import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    BarChart3,
    Boxes,
    Building2,
    Check,
    CreditCard,
    LayoutDashboard,
    LockKeyhole,
    ReceiptText,
    ShieldCheck,
    Sparkles,
    Store,
    UsersRound,
    Zap,
} from 'lucide-react';

import { dashboard, login, register } from '@/routes';

const navItems = [
    { label: 'Fitur', href: '#features' },
    { label: 'Operasional', href: '#operations' },
    { label: 'Harga', href: '#pricing' },
    { label: 'Keamanan', href: '#security' },
];

const stats = [
    { value: '3x', label: 'checkout lebih cepat' },
    { value: '24/7', label: 'laporan tersinkron' },
    { value: '99%', label: 'stok lebih terpantau' },
];

const features = [
    {
        icon: ReceiptText,
        title: 'Kasir Cepat',
        description:
            'Alur checkout ringkas dengan pencarian produk, diskon, pajak, dan cetak struk dalam satu layar.',
    },
    {
        icon: Boxes,
        title: 'Kontrol Stok',
        description:
            'Pantau persediaan, produk menipis, mutasi stok, dan performa item tanpa spreadsheet manual.',
    },
    {
        icon: BarChart3,
        title: 'Laporan Real-time',
        description:
            'Ringkasan penjualan, margin, kategori, dan performa toko siap dibaca setiap saat.',
    },
    {
        icon: UsersRound,
        title: 'Pelanggan & Loyalty',
        description:
            'Kelola data pelanggan, riwayat transaksi, dan pengalaman belanja yang lebih personal.',
    },
];

const operations = [
    'Manajemen produk, kategori, dan harga jual',
    'Transaksi kasir dengan metode pembayaran fleksibel',
    'Dashboard performa penjualan harian',
    'Hak akses untuk owner, admin, dan kasir',
];

