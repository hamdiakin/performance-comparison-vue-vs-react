
import "bootstrap/dist/css/bootstrap.css";
import { createSignal, createEffect, onCleanup } from "solid-js";
import { Link } from "@solidjs/router";

const DataGrid = () => {
    const [data, setData] = createSignal([]);
    const [currentPage, setCurrentPage] = createSignal(1);
    const [pageSize, setPageSize] = createSignal(5);
    const [sortCriteria, setSortCriteria] = createSignal("name");
    const [filter, setFilter] = createSignal("");


  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:4000/platforms");
      const data = await response.json();
      setData(sortData(data, sortCriteria()));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSort = (criteria) => {
    setSortCriteria(criteria);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  const handlePerPageChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };
 

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;




  const sortData = (data, criteria) => {
    return [...data].sort((a, b) => {
      if (criteria === "name") {
        return a.name.localeCompare(b.name);
      } else if (criteria === "date_created" || criteria === "date_updated") {
        return new Date(a[criteria]) - new Date(b[criteria]);
      } else if (criteria === "id" || criteria === "length") {
        return a[criteria] - b[criteria];
      }
    });
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };


  createEffect(() => {
    localStorage.setItem("sortCriteria", sortCriteria());
  });

  createEffect(() => {
    fetchData();
  }, []);


  createEffect(() => {
    const startIndex = (currentPage() - 1) * pageSize();
    const endIndex = startIndex + pageSize();
    const filteredData = data().filter((row) => {
      return Object.values(row).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(filter().toLowerCase());
        } else if (typeof value === "number") {
          return value === Number(filter()); // Exact match for numbers
        } else if (value instanceof Date) {
          const formattedDate = value.toISOString().substring(0, 10);
          return formattedDate.includes(filter());
        }
        return false;
      });
    });
    setData(filteredData.slice(startIndex, endIndex));
  });


  onCleanup(() => {
    // Clean up any resources or subscriptions here
  });


  return (
    <div>
      <div className="mb-4 d-flex align-items-center">
        <label className="mr-2">Filter by:</label>
        <div className="d-flex align-items-center">
          <input
            type="text"
            value={filter()}
            onInput={handleFilterChange}
            className="border border-gray-300 p-1 rounded-md mr-2"
          />
        </div>
        <label className="mr-2">Rows per page:</label>
        <div className="d-flex align-items-center">
          <select
            value={pageSize()}
            onChange={(e) => handlePerPageChange(Number(e.target.value))}
            className="border border-gray-300 p-1 rounded-md"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
      </div>

      <table className="table">
        {/* Table headers */}
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("color")}>Color</th>
            <th onClick={() => handleSort("length")}>Length</th>
            <th onClick={() => handleSort("date_created")}>Date Created</th>
            <th onClick={() => handleSort("date_updated")}>Date Updated</th>
            <th onClick={() => handleSort("id")}>ID</th>
            <th>Actions</th>
          </tr>
        </thead>

        {/* Table body */}
        <tbody>
          {data().map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.color}</td>
              <td>{row.length}</td>
              <td>{row.date_created}</td>
              <td>{row.date_updated}</td>
              <td>{row.id}</td>
              <td>
                <Link href={`/item/${row.id}`}>View</Link>
                <Link href={`/item/${row.id}/edit`}>Edit</Link>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    // Handle delete logic here
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataGrid;
