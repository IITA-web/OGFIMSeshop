import {
  IProduct,
  IVendor,
  IProductWithoutVendor,
} from "./../../typings/index.d";
import { devtools } from "zustand/middleware";
import { create } from "zustand";
import ApiService from "@/services/api";
import { toast } from "react-toastify";

export type Location = "profile" | "detail" | "create";

type AuthState = {
  products: IProduct[];
  productsPagination: any;
  searchProducts: IProduct[];
  searchPagination: any;
  product: IProduct;
  vendorAndProducts: {
    vendor: IVendor;
    products: IProductWithoutVendor[];
    rate: number;
  };
  processing: boolean;
  loading: boolean;
  message: string;
  error: string;
  productStat: {
    views: number;
    days: number;
  };
  id: string;
  chartData: any[];
  myProducts: IProductWithoutVendor[];
  getProducts: (params: Record<string, unknown>) => Promise<void>;
  getProduct: (id: string) => Promise<void>;
  getProductBySlug: (slug: string) => Promise<void>;
  createProduct: (payload: Record<string, unknown>) => Promise<void>;
  updateProduct: (
    payload: Record<string, unknown>,
    id: string
  ) => Promise<void>;
  toggleProduct: (id: string) => Promise<void>;
  sponsorProduct: (
    params: Record<string, any>,
    vendor: string,
    where: Location
  ) => Promise<void>;
  getChart: (params: Record<string, any>) => Promise<void>;
  cancelSponsorProduct: (params: Record<string, any>) => Promise<void>;
  deleteProduct: (id: string) => Promise<boolean>;
  postActivity: (id: string) => Promise<void>;
  getActivity: (id: string) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  getVendor: (id: string) => Promise<void>;
  getVendorProducts: (id: string) => Promise<void>;
  search: (params: Record<string, unknown>) => Promise<void>;
  clear: (key: string, value: unknown) => void;
};

