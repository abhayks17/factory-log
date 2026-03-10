import { Navigate } from "react-router";
import { useAuthStore, type UserRole } from "@/features/auth/authStore";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate home based on role
        const home = user.role === "admin" ? "/admin/dashboard" : "/scan";
        return <Navigate to={home} replace />;
    }

    return <>{children}</>;
}
