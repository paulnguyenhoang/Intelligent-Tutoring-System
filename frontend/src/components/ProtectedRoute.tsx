import { Navigate } from "react-router-dom";
import type { UserRole, User } from "../types";
import { STORAGE_KEYS, ROUTES } from "../constants";
import { parseJSON } from "../utils";

type Props = {
  children: React.ReactNode;
  allowedRole: UserRole;
};

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);

  if (!userStr) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  const user = parseJSON<User | null>(userStr, null);

  if (!user) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  if (user.role !== allowedRole) {
    // Redirect to correct dashboard based on actual user role
    const redirectTo = user.role === "teacher" ? ROUTES.TEACHER : ROUTES.COURSES;
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
