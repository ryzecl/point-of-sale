import { useEffect, useState, useCallback } from 'react';

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
    const [isLoaded, setIsLoaded] = useState(() => {
        return typeof window !== 'undefined' && !!window.snap;
    });

    useEffect(() => {
        // Jangan load ulang jika sudah ada
        if (typeof window === 'undefined') {
            return;
        }

        if (window.snap) {
            setIsLoaded(true);

            return;
        }

        const scriptId = 'midtrans-snap-script';
        let script = document.getElementById(
            scriptId,
        ) as HTMLScriptElement | null;

        if (!script) {
            // Jika benar-benar belum ada, buat baru
            script = document.createElement('script');
            script.id = scriptId;
            script.src = snapUrl;
            script.setAttribute('data-client-key', clientKey);
            script.async = true;
            document.head.appendChild(script);
        }

        // 3. Pasang listener untuk mengupdate state
        // Kita gunakan fungsi terpisah agar bisa di-cleanup
        const targetScript = script;
        const onScriptLoad = () => setIsLoaded(true);
        const onScriptError = () =>
            console.error('Failed to load Midtrans Snap.js');

        targetScript.addEventListener('load', onScriptLoad);
        targetScript.addEventListener('error', onScriptError);

        return () => {
            // Cleanup: copot listener agar tidak memory leak
            targetScript.removeEventListener('load', onScriptLoad);
            targetScript.removeEventListener('error', onScriptError);
        };
    }, [clientKey, snapUrl]);

    // ✅ FIX: Gunakan useCallback agar object tidak terecreate sembarangan
    const pay = useCallback(
        (
            token: string,
            callbacks: {
                onSuccess?: (result: any) => void;
                onPending?: (result: any) => void;
                onError?: (result: any) => void;
                onClose?: () => void;
            },
        ) => {
            if (typeof window !== 'undefined' && window.snap && isLoaded) {
                window.snap.pay(token, callbacks);
            } else {
                console.error('Snap.js belum siap. Memaksa abort koneksi.');
            }
        },
        [isLoaded],
    );

    return { isLoaded, pay };
}
