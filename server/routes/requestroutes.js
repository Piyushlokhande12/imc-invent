const express = require("express");
const {
  Addnewrequest,
  ListDepartmentRequests,
  ListMyRequests,
  ChangeStatus,
} = require("../controllers/RequestController");
const router = express.Router();

router.post("/Addnewrequest/:materialid/:from/:to", Addnewrequest);

router.get("/ListAllRequests/:departmentId", ListDepartmentRequests);

router.get("/ListMyRequests/:departmentId", ListMyRequests);

router.put("/ChangeStatus/:id", ChangeStatus);

module.exports = router;
