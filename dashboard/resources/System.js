import { SettingsModel } from "../models/System.js";

export const SystemResource = {
  resource: SettingsModel,
  options: {
    actions: {
      new: {
        isAccessible: false,
      },
      edit: true,
      delete: {
        isAccessible: false,
      },
      filter: {
        isAccessible: false,
      },
    },
    properties: {
      _id: {
        isVisible: false,
      },
      __v: {
        isVisible: false,
      },
      updatedAt: {
        isVisible: false,
      },
      createdAt: {
        isVisible: false,
      },
      termsAndConditions: {
        type: "richtext",
        props: {
          rows: 10,
        },
      },
      privacyPolicy: {
        type: "richtext",
        props: {
          rows: 10,
        },
      },
      termsAndConditionsLastUpdated: {
        isVisible: false,
      },
      privacyPolicyLastUpdated: {
        isVisible: false,
      },
    },
  },
};
