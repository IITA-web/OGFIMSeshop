import useAuthStore from "@/store/slices/auth.slice";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { toast } from "react-toastify";

export default class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = window.localStorage.getItem("token");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(config.headers);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (
          error.response.status === 401 &&
          error.response?.data?.messsage !== "Invalid email or password"
        ) {
          toast.error("Session expired, login to continue", {
            position: toast.POSITION.TOP_RIGHT,
          });

          useAuthStore.getState().logout();

          return Promise.reject(null);
        }

        return Promise.reject(error);
      }
    );
  }

  Get(path: string, params?: Record<string, any>): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(path, {
      params,
    });
  }

  PreSignup(payload: Record<string, string>): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/auth/pre-signup`, {
      params: {
        ...payload,
      },
    });
  }

  Signup(payload: Record<string, unknown>): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/auth/signup`, payload);
  }

  PostSignup(payload: Record<string, string>): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/auth/post-signup`, payload);
  }

  UpdateVendor(payload: Record<string, string>): Promise<AxiosResponse<any>> {
    return this.axiosInstance.put(`/auth/vendor/update`, payload);
  }

  Login(payload: Record<string, string>): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/auth/login`, payload);
  }

  ForgetPassword(payload: Record<string, string>): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/auth/forgot-password`, payload);
  }

  ResetPassword(payload: Record<string, string>): Promise<AxiosResponse<any>> {
    return this.axiosInstance.put(`/auth/reset-password`, payload);
  }

  ResendVerification(payload: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(
      `/auth/resend-verification?emailOrPhone=${payload}`
    );
  }

  ChangePassword(payload: Record<string, string>): Promise<AxiosResponse<any>> {
    return this.axiosInstance.put(`/auth/change-password`, payload);
  }

  GetProducts(params: Record<string, unknown>): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/product`, {
      params: {
        ...params,
      },
    });
  }

  GetVendorProducts(vendorId: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`product/vendor/${vendorId}`);
  }

  GetVendorAndProducts(vendorId: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/vendor/${vendorId}`);
  }

  GetProduct(id: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/product/${id}`);
  }

  GetProductBySlug(slug: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/product/slug/${slug}`);
  }

  PostActivity(id: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/activity/${id}`);
  }

  GetActivity(id: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/activity/${id}`);
  }

  GetChart(payload: Record<string, any>): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/activity/history/chart`, payload);
  }

  CreateProduct(payload: any): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/product`, payload);
  }

  UpdateProduct(payload: any, id: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.put(`/product/${id}`, payload);
  }

  ToggleProduct(id: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.put(`/product/toggle-publish/${id}`);
  }

  DeleteProduct(id: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.delete(`/product/${id}`);
  }

  GetCategories(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/category`);
  }

  GetSubCategories(category: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/sub-category/${category}`);
  }

  GetCategoriesAndSubCategories(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/category/sub-categories`);
  }

  SponsorProduct(
    payload: Record<string, unknown>
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/promotion/product`, payload);
  }

  CancelSponsorProduct(
    payload: Record<string, unknown>
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/promotion/product/close`, payload);
  }

  RequestCallback(
    payload: Record<string, unknown>
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/request-callback`, payload);
  }

  ReportVendor(payload: Record<string, unknown>): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/report-vendor`, payload);
  }

  ReviewVendor(payload: Record<string, unknown>): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/review`, payload);
  }

  GetVendorReview(payload: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/review/${payload}`);
  }

  UploadFile(formData: FormData): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/misc/upload`, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  }

  DeleteFile(id: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.delete(`/misc/upload/${id}`);
  }

  GetPrivacyPolicy(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/misc/privacy-policy`);
  }

  GetTermsAndCondition(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/misc/terms-and-conditions`);
  }

  GetSocialMedia(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/misc/social-media`);
  }
}
