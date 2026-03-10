import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, QrCode, Search, Filter } from "lucide-react";
import { getTools, createTool, updateTool, deleteTool, type Tool } from "./toolsApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";

const STOCK_LEVEL_STYLES = (level: number) => {
    if (level === 0) return "bg-red-100 text-red-800 border-red-200";
    if (level < 20) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-green-100 text-green-800 border-green-200";
};

export function ToolsPage() {
    const queryClient = useQueryClient();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingTool, setEditingTool] = useState<Tool | null>(null);
    const [qrTool, setQrTool] = useState<Tool | null>(null);
    const [adjustment, setAdjustment] = useState<number>(0);

    const [search, setSearch] = useState("");
    const [deptFilter, setDeptFilter] = useState("All");

    // Form state for Add
    const [newToolId, setNewToolId] = useState("");
    const [newName, setNewName] = useState("");
    const [newUom, setNewUom] = useState("");
    const [newDept, setNewDept] = useState("Glass Line");
    const [newStock, setNewStock] = useState<number>(0);

    const { data: tools = [], isLoading } = useQuery({
        queryKey: ["tools"],
        queryFn: getTools,
    });

    const filteredTools = tools.filter(tool => {
        const matchesSearch =
            tool.name.toLowerCase().includes(search.toLowerCase()) ||
            tool.toolId.toLowerCase().includes(search.toLowerCase());

        const matchesDept = deptFilter === "All" || tool.department === deptFilter;

        return matchesSearch && matchesDept;
    });

    const departments = ["All", ...new Set(tools.map(t => t.department))];

    const createMutation = useMutation({
        mutationFn: createTool,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tools"] });
            toast.success("Tool added successfully!");
            setIsAddOpen(false);
            // Reset form
            setNewToolId("");
            setNewName("");
            setNewUom("");
            setNewDept("Glass Line");
            setNewStock(0);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<Tool> }) => updateTool(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tools"] });
            toast.success("Tool updated successfully!");
            setEditingTool(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTool,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tools"] });
            toast.success("Tool deleted!");
        },
    });

    const handleAddTool = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({
            toolId: newToolId,
            name: newName,
            uom: newUom,
            department: newDept,
            stockLevel: newStock,
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTool) return;

        const newStock = Math.max(0, editingTool.stockLevel + adjustment);
        updateMutation.mutate({
            id: editingTool.id,
            payload: { ...editingTool, stockLevel: newStock }
        });
        setAdjustment(0);
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
                    <h1 className="text-3xl font-extrabold text-gray-900">Tools & Parts</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage factory tools and generate QR codes</p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-md active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Add New Tool
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search tool name or ID..."
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
                                <th className="px-6 py-4">Tool ID</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">UoM</th>
                                <th className="px-6 py-4">Items Left</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">Loading tools...</td>
                                </tr>
                            ) : filteredTools.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                                        No tools found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredTools.map((tool) => (
                                    <tr key={tool.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-sm text-gray-900">{tool.toolId}</td>
                                        <td className="px-6 py-4 font-bold text-sm text-gray-800">{tool.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{tool.department}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{tool.uom || "-"}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${STOCK_LEVEL_STYLES(tool.stockLevel)}`}>
                                                {tool.stockLevel === 0 ? "Out of Stock" : `${tool.stockLevel} units`}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => setQrTool(tool)}
                                                className="text-blue-600 hover:text-blue-900 font-bold text-xs inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                                            >
                                                <QrCode className="w-4 h-4" /> QR
                                            </button>
                                            <button
                                                onClick={() => setEditingTool(tool)}
                                                className="text-gray-500 hover:text-gray-800 p-1.5 rounded hover:bg-gray-100 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tool.id, tool.name)}
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

            {/* Add Tool Modal */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-extrabold text-gray-900">Add New Tool</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddTool} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Tool ID</label>
                            <input
                                required
                                value={newToolId}
                                onChange={e => setNewToolId(e.target.value)}
                                placeholder="e.g. PT-006"
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Tool / Part Name</label>
                            <input
                                required
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                placeholder="e.g. 10mm Wrench"
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
                            <label className="text-sm font-bold text-gray-700">Unit of Measurement (UoM)</label>
                            <input
                                required
                                value={newUom}
                                onChange={e => setNewUom(e.target.value)}
                                placeholder="e.g. Unit, Pail, Drum, Box"
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Stock Quantity</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={newStock}
                                onChange={e => setNewStock(parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 transition-colors"
                            />
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
                                {createMutation.isPending ? "Adding..." : "Add Tool"}
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Tool Modal */}
            <Dialog open={!!editingTool} onOpenChange={(open) => {
                if (!open) {
                    setEditingTool(null);
                    setAdjustment(0);
                }
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-extrabold text-gray-900">Edit Tool / Part</DialogTitle>
                    </DialogHeader>
                    {editingTool && (
                        <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Tool / Part Name</label>
                                <input
                                    required
                                    value={editingTool.name}
                                    onChange={e => setEditingTool({ ...editingTool, name: e.target.value })}
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 transition-colors"
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <label className="text-sm font-black text-gray-400 uppercase tracking-widest block mb-4">Stock Adjustment</label>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-sm font-bold text-gray-500">Current Stock:</span>
                                        <span className="text-lg font-black text-gray-900">{editingTool.stockLevel} units</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setAdjustment(prev => prev - 1)}
                                            className="w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all active:scale-90 text-2xl font-black"
                                        >
                                            −
                                        </button>
                                        <div className="flex-1 relative">
                                            <input
                                                type="number"
                                                value={adjustment === 0 ? "" : adjustment}
                                                onChange={e => setAdjustment(parseInt(e.target.value) || 0)}
                                                placeholder="0"
                                                className="w-full h-12 text-center text-xl font-black border-2 border-gray-200 rounded-xl focus:border-blue-900 focus:outline-none transition-all placeholder:text-gray-300"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 pointer-events-none uppercase">
                                                Units
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setAdjustment(prev => prev + 1)}
                                            className="w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-all active:scale-90 text-2xl font-black"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-center px-1 pt-2 border-t border-gray-200/50">
                                        <span className="text-sm font-bold text-gray-500">New Total:</span>
                                        <span className={`text-xl font-black ${(editingTool.stockLevel + adjustment) < 0 ? "text-red-600 underline decoration-wavy" : "text-blue-900"
                                            }`}>
                                            {Math.max(0, editingTool.stockLevel + adjustment)} units
                                        </span>
                                    </div>
                                    {(editingTool.stockLevel + adjustment) < 0 && (
                                        <p className="text-[10px] font-bold text-red-500 text-center animate-pulse tracking-tight uppercase">
                                            ⚠️ Stock cannot go below zero
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2 pt-4">
                                <label className="text-sm font-bold text-gray-700">Department</label>
                                <select
                                    value={editingTool.department}
                                    onChange={e => setEditingTool({ ...editingTool, department: e.target.value })}
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 transition-colors"
                                >
                                    <option value="Glass Line">Glass Line</option>
                                </select>
                            </div>

                            <DialogFooter className="pt-6 border-t border-gray-100 flex-col sm:flex-row gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingTool(null);
                                        setAdjustment(0);
                                    }}
                                    className="px-4 py-3 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateMutation.isPending || (editingTool.stockLevel + adjustment) < 0}
                                    className="px-6 py-3 flex-1 font-black text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all shadow-lg shadow-blue-900/10 active:scale-95 disabled:bg-gray-300 disabled:shadow-none"
                                >
                                    {updateMutation.isPending ? "Saving..." : "Update Inventory"}
                                </button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* View QR Code Modal */}
            <Dialog open={!!qrTool} onOpenChange={(open) => {
                if (!open) {
                    setQrTool(null);
                }
            }}>
                <DialogContent className="sm:max-w-[400px] flex flex-col items-center justify-center p-8">
                    {qrTool && (
                        <>
                            <DialogHeader className="w-full text-center mb-6">
                                <DialogTitle className="text-2xl font-extrabold text-gray-900 mx-auto">Tool QR Code</DialogTitle>
                                <p className="text-gray-500 font-medium">{qrTool.name}</p>
                            </DialogHeader>

                            <div className="bg-white p-6 rounded-2xl border-4 border-blue-900 inline-block shadow-2xl relative mb-6">
                                <QRCodeCanvas
                                    value={qrTool.toolId}
                                    size={220}
                                    level={"M"}
                                    includeMargin={true}
                                />
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-900 text-white px-4 py-1.5 rounded-full font-black tracking-widest text-sm shadow-md whitespace-nowrap border-2 border-white">
                                    {qrTool.toolId}
                                </div>
                            </div>

                            <p className="text-sm text-center text-gray-500 mb-6 px-4">
                                Print this code and attach it to the tool container or storage bin. Workers can scan this code using the Scanner app.
                            </p>

                            <div className="flex w-full gap-3">
                                <button
                                    onClick={() => setQrTool(null)}
                                    className="flex-1 px-4 py-3 font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        window.print();
                                        toast.success("Opening print dialog...");
                                    }}
                                    className="flex-1 px-4 py-3 font-black text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all shadow-lg shadow-blue-900/10 active:scale-95"
                                >
                                    Print Label
                                </button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
