import { devtools } from "zustand/middleware";
import { create } from "zustand";
import ApiService from "@/services/api";
import { message } from "antd";
import { toast } from "react-toastify";

type AuthState = {
  isAuthenticated: boolean;
  processing: boolean;
  user: any;
  // message: string;
  // error: string;
  isSuccess: boolean;
  isFailed: boolean;
  login: (payload: Record<string, string>) => Promise<any>;
  forgetPassword: (payload: Record<string, string>) => Promise<any>;
  changePassword: (payload: Record<string, string>) => Promise<any>;
  resetPassword: (payload: Record<string, string>) => Promise<any>;
  activateAccount: (payload: Record<string, string>) => Promise<any>;
  updateProfile: (payload: any) => Promise<any>;
  resendCode: (emailorPhone: string) => Promise<any>;
  logout: () => void;
  refreshToken: () => void;
  clear: (key: string, value: unknown) => void;
};

const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    isAuthenticated: !!window.localStorage.getItem("user"), //TODO: check cookie for token s
    user: window.localStorage.getItem("user")
      ? JSON.parse(window.localStorage.getItem("user"))
      : null,
    processing: false,
    // message: null,
    // error: null,
    isSuccess: false,
    isFailed: false,
    oldAccount: null,

    login: async (payload) => {
      set({ processing: true, isFailed: false, isSuccess: false });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.Login(payload);
        const { user } = data;

        if (user.active) {
          window.localStorage.setItem("user", JSON.stringify(user));

          set({
            isAuthenticated: true,
            user: user,
            processing: false,
            isSuccess: true,
          });
        } else {
          toast.error(data?.message || "Invalid login credentials", {
            position: toast.POSITION.TOP_RIGHT,
          });
          set({
            isFailed: true,
            processing: false,
            isAuthenticated: false,
          });
        }
      } catch (error: any) {
        if (error) {
          toast.error(
            error?.response?.data?.message || "Invalid login credentials",
            {
              position: toast.POSITION.TOP_RIGHT,
            }
          );
        }
        set({
          processing: false,
          isAuthenticated: false,
          isFailed: true,
        });
      }
    },

    updateProfile: async (payload) => {
      set({ processing: true, isFailed: false, isSuccess: false });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.UpdateVendor(payload);

        window.localStorage.setItem("user", JSON.stringify(data));

        toast.success("Profile updated successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        set({
          user: data,
          processing: false,
          isSuccess: true,
        });
      } catch (error: any) {
        if (error)
          toast.error(
            error?.response?.data?.message || "Unable to update profile",
            {
              position: toast.POSITION.TOP_RIGHT,
            }
          );
        set({
          isFailed: true,
          processing: false,
          isAuthenticated: false,
        });
      }
    },
    activateAccount: async (payload) => {
      set({ processing: true, isFailed: false, isSuccess: false });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.PostSignup(payload);
        const { user } = data;

        window.localStorage.setItem("user", JSON.stringify(user));

        set({
          isAuthenticated: true,
          user: user,
          processing: false,
          isSuccess: true,
        });
      } catch (error: any) {
        if (error)
          toast.error(
            error?.response?.data?.message || "Unable to activate your account",
            {
              position: toast.POSITION.TOP_RIGHT,
            }
          );
        set({
          processing: false,
          isAuthenticated: false,
          isFailed: true,
        });
      }
    },
    logout: () => {
      window.localStorage.clear();
      const apiService = new ApiService();

      apiService.Logout();
      set({ isAuthenticated: false, user: null });
    },
    refreshToken: () => {
      const apiService = new ApiService();
      apiService.RefreshToken();
    },
    clear: (key, value) => {
      set((state) => ({ ...state, [key]: value }));
    },
    resetPassword: async (payload) => {
      set({ processing: true, isFailed: false, isSuccess: false });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.ResetPassword(payload);

        toast.success(data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        set({
          processing: false,
          isSuccess: true,
        });
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            "Unable to complete request, please try again",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        set({
          processing: false,
          isFailed: true,
        });
      }
    },
    resendCode: async (payload) => {
      set({ processing: true });

      try {
        const apiService = new ApiService();

        await toast.promise(apiService.ResendVerification(payload), {
          pending: "Sending verification code...",
          success: {
            render(response) {
              set({
                processing: false,
              });
              return (
                response.data?.data?.message ||
                "Verification code sent successfully"
              );
            },
          },
          error: {
            render(error) {
              set({
                processing: false,
              });
              return (
                (error as any).data?.response?.data?.message ||
                "Unable to complete request, please try again"
              );
            },
          },
        });
      } catch (error: any) {}
    },
    forgetPassword: async (payload) => {
      set({ processing: true, isFailed: false, isSuccess: false });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.ForgetPassword(payload);

        toast.success(data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        set({
          processing: false,
          isSuccess: true,
        });
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            "Unable to complete request, please try again",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        set({
          processing: false,
          isFailed: true,
        });
      }
    },
    changePassword: async (payload) => {
      set({ processing: true, isFailed: false, isSuccess: false });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.ChangePassword(payload);

        toast.success(data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        set({
          processing: false,
          isSuccess: true,
        });
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            "Unable to complete request, please try again",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        set({
          processing: false,
          isFailed: true,
        });
      }
    },
  }))
);

export default useAuthStore;
