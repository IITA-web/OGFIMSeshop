import { devtools } from "zustand/middleware";
import { create } from "zustand";
import ApiService from "@/services/api";

type AuthState = {
  categories: any[];
  subCategories: any[];
  all: any[];
  getCategories: () => Promise<void>;
  getSubCategories: (category: string) => Promise<void>;
  getCatgoriesAndSubCategories: () => Promise<void>;
  getCatById: (id: string) => Promise<any | null>;
};

const useCategoryStore = create<AuthState>()(
  devtools((set, get) => ({
    categories: [],
    subCategories: [],
    all: [],
    getCategories: async () => {
      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetCategories();

        set({ categories: data || [] });
      } catch (error: any) {
        set({ categories: [] });
      }
    },
    getSubCategories: async (category) => {
      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetSubCategories(category);

        set({ subCategories: data || [] });
      } catch (error: any) {
        set({ subCategories: [] });
      }
    },
    getCatgoriesAndSubCategories: async () => {
      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetCategoriesAndSubCategories();

        set({ all: data || [] });
      } catch (error: any) {
        set({ all: [] });
      }
    },
    getCatById: async (id) => {
      const { all } = get();
      const category = all.find((c) => c._id === id);

      return category || null;
    },
  }))
);

export default useCategoryStore;