const plans = [
    {
        name: 'Starter',
        price: 'Rp49rb',
        suffix: '/bulan',
        description: 'Untuk toko kecil yang butuh sistem kasir rapi.',
        features: ['1 cabang', '3 akun kasir', 'Laporan dasar'],
        highlighted: false,
    },
    {
        name: 'Business',
        price: 'Rp129rb',
        suffix: '/bulan',
        description: 'Untuk bisnis retail yang mulai scale operasional.',
        features: [
            'Multi cabang',
            'Akun tanpa batas',
            'Inventory lanjutan',
            'Analitik penjualan',
        ],
        highlighted: true,
    },
    {
        name: 'Source Code',
        price: 'Custom',
        suffix: '',
        description: 'Untuk tim yang ingin deploy dan modifikasi sendiri.',
        features: [
            'Full source code',
            'Dokumentasi instalasi',
            'Support setup',
        ],
        highlighted: false,
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
};

type WelcomePageProps = {
    auth: {
        user?: unknown;
    };
    name?: string;
};

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth, name } = usePage<WelcomePageProps>().props;
    const appName = name || 'Point Of Sale';
    const primaryHref = auth.user
        ? dashboard()
        : canRegister
          ? register()
          : login();

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-950">
            <Head title={appName} />

            <motion.header
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
            >
                <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/70 bg-white/85 px-4 py-3 shadow-[0_18px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:px-5">
                    <a href="#" className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg shadow-slate-900/20">
                            <Store className="size-5" />
                        </span>
                        <span className="font-heading text-base font-bold tracking-tight text-slate-950 sm:text-lg">
                            {appName}
                        </span>
                    </a>

                    <div className="hidden items-center gap-1 rounded-full bg-slate-100 p-1 lg:flex">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-950 hover:shadow-sm"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
                            >
                                <LayoutDashboard className="size-4" />
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="hidden rounded-full px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 sm:inline-flex"
                                >
                                    Demo
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
                                    >
                                        Mulai
                                        <ArrowRight className="size-4" />
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </nav>
            </motion.header>

            <main>
                <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 lg:pt-40 lg:pb-24">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(16,185,129,0.16),transparent_32%),radial-gradient(circle_at_85%_0%,rgba(59,130,246,0.16),transparent_30%)]" />
                    <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            transition={{ duration: 0.55, ease: 'easeOut' }}
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm">
                                <Sparkles className="size-3.5" />
                                POS modern untuk operasional retail
                            </div>
                            <h1 className="mt-6 max-w-4xl font-heading text-5xl leading-[1.02] font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                                Sistem kasir yang membuat toko berjalan lebih
                                rapi.
                            </h1>
                            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                                Kelola transaksi, stok, pelanggan, dan laporan
                                bisnis dalam satu aplikasi POS yang cepat,
                                bersih, dan siap dipakai tim toko setiap hari.
                            </p>

                            <div className="mt-9 flex flex-wrap items-center gap-3">
                                <Link
                                    href={primaryHref}
                                    className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-500/20 transition hover:bg-emerald-600"
                                >
                                    {auth.user
                                        ? 'Buka Dashboard'
                                        : 'Coba Sekarang'}
                                    <ArrowRight className="size-4" />
                                </Link>
                                <Link
                                    href={login()}
                                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                                >
                                    <Zap className="size-4 text-blue-500" />
                                    Lihat Demo
                                </Link>
                            </div>

                            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
                                {stats.map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate="visible"
                                        transition={{
                                            duration: 0.45,
                                            delay: 0.15 + index * 0.08,
                                        }}
                                        className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm"
                                    >
                                        <div className="font-heading text-2xl font-bold text-slate-950">
                                            {stat.value}
                                        </div>
                                        <p className="mt-1 text-xs leading-5 font-semibold text-slate-500">
                                            {stat.label}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 28 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-emerald-200/50 blur-3xl" />
                            <div className="overflow-hidden rounded-[2rem] border border-white bg-white p-3 shadow-2xl shadow-slate-900/15">
                                <img
                                    src="/images/landing/hero-mockup.png"
                                    alt="Dashboard aplikasi point of sale"
                                    className="aspect-[1.18/1] w-full rounded-[1.5rem] object-cover object-left-top"
                                />
                            </div>
                            <motion.div
                                initial={{ opacity: 0, x: -18, y: 18 }}
                                animate={{ opacity: 1, x: 0, y: 0 }}
                                transition={{ delay: 0.45, duration: 0.45 }}
                                className="absolute -bottom-6 left-4 max-w-xs rounded-2xl border border-white bg-white/95 p-4 shadow-xl shadow-slate-900/12 backdrop-blur"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                        <CreditCard className="size-5" />
                                    </span>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500">
                                            Transaksi hari ini
                                        </p>
                                        <p className="font-heading text-xl font-bold text-slate-950">
                                            Rp12.840.000
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                <section className="border-y border-slate-200/70 bg-white py-10">
                    <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 text-center md:flex-row md:justify-between md:text-left">
                        <p className="max-w-xl text-sm font-semibold text-slate-500">
                            Dirancang untuk toko retail, minimarket, coffee
                            shop, dan bisnis multi-cabang yang butuh kontrol
                            harian.
                        </p>
                        <img
                            src="/images/landing/brand-logos.png"
                            alt="Brand yang menggunakan POS"
                            className="h-8 object-contain opacity-55 grayscale"
                        />
                    </div>
                </section>

                <section id="features" className="py-20 lg:py-28">
                    <div className="mx-auto max-w-7xl px-6">
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.25 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-3xl"
                        >
                            <p className="text-sm font-bold text-emerald-600">
                                Fitur inti
                            </p>
                            <h2 className="mt-3 font-heading text-4xl font-bold tracking-tight text-slate-950 lg:text-5xl">
                                Semua kebutuhan operasional toko dalam satu
                                workspace.
                            </h2>
                        </motion.div>

                        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;

                                return (
                                    <motion.div
                                        key={feature.title}
                                        variants={fadeUp}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, amount: 0.25 }}
                                        transition={{
                                            duration: 0.45,
                                            delay: index * 0.06,
                                        }}
                                        whileHover={{ y: -8 }}
                                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl hover:shadow-slate-900/8"
                                    >
                                        <span className="flex size-12 items-center justify-center rounded-xl bg-slate-950 text-white">
                                            <Icon className="size-5" />
                                        </span>
                                        <h3 className="mt-6 font-heading text-xl font-bold text-slate-950">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-3 text-sm leading-6 text-slate-600">
                                            {feature.description}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section id="operations" className="bg-white py-20 lg:py-28">
                    <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.25 }}
                            transition={{ duration: 0.5 }}
                            className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-3 shadow-2xl shadow-slate-900/15"
                        >
                            <img
                                src="/images/landing/feature-analytics.png"
                                alt="Analitik penjualan point of sale"
                                className="aspect-[1.2/1] w-full rounded-[1.5rem] object-cover"
                            />
                        </motion.div>

                        <div>
                            <p className="text-sm font-bold text-blue-600">
                                Alur kerja
                            </p>
                            <h2 className="mt-3 font-heading text-4xl font-bold tracking-tight text-slate-950 lg:text-5xl">
                                Dari checkout sampai laporan tutup toko,
                                semuanya tersambung.
                            </h2>
                            <p className="mt-5 text-base leading-8 text-slate-600">
                                Aplikasi ini membantu owner melihat kondisi
                                bisnis, sementara kasir tetap mendapat layar
                                kerja yang cepat dan mudah dipahami.
                            </p>
                            <div className="mt-8 space-y-3">
                                {operations.map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                                    >
                                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                                            <Check className="size-4" />
                                        </span>
                                        <span className="text-sm font-semibold text-slate-700">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="pricing" className="py-20 lg:py-28">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="mx-auto max-w-2xl text-center">
                            <p className="text-sm font-bold text-emerald-600">
                                Paket fleksibel
                            </p>
                            <h2 className="mt-3 font-heading text-4xl font-bold tracking-tight text-slate-950 lg:text-5xl">
                                Mulai dari operasional sederhana sampai source
                                code penuh.
                            </h2>
                        </div>

                        <div className="mt-12 grid gap-5 lg:grid-cols-3">
                            {plans.map((plan, index) => (
                                <motion.div
                                    key={plan.name}
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{
                                        duration: 0.45,
                                        delay: index * 0.07,
                                    }}
                                    className={
                                        plan.highlighted
                                            ? 'relative rounded-2xl bg-slate-950 p-7 text-white shadow-2xl shadow-slate-900/20'
                                            : 'rounded-2xl border border-slate-200 bg-white p-7 shadow-sm'
                                    }
                                >
                                    {plan.highlighted && (
                                        <span className="absolute top-6 right-6 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                                            Populer
                                        </span>
                                    )}
                                    <h3 className="font-heading text-xl font-bold">
                                        {plan.name}
                                    </h3>
                                    <p
                                        className={
                                            plan.highlighted
                                                ? 'mt-3 text-sm leading-6 text-slate-300'
                                                : 'mt-3 text-sm leading-6 text-slate-600'
                                        }
                                    >
                                        {plan.description}
                                    </p>
                                    <div className="mt-7 flex items-end gap-1">
                                        <span className="font-heading text-4xl font-bold">
                                            {plan.price}
                                        </span>
                                        <span
                                            className={
                                                plan.highlighted
                                                    ? 'pb-1 text-sm text-slate-400'
                                                    : 'pb-1 text-sm text-slate-500'
                                            }
                                        >
                                            {plan.suffix}
                                        </span>
                                    </div>
                                    <ul className="mt-8 space-y-3">
                                        {plan.features.map((feature) => (
                                            <li
                                                key={feature}
                                                className="flex items-center gap-3 text-sm font-semibold"
                                            >
                                                <Check className="size-4 text-emerald-500" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        href={primaryHref}
                                        className={
                                            plan.highlighted
                                                ? 'mt-8 inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600'
                                                : 'mt-8 inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-50'
                                        }
                                    >
                                        Pilih Paket
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="security" className="bg-white py-20">
                    <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
                        <div className="rounded-2xl bg-slate-950 p-8 text-white">
                            <ShieldCheck className="size-10 text-emerald-400" />
                            <h2 className="mt-6 font-heading text-3xl font-bold tracking-tight">
                                Dibuat untuk data transaksi yang sensitif.
                            </h2>
                            <p className="mt-4 text-sm leading-7 text-slate-300">
                                Struktur akses, aktivitas pengguna, dan data
                                operasional disiapkan agar bisnis lebih mudah
                                diaudit dan dikendalikan.
                            </p>
                        </div>
                        <div className="grid gap-5 md:grid-cols-3">
                            {[
                                {
                                    icon: LockKeyhole,
                                    title: 'Role Access',
                                    text: 'Pisahkan akses owner, admin, dan kasir.',
                                },
                                {
                                    icon: Building2,
                                    title: 'Multi Outlet',
                                    text: 'Pantau beberapa cabang dari satu dashboard.',
                                },
                                {
                                    icon: CreditCard,
                                    title: 'Audit Transaksi',
                                    text: 'Riwayat penjualan tersimpan dan mudah dilacak.',
                                },
                            ].map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={item.title}
                                        className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                                    >
                                        <Icon className="size-8 text-blue-600" />
                                        <h3 className="mt-5 font-heading text-lg font-bold text-slate-950">
                                            {item.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                            {item.text}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="px-6 py-20">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-14 text-center text-white shadow-2xl shadow-slate-900/20 sm:px-10"
                    >
                        <h2 className="mx-auto max-w-3xl font-heading text-4xl font-bold tracking-tight lg:text-5xl">
                            Siapkan sistem kasir yang lebih cepat untuk tim toko
                            Anda.
                        </h2>
                        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
                            Jalankan demo, cek alur transaksi, lalu sesuaikan
                            aplikasi dengan kebutuhan bisnis Anda.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <Link
                                href={primaryHref}
                                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-600"
                            >
                                Mulai Sekarang
                                <ArrowRight className="size-4" />
                            </Link>
                            <Link
                                href={login()}
                                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
                            >
                                Demo App
                            </Link>
                        </div>
                    </motion.div>
                </section>
            </main>

            <footer className="border-t border-slate-200 bg-white py-10">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-full bg-slate-950 text-white">
                            <Store className="size-4" />
                        </span>
                        <span className="font-heading font-bold text-slate-950">
                            {appName}
                        </span>
                    </div>
                    <p>
                        Copyright 2026 {appName}. Sistem POS untuk operasional
                        toko modern.
                    </p>
                </div>
            </footer>
        </div>
    );
}
