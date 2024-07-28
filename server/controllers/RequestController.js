const requestModal = require("../modals/requestmaterialsmodal");

async function Addnewrequest(req, resp) {
  try {
    const { materialid, to, from } = req.params;
    const { quantity, description } = req.body;

    const newrequest = await new requestModal({
      material: materialid,
      To: to,
      From: from,
      Quantity: quantity,
      description: description,
    }).save();

    if (newrequest) {
      return resp.status(200).send({
        success: true,
        newrequest,
      });
    } else {
      return resp.status(400).send({
        success: false,
        message: "not able to send request",
      });
    }
  } catch (error) {
    console.log(error);
    return resp.status(500).send({
      success: false,
      message: "Error in api",
    });
  }
}
async function ListDepartmentRequests(req, resp) {
  try {
    const { departmentId } = req.params; // Assuming the department is identified by an ID

    const requests = await requestModal
      .find({ To: departmentId })
      .populate("material From To"); // Populate referenced fields if needed

    if (requests.length > 0) {
      return resp.status(200).send({
        success: true,
        requests,
      });
    } else {
      return resp.status(210).send({
        success: false,
        message: "Cannot get requests",
      });
    }
  } catch (error) {
    console.error(error);
    return resp.status(500).send({
      success: false,
      message: "Error in API",
    });
  }
}

async function ListMyRequests(req, resp) {
  try {
    const { departmentId } = req.params; // Assuming the department is identified by an ID

    const requests = await requestModal
      .find({ From: departmentId })
      .populate("material From To"); // Populate referenced fields if needed

    if (requests.length > 0) {
      return resp.status(200).send({
        success: true,
        requests,
      });
    } else {
      return resp.status(400).send({
        success: false,
        message: "Cannot get requests",
      });
    }
  } catch (error) {
    console.error(error);
    return resp.status(500).send({
      success: false,
      message: "Error in API",
    });
  }
}

async function ChangeStatus(req, resp) {
  try {
    const id = req.params.id;
    const { state } = req.body;

    const statusUpdate = await requestModal.updateOne(
      { _id: id },
      {
        $set: {
          status: state, 
        },
      } 
    );

    if (statusUpdate.matchedCount === 0) {
      resp.status(404).send({ message: "Document not found" });
    } else if (statusUpdate.modifiedCount === 0) {
      resp.status(200).send({ message: "No changes made to the status" });
    } else {
      resp.status(200).send({ message: "Status updated successfully" });
    }
  } catch (error) {
    resp
      .status(500)
      .send({ message: "An error occurred", error: error.message });
  }
}

module.exports = {
  Addnewrequest,
  ListDepartmentRequests,
  ListMyRequests,
  ChangeStatus,
};
