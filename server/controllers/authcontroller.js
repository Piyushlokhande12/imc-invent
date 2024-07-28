const departmentmodal = require("../modals/departmentmodal");
const JWT = require("jsonwebtoken");
const { comparePassword, hashPassword } = require("../helpers/passwordbcrypt");

async function registerController(req, res) {
  try {
    const { DepartmentName, HeadName, Password, Departmentemail } = req.body;
    if (!DepartmentName || !Password || !HeadName || !Departmentemail) {
      return res
        .status(400)
        .send({ success: false, error: "All fields are required" });
    }

    const existingDepartmentName = await departmentmodal.findOne({
      DepartmentName,
    });

    if (existingDepartmentName) {
      return res
        .status(409)
        .send({ success: false, message: "Department Name already exists" });
    }

    const existingEmail = await departmentmodal.findOne({ Departmentemail });

    if (existingEmail) {
      return res
        .status(409)
        .send({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await hashPassword(Password);

    const Department = new departmentmodal({
      DepartmentName,
      HeadName,
      Password: hashedPassword,
      Departmentemail,
    });

    await Department.save();

    res.status(201).send({
      success: true,
      message: "Department registered successfully",
      Department,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, error: "Internal server error" });
  }
}

async function loginController(req, res) {
  try {
    const { DepartmentName, Password } = req.body;

    if (!DepartmentName || !Password) {
      return res.status(404).send({
        success: false,
        message: "Invalid DepartmentName or Password",
      });
    }

    const Department = await departmentmodal.findOne({ DepartmentName });

    if (!Department) {
      return res.status(404).send({
        success: false,
        message: "Department not registered",
      });
    }

    const match = await comparePassword(Password, Department.Password);

    if (!match) {
      return res.status(210).send({
        success: false,
        message: "Invalid Department or Password",
      });
    }

    // token
    const token = JWT.sign({ _id: Department._id }, process.env.JWT_SECRET, {
      expiresIn: "4d",
    });

    res.status(200).send({
      success: true,
      message: "Login successful",
      Department,
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
}

async function ListAllDepartments(req, resp) {
  try {
    const departments = await departmentmodal
      .find({})
      .select("id DepartmentName");

    if (departments.length > 0) {
      return resp.status(200).send({
        message: "All departments fetched successfully",
        departments,
      });
    } else {
      return resp.status(404).send({
        success: false,
        message: "No departments found",
      });
    }
  } catch (error) {
    console.error(error);
    return resp.status(500).send({
      success: false,
      message: "Error in fetching departments",
    });
  }
}

module.exports = {
  loginController,
  registerController,
  ListAllDepartments,
};
