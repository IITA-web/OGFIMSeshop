// import useAuthStore from "@/store/states/auth";
// import { useLocation, Navigate } from "react-router-dom";

function PublicGuard({ children }: { children: JSX.Element }) {
  // let { isAuthenticated } = useAuthStore();
  // let location = useLocation();

  // if (isAuthenticated) {
  //   return (
  //     <Navigate to="/account/dashboard" state={{ from: location }} replace />
  //   );
  // }

  return children;
}

export default PublicGuard;
