import { ReviewModel, ReportModel } from "../models/RR.js";

const Ops = {
  isVisible: false,
  isAccessible: false,
};

export const ReviewResource = {
  resource: ReviewModel,
  options: {
    actions: {
      bulkDelete: Ops,
      edit: Ops,
      new: Ops,
      delete: Ops,
      approve: {
        actionType: "record",
        component: false,
        handler: async (request, response, context) => {
          const { record, currentAdmin } = context;

          record.params.is_approved = !record.params.is_approved;
          return {
            ...response,
            record: record.toJSON(currentAdmin),
            notice: {
              type: "success",
              message:
                record.params.is_approved === true
                  ? "Review approved"
                  : "Review disapproved",
            },
          };
        },
        guard: "Are you sure?",
      },
    },
    properties: {
      google_auth_id: {
        isVisible: {
          show: true,
          list: false,
          edit: false,
          filter: false,
        },
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

export const ReportResource = {
  resource: ReportModel,
  options: {
    actions: {
      bulkDelete: Ops,
      edit: Ops,
      new: Ops,
      delete: Ops,
      approve: {
        actionType: "record",
        component: false,
        handler: async (request, response, context) => {
          const { record, currentAdmin } = context;

          record.params.is_approved = !record.params.is_approved;
          return {
            ...response,
            record: record.toJSON(currentAdmin),
            notice: {
              type: "success",
              message:
                record.params.is_approved === true
                  ? "Review approved"
                  : "Review disapproved",
            },
          };
        },
        guard: "Are you sure?",
      },
    },
    properties: {
      google_auth_id: {
        isVisible: {
          show: true,
          list: false,
          edit: false,
          filter: false,
        },
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
