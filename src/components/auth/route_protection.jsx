import { Navigate, useLocation } from "@solidjs/router";
import { authState } from "../../lib/store/auth_store";

export default function RouteProtection(props) {
  const location = useLocation();

  if (!authState.isAuthenticated) {
    return (
      <Navigate
        href={`/auth/sign-in?next=${encodeURIComponent(location.pathname)}`}
      />
    );
  }

  return props.children;
}
