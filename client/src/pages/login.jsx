import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/layout/Header";
import { useAuth } from "../Context/auth";

const Login = () => {
  const [Password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [DepartmentName, setDepartmentName] = useState("");
  const [email, setEmail] = useState("");
  const [departments, setDepartments] = useState([]);
  const [authState, setAuthState] = useAuth();
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const [showDepartmentLogin, setShowDepartmentLogin] = useState(false);
  const [showSupplierLogin, setShowSupplierLogin] = useState(false);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await fetch(
          "https://imc-hack.onrender.com/api/v1/auth/getalldepartments"
        );
        const data = await response.json();
        if (response.ok) {
          setDepartments(data.departments);
        } else {
          toast.error(data.message || "Failed to fetch departments");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching departments");
      }
    }

    fetchDepartments();
  }, []);

  async function handleDepartmentSubmit(e) {
    e.preventDefault();
    if (!DepartmentName || !Password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://imc-hack.onrender.com/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          DepartmentName,
          Password,
        }),
      });
      const data = await response.json();
      if (response.status === 404) {
        setLoading(false);
        toast.error(data.message);
      } else if (response.status === 210) {
        setLoading(false);
        toast.error(data.message);
      } else if (response.status === 200) {
        setLoading(false);
        toast.success("Login Successful");
        setAuthState({
          ...authState,
          Department: data.Department,
          token: data.token,
        });
        localStorage.setItem(
          "auth",
          JSON.stringify({ Department: data.Department, token: data.token })
        );

        setTimeout(() => {
          navigate("/getitems");
        }, 2500);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Something went wrong. Try again");
    }
  }

  async function handleSupplierSubmit(e) {
    e.preventDefault();
    if (!email || !Password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://imc-hack.onrender.com/api/v1/supplier/SupplierLogin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password: Password }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        toast.error(data.error || "Invalid email or password");
      } else {
        setLoading(false);
        toast.success("Login Successful");
        setAuthState({
          ...authState,
          supplier: data.supplier,
          token: data.token,
        });
        localStorage.setItem(
          "auth",
          JSON.stringify({ supplier: data.supplier, token: data.token })
        );

        setTimeout(() => {
          navigate("/createitem");
        }, 2500);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Something went wrong. Try again.");
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <ToastContainer />
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          {!showDepartmentLogin && !showSupplierLogin && (
            <>
              <button
                onClick={() => setShowDepartmentLogin(true)}
                className="w-full bg-blue-500 text-white py-2 rounded mb-4"
              >
                Department Login
              </button>
              <button
                onClick={() => setShowSupplierLogin(true)}
                className="w-full bg-green-500 text-white py-2 rounded"
              >
                Supplier Login
              </button>
            </>
          )}

          {showDepartmentLogin && (
            <form onSubmit={handleDepartmentSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Select Department Name
                </label>
                <select
                  value={DepartmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="w-full px-4 py-2 border rounded mt-1"
                >
                  <option value="">Select a department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept.DepartmentName}>
                      {dept.DepartmentName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4 relative">
                <label className="block text-gray-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer">
                    {showPassword ? (
                      <FaEyeSlash onClick={togglePasswordVisibility} />
                    ) : (
                      <FaEye onClick={togglePasswordVisibility} />
                    )}
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-4 py-2 border rounded mt-1"
                  />
                </div>
              </div>
              <button
                type="submit"
                className={`w-full bg-blue-500 text-white py-2 rounded ${
                  Loading ? "opacity-50" : ""
                }`}
                disabled={Loading}
              >
                {Loading ? "Log in..." : "Log In"}
              </button>
              <button
                onClick={() => setShowDepartmentLogin(false)}
                className="w-full mt-4 bg-gray-500 text-white py-2 rounded"
              >
                Cancel
              </button>
            </form>
          )}

          {showSupplierLogin && (
            <form onSubmit={handleSupplierSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="w-full px-4 py-2 border rounded mt-1"
                />
              </div>
              <div className="mb-4 relative">
                <label className="block text-gray-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer">
                    {showPassword ? (
                      <FaEyeSlash onClick={togglePasswordVisibility} />
                    ) : (
                      <FaEye onClick={togglePasswordVisibility} />
                    )}
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-4 py-2 border rounded mt-1"
                  />
                </div>
              </div>
              <button
                type="submit"
                className={`w-full bg-green-500 text-white py-2 rounded ${
                  Loading ? "opacity-50" : ""
                }`}
                disabled={Loading}
              >
                {Loading ? "Log in..." : "Log In"}
              </button>
              <button
                onClick={() => setShowSupplierLogin(false)}
                className="w-full mt-4 bg-gray-500 text-white py-2 rounded"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
