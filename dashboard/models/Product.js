import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sub_category: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    local_goverment: { type: String, required: true },
    images: [{ url: String, id: String }],
    is_service: { type: Boolean, required: true },
    billing_type: { type: String }, // You may want to validate this field to ensure it only contains valid values.
    is_negotiable: { type: Boolean, required: true },
    show_phone_number: { type: Boolean },
    show_email: { type: Boolean },
    show_whatsapp: { type: Boolean },
    is_deleted: { type: Boolean, default: false },
    is_published: { type: Boolean, default: true },
    is_promoted: { type: Boolean, default: false },
    sponsorship: { type: String },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model("Product", productSchema);

const promotionSchema = new mongoose.Schema(
  {
    duration: { type: Number, required: true },
    paystack_reference: { type: String, required: true },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    sponsorships: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  },
  { timestamps: true }
);

export const PromotionModel = mongoose.model("Promotion", promotionSchema);
