import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Context/auth";

const OutgoingRequests = () => {
  const [auth, setAuth] = useAuth();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await fetch(
          `https://imc-hack.onrender.com/api/v1/request/ListMyRequests/${auth?.Department?._id}`
        );
        const data = await response.json();
        if (data.success) {
          setRequests(data.requests);
        } else {
          if (data.status === 400) {
            toast("No requests");
          }
        }
      } catch (error) {
        toast.error("Error fetching requests");
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, [auth]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return { color: "green", fontWeight: "bold" };
      case "Rejected":
        return { color: "red", fontWeight: "bold" };
      case "Pending":
      default:
        return { color: "Orange", fontWeight: "bold" };
    }
  };

  return (
    <>
      <div className="mx-auto p-1">
        <Header />
        <ToastContainer />
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          className="mt-6 font-bold text-center"
        >
          My Requests
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "700" }}>Item Name</TableCell>
                <TableCell style={{ fontWeight: "700" }}>Department</TableCell>
                <TableCell style={{ fontWeight: "700" }}>
                  Quantity Requested
                </TableCell>
                <TableCell style={{ fontWeight: "700" }}>
                  {" "}
                  Request Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.material.MaterialName}</TableCell>
                  <TableCell>{request.To.DepartmentName}</TableCell>
                  <TableCell>{request.Quantity}</TableCell>
                  <TableCell
                    style={getStatusStyle(request.status || "Pending")}
                    //  className="font-extrabold"
                  >
                    {request.status || "Pending"}
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

export default OutgoingRequests;
