<?php

namespace App\Http\Controllers;

use App\Http\Requests\OfflineOrderStoreRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ItemResource;
use App\Models\Category;
use App\Models\Item;
use App\Services\ItemService;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OfflineOrderController extends Controller
{
    public function __construct(
        private readonly OrderService $orderService
    ) {}

    public function index(Request $request, ItemService $itemService)
    {
        $query = Item::query()->with('category')
            ->where('is_active', true);

        // Gunakan service yang sama
        $query = $itemService->applyFilters($query, $request->all());

        // Deteksi apakan request dari HP
        $isMobile = \Illuminate\Support\Str::contains(
            strtolower($request->userAgent()),
            ['mobile', 'android', 'iphone', 'ipad']
        );

        // Jika dari HP ambil 10 (biar cepat & pas 2 kolom x 5), jika Desktop 24 (pas untuk 8 kolom atau 6 kolom)
        $defaultPerPage = $isMobile ? 10 : 24;
        $perPage = $request->input('perPage', $defaultPerPage);

        $items = ItemResource::collection(
            $query->paginate((int) $perPage)->withQueryString()
        );
        $categories = CategoryResource::collection(Category::all());

        return Inertia::render('cashier/Index', [
            'items' => $items,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category_id', 'min_price', 'max_price']),
            'midtransClientKey' => config('midtrans.client_key'),
            'midtransSnapUrl'   => config('midtrans.snap_url'),
        ]);
    }

    public function store(OfflineOrderStoreRequest $request)
    {
        try {
            $validated = $request->validated();
            $result = $this->orderService->createOfflineOrder($validated, Auth::id());

            $order = $result['order'];
            $snapToken = $result['snapToken'];

            // Jika metode cash: redirect seperti biasa
            if ($validated['paymentMethod'] === 'cash') {
                return back()->with('orderSuccess', [
                    'orderCode'  => $order->order_code,
                    'grandTotal' => $order->grand_total,
                    'message'    => "Pesanan #{$order->order_code} berhasil diproses!",
                ]);
            }

            // Jika metode transfer: kembalikan snap token ke frontend
            return back()->with('orderSuccess', [
                'orderCode'  => $order->order_code,
                'grandTotal' => $order->grand_total,
                'snapToken'  => $snapToken,
                'message'    => "Silakan selesaikan pembayaran.",
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Order Error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return back()->withErrors([
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ]);
        }
    }
}
