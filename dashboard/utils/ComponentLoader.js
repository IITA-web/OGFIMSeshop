import { ComponentLoader } from "adminjs";

const componentLoader = new ComponentLoader();

const Components = {
  ImageEditor: componentLoader.add("ImageEditor", "../components/ImageEditor"),
  dashboard: componentLoader.add("Dashboard", "../components/Dashboard"),
};

export { componentLoader, Components };
