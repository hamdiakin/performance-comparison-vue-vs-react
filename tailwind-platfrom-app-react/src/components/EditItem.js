import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Axios from "axios";

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  //const [item, setItem] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    color: "",
    length: 0,
    // Add more form fields for other attributes here
  });

  useEffect(() => {
    // Fetch the item's data for pre-filling the form
    Axios.get(`http://localhost:3004/platforms/${id}`)
      .then((response) => {
        //setItem(response.data);
        setFormData({
          name: response.data.name,
          color: response.data.color,
          length: response.data.length,
          // Set values for other form fields here
        });
      })
      .catch((error) => {
        console.error("Error fetching item data:", error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send an API request to update the item
      await Axios.put(`http://localhost:3004/platforms/${id}`, formData);
      // Redirect to the item detail page after successful update
      navigate(`/item/${id}`);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <div className="bg-white shadow-md p-4">
      <h2 className="text-xl font-semibold">Edit Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="color">
            Color
          </label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="length">
            Length
          </label>
          <input
            type="number"
            id="length"
            name="length"
            value={formData.length}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        {/* Add more form fields for other attributes here */}
        <div className="mt-4">
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Save Changes
          </button>
          <Link to={`/item/${id}`} className="ml-2 text-blue-500 hover:underline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditItem;
