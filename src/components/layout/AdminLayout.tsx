import { useState } from "react";
import { Outlet } from "react-router";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";

export function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-0 h-screen">
                <Sidebar />
            </aside>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <div className="relative z-10">
                        <Sidebar onClose={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 shadow-sm gap-4 sticky top-0 z-10">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-extrabold text-gray-800">Manager Portal</h2>
                </header>

                <main className="flex-1 overflow-auto p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
