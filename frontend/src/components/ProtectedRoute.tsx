import { Navigate } from "react-router-dom";
import { UserRole } from "../types";
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

  const user = parseJSON(userStr, null);

  if (!user || user.role !== allowedRole) {
    const redirectTo = user?.role === "teacher" ? ROUTES.TEACHER : ROUTES.QUIZ;
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
