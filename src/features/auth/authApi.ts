import { api } from "@/lib/api";
import type { AuthUser } from "./authStore";

export interface LoginPayload {
    workerId: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: AuthUser;
}

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/api/auth/login", payload);
    return data;
}

export async function logoutApi(): Promise<void> {
    await api.post("/api/auth/logout");
}
