import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { Badge } from "antd";
import { FaCodePullRequest } from "react-icons/fa6";

function Header() {
  const [auth, setAuth] = useState({
    Department: null,
    token: "",
  });

  const Navigate = useNavigate();
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  function handleLogout() {
    setAuth({
      Department: null,
      token: "",
    });
    localStorage.removeItem("auth");
    setTimeout(() => {
      toast.success("Logout Successful");
    }, 500);
    Navigate("/");
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <NavLink to="/" className="text-xl font-bold text-gray-700">
          MyApp
        </NavLink>

        <nav className="flex items-center space-x-4">
          {auth?.Department?.DepartmentName ? (
            <>
              <NavLink to="/getitems" className="text-gray-700">
                Material List
              </NavLink>
              <NavLink to="/allitems" className="text-gray-700">
                All Items
              </NavLink>
              <NavLink to="/showsuppliers" className="text-gray-700">
                Suppliers
              </NavLink>
              <NavLink to="/outgoingrequests" className="text-gray-700">
                My_Requests
              </NavLink>
              <NavLink to="/outofstock" className="text-gray-700"></NavLink>
              <Badge count={1}>
                <NavLink to="/request" className="text-gray-700">
                  <FaCodePullRequest size={24} />
                </NavLink>
              </Badge>

              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/" className="text-gray-700">
                Home
              </NavLink>
              <NavLink to="/login" className="text-gray-700">
                Login
              </NavLink>
              <NavLink to="/register" className="text-gray-700">
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
