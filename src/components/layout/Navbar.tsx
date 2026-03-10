import { useNavigate } from "react-router";
import { LogOut, Wrench } from "lucide-react";
import { useAuthStore } from "@/features/auth/authStore";
import { toast } from "sonner";

interface NavbarProps {
    title?: string;
}

export function Navbar({ title = "FactoryLog" }: NavbarProps) {
    const navigate = useNavigate();
    const { logout, user } = useAuthStore();

    const handleLogout = () => {
        logout();
        toast.success("Logged out");
        navigate("/login", { replace: true });
    };

    return (
        <header className="bg-blue-900 text-white px-6 py-5 shadow-md flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
                <Wrench className="w-8 h-8 text-blue-300" />
                <div>
                    <h1 className="text-xl font-extrabold tracking-wide leading-tight">{title}</h1>
                    {user && (
                        <p className="text-blue-300 text-xs font-medium">👤 {user.name} · {user.department}</p>
                    )}
                </div>
            </div>
            <button
                onClick={handleLogout}
                className="flex flex-col items-center gap-1 text-blue-200 hover:text-white transition-colors p-2 rounded-lg hover:bg-blue-800"
                aria-label="Logout"
            >
                <LogOut className="w-7 h-7" />
                <span className="text-xs font-bold uppercase">Exit</span>
            </button>
        </header>
    );
}
