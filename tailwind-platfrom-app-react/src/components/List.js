import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import Axios from "axios";
import "./List.css";

const List = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;
  const [sortCriteria, setSortCriteria] = useState("platformName");

  useEffect(() => {
    const savedSortCriteria = localStorage.getItem("sortCriteria");
    if (savedSortCriteria) {
      setSortCriteria(savedSortCriteria);
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await Axios.get("http://localhost:3004/platforms");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("sortCriteria", sortCriteria);
  }, [sortCriteria]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const handleSort = (criteria) => {
    setSortCriteria(criteria);
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortCriteria === "platformName") {
      return a.platformName.localeCompare(b.platformName);
    } else if (sortCriteria === "inventoryDate") {
      return new Date(a.inventoryDate) - new Date(b.inventoryDate);
    } else if (sortCriteria === "platformId") {
      return a.id - b.id;
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">List of Platforms</h1>
      <div className="mb-4 flex items-center space-x-2">
        <label className="text-gray-700">Sort by:</label>
        <select
          value={sortCriteria}
          onChange={(e) => handleSort(e.target.value)}
          className="border border-gray-300 p-1 rounded-md"
        >
          <option value="platformName">Platform Name</option>
          <option value="inventoryDate">Date Created</option>
          <option value="platformId">ID</option>
        </select>
      </div>
      {sortedData.slice(startIndex, endIndex).map((item) => (
        <div key={item.id} className="bg-white shadow-md p-4 mb-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">
            Platform Name: {item.platformName}
          </h2>
          <p className="text-gray-600 mb-2">Platform ID: {item.id}</p>
          <p className="text-gray-600 mb-2">
            Inventory Date: {item.inventoryDate}
          </p>
          <div className="mb-4 relative">
            <label className="text-gray-600">Platform Type:</label>
            <div className="custom-dropdown">
              <span
                onClick={toggleDropdown}
                className="custom-dropdown-toggle cursor-pointer"
              >
                {item.platformType[0].name}
              </span>
              {isOpen && (
                <div className="custom-dropdown-content">
                  {item.platformType.map((type) => (
                    <div key={type.id} className="custom-dropdown-option">
                      {type.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Link
            to={`/item/${item.id}`}
            className="text-blue-500 hover:underline"
          >
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
