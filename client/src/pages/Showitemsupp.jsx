import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header2 from "../components/layout/Header2";
import { useAuth } from "../Context/auth";

const CreateItem = () => {
  const [materials, setMaterials] = useState([]);
  const { auth } = useAuth(); // Destructure auth from useAuth context
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

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      if (auth?.supplier?._id) {
        console.log("Fetching materials for supplier ID:", auth.supplier._id); // Debug log
        const response = await fetch(`https://imc-hack.onrender.com/api/v1/supplier/suppshowitems/${auth.supplier._id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched materials:", data); // Debug log
        setMaterials(data);
        toast.success("Materials fetched successfully");
      } else {
        console.log("Supplier ID not found in auth object", auth); // Debug log
        toast.error("Supplier ID not found");
      }
    } catch (error) {
      console.error("Error fetching materials:", error); // Debug log
      toast.error("Error fetching materials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   
      fetchMaterials();
    
  }, []);

  return (
    <div>
      <Header2 />
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <ToastContainer />
        <div className="bg-white p-6 rounded shadow-md w-full max-w-4xl mt-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Materials</h2>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : materials.length > 0 ? (
            <table className="min-w-full bg-white table-auto">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 text-center">Name</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-center">Description</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-center">Quantity</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-center">Unit Price</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-center">Seller</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-center">Lifetime</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">{material.MaterialName}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">{material.Description}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">{material.quantity}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">{material.UnitPrice}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">{material.Seller}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">{material.lifetime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No materials found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateItem;
