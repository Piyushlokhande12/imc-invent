import React, { useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/supplier";

function Header() {
  const [supauth, setsupAuth] = useAuth();
  const Navigate = useNavigate();

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setsupAuth(JSON.parse(storedAuth));
    }
  }, [setsupAuth]);

  function handleLogout() {
    setsupAuth({
      supplier: null,
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
          {supauth.supplier ? (
            <>
              <NavLink to="/createitems" className="text-gray-700">
                Create-item
              </NavLink>
              <NavLink to="/showitems" className="text-gray-700">
                Show-items
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
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
