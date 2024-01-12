import argon from "argon2";
import uploadFeature from "@adminjs/upload";
import { AdminModel } from "../models/Admin.js";
import { componentLoader, Components } from "../utils/ComponentLoader.js";
import CustomUploadProvider from "../utils/CustomUploadProvider.js";

export const AdminResource = {
  resource: AdminModel,
  options: {
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === "superadmin",
        before: async (request) => {
          if (!request.payload?.password) {
            throw new Error("Password is required");
          }
          if (request.payload?.password) {
            request.payload.password = await argon.hash(
              request.payload.password
            );
          }

          return request;
        },
      },

      show: {
        after: async (response) => {
          response.record.params.password = "";

          return response;
        },
      },
      edit: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === "superadmin",
        before: async (request) => {
          if (request.method === "post") {
            if (request.payload?.password) {
              request.payload.password = await argon.hash(
                request.payload.password
              );
            } else {
              delete request.payload?.password;
            }
          }

          return request;
        },
        after: async (response) => {
          response.record.params.password = "";

          return response;
        },
      },
      list: {
        after: async (response) => {
          response.records.forEach((record) => {
            record.params.password = "";
          });

          return response;
        },
      },
    },
    properties: {
      first_name: {
        isTitle: true,
      },
      password: {
        isVisible: {
          list: false,
          filter: false,
          show: false,
          edit: true,
        },
      },
      image: {
        components: {
          edit: Components.ImageEditor,
        },
      },
      mimeType: {
        isVisible: false,
      },
    },
    feature: [
      uploadFeature({
        componentLoader,
        provider: new CustomUploadProvider(
          {
            forcePathStyle: false,
            endpoint: process.env.STORAGE_ENDPOINT,
            region: process.env.STORAGE_REGION,
            credentials: {
              accessKeyId: process.env.STORAGE_KEY,
              secretAccessKey: process.env.STORAGE_SECRET,
            },
          },
          process.env.STORAGE_NAME
        ),
        properties: {
          key: "image.path",
          bucket: "image.folder",
          mimeType: "image.type",
          size: "image.size",
          filename: "image.filename",
        },
        validation: { mimeTypes: ["image/png", "image/jpeg", "image/jpg"] },
      }),
    ],
  },
};

export const authenticate = async (email, password) => {
  const admin = await AdminModel.findOne({
    email,
  });

  if (admin) {
    if (await argon.verify(admin.password, password)) {
      return admin;
    }
  }

  return null;
};
