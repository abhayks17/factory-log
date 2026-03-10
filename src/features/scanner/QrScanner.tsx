import { Scanner } from '@yudiel/react-qr-scanner';

interface QrScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onScanError?: (error: unknown) => void;
}

export function QrScanner({ onScanSuccess, onScanError }: QrScannerProps) {
    return (
        <div className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl border-4 border-blue-200 bg-black shadow-xl aspect-square relative flex items-center justify-center">
            <Scanner
                onScan={(result) => {
                    if (result && result.length > 0) {
                        onScanSuccess(result[0].rawValue);
                    }
                }}
                onError={(error) => {
                    if (onScanError) onScanError(error);
                }}
                components={{
                    onOff: true,
                    torch: true,
                    zoom: true,
                    finder: true,
                }}
                formats={[
                    'qr_code'
                ]}
            />
        </div>
    );
}
