const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const ConnectDb = require("./config/dbconnect");

const authRoutes = require("./routes/authroutes");

const materialRoutes = require("./routes/materialroutes");

const requestRoutes = require("./routes/requestroutes");

const supplierRoute = require("./routes/supplierroute");

dotenv.configDotenv();
ConnectDb();

const app = express();

app.use(express.json());

app.use(cors());

// routes

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/materials", materialRoutes);

app.use("/api/v1/request", requestRoutes);

app.use("/api/v1/supplier", supplierRoute);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("server running on", PORT);
});
