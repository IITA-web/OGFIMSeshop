import HomePage from "@/pages/private/Home";
import PrivateLayout from "@/components/layouts/private/Layout";
import PublicLayout from "@/components/layouts/public/Layout";
import VendorPage from "@/pages/private/Vendor";
import DetailPage from "@/pages/private/Detail";
import CreateAd from "@/pages/private/CreateAd";
import AdSuccess from "@/pages/private/AdSuccess";
import ProfilePage from "@/pages/private/Profile";
import EditProfile from "@/pages/private/EditProfile";
import { Navigate, RouteObject } from "react-router-dom";
import ForgotPassword from "@/pages/public/ForgotPassword";
import ResetPassword from "@/pages/public/ResetPassword";
import Login from "@/pages/public/Login";
import Activate from "@/pages/public/Activate";
import ResultPage from "@/pages/private/Result";
import Information from "@/pages/public/Information";
import ErrorPage from "@/pages/ErrorPage";
import useProductStore from "@/store/slices/product.slice";
import { NotAccountGuard } from "@/services";
import AccountGuard from "@/services/guards/Account";

const productAction = async ({ params }) => {
  if (params.id) {
    await useProductStore.getState().getProductBySlug(params.id);

    if (useProductStore.getState().product) {
      return useProductStore.getState().product;
    }

    throw new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return null;
};

const routes: RouteObject[] = [
  {
    path: "/",
    element: <PrivateLayout />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "categories",
            children: [
              {
                path: ":cat",
                element: <ResultPage />,
              },
              {
                path: ":cat/:sub",
                element: <ResultPage />,
              },
            ],
          },
          {
            path: "search",
            element: <ResultPage />,
          },
          {
            path: "vendor/:id",
            element: <VendorPage />,
          },
          {
            path: "profile",
            children: [
              {
                index: true,
                element: (
                  <AccountGuard>
                    <ProfilePage />
                  </AccountGuard>
                ),
              },
              {
                path: "edit",
                element: (
                  <AccountGuard>
                    <EditProfile />
                  </AccountGuard>
                ),
              },
            ],
          },
          {
            path: "detail/:id",
            element: <DetailPage />,
            errorElement: <ErrorPage />,
            loader: productAction,
          },
          {
            path: "ad",
            children: [
              {
                index: true,
                element: <Navigate to="/ad/new" />,
              },
              {
                path: "new",
                element: (
                  <AccountGuard>
                    <CreateAd />
                  </AccountGuard>
                ),
                loader: async () => {
                  useProductStore.setState({
                    product: null,
                  });

                  return null;
                },
              },
              {
                path: "success/:id",
                element: (
                  <AccountGuard>
                    <AdSuccess />
                  </AccountGuard>
                ),
              },
              {
                path: ":id",
                errorElement: <ErrorPage />,
                element: (
                  <AccountGuard>
                    <CreateAd />
                  </AccountGuard>
                ),
              },
            ],
          },
        ],
      },
    ],
    errorElement: (
      <PublicLayout>
        <ErrorPage />
      </PublicLayout>
    ),
  },
  {
    path: "auth",
    element: (
      <NotAccountGuard>
        <PublicLayout />
      </NotAccountGuard>
    ),
    errorElement: (
      <PublicLayout>
        <ErrorPage />
      </PublicLayout>
    ),
    children: [
      {
        children: [
          {
            index: true,
            element: <Login />,
          },
          {
            path: "forgot-password",
            element: <ForgotPassword />,
          },
          {
            path: "reset-password",
            element: <ResetPassword />,
          },
          {
            path: "activate",
            element: <Activate />,
          },
        ],
      },
    ],
  },
  {
    path: "privacy-policy",
    element: (
      <PublicLayout>
        <Information info="privacy" />
      </PublicLayout>
    ),
  },
  {
    path: "terms-and-condition",
    element: (
      <PublicLayout>
        <Information info="terms" />
      </PublicLayout>
    ),
  },
];

export default routes;
