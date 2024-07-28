const Supplier = require("../modals/supplierschema");
const materials = require("../modals/materialModel")
const { comparePassword } = require("../helpers/passwordbcrypt");

const JWT = require("jsonwebtoken");

const createSupplier = async (req, res) => {
  try {
    const supplierData = req.body;
    const supplier = new Supplier(supplierData);
    const result = await supplier.save();
    res.status(201).send(result);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const listSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({});
    res.status(200).send(suppliers);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};


const listSuppliersitems = async (req, res) => {
  try {
    const suppliers = await materials.find({createdBy:req.params.id});
    res.status(200).send(suppliers);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const supplierLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const supplier = await Supplier.findOne({ email });

    if (!supplier) {
      return res.status(404).send({
        success: false,
        message: "Supplier not registered",
      });
    }

    if (password != supplier.password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    // Generate token
    const token = JWT.sign({ _id: supplier._id }, process.env.JWT_SECRET, {
      expiresIn: "4d",
    });

    res.status(200).send({
      success: true,
      message: "Login successful",
      supplier,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

module.exports = {
  createSupplier,
  listSuppliers,
  supplierLoginController,
  listSuppliersitems,
};
