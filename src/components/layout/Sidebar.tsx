import { NavLink, useNavigate } from "react-router";
import {
    LayoutDashboard, ClipboardList, Package,
    FileBarChart, LogOut, Users, Wrench, X
} from "lucide-react";
import { useAuthStore } from "@/features/auth/authStore";
import { toast } from "sonner";

interface SidebarProps {
    onClose?: () => void;
}

const navItems = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/logs", icon: ClipboardList, label: "Usage Logs" },
    { to: "/admin/tools", icon: Package, label: "Tools & Parts" },
    { to: "/admin/workers", icon: Users, label: "Workers" },
    { to: "/admin/reports", icon: FileBarChart, label: "Reports" },
];

export function Sidebar({ onClose }: SidebarProps) {
    const navigate = useNavigate();
    const { logout, user } = useAuthStore();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/login", { replace: true });
    };

    return (
        <div className="h-full w-64 bg-blue-900 text-white flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-blue-800">
                <div className="flex items-center gap-3">
                    <Wrench className="w-8 h-8 text-blue-300" />
                    <span className="text-2xl font-extrabold tracking-tight">FactoryLog</span>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden text-blue-300 hover:text-white transition-colors p-1"
                        aria-label="Close menu"
                    >
                        <X className="w-6 h-6" />
                    </button>
                )}
            </div>

            {/* User info */}
            <div className="px-6 py-4 border-b border-blue-800/60">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center font-bold text-sm border-2 border-blue-500">
                        {user?.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-sm text-white leading-tight">{user?.name}</p>
                        <p className="text-xs text-blue-300 font-medium capitalize">{user?.role}</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-6 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${isActive
                                ? "bg-blue-800 text-white shadow-inner"
                                : "text-blue-200 hover:bg-blue-800/50 hover:text-white"
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 shrink-0" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-blue-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3.5 w-full text-blue-200 hover:bg-red-600 hover:text-white rounded-xl font-bold text-sm transition-all"
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    Logout
                </button>
            </div>
        </div>
    );
}
