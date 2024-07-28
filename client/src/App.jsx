import { useState } from "react";
import Login from "./pages/login";
import Register from "./pages/register";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/auth";
import Itemshow from "./pages/Itemshow";
import Homepage from "./pages/Homepage";
import Waste from "./pages/Waste";
import OutOfStock from "./pages/OutOfStock";
import Allitem from "./pages/Allitem";
import Requestpage from "./pages/Requestpage";
import Createitem from "./pages/Createitem";
import ShowSuppliers from "./pages/Showsuppliers";
import Showitemsupp from "./pages/Showitemsupp";
import Outgoingrequests from "./pages/outgoingrequests";
function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/getitems" element={<Itemshow />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/waste" element={<Waste />} />
          <Route path="/outofstock" element={<OutOfStock />} />
          <Route path="/allitems" element={<Allitem />} />
          <Route path="/request" element={<Requestpage />} />
          <Route path="/createitems" element={<Createitem />} />
          <Route path="/showsuppliers" element={<ShowSuppliers />} />
          <Route path="/showitems" element={<Showitemsupp />} />
          <Route
            path="/outgoingrequests"
            element={<Outgoingrequests />}
          ></Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
