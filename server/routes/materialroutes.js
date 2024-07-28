const express = require("express");

const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const {
  GetAllMaterials2,
  GetAllMaterials,
  AddNewMaterials,
} = require("../controllers/Materialcontroller");

const { uploadMaterial } = require("../controllers/exceltojson");

const router = express.Router();

router.post("/AddMaterials", AddNewMaterials);

router.post("/AddMaterials/:createdBy", AddNewMaterials);
router.get("/GetMaterials/:id", GetAllMaterials);
router.get("/GetMaterials", GetAllMaterials2);
router.post("/upload", upload.single("File"), uploadMaterial);

module.exports = router;
