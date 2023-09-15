import { createSignal, onCleanup, createEffect } from "solid-js";
import { useParams } from "@solidjs/router";
import { Link, useNavigate } from "@solidjs/router";
import Axios from "axios";

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = createSignal([]);

  const fetchItemData = async () => {
    try {
      console.log("Fetching item data for ID:", id);
      const response = await Axios.get(`http://localhost:4000/platforms?id=${id}`);
      console.log("API Response:", response.data);
      const itemData = response.data;

      if (Array.isArray(itemData) && itemData.length > 0) {
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

  createEffect(() => {
    // Call the asynchronous function to fetch item data
    fetchItemData();
  }, [id]);

  const handleDelete = async () => {
    try {
      // Send an API request to delete the item
      await Axios.delete(`http://localhost:4000/platforms/${id}`);
      // Redirect to the list page after successful deletion
      navigate("/");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  onCleanup(() => {
    // Clean up any resources or subscriptions here
  });

  

  return (

    <Show when={item().length >  0} fallback={<p>Loading...</p>}>
  

      <div class="bg-white shadow-md p-4 rounded-lg w-96 mx-auto">
          <h2 class="text-xl font-semibold">Platform Name: {item()[0].platformName}</h2>
          <p class="text-gray-600">Platform ID: {item()[0].id}</p>
          <p class="text-gray-600">Inventory Date: {item()[0].inventoryDate}</p>
          <p class="text-gray-600">Length: {item()[0].length}</p>
          <p class="text-gray-600">Width: {item()[0].width}</p>
          <p class="text-gray-600">Height: {item()[0].height}</p>
          <p class="text-gray-600">Max Speed: {item()[0].maxSpeed}</p>
          <p class="text-gray-600">Min Speed: {item()[0].minSpeed}</p>
          {/* Display other item attributes here */}
          <div class="mt-4">
            <button onClick={() => navigate(`/`)} class="text-blue-500 hover:underline">
            Back to List
            </button>
          </div>
          <div class="mt-4">
            <button onClick={() => navigate(`/item/${id}/edit`)} class="text-blue-500 hover:underline mr-2">
              Edit
            </button>
            <button onClick={handleDelete} class="text-red-500 hover:underline">
              Delete
            </button>
          </div>
        </div>

    </Show>
    
  );
};

export default ItemDetail;