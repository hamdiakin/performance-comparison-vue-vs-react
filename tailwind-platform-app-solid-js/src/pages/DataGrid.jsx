import { createSignal, onCleanup , createEffect } from 'solid-js';
import { LightPaginationNav,PaginationNav,DarkPaginationNav, paginate } from 'solid-paginate'
import { Link} from "@solidjs/router";
import 'solid-paginate/styles'

const DataGrid = () => {
  const [data, setData] = createSignal([]);
  const [currentPage, setCurrentPage] = createSignal(1);
  const [pageSize, setPageSize] = createSignal(5);
  const [sortCriteria, setSortCriteria] = createSignal('name');
  const [filter, setFilter] = createSignal('');



  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:4000/platforms');
      const sortedData = sortData(await response.json(), sortCriteria());
      setData(sortedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  createEffect(() => {
    

    fetchData();

    return onCleanup(() => {
      // Clean up any resources here if needed
    });
  });

  createEffect(() => {
    localStorage.setItem('sortCriteria', sortCriteria());
  });

  const startIndex = () => (currentPage() - 1) * pageSize();
  const endIndex = () => startIndex() + pageSize();

  const handleSort = (criteria) => {
    const sortedData = sortData(data(), criteria);
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
      if (criteria === 'name') {
        return a.name.localeCompare(b.name);
      } else if (criteria === 'date_created' || criteria === 'date_updated') {
        return new Date(a[criteria]) - new Date(b[criteria]);
      } else if (criteria === 'id' || criteria === 'length') {
        return a[criteria] - b[criteria];
      }
    });
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredData = () => data().filter((row) => {
    return Object.values(row).some((value) => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(filter().toLowerCase());
      } else if (typeof value === 'number') {
        return value === Number(filter()); // Exact match for numbers
      } else if (value instanceof Date) {
        const formattedDate = value.toISOString().substring(0, 10);
        return formattedDate.includes(filter());
      }
      return false;
    });
  });

  const columns = [
    {
      name: 'Name',
      cell: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Color',
      cell: (row) => row.color,
      sortable: true,
    },
    {
      name: 'Length',
      cell: (row) => row.length,
      sortable: true,
    },
    {
      name: 'Date Created',
      cell: (row) => row.date_created,
      sortable: true,
    },
    {
      name: 'Date Updated',
      cell: (row) => row.date_updated,
      sortable: true,
    },
    {
      name: 'ID',
      cell: (row) => row.id,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <div class="">
            <Link
              href={`/item/${row.id}`}
              class="btn btn-primary"
              onClick={() => {}}
            >
              View
            </Link>
            <Link
              href={`/item/${row.id}/edit`}
              class="btn btn-secondary"
              onClick={() => {}}
            >
              Edit
            </Link>
            <button
              class="btn btn-danger"
              onClick={() => {
                // Handle delete logic here
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div>
        <div class="mb-4 d-flex align-items-center">
          <label class="mr-2">Filter by:</label>
          <div class="d-flex align-items-center">
            <input
              type="text"
              value={filter()}
              onInput={handleFilterChange}
              class="border border-gray-300 p-1 rounded-md mr-2"
            />
          </div>
          <label class="mr-2">Rows per page:</label>
          <div class="d-flex align-items-center">
            <select
              value={pageSize()}
              onChange={(e) => handlePerPageChange(Number(e.target.value))}
              class="border border-gray-300 p-1 rounded-md"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
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
          {data().slice(startIndex(), endIndex()).map((row) => (
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

      <LightPaginationNav
        currentPage={currentPage()}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize()}
        limit={1}
        totalItems={data().length}
        showStepOptions={true}
        className="mt-4"
      />
    </div>
  );
};

export default DataGrid;
