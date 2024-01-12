import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import Routes from "@/routes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./components/Other/ScrollToTop";

function App() {
  return (
    <>
      <Suspense
        fallback={
          <div className="h-screen flex flex-col justify-center items-center">
            <div className="loader-mask">
              <div className="loader">
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        }
      >
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <RouterProvider router={Routes} />
        </GoogleOAuthProvider>
      </Suspense>
      <ToastContainer />
    </>
  );
}

export default App;
