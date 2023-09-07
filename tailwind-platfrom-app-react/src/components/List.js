import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import Axios from "axios";

const List = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;
  const [sortCriteria, setSortCriteria] = useState("name"); // Initialize with a default sorting criteria

  // Load the saved sorting criteria from localStorage (if available)
  useEffect(() => {
    const savedSortCriteria = localStorage.getItem("sortCriteria");
    if (savedSortCriteria) {
      setSortCriteria(savedSortCriteria);
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await Axios.get("http://localhost:3004/platforms"); // Assuming the data.json file is in the public folder
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Save the current sorting criteria to localStorage
    localStorage.setItem("sortCriteria", sortCriteria);
  }, [sortCriteria]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const handleSort = (criteria) => {
    // Update the sorting criteria state
    setSortCriteria(criteria);
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortCriteria === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortCriteria === "date_created") {
      return new Date(a.date_created) - new Date(b.date_created);
    } else if (sortCriteria === "id") {
      return a.id - b.id; // Sort by ID as integers
    }
    // Add more sorting criteria as needed
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">List of Items</h1>
      <div className="mb-4">
        <label className="mr-2">Sort by:</label>
        <select
          value={sortCriteria}
          onChange={(e) => handleSort(e.target.value)}
          className="border border-gray-300 p-1 rounded-md"
        >
          <option value="name">Name</option>
          <option value="date_created">Date Created</option>
          <option value="id">ID</option> {/* Add "Sort by ID" */}
          {/* Add more sorting criteria as needed */}
        </select>
      </div>
      {sortedData.slice(startIndex, endIndex).map((item) => (
        <div key={item.id} className="bg-white shadow-md p-4 mb-4">
          <h2 className="text-xl font-semibold">{item.name}</h2>
          <p className="text-gray-600">Color: {item.color}</p>
          {/* Add more item attributes here */}
          <Link to={`/item/${item.id}`} className="text-blue-500 hover:underline">
            View Details
          </Link>
        </div>
      ))}
      <Pagination
        pageSize={pageSize}
        current={currentPage}
        total={sortedData.length}
        onChange={setCurrentPage}
        className="mt-4"
      />
    </div>
  );
};

export default List;
