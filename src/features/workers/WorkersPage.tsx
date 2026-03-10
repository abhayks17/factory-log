import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus, Edit2, Trash2, Search, Filter } from "lucide-react";
import { getWorkers, createWorker, updateWorker, deleteWorker, type Worker } from "./workersApi";
import { getInitials } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const STATUS_STYLES = {
    active: "bg-green-100 text-green-800",
    on_leave: "bg-orange-100 text-orange-800",
    inactive: "bg-gray-100 text-gray-600",
};

export function WorkersPage() {
    const queryClient = useQueryClient();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingWorker, setEditingWorker] = useState<Worker | null>(null);

    const [search, setSearch] = useState("");
    const [deptFilter, setDeptFilter] = useState("All");

    // Form State for Add
    const [newWorkerId, setNewWorkerId] = useState("");
    const [newName, setNewName] = useState("");
    const [newDept, setNewDept] = useState("Glass Line");
    const [newStatus, setNewStatus] = useState<Worker["status"]>("active");

    const { data: workers = [], isLoading } = useQuery({
        queryKey: ["workers"],
        queryFn: getWorkers,
    });

    const filteredWorkers = workers.filter(worker => {
        const matchesSearch =
            worker.name.toLowerCase().includes(search.toLowerCase()) ||
            worker.workerId.toLowerCase().includes(search.toLowerCase());

        const matchesDept = deptFilter === "All" || worker.department === deptFilter;

        return matchesSearch && matchesDept;
    });

    const departments = ["All", ...new Set(workers.map(w => w.department))];

    const createMutation = useMutation({
        mutationFn: createWorker,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workers"] });
            toast.success("Worker added successfully!");
            setIsAddOpen(false);
            // Reset form
            setNewWorkerId("");
            setNewName("");
            setNewDept("Glass Line");
            setNewStatus("active");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<Worker> }) => updateWorker(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workers"] });
            toast.success("Worker updated successfully!");
            setEditingWorker(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteWorker,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workers"] });
            toast.success("Worker deleted!");
        },
    });

    const handleAddWorker = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({
            workerId: newWorkerId,
            name: newName,
            department: newDept,
            status: newStatus,
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingWorker) return;
        updateMutation.mutate({ id: editingWorker.id, payload: editingWorker });
    };

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Workers</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage factory worker accounts and departments</p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-md active:scale-95"
                >
                    <UserPlus className="w-5 h-5" />
                    Add Worker
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search worker name or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-blue-900 outline-none font-medium transition-all"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Filter className="w-5 h-5 text-gray-400 hidden sm:block" />
                    <select
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                        className="px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-blue-900 outline-none font-bold bg-white min-w-[160px]"
                    >
                        {departments.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 text-xs font-black uppercase tracking-widest">
                                <th className="px-6 py-4">Worker</th>
                                <th className="px-6 py-4">Worker ID</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">Loading workers...</td>
                                </tr>
                            ) : filteredWorkers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                                        No workers found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredWorkers.map((worker) => (
                                    <tr key={worker.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-extrabold text-sm shrink-0">
                                                    {getInitials(worker.name)}
                                                </div>
                                                <span className="font-bold text-sm text-gray-900">{worker.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-sm text-gray-600">{worker.workerId}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{worker.department}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${STATUS_STYLES[worker.status]}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                {worker.status.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-1">
                                            <button
                                                onClick={() => setEditingWorker(worker)}
                                                className="text-gray-500 hover:text-gray-800 p-1.5 rounded hover:bg-gray-100 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(worker.id, worker.name)}
                                                className="text-red-400 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Worker Modal */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-extrabold text-gray-900">Add Worker</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddWorker} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Worker ID</label>
                            <input
                                required
                                value={newWorkerId}
                                onChange={e => setNewWorkerId(e.target.value)}
                                placeholder="e.g. WK-106"
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Full Name</label>
                            <input
                                required
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                placeholder="e.g. John Doe"
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Department</label>
                            <select
                                value={newDept}
                                onChange={e => setNewDept(e.target.value)}
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 transition-colors"
                            >
                                <option value="Glass Line">Glass Line</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Status</label>
                            <select
                                value={newStatus}
                                onChange={e => setNewStatus(e.target.value as Worker["status"])}
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 transition-colors"
                            >
                                <option value="active">Active</option>
                                <option value="on_leave">On Leave</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <DialogFooter className="pt-4">
                            <button
                                type="button"
                                onClick={() => setIsAddOpen(false)}
                                className="px-4 py-2 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="px-4 py-2 font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors disabled:bg-blue-400"
                            >
                                {createMutation.isPending ? "Adding..." : "Add Worker"}
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Worker Modal */}
            <Dialog open={!!editingWorker} onOpenChange={(open) => !open && setEditingWorker(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-extrabold text-gray-900">Edit Worker</DialogTitle>
                    </DialogHeader>
                    {editingWorker && (
                        <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Worker ID</label>
                                <input
                                    required
                                    value={editingWorker.workerId}
                                    onChange={e => setEditingWorker({ ...editingWorker, workerId: e.target.value })}
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Full Name</label>
                                <input
                                    required
                                    value={editingWorker.name}
                                    onChange={e => setEditingWorker({ ...editingWorker, name: e.target.value })}
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Department</label>
                                <select
                                    value={editingWorker.department}
                                    onChange={e => setEditingWorker({ ...editingWorker, department: e.target.value })}
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 transition-colors"
                                >
                                    <option value="Glass Line">Glass Line</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Status</label>
                                <select
                                    value={editingWorker.status}
                                    onChange={e => setEditingWorker({ ...editingWorker, status: e.target.value as Worker["status"] })}
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 transition-colors"
                                >
                                    <option value="active">Active</option>
                                    <option value="on_leave">On Leave</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <DialogFooter className="pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingWorker(null)}
                                    className="px-4 py-2 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="px-4 py-2 font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors disabled:bg-blue-400"
                                >
                                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                                </button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
