const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema(
  {
    MaterialName: {
      type: String,
      unique: true,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
    },
    Department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Departments",
      default: "66a44032293bac236289f5d6", 
    },
    UnitPrice: {
      type: Number,
      required: true,
    },
    Seller: {
      type: String,
      required: true,
    },
    lifetime: {
      type: Number, // lifetime in days
      required: true,
    },
    expiryDate: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
  },
  { timestamps: true }
);

// Calculate expiry date before saving
MaterialSchema.pre("save", function (next) {
  if (this.lifetime) {
    const createdAt = this.createdAt || new Date();
    this.expiryDate = new Date(
      createdAt.getTime() + this.lifetime * 24 * 60 * 60 * 1000
    );
  }
  next();
});

module.exports = mongoose.model("Materials", MaterialSchema);
