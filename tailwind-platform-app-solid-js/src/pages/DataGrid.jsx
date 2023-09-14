import { createSignal, onCleanup , createEffect } from 'solid-js';
import { LightPaginationNav,PaginationNav,DarkPaginationNav, paginate } from 'solid-paginate'
import { Link} from "@solidjs/router";
import 'solid-paginate/styles'

const DataGrid = () => {
  const [data, setData] = createSignal([]);
  const [currentPage, setCurrentPage] = createSignal(1);
  const [pageSize, setPageSize] = createSignal(10);
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
      if (criteria === 'platformName') {
        return a.platformName.localeCompare(b.platformName);
      } else if (criteria === 'inventoryDate' || criteria === 'inventoryDate') {
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



  return (
    <div class='bg-white p-4 shadow-md rounded-lg'>
      <div class='mb-4 flex items-center justify-evenly'>
        <div class="mb-4 d-flex align-items-center">
          <label class="mr-2">Filter by:</label>
          <div class="d-flex align-items-center pr-5">
            <input
              type="text"
              value={filter()}
              onInput={handleFilterChange}
              class="border border-gray-300 p-1 rounded-md mr-2"
            />
            <button
            
            className="px-2 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
          >
            Clear
          </button>
          </div>
          <label class="m-2 pl-5">Rows per page:</label>
          <div class="d-flex align-items-center">
            <select
              value={pageSize()}
              onChange={(e) => handlePerPageChange(Number(e.target.value))}
              class="border border-gray-300 p-1 rounded-md"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={150}>150</option>
            </select>
          </div>
        </div>
      </div>

      <table className="table">
        {/* Table headers */}
        <thead>
          <tr>
            <th onClick={() => handleSort("platformName")}>Platform Name</th>
            <th onClick={() => handleSort("id")}>ID</th>
            <th onClick={() => handleSort("inventoryDate")}>Inventory Date</th>
            <th onClick={() => handleSort("length")}>Length</th>
            <th onClick={() => handleSort("width")}>Width</th>
            <th onClick={() => handleSort("height")}>Height</th>
            <th onClick={() => handleSort("maxSpeed")}>Max Speed</th>
            <th onClick={() => handleSort("minSpeed")}>Min Speed</th>
           

            <th>Actions</th>
          </tr>
        </thead>

        {/* Table body */}
        <tbody>
          {data().slice(startIndex(), endIndex()).map((row) => (
            <tr key={row.id}>
              <td>{row.platformName}</td>
              <td>{row.id}</td>
              <td>{row.inventoryDate}</td>
              <td>{row.length}</td>
              <td>{row.width}</td>
              <td>{row.height}</td>
              <td>{row.maxSpeed}</td>
              <td>{row.minSpeed}</td>
              
              <td>
                <Link href={`/item/${row.id}`} class='m-1' style={{color:'blue'}}>View</Link>
                <Link href={`/item/${row.id}/edit`} class='m-1' style={{color:'black'}}>Edit</Link>
                <button class='m-1 ' style={{color:'red'}}
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
