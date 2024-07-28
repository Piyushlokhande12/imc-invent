import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useNavigate } from "react-router-dom";

const calculateStatus = (expiryDate, quantity) => {
  const now = new Date();
  const expDate = new Date(expiryDate);

  const oneMonthFromNow = new Date(now);
  oneMonthFromNow.setMonth(now.getMonth() + 1);

  if (quantity <= 0) {
    return "Out of Stock";
  }

  if (expDate < now) {
    return "Expired";
  }

  if (expDate <= oneMonthFromNow) {
    return "Expires in 1 Month";
  }

  return "Available";
};

const getStatusColor = (status) => {
  switch (status) {
    case "Available":
      return "green";
    case "Expires in 1 Month":
      return "red";
    case "Expired":
      return "red";
    case "Out of Stock":
      return "purple";
    default:
      return "black";
  }
};

const Itemshow = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentName, setDepartmentName] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth && auth.Department) {
      setDepartmentName(auth.Department.DepartmentName);
    }

    async function fetchMaterials() {
      try {
        const response = await fetch(
          `https://imc-hack.onrender.com/api/v1/materials/GetMaterials/${auth?.Department?._id}`
        );
        const data = await response.json();
        if (data.success === "true") {
          setMaterials(data.materials);
          calculateTotalPrice(data.materials);
        } else {
          toast.error("Failed to fetch materials");
        }
      } catch (error) {
        toast.error("Error fetching materials");
      } finally {
        setLoading(false);
      }
    }

    fetchMaterials();
  }, []);

  const calculateTotalPrice = (materials) => {
    const total = materials.reduce((acc, material) => {
      return acc + material.quantity * material.UnitPrice;
    }, 0);
    setTotalPrice(total);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-6">
        <ToastContainer />
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          style={{ marginBottom: "0.5rem", fontWeight: "bold" }}
        >
          {departmentName} Department
        </Typography>
        <Box display="flex" justifyContent="center" marginBottom="1rem">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/allitems")}
            style={{ marginRight: "1rem" }}
          >
            All Items
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/waste")}
            style={{ marginRight: "1rem" }}
          >
            Show Expired Items
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => navigate("/outofstock")}
          >
            Show Out of Stock Items
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Material Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Seller</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materials.map((material) => {
                const status = calculateStatus(
                  material.expiryDate,
                  material.quantity
                );
                const color = getStatusColor(status);

                return (
                  <TableRow key={material._id}>
                    <TableCell>{material.MaterialName}</TableCell>
                    <TableCell>{material.Description}</TableCell>
                    <TableCell>{material.quantity}</TableCell>
                    <TableCell>{material.UnitPrice}</TableCell>
                    <TableCell>{material.Seller}</TableCell>
                    <TableCell>{material.Department.DepartmentName}</TableCell>
                    <TableCell style={{ color }}>{status}</TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={2} />
                <TableCell>Total Price</TableCell>
                <TableCell colSpan={2}>{totalPrice.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Footer/>
    </>
  );
};

export default Itemshow;
