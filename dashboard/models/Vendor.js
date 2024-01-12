import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    main_app_vendor_id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    image: String,
    tags: {
      type: [String],
      maxlength: 2,
      enum: [
        "Crop Farming",
        "Grain Farming",
        "Fruit Farming",
        "Vegetable Farming",
        "Livestock Farming",
        "Cattle Farming",
        "Poultry Farming",
        "Sheep and Goat Farming",
        "Aquaculture",
        "Fish Farming",
        "Shrimp Farming",
        "Oyster and Mussel Farming",
        "Horticulture",
        "Floriculture",
        "Nursery Operations",
      ],
    },
    phone_number: {
      type: String,
      unique: true,
    },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const VendorModel = mongoose.model("Vendor", vendorSchema);

const verificationCodeSchema = new mongoose.Schema({
  code: { type: String, required: true },
  expiration_date: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 1800,
  }, // Expires after 30 minutes
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  status: { type: Boolean, default: false },
});

export const VerificationCodeModel = mongoose.model(
  "VerificationCode",
  verificationCodeSchema
);
