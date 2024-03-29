import React, { useState, useEffect } from "react";
import Axios from "axios";
import DataTable from "react-data-table-component";
import { Link, useNavigate, useLocation } from "react-router-dom";
import BootyPagination from "./BootyPagination";

const DataGrid = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortCriteria, setSortCriteria] = useState("platformName");
  const [filter, setFilter] = useState("");

  const location = useLocation();

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

  const handleClearFilter = () => {
    setFilter(""); // Clear the filter by setting it to an empty string
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
        <div className="flex space-x-2">
          <Link
            to={`/item/${row.id}`}
            state={{ from: location }} // Set the state.from to the current location
            className="text-blue-500 hover:text-blue-600"
          >
            View
          </Link>

          <Link
            to={`/item/${row.id}/edit`}
            className="text-gray-700 hover:text-gray-800"
          >
            Edit
          </Link>
          <button
            onClick={() => {}}
            className="text-red-500 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-200 p-4 shadow-md rounded-lg">
      <div className="mb-4 flex items-center justify-evenly">
        <div>
          <label className="mr-2">Filter by:</label>
          <input
            type="text"
            value={filter}
            onChange={handleFilterChange}
            className="border border-gray-300 p-1 rounded-md"
          />
          <button
            onClick={handleClearFilter}
            className="px-2 py-1 rounded-md bg-gray-400 text-white hover:bg-gray-400"
          >
            Clear
          </button>
        </div>
        <div>
          <label className="mb-2">Rows per page:</label>
          <select
            value={pageSize}
            onChange={(e) => handlePerPageChange(Number(e.target.value))}
            className="border border-gray-300 p-1 rounded-md"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={150}>A Lot</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredData.slice(startIndex, endIndex)}
        pagination
        paginationComponent={(props) => (
          <BootyPagination
            {...props}
            totalItems={data.length}
            itemsPerPage={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      />
    </div>
  );
};

export default DataGrid;
