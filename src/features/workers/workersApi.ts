import { api } from "@/lib/api";

export interface Worker {
    id: string;
    workerId: string;
    name: string;
    department: string;
    status: "active" | "on_leave" | "inactive";
}

const STORAGE_KEY = "factorylog_mock_workers";

function getMockWorkers(): Worker[] {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);

    const initialWorkers: Worker[] = [
        { id: "1", workerId: "WK-101", name: "Marcus Johnson", department: "Glass Line", status: "active" },
        { id: "2", workerId: "WK-102", name: "Sarah Chen", department: "Glass Line", status: "active" },
        { id: "3", workerId: "WK-103", name: "David Rodriguez", department: "Glass Line", status: "on_leave" },
        { id: "4", workerId: "WK-104", name: "Emma Wilson", department: "Glass Line", status: "active" },
        { id: "5", workerId: "WK-105", name: "James Taylor", department: "Glass Line", status: "active" },
    ];
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initialWorkers));
    return initialWorkers;
}

function saveMockWorkers(workers: Worker[]) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(workers));
}

export async function getWorkers(): Promise<Worker[]> {
    return getMockWorkers();
}

export async function createWorker(payload: Omit<Worker, "id">): Promise<Worker> {
    const workers = getMockWorkers();
    const newWorker: Worker = { ...payload, id: Date.now().toString() };
    const updated = [newWorker, ...workers];
    saveMockWorkers(updated);
    return newWorker;
}

export async function updateWorker(id: string, payload: Partial<Worker>): Promise<Worker> {
    const workers = getMockWorkers();
    const index = workers.findIndex(w => w.id === id);
    if (index === -1) throw new Error("Worker not found");

    const updatedWorker = { ...workers[index], ...payload };
    workers[index] = updatedWorker;
    saveMockWorkers(workers);
    return updatedWorker;
}

export async function deleteWorker(id: string): Promise<void> {
    const workers = getMockWorkers();
    saveMockWorkers(workers.filter(w => w.id !== id));
}
