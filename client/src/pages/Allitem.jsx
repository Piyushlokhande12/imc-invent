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
} from "@mui/material";
import { Checkbox, Row, Col, Modal, Form, Input } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/layout/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/auth";

const calculateStatus = (expiryDate, quantity) => {
  const now = new Date();
  const expDate = new Date(expiryDate);
  const oneMonthFromNow = new Date(now);
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

const getStatusColor = (status) => {
  switch (status) {
    case "Available":
      return "green";
    case "Expires in 1 Month":
      return "orange";
    case "Expired":
      return "red";
    case "Unavailable":
      return "purple";
    default:
      return "black";
  }
};

const Allitem = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [quantity, setQuantity] = useState(0); // Track quantity state
  const [form] = Form.useForm(); // Initialize the form instance
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth(); // Use auth context to get current user info

  useEffect(() => {
    async function fetchMaterials() {
      try {
        const response = await fetch(
          "https://imc-hack.onrender.com/api/v1/materials/GetMaterials"
        );
        const data = await response.json();
        if (data.success === "true") {
          setMaterials(data.materials);
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

  const handleDepartmentChange = (checkedValues) => {
    setSelectedDepartments(checkedValues);
  };

  const filteredMaterials = selectedDepartments.length
    ? materials.filter((material) =>
        selectedDepartments.includes(material.Department.DepartmentName)
      )
    : materials;

  const uniqueDepartments = [
    ...new Set(materials.map((material) => material.Department.DepartmentName)),
  ];

  const showModal = (material) => {
    setSelectedMaterial(material);
    form.setFieldsValue({
      materialName: material.MaterialName,
      quantity: 0,
      description: "",
    }); // Set initial form values based on selected material
    setIsModalVisible(true);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleOk = async (values) => {
    if (values.quantity <= 0) {
      toast.error("enter quantity greater than 0");
      return;
    }
    const requestData = {
      materialId: selectedMaterial._id,
      materialName: selectedMaterial.MaterialName,
      fromDepartmentId: auth.Department._id,
      toDepartmentId: selectedMaterial.Department._id, // The department the material is being requested from
      quantity: values.quantity,
      description: values.description,
    };

    try {
      const response = await fetch(
        `https://imc-hack.onrender.com/api/v1/request/Addnewrequest/${requestData.materialId}/${requestData.fromDepartmentId}/${requestData.toDepartmentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: requestData.quantity,
            description: requestData.description,
          }),
        }
      );

      const data = await response.json();
      if (data.success === true) {
        toast.success("Request submitted successfully!");
        form.resetFields(); // Reset form fields after successful submission
        setSelectedMaterial(null); // Clear the selected material
        setQuantity(0); // Reset quantity state
      } else {
        toast.error("Failed to submit request");
      }
    } catch (error) {
      toast.error("Error submitting request");
    } finally {
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const isSubmitDisabled =
    quantity > (selectedMaterial ? selectedMaterial.quantity : 0);

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
          style={{ fontWeight: "bold" }}
        >
          Data-warehouse
          <br />
          A single source of truth!
        </Typography>
        <div className="mb-4 ">
          <Checkbox.Group
            onChange={handleDepartmentChange}
            className="d-flex gap-4"
          >
            <Row>
              {uniqueDepartments.map((department) => (
                <Col key={department} span={8}>
                  <Checkbox
                    value={department}
                    style={{ fontSize: '16px', marginRight: '10px' }}
                  >
                    {department}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </div>
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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMaterials.map((material) => {
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
                    <TableCell sx={{ color }}>{status}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => showModal(material)}
                      >
                        Request Item
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Modal
        title="Request Item"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedMaterial && (
          <Form form={form} layout="vertical" onFinish={handleOk}>
            <Form.Item label="Material Name" name="materialName">
              <Input value={form.getFieldValue("materialName")} disabled />
            </Form.Item>
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[
                { required: true, message: "Please input the quantity!" },
              ]}
            >
              <Input
                type="number"
                value={quantity}
                onChange={(e) => {
                  handleQuantityChange(e);
                  form.setFieldsValue({ quantity: e.target.value });
                }}
              />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please input the description!" },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={isSubmitDisabled}>
                Submit Request
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default Allitem;
