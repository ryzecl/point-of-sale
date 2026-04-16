import { Head, router, usePage } from '@inertiajs/react';
import { ShoppingCart, Search, X, Minus, Plus, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useFilter } from '@/hooks/use-filter';
import { useMidtransSnap } from '@/hooks/use-midtrans-snap';
import type { Category, Item, CheckoutData, OrderSuccessData } from '@/types';
import CheckoutDialog from './components/CheckoutDialog';
import PosFilter from './components/PosFilter';
import SuccessDialog from './components/SuccessDialog';

const categoryColors = [
    'bg-blue-500/20 text-blue-700 dark:bg-blue-500/30 dark:text-blue-300',
    'bg-amber-500/20 text-amber-700 dark:bg-amber-500/30 dark:text-amber-300',
    'bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/30 dark:text-emerald-300',
    'bg-purple-500/20 text-purple-700 dark:bg-purple-500/30 dark:text-purple-300',
    'bg-pink-500/20 text-pink-700 dark:bg-pink-500/30 dark:text-pink-300',
    'bg-rose-500/20 text-rose-700 dark:bg-rose-500/30 dark:text-rose-300',
    'bg-cyan-500/20 text-cyan-700 dark:bg-cyan-500/30 dark:text-cyan-300',
];

interface IndexProps {
    items: {
        data: Item[];
        links: any;
        meta: {
            current_page: number;
            last_page: number;
            from: number;
            to: number;
            total: number;
            per_page: number;
        };
    };
    categories: { data: Category[] };
    filters?: {
        search?: string;
        category_id?: string;
        min_price?: string;
        max_price?: string;
        stock_status?: string;
        is_active?: string;
        is_low_stock?: string;
        perPage?: string;
    };
    midtransClientKey: string;
    midtransSnapUrl: string;
}

type CartItem = Item & { quantity: number };

