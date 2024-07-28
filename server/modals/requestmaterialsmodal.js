const { default: mongoose } = require("mongoose");

const RequestSchema = mongoose.Schema({
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Materials",
  },
  From: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departments",
    required: true,
  },
  To: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departments",
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
});

module.exports = mongoose.model("Request", RequestSchema);
