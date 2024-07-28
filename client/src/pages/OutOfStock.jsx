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
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/layout/Header";

const calculateStatus = (expiryDate, quantity) => {
  const now = new Date();
  const expDate = new Date(expiryDate);
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(now.getMonth() + 1);

  if (quantity <= 0) {
    return "Unavailable";
  }

  if (expDate < now) {
    return "Expired";
  }

  if (expDate <= oneMonthFromNow) {
    return "Expires in 1 Month";
  }

  return "Available";
};

const OutOfStock = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOutOfStockMaterials() {
      try {
        const response = await fetch(
          "https://imc-hack.onrender.com/api/v1/materials/GetMaterials"
        );
        const data = await response.json();
        if (data.success === "true") {
          const outOfStockItems = data.materials.filter(
            (material) =>
              calculateStatus(material.expiryDate, material.quantity) ===
              "Unavailable"
          );
          setMaterials(outOfStockItems);
        } else {
          toast.error("Failed to fetch materials");
        }
      } catch (error) {
        toast.error("Error fetching materials");
      } finally {
        setLoading(false);
      }
    }

    fetchOutOfStockMaterials();
  }, []);

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
        <Typography variant="h4" component="h1" gutterBottom>
          Out of Stock Materials List
        </Typography>
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
              {materials.map((material) => (
                <TableRow key={material._id}>
                  <TableCell>{material.MaterialName}</TableCell>
                  <TableCell>{material.Description}</TableCell>
                  <TableCell>{material.quantity}</TableCell>
                  <TableCell>{material.UnitPrice}</TableCell>
                  <TableCell>{material.Seller}</TableCell>
                  <TableCell>{material.Department.DepartmentName}</TableCell>
                  <TableCell>
                    {calculateStatus(material.expiryDate, material.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default OutOfStock;
