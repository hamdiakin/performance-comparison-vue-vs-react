import { createSignal, onCleanup, createEffect } from "solid-js";
import { Link, useParams, useNavigate } from "@solidjs/router";
import Axios from "axios";
import { useForm } from "../components/Validation";
import { createStore } from "solid-js/store";


const ErrorMessage = ({ error }) => <span class="error-message">{error}</span>;


const EditItem = () => {
  const { id } = useParams();
  const [formData, setFormData] = createSignal({
    platformName: "",
    inventoryDate: "",
    length: 0,
    width: 0,
    height: 0,
    maxSpeed: 0,
    minSpeed: 0,
    platformType: [{}]
    // Add more form fields for other attributes here
  });
  const [isNameValid, setIsNameValid] = createSignal(true);
  const [isColorValid, setIsColorValid] = createSignal(true);
  const [isLengthValid, setIsLengthValid] = createSignal(true);
  const navigate = useNavigate()


  const { validate, formSubmit, errors } = useForm({
    errorClass: "error-input"
  });
  const [fields, setFields] = createStore();
  const fn = (form) => {
    // form.submit()
    console.log("Done");
  };
  


  createEffect(() => {
    // Fetch the item's data for pre-filling the form
    Axios.get(`http://localhost:4000/platforms/${id}`)
      .then((response) => {
        setFormData({
          platformName: response.data.platformName,
          inventoryDate: response.data.inventoryDate,
          length: response.data.length,
          width: response.data.width,
          height: response.data.height,
          maxSpeed: response.data.maxSpeed,
          minSpeed: response.data.minSpeed,
          platformType: response.data.platformType.map((type) => type.name)
          // Set values for other form fields here
        });
      })
      .catch((error) => {
        console.error("Error fetching item data:", error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    console.log(name)
    if(name === "name"){
      console.log(value.length)
      if(value.length < 10){
        setIsNameValid(false);
      }
      else{
        setIsNameValid(true);
      }
    }
    else if (name === "color"){
      console.log(value.length)
      if(value.length < 10){
        setIsColorValid(false);
      }
      else{
        setIsColorValid(true);
      }
    }
    else if (name === "length"){
      
      if(isNaN(value)){
        setIsLengthValid(false);
      }
      else{
        setIsLengthValid(true);
      }
    }
    if(isNameValid() && isColorValid() && isLengthValid())
    {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isNameValid() && isColorValid() && isLengthValid())
    {
      try {
        // Send an API request to update the item
        await Axios.put(`http://localhost:4000/platforms/${id}`, formData());
        // Redirect to the item detail page after successful update
        // Assuming you have access to a `navigate` function
        navigate(`/item/${id}`);
      } catch (error) {
        console.error("Error updating item:", error);
      }
    }
    else{
      console.log("Invalid Inputs")
    }
    
  };

  onCleanup(() => {
    // Clean up any resources or subscriptions here
  });

  return (
    <div class="bg-white shadow-md p-4">
      <h2 class="text-xl font-semibold">Edit Item</h2>
      <form onSubmit={handleSubmit} use:formSubmit={fn}>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="platformName">
            Platform Name
          </label>
          <input
            type="text"
            id="platformName"
            name="platformName"
            value={formData().platformName}
            onInput={handleInputChange}
            class="w-full p-2 border rounded"
            required=""
          />
          {!isNameValid() && <div style="color: red;">Platform Name must be at least 10 characters long</div>}
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="inventoryDate">
            Inventory Date
          </label>
          <input
            type="text"
            id="inventoryDate"
            name="inventoryDate"
            value={formData().inventoryDate}
            onInput={handleInputChange}
            class="w-full p-2 border rounded"
            required=""
          />
          {!isNameValid() && <div style="color: red;">Name must be at least 10 characters long</div>}
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="length">
            Length
          </label>
          <input
            type="text"
            id="length"
            name="length"
            value={formData().length}
            onInput={handleInputChange}
            class="w-full p-2 border rounded"
            required=""
          />
          {!isNameValid() && <div style="color: red;">Name must be at least 10 characters long</div>}
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="width">
            Width
          </label>
          <input
            type="text"
            id="width"
            name="width"
            value={formData().width}
            onInput={handleInputChange}
            class="w-full p-2 border rounded"
            required=""
          />
          {!isNameValid() && <div style="color: red;">Name must be at least 10 characters long</div>}
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="height">
            Height
          </label>
          <input
            type="text"
            id="height"
            name="height"
            value={formData().height}
            onInput={handleInputChange}
            class="w-full p-2 border rounded"
          />
          {!isColorValid() && <div style="color: red;">Color must be at least 10 characters long</div>}
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="maxSpeed">
            Max Speed
          </label>
          <input
            type="number"
            id="maxSpeed"
            name="maxSpeed"
            value={formData().maxSpeed}
            onInput={handleInputChange}
            class="w-full p-2 border rounded"
          />
          {!isLengthValid() && <div style="color: red;">Length must be a number</div>}
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="minSpeed">
            Min Speed
          </label>
          <input
            type="text"
            id="minSpeed"
            name="minSpeed"
            value={formData().minSpeed}
            onInput={handleInputChange}
            class="w-full p-2 border rounded"
            required=""
          />
          {!isNameValid() && <div style="color: red;">Name must be at least 10 characters long</div>}
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="platformType">
            Platform Type
          </label>
          <select
            multiple
            id="platformType"
            name="platformType"
            value={formData().platformType}
            onChange={handleInputChange}
            
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          >
            <option value="Platform A">Platform A</option>
            <option value="Platform B">Platform B</option>
            {/* Add more options as needed */}
          </select>
          {!isNameValid() && <div style="color: red;">Name must be at least 10 characters long</div>}
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
