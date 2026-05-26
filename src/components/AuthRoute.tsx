import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

interface AuthRouteProps {
  children: ReactNode;
}

export default function AuthRoute({ children }: AuthRouteProps) {
  const token = useSelector((state: RootState) => state.users.token);

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}
