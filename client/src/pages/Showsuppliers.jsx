import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/layout/Header";

const ShowSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const response = await fetch("https://imc-hack.onrender.com/api/v1/supplier/listSupplier");
        const data = await response.json();
        if (response.ok) {
          setSuppliers(data);
        } else {
          toast.error(data.message || "Failed to fetch suppliers");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching suppliers");
      }
    }

    fetchSuppliers();
  }, []);

  return (
    <div>
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <ToastContainer />
        <div className="bg-white p-6 rounded shadow-md w-full max-w-4xl overflow-x-auto">
          <h1 className="text-2xl font-bold mb-4 text-center">Suppliers</h1>
          {suppliers.length > 0 ? (
            <table className="min-w-full bg-white table-auto">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 text-center">Name</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-center">Contact Number</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-center">Email</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier._id}>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">{supplier.name}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">{supplier.contactNumber}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">{supplier.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No suppliers found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowSuppliers;
