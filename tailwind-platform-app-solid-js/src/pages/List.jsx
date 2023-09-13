import { createSignal, onCleanup, createEffect } from "solid-js";
import { Link } from "@solidjs/router";
import { LightPaginationNav,PaginationNav,DarkPaginationNav, paginate } from 'solid-paginate'
import 'solid-paginate/styles'

import Axios from "axios";

const List = () => {
  const [data, setData] = createSignal([]);
  const [currentPage, setCurrentPage] = createSignal(1);
  const pageSize = 7;
  const [sortCriteria, setSortCriteria] = createSignal("name"); 

  const paginatedItems = () =>
  paginate({ items: sortedData(), pageSize, currentPage: currentPage() })
  

  createEffect(() => {
    // Load the saved sorting criteria from localStorage (if available)
    const savedSortCriteria = localStorage.getItem("sortCriteria");
    if (savedSortCriteria) {
      setSortCriteria(savedSortCriteria);
    }
  });

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:4000/platforms");
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  createEffect(() => {
    fetchData();
  });

  createEffect(() => {
    // Save the current sorting criteria to localStorage
    localStorage.setItem("sortCriteria", sortCriteria());
  }, [sortCriteria]);

  const startIndex = () => (currentPage() - 1) * pageSize;
  const endIndex = () => startIndex() + pageSize;

  const handleSort = (criteria) => {
    // Update the sorting criteria state
    setSortCriteria(criteria);
  };

  const sortedData = () => [...data()].sort((a, b) => {
    if (sortCriteria() === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortCriteria() === "date_created") {
      return new Date(a.date_created) - new Date(b.date_created);
    } else if (sortCriteria() === "id") {
      return a.id - b.id;
    }
  });

  onCleanup(() => {
    // Clean up any resources or subscriptions here
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">List of Items</h1>
      <div className="mb-4">
        <label className="mr-2">Sort by:</label>
        <select
          value={sortCriteria()}
          onChange={(e) => handleSort(e.target.value)}
          className="border border-gray-300 p-1 rounded-md"
        >
          <option value="name">Name</option>
          <option value="date_created">Date Created</option>
          <option value="id">ID</option>
        </select>
      </div>
      {sortedData().slice(startIndex(), endIndex()).map((item) => (
        <div key={item.id} className="bg-white shadow-md p-4 mb-4">
          <h2 className="text-xl font-semibold">{item.name}</h2>
          <p className="text-gray-600">Color: {item.color}</p>
          
            <Link href={`/item/${item.id}`} class="text-blue-500 hover:underline">
            View Details
          </Link>
        </div>
      ))}
      <LightPaginationNav
        currentPage={currentPage()}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        limit={1}
        totalItems={sortedData().length}
        showStepOptions={true}
        className="mt-4"
      />
    </div>
  );
};

export default List;
