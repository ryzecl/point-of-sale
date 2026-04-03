import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 42" xmlns="http://www.w3.org/2000/svg">
            {/* <svg
                {...props}
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect x="6" y="18" width="36" height="20" fill="currentColor" />
                <polygon points="6,18 24,6 42,18" fill="currentColor" />
                <rect x="20" y="26" width="8" height="12" fill="#fff" />
                <rect x="10" y="22" width="6" height="6" fill="#fff" />
                <rect x="32" y="22" width="6" height="6" fill="#fff" />
            </svg> */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                // stroke-linecap="round"
                // stroke-linejoin="round"
            >
                <path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5" />
                <path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244" />
                <path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05" />
            </svg>
        </svg>
    );
}
