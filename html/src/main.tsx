import { HelmetProvider } from "react-helmet-async";
import { hydrateRoot, createRoot } from "react-dom/client";
import App from "./App";

import "./index.scss";

const rootElement = document.getElementById("root");

if (rootElement.hasChildNodes()) {
  hydrateRoot(
    rootElement,
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
} else {
  createRoot(rootElement).render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
}
