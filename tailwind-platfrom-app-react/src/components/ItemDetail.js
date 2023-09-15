import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const location = useLocation();
  const from = location.state ? location.state.from : "/"; // Default to root if state is undefined

  const fetchItemData = async () => {
    try {
      const response = await Axios.get(
        `http://localhost:3004/platforms?id=${id}`
      );
      const itemData = response.data;

      if (Array.isArray(itemData) && itemData.length > 0) {
        setItem(itemData);
      } else {
        console.warn("No data found for ID:", id);
        setItem([]);
      }
      setIsLoading(false); // Set loading state to false
    } catch (error) {
      console.error("Error fetching item data:", error);
      setItem([]);
      setIsLoading(false); // Set loading state to false
    }
  };

  useEffect(() => {
    fetchItemData();
  }, [id]);

  const handleDelete = async () => {
    try {
      await Axios.delete(`http://localhost:3004/platforms/${id}`);
      navigate(from); // Navigate back to the previous page
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  if (isLoading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }
  return (
    <div className="bg-gray-200 shadow-md p-4 rounded-lg w-96 mx-auto items-center justify-center">
      <h2 className="text-2xl font-semibold mb-4">
        Platform Name: {item[0].platformName}
      </h2>
      <p className="text-gray-600">Platform ID: {item[0].id}</p>
      <p className="text-gray-600">Inventory Date: {item[0].inventoryDate}</p>
      <p className="text-gray-600">Length: {item[0].length}</p>
      <p className="text-gray-600">Width: {item[0].width}</p>
      <p className="text-gray-600">Height: {item[0].height}</p>
      <p className="text-gray-600">Max Speed: {item[0].maxSpeed}</p>
      <p className="text-gray-600">Min Speed: {item[0].minSpeed}</p>

      <div className="mt-6 flex justify-between">
        <Link to={from} className="text-blue-500 hover:underline">
          Back
        </Link>
        <div>
          <button
            onClick={() => navigate(`/item/${id}/edit`)}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 mr-2 transition duration-300"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
