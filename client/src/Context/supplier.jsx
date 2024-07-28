import { useState, useEffect, useContext, createContext } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

function SupplierProvider({ children }) {
  const [supauth, setsupAuth] = useState({
    supplier: null,
    token: "",
  });

  useEffect(() => {
    try {
      const data = localStorage.getItem("auth");
      if (data) {
        const parsedData = JSON.parse(data);
        setsupAuth({
          supplier: parsedData.supplier,
          token: parsedData.token,
        });
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
    }
  }, []); // The empty array ensures this effect runs only once

  return (
    <AuthContext.Provider value={[supauth, setsupAuth]}>
      {children}
    </AuthContext.Provider>
  );
}

SupplierProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useAuth = () => useContext(AuthContext);

export { useAuth, SupplierProvider };
