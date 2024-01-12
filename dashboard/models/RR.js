import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  google_auth_id: { type: String, required: true },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  reason: { type: String, required: true },
  description: { type: String, required: true },
  is_approved: { type: Boolean, default: false },
  is_deleted: { type: Boolean, default: false },
});

export const ReportModel = mongoose.model("Report", reportSchema);

const reviewSchema = new mongoose.Schema(
  {
    google_auth_id: { type: String, required: true },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    name: String,
    is_approved: { type: Boolean, default: false },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ReviewModel = mongoose.model("Review", reviewSchema);

const callbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
});

export const CallbackModel = mongoose.model("Callback", callbackSchema);
