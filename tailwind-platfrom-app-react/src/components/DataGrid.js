import React, { useState, useEffect } from "react";
import Axios from "axios";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";

const DataGrid = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortCriteria, setSortCriteria] = useState("platformName");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("sortCriteria", sortCriteria);
  }, [sortCriteria]);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await Axios.get("http://localhost:3004/platforms");
      const sortedData = sortData(response.data, sortCriteria);
      setData(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const handleSort = (criteria) => {
    const sortedData = sortData(data, criteria);
    setData(sortedData);
    setSortCriteria(criteria);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const sortData = (data, criteria) => {
    return [...data].sort((a, b) => {
      if (criteria === "platformName") {
        return a.platformName.localeCompare(b.platformName);
      } else if (criteria === "inventoryDate") {
        return new Date(a[criteria]) - new Date(b[criteria]);
      } else if (criteria === "id" || criteria === "length") {
        return a[criteria] - b[criteria];
      }
    });
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredData = data.filter((row) => {
    return Object.values(row).some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(filter.toLowerCase());
      } else if (typeof value === "number") {
        return value === Number(filter); // Exact match for numbers
      } else if (value instanceof Date) {
        const formattedDate = value.toISOString().substring(0, 10);
        return formattedDate.includes(filter);
      }
      return false;
    });
  });

  const columns = [
    {
      name: "Platform Name",
      selector: (row) => row.platformName,
      sortable: true,
    },
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Inventory Date",
      selector: (row) => row.inventoryDate,
      sortable: true,
    },
    {
      name: "Length",
      selector: (row) => row.length,
      sortable: true,
    },
    {
      name: "Width",
      selector: (row) => row.width,
      sortable: true,
    },
    {
      name: "Height",
      selector: (row) => row.height,
      sortable: true,
    },
    {
      name: "Max Speed",
      selector: (row) => row.maxSpeed,
      sortable: true,
    },
    {
      name: "Min Speed",
      selector: (row) => row.minSpeed,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-2">
          <Link
            to={`/item/${row.id}`}
          >
            View
          </Link>
          <Link
            to={`/item/${row.id}/edit`}
          >
            Edit
          </Link>
          <button
            onClick={() => {
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
    
  ];

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center">
        <label className="mr-2">Filter by:</label>
        <input
          type="text"
          value={filter}
          onChange={handleFilterChange}
          className="border border-gray-300 p-1 rounded-md mr-2"
        />
        <label className="mr-2">Rows per page:</label>
        <select
          value={pageSize}
          onChange={(e) => handlePerPageChange(Number(e.target.value))}
          className="border border-gray-300 p-1 rounded-md"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filteredData.slice(startIndex, endIndex)}
        pagination
        paginationServer
        paginationPerPage={pageSize}
        paginationTotalRows={filteredData.length}
        onChangePage={handlePageChange}
        paginationRowsPerPageOptions={[5, 20, 30]}
        onChangeRowsPerPage={handlePerPageChange}
        paginationComponentOptions={{
          noRowsPerPage: false,
          pageButtons: 5,
          paginationActivePage: currentPage,
        }}
      />
    </div>
  );
};

export default DataGrid;
