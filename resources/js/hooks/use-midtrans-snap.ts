import { useEffect, useState } from 'react';

// Deklarasi window.snap agar TypeScript tidak error
declare global {
    interface Window {
        snap: {
            pay: (
                token: string,
                options: {
                    onSuccess?: (result: any) => void;
                    onPending?: (result: any) => void;
                    onError?: (result: any) => void;
                    onClose?: () => void;
                },
            ) => void;
        };
    }
}

interface UseMidtransSnapOptions {
    clientKey: string;
    snapUrl: string;
}

export function useMidtransSnap({
    clientKey,
    snapUrl,
}: UseMidtransSnapOptions) {
    const [isLoaded, setIsLoaded] = useState(
        () => typeof window !== 'undefined' && !!window.snap,
    );

    useEffect(() => {
        // Jangan load ulang jika sudah ada
        if (typeof window !== 'undefined' && window.snap) {
            return;
        }

        const script = document.createElement('script');
        script.src = snapUrl;
        script.setAttribute('data-client-key', clientKey);
        script.async = true;
        script.onload = () => setIsLoaded(true);
        script.onerror = () => console.error('Failed to load Midtrans Snap.js');

        document.head.appendChild(script);

        return () => {
            // Cleanup saat unmount (opsional, biasanya dibiarkan)
        };
    }, [clientKey, snapUrl]);

    const pay = (
        token: string,
        callbacks: {
            onSuccess?: (result: any) => void;
            onPending?: (result: any) => void;
            onError?: (result: any) => void;
            onClose?: () => void;
        },
    ) => {
        if (!isLoaded || !window.snap) {
            console.error('Snap.js belum dimuat.');

            return;
        }

        window.snap.pay(token, callbacks);
    };

    return { isLoaded, pay };
}
