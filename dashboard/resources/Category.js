import { CategoryModel, SubCategoryModel } from "../models/Category.js";

const Ops = {
  isVisible: false,
  isAccessible: false,
};

export const CategoryResource = {
  resource: CategoryModel,
  options: {
    properties: {
      slug: {
        isVisible: false,
      },
      _id: {
        isVisible: false,
      },
      updatedAt: {
        isVisible: {
          show: false,
          list: false,
          edit: false,
          filter: false,
        },
      },
      createdAt: {
        isVisible: {
          show: false,
          list: false,
          edit: false,
          filter: false,
        },
      },
    },
  },
};

export const SubCategoryResource = {
  resource: SubCategoryModel,
  options: {
    properties: {
      slug: {
        isVisible: false,
      },
      _id: {
        isVisible: false,
      },
      category_id: {},
      updatedAt: {
        isVisible: {
          show: false,
          list: false,
          edit: false,
          filter: false,
        },
      },
      createdAt: {
        isVisible: {
          show: false,
          list: false,
          edit: false,
          filter: false,
        },
      },
    },
  },
};
