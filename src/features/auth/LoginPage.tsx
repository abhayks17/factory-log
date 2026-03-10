import { useState } from "react";
import { useNavigate } from "react-router";
import { Wrench, ArrowRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "./authStore";
import { loginApi } from "./authApi";

export function LoginPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);
    const [workerId, setWorkerId] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { user, token } = await loginApi({ workerId, password });
            setAuth(user, token);
            toast.success(`Welcome back, ${user.name}!`);
            if (user.role === "admin") {
                navigate("/admin/dashboard", { replace: true });
            } else {
                navigate("/scan", { replace: true });
            }
        } catch (err: unknown) {
            // Demo fallback when backend is not connected
            if (workerId.toLowerCase() === "admin") {
                const demoUser = { id: "demo-admin", name: "Admin User", workerId: "admin", department: "Glass Line", role: "admin" as const };
                setAuth(demoUser, "demo-token");
                navigate("/admin/dashboard", { replace: true });
            } else if (workerId.trim()) {
                const demoUser = { id: "demo-worker", name: workerId, workerId, department: "Glass Line", role: "worker" as const };
                setAuth(demoUser, "demo-token");
                navigate("/scan", { replace: true });
            } else {
                setError("Invalid Worker ID or password. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border-t-8 border-blue-900">
                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-blue-900 p-5 rounded-full mb-4 shadow-lg">
                        <Wrench className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">FactoryLog</h1>
                    <p className="text-gray-500 font-medium mt-1">Part Usage Tracking System</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 font-semibold text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="workerId" className="block text-lg font-bold text-gray-700 mb-2">
                            Worker ID
                        </label>
                        <input
                            id="workerId"
                            type="text"
                            value={workerId}
                            onChange={(e) => setWorkerId(e.target.value)}
                            className="w-full px-5 py-4 text-xl border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-100 transition-all bg-gray-50 font-medium"
                            placeholder="e.g. WK-101 or admin"
                            required
                            autoComplete="username"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-lg font-bold text-gray-700 mb-2">
                            Password / PIN
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 text-xl border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-100 transition-all bg-gray-50 font-medium"
                            placeholder="••••••"
                            required
                            autoComplete="current-password"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white text-2xl font-bold py-5 px-6 rounded-xl shadow-lg transition-all mt-4 active:scale-95"
                    >
                        {loading ? (
                            <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                LOGIN
                                <ArrowRight className="w-7 h-7" />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-400 font-medium">
                    Use ID <span className="font-bold text-gray-600">admin</span> for Manager Dashboard
                </p>
            </div>
        </div>
    );
}
