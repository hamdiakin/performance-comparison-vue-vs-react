import { createSignal, onCleanup, createEffect } from "solid-js";
import { Link, useParams } from "@solidjs/router";
import Axios from "axios";

const EditItem = () => {
  const { id } = useParams();
  const [formData, setFormData] = createSignal({
    name: "",
    color: "",
    length: 0,
    // Add more form fields for other attributes here
  });

  createEffect(() => {
    // Fetch the item's data for pre-filling the form
    Axios.get(`http://localhost:4000/platforms/${id}`)
      .then((response) => {
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send an API request to update the item
      await Axios.put(`http://localhost:4000/platforms/${id}`, formData());
      // Redirect to the item detail page after successful update
      // Assuming you have access to a `navigate` function
      navigate(`/item/${id}`);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  onCleanup(() => {
    // Clean up any resources or subscriptions here
  });

  return (
    <div class="bg-white shadow-md p-4">
      <h2 class="text-xl font-semibold">Edit Item</h2>
      <form onSubmit={handleSubmit}>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData().name}
            onInput={handleInputChange}
            class="w-full p-2 border rounded"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="color">
            Color
          </label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData().color}
            onInput={handleInputChange}
            class="w-full p-2 border rounded"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="length">
            Length
          </label>
          <input
            type="number"
            id="length"
            name="length"
            value={formData().length}
            onInput={handleInputChange}
            class="w-full p-2 border rounded"
          />
        </div>
        {/* Add more form fields for other attributes here */}
        <div class="mt-4">
          <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Save Changes
          </button>
          <Link href={`/item/${id}`} class="ml-2 text-blue-500 hover:underline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditItem;
