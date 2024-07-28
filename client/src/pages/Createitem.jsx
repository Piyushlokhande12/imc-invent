import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header2 from "../components/layout/Header2";
import FileUpload from "./Fileupload";
import { useAuth } from "../Context/supplier"; // Make sure to import useAuth from the correct path

const CreateItem = () => {
  const [materials, setMaterials] = useState([]);
  const [supauth, setsupAuth] = useAuth(); // Use the context state
  const [form, setForm] = useState({
    MaterialName: "",
    Description: "",
    quantity: "",
    UnitPrice: "",
    Seller: "",
    lifetime: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://imc-hack.onrender.com/api/v1/materials/addmaterials/${supauth?.supplier?._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setMaterials([...materials, data.material]);
        toast.success("Material added successfully");
        setForm({
          MaterialName: "",
          Description: "",
          quantity: "",
          UnitPrice: "",
          Seller: "",
          lifetime: "",
        });
      } else {
        toast.error("Name Should Be Unique");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding material");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header2 />
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <ToastContainer />
        <div className="flex justify-center items-start mt-6 space-x-4 w-full px-6">
          <div className="w-2/5 flex justify-center">
            <FileUpload />
          </div>
          <div className="w-3/5 flex justify-center">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded shadow-md w-full"
            >
              <h1 className="text-2xl font-bold mb-4 text-center">
                Create New Material
              </h1>
              {[
                "MaterialName",
                "Description",
                "quantity",
                "UnitPrice",
                "Seller",
                "lifetime",
              ].map((field) => (
                <div key={field} className="mb-4">
                  <label className="block text-gray-700 capitalize">
                    {field}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded mt-1"
                    required
                  />
                </div>
              ))}
              <button
                type="submit"
                className={`w-full bg-blue-500 text-white py-2 rounded ${
                  loading ? "opacity-50" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Material"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateItem;
