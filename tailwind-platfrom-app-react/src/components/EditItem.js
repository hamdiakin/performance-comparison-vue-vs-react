import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Axios from "axios";

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    platformName: "",
    inventoryDate: "",
    length: 0,
    width: 0,
    height: 0,
    maxSpeed: 0,
    minSpeed: 0,
    platformType: [],
  });

  useEffect(() => {
    // Fetch the item's data for pre-filling the form
    Axios.get(`http://localhost:3004/platforms/${id}`)
      .then((response) => {
        const data = response.data;
        setFormData({
          platformName: data.platformName,
          inventoryDate: data.inventoryDate,
          length: data.length,
          width: data.width,
          height: data.height,
          maxSpeed: data.maxSpeed,
          minSpeed: data.minSpeed,
          platformType: data.platformType.map((type) => type.name),
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

  const handlePlatformTypeChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({ ...formData, platformType: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert platformType back to an array of objects
      const platformTypeArray = formData.platformType.map((name, index) => ({
        id: index + 1, // Assign unique IDs
        name,
      }));

      // Send an API request to update the item
      await Axios.put(`http://localhost:3004/platforms/${id}`, {
        ...formData,
        platformType: platformTypeArray,
      });

      // Redirect to the item detail page after a successful update
      navigate(`/item/${id}`);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return ""; // Handle empty date

    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-lg w-96 mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Edit Platform</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold" htmlFor="platformName">
            Platform Name
          </label>
          <input
            type="text"
            id="platformName"
            name="platformName"
            value={formData.platformName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold" htmlFor="inventoryDate">
            Inventory Date
          </label>
          <input
            type="date"
            id="inventoryDate"
            name="inventoryDate"
            value={formData.inventoryDate}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold" htmlFor="length">
            Length
          </label>
          <input
            type="number"
            id="length"
            name="length"
            value={formData.length}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold" htmlFor="width">
            Width
          </label>
          <input
            type="number"
            id="width"
            name="width"
            value={formData.width}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold" htmlFor="maxSpeed">
            Max Speed
          </label>
          <input
            type="number"
            id="maxSpeed"
            name="maxSpeed"
            value={formData.maxSpeed}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold" htmlFor="minSpeed">
            Min Speed
          </label>
          <input
            type="number"
            id="minSpeed"
            name="minSpeed"
            value={formData.minSpeed}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold" htmlFor="platformType">
            Platform Type
          </label>
          <select
            multiple
            id="platformType"
            name="platformType"
            value={formData.platformType}
            onChange={handlePlatformTypeChange}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          >
            <option value="Platform A">Platform A</option>
            <option value="Platform B">Platform B</option>
            {/* Add more options as needed */}
          </select>
        </div>

        <div className="flex justify-center space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
          <Link
            to={`/item/${id}`}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditItem;
