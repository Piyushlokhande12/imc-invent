const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  DepartmentName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  HeadName: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Departmentemail: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Departments", DepartmentSchema);
