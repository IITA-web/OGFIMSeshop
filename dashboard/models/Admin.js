import mongoose, { Schema } from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    image: {
      key: String,
      mimeType: String,
      bucket: String,
      size: Number,
    },
    password: { type: String },
    email: { type: String, required: true, unique: true },
    mimeType: String,
    name: { type: String, required: true },
    role: {
      type: String,
      required: true,
      default: "admin",
      enum: ["admin", "superadmin"],
    },
  },
  {
    timestamps: true,
  }
);

export const AdminModel = mongoose.model("Admin", adminSchema);