export default function Index({
    items,
    categories,
    filters = {},
    midtransClientKey,
    midtransSnapUrl,
}: IndexProps) {
    const { search, setSearch, handleReset, applyFilters } = useFilter({
        routeName: '/cashier',
        initialFilters: filters,
    });

    const [cart, setCart] = useState<CartItem[]>([]);
    // State untuk mengendalikan Buka-tutup Dialog Checkout
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    // State baru untuk Success Dialog
    const [successData, setSuccessData] = useState<OrderSuccessData | null>(
        null,
    );
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    // Inisialisasi Midtrans Snap
    const { pay: snapPay } = useMidtransSnap({
        clientKey: midtransClientKey,
        snapUrl: midtransSnapUrl,
    });

    // Ambil flash message dari Inertia props
    // Casting 'any' di awal atau definisikan SharedProps agar TS tidak rewel
    const { flash } = usePage().props as any;
    const orderSuccess = flash?.orderSuccess as OrderSuccessData | undefined;

    useEffect(() => {
        if (!orderSuccess) {
            return;
        }

        if (orderSuccess.snapToken) {
            // Beri jeda sangat kecil agar Radix UI selesai membersihkan overlay/focus-trap
            setTimeout(() => {
                // ✅ TUTUP dialog checkout di dalam timeout agar tidak memicu cascading render
                setIsCheckoutOpen(false);

                snapPay(orderSuccess.snapToken!, {
                    onSuccess: () => {
                        // Pembayaran berhasil di sisi Midtrans
                        setSuccessData(orderSuccess);
                        setIsSuccessOpen(true);
                        setCart([]);
                    },
                    onPending: () => {
                        // Pembayaran pending (transfer manual, dll)
                        alert(
                            'Pembayaran masih pending. Silakan cek status di halaman Order.',
                        );
                        setCart([]);
                    },
                    onError: () => {
                        alert('Pembayaran gagal. Silakan coba lagi.');
                    },
                    onClose: () => {
                        // User menutup popup tanpa menyelesaikan pembayaran
                        console.log('Snap popup ditutup.');
                    },
                });
            }, 100);
        } else {
            // Metode Cash: Langsung tampilkan Success Dialog
            // Wrap in setTimeout to avoid cascading render lint error
            setTimeout(() => {
                setSuccessData(orderSuccess);
                setIsSuccessOpen(true);
                setCart([]);
                setIsCheckoutOpen(false);
            }, 0);
        }
    }, [orderSuccess, snapPay]);

    // Handler tutup Success Dialog
    const handleSuccessClose = () => {
        setIsSuccessOpen(false);
        setSuccessData(null);
    };

    const products = items?.data ?? [];

    const handlePageChange = (page: number) => {
        router.get(
            '/cashier',
            { ...filters, page },
            // preserveScroll penting agar layar tidak selalu lompat ke paling atas ketika ganti halaman di HP
            { preserveState: true, replace: true, preserveScroll: true },
        );
    };

    const handleAddToCart = (product: Item) => {
        setCart((prevCart) => {
            // Cek apakah barangnya sudah pernah diklik sebelumnya
            const existingItem = prevCart.find(
                (item) => item.id === product.id,
            );

            if (existingItem) {
                // Jika sudah ada, tambahkan jumlah quantity (qty) menjadi +1
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                );
            }

            // Jika belum ada di list keranjang, masukkan item gres dengan qty 1
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    // FUNGSI UNTUK MENGURANGI QTY / HAPUS JIKA QTY = 1
    const handleRemoveFromCart = (productId: number) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === productId);

            if (existingItem?.quantity === 1) {
                // Jika quantity saat ini = 1, saat dikurangi artinya terhapus seutuhnya (Filter yang TIDAK sama dengan ID-nya)
                return prevCart.filter((item) => item.id !== productId);
            } else {
                // Jika quantity lebih dari 1, turunkan angka quantity-nya jadi - 1
                return prevCart.map((item) =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item,
                );
            }
        });
    };

    const handleResetCart = () => {
        setCart([]);
    };

    // 4. Kalkulasi Subtotal, Pajak 10%, dan Total Akhir
    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    const tax = subtotal * 0.1; // Pajak 10%
    const grandTotal = subtotal + tax;

    // Fungsi Menyelesaikan Pesanan dari anak komponen (CheckoutDialog.tsx)
    const handleSelesaikanPesanan = (data: CheckoutData) => {
        // Memanggil router.post Inertia untuk mengirim data ke Backend
        router.post(
            '/cashier',
            {
                ...data,
                // Map isi keranjang agar hanya mengirim ID dan jumlahnya saja
                cart: cart.map((item) => ({
                    id: item.id,
                    quantity: item.quantity,
                })),
            },
            {
                onSuccess: () => {
                    // Kita tidak perlu menutup dialog atau hapus cart di sini lagi,
                    // Karena sudah dihandle secara terpusat oleh useEffect di atas
                    // yang memantau flash.orderSuccess dari server.
                },
                onError: (errors) => {
                    // Handle Error (Opsional: Bisa tampilkan toast)
                    console.error('Gagal memproses pesanan:', errors);
                },
                preserveScroll: true,
            },
        );
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] flex-col bg-muted/20 p-4 lg:h-[calc(100vh-64px)] lg:flex-row lg:gap-8 lg:overflow-hidden lg:p-8">
            <Head title="Cashier (POS)" />

            {/* Success Dialog */}
            {successData && (
                <SuccessDialog
                    open={isSuccessOpen}
                    onClose={handleSuccessClose}
                    orderCode={successData.orderCode}
                    grandTotal={successData.grandTotal}
                />
            )}

            {/* Left Section: Product Selection */}
            <div className="flex min-h-0 flex-1 flex-col gap-3">
                <div className="flex shrink-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Katalog Produk
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Pilih produk untuk ditambahkan ke pesanan
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative w-full max-w-[300px]">
                            <Input
                                placeholder="Cari nama produk..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            {/* Tombol X (Reset) di dalam Input (muncul jika ada teks) */}
                            {search && (
                                <button
                                    onClick={handleReset}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                    type="button"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Tombol Search Manual (opsional karena sudah debounced) */}
                        <Button
                            variant="default"
                            className="rounded-xl px-5"
                            onClick={() => applyFilters({ search })}
                        >
                            <Search />
                            <span className="hidden md:flex">Cari</span>
                        </Button>

                        <PosFilter
                            categories={categories.data}
                            initialFilters={filters}
                            onFilter={applyFilters}
                            onReset={handleReset}
                        />
                    </div>
                </div>

                {/* Category Quick Filter */}
                <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
                    <Button
                        variant={!filters.category_id ? 'default' : 'outline'}
                        size="sm"
                        className="rounded-full px-6"
                        onClick={() => applyFilters({ category_id: undefined })}
                    >
                        Semua
                    </Button>

                    {categories.data.map((cat) => (
                        <Button
                            key={cat.id}
                            variant={
                                filters.category_id == String(cat.id)
                                    ? 'default'
                                    : 'outline'
                            }
                            size="sm"
                            className="rounded-full px-6 whitespace-nowrap"
                            onClick={() =>
                                applyFilters({ category_id: String(cat.id) })
                            }
                        >
                            {cat.cat_name}
                        </Button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="no-scrollbar flex-1 pr-2 pb-4 lg:overflow-y-auto">
                    <div className="grid grid-cols-2 content-start gap-5 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8">
                        {products.length > 0 ? (
                            products.map((item) => {
                                const stock = item.stock ?? 0;
                                const minStock = item.min_stock ?? 0;

                                let badgeVariant:
                                    | 'default'
                                    | 'destructive'
                                    | 'outline'
                                    | 'secondary' = 'default';
                                let badgeClassName = '';

                                if (stock <= 0) {
                                    badgeVariant = 'destructive';
                                } else if (stock <= minStock) {
                                    badgeClassName =
                                        'bg-amber-500 text-white hover:bg-amber-600 border-none';
                                } else {
                                    badgeVariant = 'default';
                                    badgeClassName =
                                        'bg-green-500 text-white hover:bg-green-600 border-none';
                                }

                                const catColor = item.category?.id
                                    ? categoryColors[
                                          item.category.id %
                                              categoryColors.length
                                      ]
                                    : 'bg-muted/80 text-muted-foreground';

                                return (
                                    <Card
                                        key={item.id}
                                        onClick={() => {
                                            handleAddToCart(item);
                                        }}
                                        className="group form-ring relative flex cursor-pointer flex-col gap-1 overflow-hidden rounded-2xl border-2 border-transparent bg-card/50 py-0 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl active:scale-95"
                                        // className="group relative flex cursor-pointer flex-col gap-1 overflow-hidden rounded-2xl border-none bg-card/50 py-0 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
                                    >
                                        <div className="absolute top-1 right-2 z-10">
                                            <Badge
                                                variant="secondary"
                                                className={`border-none font-semibold shadow-sm backdrop-blur-md ${catColor}`}
                                            >
                                                {item.category?.cat_name ||
                                                    'Tanpa Kategori'}
                                            </Badge>
                                        </div>
                                        <div className="relative aspect-4/3 overflow-hidden bg-muted/30">
                                            {item.img ? (
                                                <img
                                                    src={item.img}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-muted-foreground/30">
                                                    <ShoppingCart className="h-10 w-10 opacity-20" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                        </div>

                                        <CardHeader className="bg-card p-2">
                                            <CardTitle className="line-clamp-1 text-base leading-tight font-medium transition-colors group-hover:text-primary">
                                                {item.name}
                                            </CardTitle>
                                            <CardDescription className="mt-1 line-clamp-1 flex justify-between text-xs text-muted-foreground">
                                                <div>
                                                    <span className="text-xs text-muted-foreground">
                                                        Stok:
                                                    </span>
                                                    <Badge
                                                        variant={badgeVariant}
                                                        className={
                                                            badgeClassName
                                                        }
                                                    >
                                                        {stock}
                                                    </Badge>
                                                </div>
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="bg-card px-4 pb-4">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xs font-bold text-primary">
                                                    Rp.
                                                </span>
                                                <span className="text-md font-bold tracking-tight text-primary">
                                                    {item.price.toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-10 text-center text-muted-foreground">
                                Produk tidak ditemukan
                            </div>
                        )}
                    </div>

                    {items.meta && items.meta.last_page > 1 && (
                        <div className="mt-8 mb-6 flex items-center justify-between border-t border-muted/20 pt-4 lg:mb-4 lg:justify-center lg:gap-8">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handlePageChange(
                                        items.meta.current_page - 1,
                                    )
                                }
                                disabled={items.meta.current_page === 1}
                                className="rounded-xl"
                            >
                                Sebelumnya
                            </Button>

                            <span className="text-sm font-medium text-muted-foreground">
                                Halaman {items.meta.current_page} dari{' '}
                                {items.meta.last_page}
                            </span>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handlePageChange(
                                        items.meta.current_page + 1,
                                    )
                                }
                                disabled={
                                    items.meta.current_page ===
                                    items.meta.last_page
                                }
                                className="rounded-xl"
                            >
                                Selanjutnya
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Section: Order Summary (Static Placeholder) */}
            <div className="mt-4 w-full self-start lg:sticky lg:top-6 lg:mt-0 lg:block lg:w-[400px]">
                <div className="lg:sticky lg:top-20 lg:h-[calc(100vh-120px)]">
                    <Card className="flex h-full flex-col overflow-hidden rounded-3xl border-none bg-background shadow-2xl">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-muted/50 bg-card/30 p-6">
                            <div className="flex items-center gap-2">
                                <div className="rounded-xl bg-primary/10 p-2.5">
                                    <ShoppingCart className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold">
                                        Ringkasan Pesanan
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        {cart ? cart.length : '0'} item terpilih
                                    </CardDescription>
                                </div>
                            </div>
                            {cart.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleResetCart}
                                    className="h-8 rounded-lg px-2 text-destructive transition-colors hover:bg-destructive/15 hover:text-destructive"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            )}
                        </CardHeader>

                        <CardContent className="no-scrollbar flex flex-1 flex-col overflow-y-auto bg-card/10 p-6">
                            {cart.length === 0 ? (
                                // TAMPILAN JIKA KERANJANG KOSONG
                                <div className="flex h-full flex-col items-center justify-center">
                                    <div className="mb-4 rounded-full bg-muted/20 p-8 shadow-inner">
                                        <ShoppingCart className="h-16 w-16 text-muted-foreground/30" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-muted-foreground/80">
                                        Belum ada item
                                    </h3>
                                    <p className="mt-1 max-w-[200px] text-center text-sm text-muted-foreground/50">
                                        Pilih produk untuk ditambahkan ke
                                        pesanan
                                    </p>
                                </div>
                            ) : (
                                // TAMPILAN JIKA KERANJANG ADA ISINYA
                                <div className="flex flex-col gap-3">
                                    {cart.map((cartItem) => (
                                        <div
                                            key={cartItem.id}
                                            className="group relative flex flex-col gap-3 rounded-2xl border border-muted/40 bg-background/50 p-3 shadow-sm backdrop-blur-sm transition-all hover:bg-background hover:shadow-md"
                                        >
                                            {/* Baris Atas: Info Item dan Subtotalnya */}
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex flex-col">
                                                    <h4 className="line-clamp-2 text-sm leading-tight font-semibold">
                                                        {cartItem.name}
                                                    </h4>
                                                    <span className="mt-0.5 text-xs font-medium text-muted-foreground">
                                                        @ Rp{' '}
                                                        {cartItem.price.toLocaleString(
                                                            'id-ID',
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="text-right text-sm font-bold whitespace-nowrap text-foreground">
                                                    Rp{' '}
                                                    {(
                                                        cartItem.price *
                                                        cartItem.quantity
                                                    ).toLocaleString('id-ID')}
                                                </div>
                                            </div>
                                            {/* Baris Bawah: Aksesoris Control (+/-) */}
                                            <div className="mt-1 flex items-center justify-between border-t border-muted/40 pt-2">
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    Banyaknya:
                                                </span>
                                                <div className="flex flex-row items-center gap-1 rounded-lg bg-muted/40 p-1">
                                                    {/* Kurangi Item */}
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveFromCart(
                                                                cartItem.id,
                                                            )
                                                        }
                                                        className="flex h-6 w-6 items-center justify-center rounded-md bg-background text-muted-foreground shadow-sm transition-colors hover:bg-red-500/10 hover:text-destructive"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>

                                                    {/* Indikator QTY */}
                                                    <span className="flex w-6 items-center justify-center text-xs font-bold">
                                                        {cartItem.quantity}
                                                    </span>

                                                    {/* Tambah Item (Panggil Fungsi Tambah Yang Biasa) */}
                                                    <button
                                                        onClick={() =>
                                                            handleAddToCart(
                                                                cartItem,
                                                            )
                                                        }
                                                        className="flex h-6 w-6 items-center justify-center rounded-md bg-background text-muted-foreground shadow-sm transition-colors hover:bg-primary/10 hover:text-primary"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="flex flex-col gap-6 border-t border-muted/50 bg-card/30 p-6">
                            <div className="flex w-full flex-col gap-3">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-muted-foreground">
                                        Subtotal
                                    </span>
                                    <span>
                                        Rp {subtotal.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        Tax (10%){' '}
                                        <Badge
                                            variant="secondary"
                                            className="h-4 px-1 text-[10px]"
                                        >
                                            PPN
                                        </Badge>
                                    </span>
                                    <span>
                                        Rp {tax.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <div className="border-t border-dashed border-muted/80 pt-4">
                                    <div className="flex items-center justify-between rounded-2xl bg-primary/5 p-4">
                                        <span className="text-lg font-bold">
                                            Grand Total
                                        </span>
                                        <span className="text-2xl font-black text-primary drop-shadow-sm">
                                            Rp{' '}
                                            {grandTotal.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Panggil Modul Komponen Eksternal CheckoutDialog */}
                            <CheckoutDialog
                                open={isCheckoutOpen}
                                setOpen={setIsCheckoutOpen}
                                cartLength={cart.length}
                                totalPembayaran={grandTotal}
                                onOrderSubmit={handleSelesaikanPesanan}
                            />
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}

Index.layout = {
    breadcrumbs: [{ title: 'Cashier (POS)', href: '/cashier' }],
};
