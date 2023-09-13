import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Axios from "axios";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    platformName: Yup.string().required("Platform Name is required"),
    inventoryDate: Yup.date().required("Inventory Date is required"),
    length: Yup.number()
      .min(1, "Length must be greater than 0")
      .required("Length is required"),
    width: Yup.number()
      .min(1, "Width must be greater than 0")
      .required("Width is required"),
    height: Yup.number()
      .min(1, "Height must be greater than 0")
      .required("Height is required"),
    maxSpeed: Yup.number()
      .min(1, "Max Speed must be greater than 0")
      .required("Max Speed is required"),
    minSpeed: Yup.number()
      .min(1, "Min Speed must be greater than 0")
      .required("Min Speed is required"),
    platformType: Yup.array().min(
      1,
      "Please select at least one Platform Type"
    ),
  });

  const [initialValues, setInitialValues] = useState({
    platformName: "",
    inventoryDate: null,
    length: 0,
    width: 0,
    height: 0,
    maxSpeed: 0,
    minSpeed: 0,
    platformType: [],
  });

  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    // Fetch the item's data for pre-filling the form
    Axios.get(`http://localhost:3004/platforms/${id}`)
      .then((response) => {
        const data = response.data;
        const formattedDate = data.inventoryDate
          ? new Date(data.inventoryDate)
          : null;
  
        setInitialValues((prevValues) => ({
          ...prevValues,
          platformName: data.platformName,
          inventoryDate: data.inventoryDate,
          length: data.length,
          width: data.width,
          height: data.height,
          maxSpeed: data.maxSpeed,
          minSpeed: data.minSpeed,
          platformType: data.platformType.map((type) => type.name),
        }));
  
        setSelectedDate(formattedDate);
      })
      .catch((error) => {
        console.error("Error fetching item data:", error);
      });
  }, [id]);
  

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const platformTypeArray = values.platformType.map((name, index) => ({
          id: index + 1,
          name,
        }));

        // Format the date before sending it to the server
        const formattedDate = format(values.inventoryDate, "dd.MM.yyyy");

        await Axios.put(`http://localhost:3004/platforms/${id}`, {
          ...values,
          platformType: platformTypeArray,
          inventoryDate: formattedDate,
        });

        navigate(`/item/${id}`);
      } catch (error) {
        console.error("Error updating item:", error);
      }
    },
  });

  const { values, touched, errors, handleChange, handleBlur, handleSubmit } =
    formik;

  return (
    <div className="bg-white shadow-md p-6 rounded-lg w-96 mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Edit Platform</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="block text-gray-700 font-semibold"
            htmlFor="platformName"
          >
            Platform Name
          </label>
          <input
            type="text"
            id="platformName"
            name="platformName"
            value={values.platformName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
          {touched.platformName && errors.platformName && (
            <p className="text-red-500">{errors.platformName}</p>
          )}
        </div>

        <div>
          <label
            className="block text-gray-700 font-semibold"
            htmlFor="inventoryDate"
          >
            Inventory Date
          </label>
          <DatePicker
            selected={values.inventoryDate}
            dateFormat="dd.MM.yyyy"
            id="inventoryDate"
            name="inventoryDate"
            onChange={(date) => {
              // Set the value in the formik field
              formik.setFieldValue("inventoryDate", date);
            }}
            onBlur={handleBlur}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
          {touched.inventoryDate && errors.inventoryDate && (
            <p className="text-red-500">{errors.inventoryDate}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold" htmlFor="length">
            Length
          </label>
          <input
            type="number"
            id="length"
            name="length"
            value={values.length}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
          {touched.length && errors.length && (
            <p className="text-red-500">{errors.length}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold" htmlFor="width">
            Width
          </label>
          <input
            type="number"
            id="width"
            name="width"
            value={values.width}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
          {touched.width && errors.width && (
            <p className="text-red-500">{errors.width}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold" htmlFor="width">
            Height
          </label>
          <input
            type="number"
            id="height"
            name="height"
            value={values.height}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
          {touched.height && errors.height && (
            <p className="text-red-500">{errors.height}</p>
          )}
        </div>

        <div>
          <label
            className="block text-gray-700 font-semibold"
            htmlFor="maxSpeed"
          >
            Max Speed
          </label>
          <input
            type="number"
            id="maxSpeed"
            name="maxSpeed"
            value={values.maxSpeed}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
          {touched.maxSpeed && errors.maxSpeed && (
            <p className="text-red-500">{errors.maxSpeed}</p>
          )}
        </div>

        <div>
          <label
            className="block text-gray-700 font-semibold"
            htmlFor="minSpeed"
          >
            Min Speed
          </label>
          <input
            type="number"
            id="minSpeed"
            name="minSpeed"
            value={values.minSpeed}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
          {touched.minSpeed && errors.minSpeed && (
            <p className="text-red-500">{errors.minSpeed}</p>
          )}
        </div>

        <div>
          <label
            className="block text-gray-700 font-semibold"
            htmlFor="platformType"
          >
            Platform Type
          </label>
          <select
            multiple
            id="platformType"
            name="platformType"
            value={values.platformType}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          >
            <option value="Platform A">Platform A</option>
            <option value="Platform B">Platform B</option>
            {/* Add more options as needed */}
          </select>
          {touched.platformType && errors.platformType && (
            <p className="text-red-500">{errors.platformType}</p>
          )}
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
            className="bg-blue-500 text-white py-2 px-4 rounded hover-bg-blue-600"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditItem;