const useProductStore = create<AuthState>()(
  devtools((set, get) => ({
    products: [],
    searchProducts: [],
    productsPagination: null,
    searchPagination: null,
    product: null,
    vendorAndProducts: null,
    myProducts: [],
    loading: false,
    processing: false,
    message: null,
    error: null,
    id: null,
    chartData: [],
    productStat: {
      days: 0,
      views: 0,
    },
    search: async (params) => {
      const defaultParam = {
        page: 1,
        search: "",
        location: null,
        category: null,
        pageCount: 10,
        ...params,
      };
      set({ loading: true });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetProducts(defaultParam);

        set({
          searchProducts: data.data,
          searchPagination: data.pagination,
        });
      } catch (error: any) {
        set({ searchProducts: [] });
      } finally {
        set({ loading: false });
      }
    },
    getProducts: async (params) => {
      const defaultParam = {
        page: 1,
        pageCount: 10,
        ...params,
      };
      set({ loading: true });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetProducts(defaultParam);

        set({
          products: data.data,
          productsPagination: data.pagination,
        });
      } catch (error: any) {
        set({ products: [] });
      } finally {
        set({ loading: false });
      }
    },
    getProduct: async (id) => {
      try {
        set({ loading: true });
        const apiService = new ApiService();
        const { data } = await apiService.GetProduct(id);

        set({ product: data || {} });
      } catch (error: any) {
        set({ product: null });
      } finally {
        set({ loading: false });
      }
    },
    getProductBySlug: async (slug) => {
      try {
        set({ loading: true });
        const apiService = new ApiService();
        const { data } = await apiService.GetProductBySlug(slug);

        set({ product: data || null, loading: false });
      } catch (error: any) {
        set({ product: null, loading: false });
      }
    },
    postActivity: async (id) => {
      try {
        const apiService = new ApiService();
        await apiService.PostActivity(id);
      } catch (error: any) {}
    },
    getActivity: async (id) => {
      try {
        set({ processing: true });
        const apiService = new ApiService();
        const { data } = await apiService.GetActivity(id);

        set({
          productStat: data,
        });
      } catch (error: any) {
        set({
          productStat: {
            days: 0,
            views: 0,
          },
        });
      } finally {
        set({ processing: false });
      }
    },
    getChart: async (payload) => {
      const { chartData } = get();

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetChart(payload);

        set({
          chartData: data,
        });
      } catch (error: any) {
        set({
          chartData,
        });
      }
    },
    createProduct: async (payload) => {
      set({ processing: true, error: null });
      try {
        const apiService = new ApiService();
        const { data } = await apiService.CreateProduct(payload);

        set({
          id: data.slug,
          processing: false,
          message: "Ads created successfully",
        });
      } catch (error: any) {
        if (error.response?.data?.message)
          toast.error(error.response?.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        set({ product: null, error: null, processing: false });
      } finally {
        set({ processing: false });
      }
    },
    updateProduct: async (payload, id) => {
      set({ processing: true, error: null });
      try {
        const apiService = new ApiService();
        const { data } = await apiService.UpdateProduct(payload, id);

        toast.success("Product updated successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        set({ product: data, message: "updated" });
      } catch (error: any) {
        if (error.response?.data?.message)
          toast.error(error.response?.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
      } finally {
        set({ processing: false });
      }
    },
    toggleProduct: async (id) => {
      try {
        const apiService = new ApiService();
        const { data } = await apiService.ToggleProduct(id);

        set({ product: data || [] });
        toast.success(
          `Your ad has been ${
            data.is_published ? "made public" : "remove from public"
          }`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      } catch (error: any) {
        set({ product: null });
      }
    },
    deleteProduct: async (id) => {
      try {
        set({ processing: true });
        const apiService = new ApiService();
        const { data } = await apiService.DeleteProduct(id);

        return data;
      } catch (error: any) {
        set({ processing: false });
      } finally {
        set({ processing: false });
      }
    },
    deleteFile: async (id) => {
      try {
        set({ loading: true });
        const apiService = new ApiService();
        const { data } = await apiService.DeleteFile(id);

        set({ product: data || [] });
      } catch (error: any) {
        set({ product: null });
      } finally {
        set({ loading: false });
      }
    },
    getVendor: async (id) => {
      try {
        set({ loading: true });
        const apiService = new ApiService();
        const { data } = await apiService.GetVendorAndProducts(id);

        set({ vendorAndProducts: data || [] });
      } catch (error: any) {
        set({ product: null });
      } finally {
        set({ loading: false });
      }
    },
    getVendorProducts: async (id) => {
      try {
        set({ loading: true });
        const apiService = new ApiService();
        const { data } = await apiService.GetVendorProducts(id);

        set({ myProducts: data || [] });
      } catch (error: any) {
        set({ myProducts: null });
      } finally {
        set({ loading: false });
      }
    },
    sponsorProduct: async (payload, vendor, where) => {
      const { getVendorProducts, getProduct } = get();

      try {
        set({ processing: true, message: null });
        const apiService = new ApiService();
        const { data } = await apiService.SponsorProduct(payload);

        if (data) {
          toast.success(data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });

          switch (where) {
            case "detail":
              await getProduct(payload.product);

            case "profile":
              await getVendorProducts(vendor);

            case "create":
              set({ message: "send" });

            default:
              break;
          }
        } else {
          toast.error("Something went wrong, please try again", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } catch (error: any) {
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } finally {
        set({ processing: false });
      }
    },
    cancelSponsorProduct: async (payload) => {
      try {
        set({ processing: true });
        const apiService = new ApiService();
        await apiService.CancelSponsorProduct(payload);

        toast.success("Transaction cancelled", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error: any) {
        toast.success("Transaction cancelled", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } finally {
        set({ processing: false });
      }
    },
    clear: (key, value) => {
      set((state) => ({ ...state, [key]: value }));
    },
  }))
);

export default useProductStore;
