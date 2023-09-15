import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css"; // Import your CSS file

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 shadow-md p-6 rounded-lg mx-auto">
      {/* Animated Logo */}
      <img
        src="../../logo.jpg"
        alt="Logo"
        className="mb-4  border-indigo-500 p-2 animation-fade-in "
      />
      {/* Title and Description */}
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-indigo-600 mb-2">
          POC Application for Platform
        </h1>
        <p className="text-gray-600 text-lg">
          Application is dedicated for showing the capabilities of different
          types of JavaScript libraries and frameworks.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-x-4">
        <Link to="/datagrid">
          <button className="px-6 py-3 text-lg font-medium text-white bg-indigo-500 rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            Go to "Data Table"
          </button>
        </Link>
        <Link to="/list">
          <button className="px-6 py-3 text-lg font-medium text-indigo-600 border border-indigo-600 rounded-full hover:text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            Go to "List Page"
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
