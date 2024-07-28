import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Context/auth";
import Header from "../components/layout/Header";

const RequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth(); // Removed unnecessary setAuth
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  useEffect(() => {
    async function fetchRequests() {
      if (!auth?.Department?._id) {
        setLoading(false);
        toast.error("Department ID is missing");
        return;
      }
      try {
        const response = await fetch(
          `https://imc-hack.onrender.com/api/v1/request/ListAllRequests/${auth.Department._id}`
        );
        const data = await response.json();
        if (data.success) {
          setRequests(data.requests);
        } else {
          console.log(data);
          if (response.status === 210) {
          } else {
            toast.error("Failed to fetch requests");
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

  const handleMenuClick = (event, requestId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRequestId(requestId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRequestId(null);
  };

  const handleAction = async (requestId, action) => {
    handleMenuClose();

    try {
      const response = await fetch(
        `https://imc-hack.onrender.com/api/v1/request/ChangeStatus/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ state: action }),
        }
      );
      const data = await response.json();
      if (response.status == 200) {
        toast.success("Status updated");
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === requestId ? { ...req, status: action } : req
          )
        );
      } else {
        toast.error("Failed to update request");
      }
    } catch (error) {
      toast.error("Error updating request");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Header />
      <ToastContainer />
      <Typography variant="h4" component="h1" gutterBottom>
        Incoming Requests
      </Typography>
      {requests.length === 0 ? (
        <Typography variant="h6" component="h2">
          No requests found
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.material.MaterialName}</TableCell>
                  <TableCell>{request.From.DepartmentName}</TableCell>
                  <TableCell>{request.Quantity}</TableCell>
                  <TableCell>{request.status || "Pending"}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={(event) => handleMenuClick(event, request._id)}
                    >
                      Actions
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem
                        onClick={() =>
                          handleAction(selectedRequestId, "Approved")
                        }
                      >
                        Approve
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          handleAction(selectedRequestId, "Rejected")
                        }
                      >
                        Reject
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          handleAction(selectedRequestId, "Pending")
                        }
                      >
                        Pending
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default RequestPage;
