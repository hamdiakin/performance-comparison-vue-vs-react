import React from "react";
import { Link } from "react-router-dom";

const ListItem = ({ item }) => {
  return (
    <div className="bg-white shadow-md p-4 mb-4">
      <h2 className="text-xl font-semibold">{item.name}</h2>
      <p className="text-gray-600">Color: {item.color}</p>
      {/* Add more item attributes here */}
      <Link to={`/item/${item.id}`} className="text-blue-500 hover:underline">
        View Details
      </Link>
    </div>
  );
};

export default ListItem;
