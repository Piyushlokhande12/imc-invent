const express = require("express");
const {
  loginController,
  registerController,
  ListAllDepartments,
} = require("../controllers/authcontroller");
const router = express.Router();

const formidable = require("express-formidable");

router.post("/login", loginController);
router.post("/register", registerController);
router.get("/getalldepartments", ListAllDepartments);
module.exports = router;
