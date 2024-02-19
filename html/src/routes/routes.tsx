import HomePage from "@/pages/private/Home";
import PrivateLayout from "@/components/layouts/private/Layout";
import PublicLayout from "@/components/layouts/public/Layout";
import VendorPage from "@/pages/private/Vendor";
import DetailPage from "@/pages/private/Detail";
import CreateAd from "@/pages/private/CreateAd";
import AdSuccess from "@/pages/private/AdSuccess";
import ProfilePage from "@/pages/private/Profile";
import EditProfile from "@/pages/private/EditProfile";
import { RouteObject } from "react-router-dom";
import ForgotPassword from "@/pages/public/ForgotPassword";
import ResetPassword from "@/pages/public/ResetPassword";
import Login from "@/pages/public/Login";
import Activate from "@/pages/public/Activate";
import ResultPage from "@/pages/private/Result";
import Information from "@/pages/public/Information";
import ErrorPage from "@/pages/ErrorPage";
import useProductStore from "@/store/slices/product.slice";

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
                element: <ProfilePage />,
              },
              {
                path: "edit",
                element: <EditProfile />,
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
                path: "new",
                element: <CreateAd />,
                loader: async () => {
                  useProductStore.setState({
                    product: null,
                  });

                  return null;
                },
              },
              {
                path: "success/:id",
                element: <AdSuccess />,
              },
              {
                path: ":id",
                errorElement: <ErrorPage />,
                element: <CreateAd />,
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
    element: <PublicLayout />,
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
