import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth, name } = usePage<any>().props;

    return (
        <div className="bg-white font-sans text-slate-900">
            <Head title="Welcome" />

            {/* Navbar */}
            <nav className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <span className="font-heading text-xl font-bold tracking-tight text-[#0F172A]">
                            {name}
                        </span>
                    </div>
                    <div className="hidden items-center gap-8 text-sm font-medium text-slate-500 lg:flex">
                        <a
                            href="#features"
                            className="transition-colors hover:text-slate-900"
                        >
                            Features
                        </a>
                        <a
                            href="#pricing"
                            className="transition-colors hover:text-slate-900"
                        >
                            Pricing
                        </a>
                        <a
                            href="#solutions"
                            className="transition-colors hover:text-slate-900"
                        >
                            Solutions
                        </a>
                        <a
                            href="#about"
                            className="transition-colors hover:text-slate-900"
                        >
                            About
                        </a>
                    </div>
                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="text-sm font-semibold text-slate-900"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
                                >
                                    Demo
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="rounded-full bg-[#0F172A] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/10 transition-all hover:scale-105 hover:bg-slate-800"
                                    >
                                        Buy Code
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
                        <div className="max-w-2xl">
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold tracking-wider text-emerald-600 uppercase ring-1 ring-emerald-600/20 ring-inset">
                                Modern Business Logic
                            </span>
                            <h1 className="mt-6 font-heading text-5xl leading-[1.1] font-bold tracking-tight text-[#0F172A] lg:text-7xl">
                                Your Business, <br />
                                <span className="text-slate-400">
                                    Perfectly Fluid.
                                </span>
                            </h1>
                            <p className="mt-8 max-w-lg text-lg leading-relaxed text-slate-600">
                                Experience the digital glasshouse of POS
                                systems. Minimalist design meets authoritative
                                data management for the modern retailer.
                            </p>
                            <div className="mt-10 flex flex-wrap items-center gap-4">
                                <Link
                                    href={register()}
                                    className="rounded-full bg-[#3B82F6] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:scale-105 hover:bg-blue-600 active:scale-95"
                                >
                                    Buy Source Code
                                </Link>
                                <Link
                                    href={login()}
                                    className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-8 py-4 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-200"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="h-5 w-5"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    Demo App
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 -z-10 translate-x-8 translate-y-8 rounded-[3rem] bg-[#FFF2F2]" />
                            <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-4 shadow-2xl ring-1 ring-slate-100">
                                <img
                                    src="/images/landing/hero-mockup.png"
                                    alt="POS App Mockup"
                                    className="h-auto w-full rounded-[2rem]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted Brands */}
            <section className="bg-slate-50/50 py-12">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                        Trusted by fast-growing brands
                    </p>
                    <div className="mt-8 flex justify-center">
                        <img
                            src="/images/landing/brand-logos.png"
                            alt="Trusted Brands"
                            className="h-8 object-contain opacity-60 grayscale filter transition-opacity hover:opacity-100"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 lg:py-32">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="font-heading text-4xl font-bold tracking-tight text-[#0F172A] lg:text-5xl">
                            Built for precision, designed for clarity.
                        </h2>
                        <p className="mt-6 text-lg leading-relaxed text-slate-600">
                            We removed the clutter so you can focus on what
                            matters: your customers and your growth.
                        </p>
                    </div>

                    <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                        {/* Real-time Analytics */}
                        <div className="group relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white transition-all hover:scale-[1.02]">
                            <div className="absolute inset-0 -z-10 opacity-40">
                                <img
                                    src="/images/landing/feature-analytics.png"
                                    alt="Analytics"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="mb-12 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-400/20 ring-inset">
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold">
                                Real-time Analytics
                            </h3>
                            <p className="mt-4 max-w-xs text-slate-400">
                                Track your sales, margins, and performance
                                metrics as they happen. Our Digital Glasshouse
                                dashboard provides instant clarity.
                            </p>
                        </div>

                        {/* Inventory Management */}
                        <div className="group relative rounded-[2rem] bg-[#0A1629] p-8 text-white transition-all hover:scale-[1.02]">
                            <div className="mb-12 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-400/20 ring-inset">
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold">
                                Inventory Management
                            </h3>
                            <p className="mt-4 max-w-xs text-slate-400">
                                Automated stock tracking across all channels.
                                Never miss a sale due to low stock again.
                            </p>
                        </div>

                        {/* Multi-location Support */}
                        <div className="rounded-[2rem] bg-slate-100 p-8 transition-all hover:scale-[1.02]">
                            <div className="mb-12 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-white">
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">
                                Multi-location Support
                            </h3>
                            <p className="mt-4 max-w-xs text-slate-600">
                                Manage ten stores as easily as one. Centralized
                                control for the modern enterprise.
                            </p>
                        </div>

                        {/* Secure Transactions */}
                        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200 transition-all hover:scale-[1.02]">
                            <div className="mb-12 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-emerald-600 ring-1 ring-emerald-600/20 ring-inset">
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">
                                Secure Transactions
                            </h3>
                            <div className="mt-8 flex w-fit items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-[10px] font-bold text-slate-600 ring-1 ring-slate-100">
                                <svg
                                    className="h-3 w-3 text-emerald-500"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                                PCI Compliance Level 1
                            </div>
                            <p className="mt-4 max-w-xs text-slate-600">
                                Bank-grade encryption for every swipe, tap, and
                                click. Your data is protected by the Fluid Auth.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="bg-slate-50/50 py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center">
                        <h2 className="font-heading text-4xl font-bold tracking-tight text-[#0F172A]">
                            Transparent Pricing
                        </h2>
                        <p className="mt-4 text-slate-600">
                            Choose the plan that matches your business velocity.
                        </p>
                    </div>

                    <div className="mt-20 grid gap-8 lg:grid-cols-3">
                        {/* Starter */}
                        <div className="flex flex-col rounded-[2.5rem] bg-white p-10 shadow-sm ring-1 ring-slate-200">
                            <h4 className="text-lg font-bold">Starter</h4>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-bold">$49</span>
                                <span className="text-slate-400">/mo</span>
                            </div>
                            <ul className="mt-10 flex-grow space-y-4 text-sm text-slate-600">
                                <li className="flex items-center gap-3">
                                    <svg
                                        className="h-4 w-4 text-emerald-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                    </svg>
                                    Single location
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg
                                        className="h-4 w-4 text-emerald-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                    </svg>
                                    Up to 3 registers
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg
                                        className="h-4 w-4 text-emerald-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                    </svg>
                                    Basic reports
                                </li>
                            </ul>
                            <button className="mt-10 w-full rounded-full border border-slate-200 py-4 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-50">
                                Get Started
                            </button>
                        </div>

                        {/* Pro */}
                        <div className="relative z-10 flex scale-105 flex-col rounded-[2.5rem] bg-[#0A1629] p-10 text-white shadow-2xl">
                            <div className="absolute top-8 right-8 inline-flex rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase">
                                Popular
                            </div>
                            <h4 className="text-lg font-bold">Pro</h4>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-bold">$129</span>
                                <span className="text-slate-400">/mo</span>
                            </div>
                            <ul className="mt-10 flex-grow space-y-4 text-sm text-slate-300">
                                <li className="flex items-center gap-3">
                                    <svg
                                        className="h-4 w-4 text-emerald-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                    </svg>
                                    Up to 10 locations
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg
                                        className="h-4 w-4 text-emerald-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                    </svg>
                                    Unlimited registers
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg
                                        className="h-4 w-4 text-emerald-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                    </svg>
                                    Advanced inventory
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg
                                        className="h-4 w-4 text-emerald-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                    </svg>
                                    Customer loyalty
                                </li>
                            </ul>
                            <button className="mt-10 w-full rounded-full bg-[#10B981] py-4 text-sm font-bold text-white transition-all hover:scale-[1.02] hover:bg-emerald-600">
                                Start Free Trial
                            </button>
                        </div>

                        {/* Enterprise */}
                        <div className="flex flex-col rounded-[2.5rem] bg-white p-10 shadow-sm ring-1 ring-slate-200">
                            <h4 className="text-lg font-bold">Enterprise</h4>
                            <div className="mt-4">
                                <span className="text-4xl font-bold">
                                    Custom
                                </span>
                            </div>
                            <ul className="mt-10 flex-grow space-y-4 text-sm text-slate-600">
                                <li className="flex items-center gap-3">
                                    <svg
                                        className="h-4 w-4 text-emerald-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                    </svg>
                                    Unlimited locations
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg
                                        className="h-4 w-4 text-emerald-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                    </svg>
                                    Dedicated account manager
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg
                                        className="h-4 w-4 text-emerald-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                    </svg>
                                    Custom integrations
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg
                                        className="h-4 w-4 text-emerald-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                    </svg>
                                    API Access
                                </li>
                            </ul>
                            <button className="mt-10 w-full rounded-full border border-slate-200 py-4 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-50">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="overflow-hidden bg-white py-24 lg:py-32">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex flex-col items-center text-center">
                        <svg
                            className="mb-8 h-12 w-12 text-[#10B981]"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M14.017 21L14.017 18C14.017 16.8954 14.9125 16 16.0171 16H19.0171C19.5694 16 20.0171 15.5523 20.0171 15V9C20.0171 8.44772 19.5694 8 19.0171 8H16.0171C14.9125 8 14.017 8.89543 14.017 10V11M3 21L3 18C3 16.8954 3.89543 16 5 16H8C8.55228 16 9 15.5523 9 15V9C9 8.44772 8.55228 8 8 8H5C3.89543 8 3 8.89543 3 10V11" />
                        </svg>
                        <blockquote className="max-w-3xl">
                            <p className="font-heading text-2xl leading-relaxed font-bold text-[#0F172A] italic lg:text-3xl">
                                "Switching to {name || 'Point Of Sale'} was the
                                single best decision we made for our
                                multi-location boutique. The interface is
                                stunningly simple, yet the data insights are
                                deeper than anything we've used before."
                            </p>
                        </blockquote>
                        <div className="mt-12 flex flex-col items-center">
                            <img
                                src="/images/landing/sarah-khan.png"
                                alt="Sarah Khan"
                                className="mb-4 h-16 w-16 rounded-full object-cover ring-4 ring-emerald-50"
                            />
                            <h4 className="text-sm leading-none font-bold text-slate-900">
                                Sarah Khan
                            </h4>
                            <p className="mt-1 text-xs tracking-widest text-slate-400 uppercase">
                                Founder, Earth & Threads
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Banner Section */}
            <section className="bg-white px-6 py-24">
                <div className="mx-auto max-w-7xl">
                    <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-slate-600 to-[#0F172A] px-8 py-24 text-center shadow-2xl">
                        <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />
                        <div className="relative z-10 mx-auto max-w-2xl">
                            <h2 className="font-heading text-4xl font-bold tracking-tight text-white lg:text-5xl">
                                Ready to streamline your transactions?
                            </h2>
                            <p className="mt-6 text-lg text-slate-300">
                                Join 10,000+ businesses who have already
                                transitioned to the future of retail management.
                            </p>
                            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                                <Link
                                    href={register()}
                                    className="rounded-full bg-[#10B981] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 hover:bg-emerald-600"
                                >
                                    Get Started for Free
                                </Link>
                                <button className="rounded-full border border-slate-400 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20">
                                    Schedule a Demo
                                </button>
                            </div>
                            <p className="mt-8 text-xs text-slate-400">
                                No credit card required. 14-day free trial.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-100 bg-white pt-24 pb-12">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid gap-12 lg:grid-cols-4">
                        <div className="col-span-1 lg:col-span-1">
                            <span className="font-heading text-xl font-bold tracking-tight text-[#0F172A]">
                                {name || 'Point Of Sale'}
                            </span>
                            <p className="mt-6 max-w-xs text-xs leading-relaxed text-slate-400">
                                Redefining business transactions through the
                                digital glasshouse philosophy.
                            </p>
                        </div>
                        <div>
                            <h5 className="mb-6 text-[10px] font-bold tracking-widest text-slate-900 uppercase">
                                Product
                            </h5>
                            <ul className="space-y-4 text-xs text-slate-500">
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-slate-900"
                                    >
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-slate-900"
                                    >
                                        Solutions
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-slate-900"
                                    >
                                        Integrations
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-slate-900"
                                    >
                                        Pricing
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="mb-6 text-[10px] font-bold tracking-widest text-slate-900 uppercase">
                                Company
                            </h5>
                            <ul className="space-y-4 text-xs text-slate-500">
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-slate-900"
                                    >
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-slate-900"
                                    >
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-slate-900"
                                    >
                                        Newsroom
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-slate-900"
                                    >
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="mb-6 text-[10px] font-bold tracking-widest text-slate-900 uppercase">
                                Support
                            </h5>
                            <ul className="space-y-4 text-xs text-slate-500">
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-slate-900"
                                    >
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-slate-900"
                                    >
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-slate-900"
                                    >
                                        Contact Support
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-slate-900"
                                    >
                                        Status
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-20 flex flex-col items-center justify-between border-t border-slate-50 pt-12 md:flex-row">
                        <p className="text-[10px] text-slate-400">
                            © 2024 Fluid Authority POS. All rights reserved.
                        </p>
                        <div className="mt-4 flex gap-6 md:mt-0">
                            {/* Social Icons Placeholder */}
                            <div className="h-4 w-4 rounded-full bg-slate-100" />
                            <div className="h-4 w-4 rounded-full bg-slate-100" />
                            <div className="h-4 w-4 rounded-full bg-slate-100" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
