const MaterialModel = require("../modals/materialModel");

async function GetAllMaterials(req, resp) {
  try {
    const dep = req.params.id;
    const materials = await MaterialModel.find({
      Department: dep,
    }).populate("Department", "DepartmentName");

    if (materials) {
      return resp.send({
        success: "true",
        materials,
      });
    } else {
      return resp.send({
        success: "false",
      });
    }
  } catch (error) {
    console.log(error);
    resp.send({
      messaage: "Error in api",
    });
  }
}
async function GetAllMaterials2(req, resp) {
  try {
    const materials = await MaterialModel.find({}).populate(
      "Department",
      "DepartmentName"
    );

    if (materials) {
      return resp.send({
        success: "true",
        materials,
      });
    } else {
      return resp.send({
        success: "false",
      });
    }
  } catch (error) {
    console.log(error);
    resp.send({
      messaage: "Error in api",
    });
  }
}
async function AddNewMaterials(req, resp) {
  try {
    const {
      MaterialName,
      Description,
      quantity,
      UnitPrice,
      Seller,
      lifetime,
      Department,
    } = req.body;

    const createdBy = req.params.createdBy;
    const material = await new MaterialModel({
      MaterialName,
      Description,
      quantity,
      UnitPrice,
      Department,
      Seller,
      lifetime,
      createdBy,
    }).save();

    if (material) {
      return resp.status(200).send({
        success: true,
        material,
      });
    } else {
      return resp.status(400).send({
        success: false,
        message: "Data not saved",
      });
    }
  } catch (error) {
    console.log(error);
    return resp.status(500).send({
      success: false,
      message: "Error in API",
    });
  }
}

async function SearchMaterialDepartmentWise(req, resp) {
  try {
    const { departmentid } = req.params;

    const materials = await MaterialModel.find({
      Department: departmentid,
    }).populate("Department", "DepartmentName");

    if (materials.length > 0) {
      return resp.status(200).send({
        success: true,
        message: "Materials fetched successfully",
        materials,
      });
    } else {
      return resp.status(404).send({
        success: false,
        message: "No materials found for this department",
      });
    }
  } catch (error) {
    console.error(error);
    return resp.status(500).send({
      success: false,
      message: "Error in fetching materials",
    });
  }
}

module.exports = {
  GetAllMaterials,
  AddNewMaterials,
  GetAllMaterials2,
  SearchMaterialDepartmentWise,
};
