import useStore from "@/store";
import { Navigate, useLocation } from "react-router-dom";

function AccountGuard({ children }: { children: JSX.Element }) {
  const {
    authStore: { isAuthenticated },
  } = useStore();
  let location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export default AccountGuard;
