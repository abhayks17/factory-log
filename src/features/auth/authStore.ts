import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "admin" | "worker";

export interface AuthUser {
    id: string;
    name: string;
    workerId: string;
    department: string;
    role: UserRole;
}

interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: AuthUser, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
            logout: () => set({ user: null, token: null, isAuthenticated: false }),
        }),
        {
            name: "factorylog-auth",
            partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
        }
    )
);
