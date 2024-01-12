import { ProductModel } from "../models/Product.js";

export const ProductResource = {
  resource: ProductModel,
  options: {
    properties: {
      description: {
        type: "richtext",
      },
    },
  },
};
