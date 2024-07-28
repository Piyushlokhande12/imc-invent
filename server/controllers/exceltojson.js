const xlsx = require("xlsx");
const fs = require("fs");
const Material = require("../modals/materialModel");

const excelToJson = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(worksheet);
};

const uploadMaterial = async (req, res) => {
  const filePath = req.file.path;

  try {
    const jsonData = excelToJson(filePath);

    for (const item of jsonData) {
      await Material.updateOne(
        { MaterialName: item.MaterialName }, // Filter: Find by MaterialName
        {
          $set: {
            Description: item.Description,
            quantity: item.quantity,
            UnitPrice: item.UnitPrice,
            Seller: item.Seller,
            lifetime: item.lifetime,
          },
        },
        { upsert: true } // Create if not found
      );
    }

    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: "File uploaded and data processed successfully!",
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Error processing file" });
  }
};

module.exports = { uploadMaterial };
