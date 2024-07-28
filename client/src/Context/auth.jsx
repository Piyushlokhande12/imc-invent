import { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    Department: null,
    token: "",
  });

  useEffect(() => {
    try {
      const data = localStorage.getItem("auth");
      if (data) {
        const parsedData = JSON.parse(data);
        setAuth({
          Department: parsedData.Department,
          token: parsedData.token,
        });
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
    }
    //eslint-disable-next-line
  }, []); // Empty dependency array means this runs once after initial render

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
