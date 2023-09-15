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
  const [isPlatformNameValid, setIsPlatformNameValid] = createSignal(true);
  const [isInventoryDateValid, setIsInventoryDateValid] = createSignal(true);
  const [isLengthValid, setIsLengthValid] = createSignal(true);
  const [isWidthValid, setIsWidthValid] = createSignal(true);
  const [isHeightValid, setIsHeightValid] = createSignal(true);
  const [isMaxSpeedValid, setIsMaxSpeedValid] = createSignal(true);
  const [isMinSpeedValid, setIsMinSpeedValid] = createSignal(true);
  const [isPlatformTypeValid, setIsPlatformTypeValid] = createSignal(true);


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
    if(name === "platformName"){
      console.log(value.length)
      if(value.length < 10){
        setIsPlatformNameValid(false);
      }
      else{
        setIsPlatformNameValid(true);
      }
    }
    else if (name === "inventoryDate"){
      console.log(value.length)
      if(value.length < 10){
        setIsInventoryDateValid(false);
      }
      else{
        setIsInventoryDateValid(true);
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
    else if (name === "width"){
      
      if(isNaN(value)){
        setIsWidthValid(false);
      }
      else{
        setIsWidthValid(true);
      }
    }
    else if (name === "height"){
      
      if(isNaN(value)){
        setIsHeightValid(false);
      }
      else{
        setIsHeightValid(true);
      }
    }
    else if (name === "maxSpeed"){
      
      if(isNaN(value)){
        setIsMaxSpeedValid(false);
      }
      else{
        setIsMaxSpeedValid(true);
      }
    }
    else if (name === "minSpeed"){
      
      if(isNaN(value)){
        setIsMinSpeedValid(false);
      }
      else{
        setIsMinSpeedValid(true);
      }
    }
    else if (name === "platformType"){
      
      if(isNaN(value)){
        setIsPlatformTypeValid(false);
      }
      else{
        setIsPlatformTypeValid(true);
      }
    }
    if(isPlatformNameValid() && isInventoryDateValid() && isLengthValid() && isWidthValid() && isHeightValid() && isMaxSpeedValid() && isMinSpeedValid() && isPlatformTypeValid())
    {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isPlatformNameValid() && isInventoryDateValid() && isLengthValid() && isWidthValid() && isHeightValid() && isMaxSpeedValid() && isMinSpeedValid() && isPlatformTypeValid())
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
    <div class="bg-white shadow-md p-4 rounded-lg w-96 mx-auto">
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
          {!isPlatformNameValid() && <div style="color: red;">Platform Name must be at least 10 characters long</div>}
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
          {!isInventoryDateValid() && <div style="color: red;">Inventory Date must be at least 10 characters long</div>}
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
          {!isLengthValid() && <div style="color: red;">Length must be a number</div>}
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
          {!isWidthValid() && <div style="color: red;">Width must be a number</div>}
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
          {!isHeightValid() && <div style="color: red;">Height must be a number</div>}
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
          {!isMaxSpeedValid() && <div style="color: red;">Max Speed must be a number</div>}
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
          {!isMinSpeedValid() && <div style="color: red;">Min Speed must be a number</div>}
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
          {!isPlatformTypeValid() && <div style="color: red;">Platform Type must be at least 10 characters long</div>}
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