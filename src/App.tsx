import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { router } from "@/routes/index";
import { queryClient } from "@/lib/queryClient";

function ErrorFallback({ error }: FallbackProps) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center border-t-4 border-red-600">
                <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
                    Something went wrong
                </h1>
                <p className="text-gray-500 mb-6 font-medium">{(error as Error).message}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-900 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
                >
                    Reload App
                </button>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <ErrorBoundary fallbackRender={(props) => <ErrorFallback {...props} />}>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
                <Toaster
                    position="top-center"
                    richColors
                    toastOptions={{
                        style: { fontSize: "1.1rem", fontWeight: "700", padding: "16px 20px" },
                    }}
                />
            </QueryClientProvider>
        </ErrorBoundary>
    );
}
