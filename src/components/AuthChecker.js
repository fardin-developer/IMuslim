// This component is deprecated - use AuthContext instead
// Keeping for backward compatibility but it's no longer needed
import { useAuth } from "../context/AuthContext";

export default function AuthChecker({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
}

