import mongoose from "mongoose";
import slugUpdater from "mongoose-slug-updater";

mongoose.plugin(slugUpdater);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, slug: "name", unique: true },
  },
  { timestamps: true }
);

export const CategoryModel = mongoose.model("Category", categorySchema);

const subCategorySchema = new mongoose.Schema(
  {
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: { type: String, required: true },
    slug: { type: String, slug: "name", unique: true },
  },
  { timestamps: true }
);

export const SubCategoryModel = mongoose.model(
  "SubCategory",
  subCategorySchema
);
