import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Axios from "axios";

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState([]); // Initialize item as an empty array

  const fetchItemData = async () => {
    try {
      console.log("Fetching item data for ID:", id);
      const response = await Axios.get(`http://localhost:3004/platforms?id=${id}`);
      console.log("API Response:", response.data);
      const itemData = response.data;

      if (Array.isArray(itemData) && itemData.length > 0) {
        // Check if itemData is an array and not empty
        setItem(itemData);
      } else {
        console.warn("No data found for ID:", id);
        setItem([]); // Set item as an empty array if no data is found
      }
    } catch (error) {
      console.error("Error fetching item data:", error);
      setItem([]); // Set item as an empty array in case of an error
    }
  };

  useEffect(() => {
    // Call the asynchronous function to fetch item data
    fetchItemData();
  }, [id]);

  const handleDelete = async () => {
    try {
      // Send an API request to delete the item
      await Axios.delete(`http://localhost:3004/platforms/${id}`);
      // Redirect to the list page after successful deletion
      navigate.push("/");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  if (item.length === 0) {
    // Handle loading state or item not found
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white shadow-md p-4">
      <h2 className="text-xl font-semibold">{item[0].name}</h2>
      <p className="text-gray-600">Color: {item[0].color}</p>
      {/* Display other item attributes here */}
      <div className="mt-4">
        <Link to="/" className="text-blue-500 hover:underline">
          Back to List
        </Link>
      </div>
      <div className="mt-4">
        <button onClick={() => navigate(`/item/${id}/edit`)} className="text-blue-500 hover:underline mr-2">
          Edit
        </button>
        <button onClick={handleDelete} className="text-red-500 hover:underline">
          Delete
        </button>
      </div>
    </div>
  );
};

export default ItemDetail;
