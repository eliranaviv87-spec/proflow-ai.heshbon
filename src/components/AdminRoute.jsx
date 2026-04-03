import { useAuth } from "@/lib/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role !== "admin") return <Navigate to="/403" replace />;
  return children;
}