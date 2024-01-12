import useAuthStore from "./slices/auth.slice";
import useCategoryStore from "./slices/category.slice";
import useMiscStore from "./slices/misc.slice";
import useProductStore from "./slices/product.slice";

const useStore = () => {
  const authStore = useAuthStore();
  const catStore = useCategoryStore();
  const productStore = useProductStore();
  const miscStore = useMiscStore();

  return {
    authStore,
    catStore,
    productStore,
    miscStore,
  };
};

export default useStore;
