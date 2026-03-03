import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, redirectTo = "/login" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      try {
        localStorage.setItem("intendedPath", location.pathname || "/");
      } catch (error) {
        // Silently fail if localStorage is not available
      }
      navigate(redirectTo, { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate, redirectTo, location.pathname]);

  if (isLoading) {
    return null; // Don't show loading screen, just wait
  }

  if (!isAuthenticated) {
    return null; // Will redirect, don't render anything
  }

  return <>{children}</>;
}
