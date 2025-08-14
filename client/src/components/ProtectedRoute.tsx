import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
