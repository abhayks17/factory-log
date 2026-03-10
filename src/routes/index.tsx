import { createBrowserRouter, Navigate } from "react-router";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "./ProtectedRoute";

// Standard components for critical scanner flow (avoiding lazy issues for now)
import { ScannerPage } from "@/features/scanner/ScannerPage";
import { SuccessPage } from "@/features/scanner/SuccessPage";

// Lazy-loaded pages for admin/other sections
const LoginPage = lazy(() => import("@/features/auth/LoginPage").then(m => ({ default: m.LoginPage })));
const AdminLayout = lazy(() => import("@/components/layout/AdminLayout").then(m => ({ default: m.AdminLayout })));
const DashboardPage = lazy(() => import("@/features/dashboard/DashboardPage").then(m => ({ default: m.DashboardPage })));
const ToolsPage = lazy(() => import("@/features/tools/ToolsPage").then(m => ({ default: m.ToolsPage })));
const WorkersPage = lazy(() => import("@/features/workers/WorkersPage").then(m => ({ default: m.WorkersPage })));
const LogsPage = lazy(() => import("@/features/logs/LogsPage").then(m => ({ default: m.LogsPage })));
const ReportsPage = lazy(() => import("@/features/reports/ReportsPage").then(m => ({ default: m.ReportsPage })));

function PageLoader() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin" />
                <p className="text-gray-600 font-bold text-lg">Loading...</p>
            </div>
        </div>
    );
}

function withSuspense(node: React.ReactNode) {
    return <Suspense fallback={<PageLoader />}>{node}</Suspense>;
}

export const router = createBrowserRouter([
    // Public
    {
        path: "/",
        element: <Navigate to="/login" replace />,
    },
    {
        path: "/login",
        element: withSuspense(<LoginPage />),
    },

    // Worker routes - Non-lazy for critical path reliability
    {
        path: "/scan",
        element: (
            <ProtectedRoute allowedRoles={["worker"]}>
                <ScannerPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/scan/success",
        element: (
            <ProtectedRoute allowedRoles={["worker"]}>
                <SuccessPage />
            </ProtectedRoute>
        ),
    },

    // Admin routes
    {
        path: "/admin",
        element: withSuspense(
            <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Navigate to="/admin/dashboard" replace /> },
            { path: "dashboard", element: withSuspense(<DashboardPage />) },
            { path: "logs", element: withSuspense(<LogsPage />) },
            { path: "tools", element: withSuspense(<ToolsPage />) },
            { path: "workers", element: withSuspense(<WorkersPage />) },
            { path: "reports", element: withSuspense(<ReportsPage />) },
        ],
    },

    // Catch-all
    {
        path: "*",
        element: <Navigate to="/login" replace />,
    },
]);
