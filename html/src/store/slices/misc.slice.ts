import { message } from "antd";
import { devtools } from "zustand/middleware";
import { create } from "zustand";
import ApiService from "@/services/api";
import { iReview } from "@/typings";
import { toast } from "react-toastify";

type MiscState = {
  spinning: boolean;
  processing: boolean;
  message: string;
  error: string;
  reviews: iReview[];
  terms_and_conditions: string;
  last_updated_date_terms_and_conditions: Date;
  privacy_policy: string;
  last_updated_date_privacy_policy: Date;
  social_media: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
  setSpinner: (state: boolean) => void;
  requestCallback: (payload: Record<string, unknown>) => Promise<void>;
  reportVendor: (payload: Record<string, unknown>) => Promise<void>;
  reviewVendor: (payload: Record<string, any>) => Promise<void>;
  getVendorReview: (vendorId: string) => Promise<void>;
  getSystemSettings: () => Promise<void>;
  clear: (key: string, value: unknown) => void;
};

const useMiscStore = create<MiscState>()(
  devtools((set, get) => ({
    spinning: false,
    processing: false,
    message: null,
    error: null,
    terms_and_conditions: null,
    last_updated_date_privacy_policy: null,
    last_updated_date_terms_and_conditions: null,
    privacy_policy: null,
    social_media: null,
    reviews: [],
    setSpinner: (state) => {
      set({ spinning: state });
    },
    requestCallback: async (payload) => {
      set({ processing: true, error: null, message: null });
      try {
        const apiService = new ApiService();
        const { data } = await apiService.RequestCallback(payload);

        toast.success(data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        set({ message: data.message });
      } catch (error: any) {
        toast.error(
          error.response.data.message ||
            error.message ||
            "Error: Something went wrong!",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      } finally {
        set({ processing: false });
      }
    },
    reportVendor: async (payload) => {
      set({ processing: true, error: null, message: null });
      try {
        const apiService = new ApiService();
        const { data } = await apiService.ReportVendor(payload);

        toast.success(data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        set({ message: data.message });
      } catch (error: any) {
        toast.error(
          error.response.data.message ||
            error.message ||
            "Error: Something went wrong!",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      } finally {
        set({ processing: false });
      }
    },
    reviewVendor: async (payload) => {
      set({ processing: true, error: null, message: null });
      try {
        const { getVendorReview } = get();
        const apiService = new ApiService();
        const { data } = await apiService.ReviewVendor(payload);

        toast.success(data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        set({ message: data.message });
        await getVendorReview(payload["vendor"]);
      } catch (error: any) {
        toast.error(
          error.response.data.message ||
            error.message ||
            "Error: Something went wrong!",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      } finally {
        set({ processing: false });
      }
    },
    getVendorReview: async (payload) => {
      set({ processing: true, error: null, message: null });
      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetVendorReview(payload);

        set({ reviews: data });
      } catch (error: any) {
        set({ reviews: [] });
      } finally {
        set({ processing: false });
      }
    },
    getSystemSettings: async () => {
      try {
        const apiService = new ApiService();
        const [res1, res2, res3] = await Promise.all([
          apiService.GetTermsAndCondition(),
          apiService.GetPrivacyPolicy(),
          apiService.GetSocialMedia(),
        ]);

        const [terms_and_conditions, privacy_policy, social_media] = [
          res1.data,
          res2.data,
          res3.data,
        ];

        set({
          terms_and_conditions: terms_and_conditions.content,
          last_updated_date_terms_and_conditions:
            terms_and_conditions.lastUpdated,
          privacy_policy: privacy_policy.content,
          last_updated_date_privacy_policy: privacy_policy.lastUpdated,
          social_media: social_media,
        });
      } catch (error: any) {
        toast.error(
          error.response.data.message ||
            error.message ||
            "Error: Something went wrong!",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      }
    },
    clear: (key, value) => {
      set((state) => ({ ...state, [key]: value }));
    },
  }))
);

export default useMiscStore;
