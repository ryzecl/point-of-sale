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
        ]);
    }

    public function store(OfflineOrderStoreRequest $request)
    {
        try {
            // Data sudah tervalidasi oleh Form Request
            $validated = $request->validated();

            // Kita mengirimkan data array dan ID user (kasir) yang sedang login
            $order = $this->orderService->createOfflineOrder($validated, Auth::id());

            // Redirect kembali ke kasir dengan pesan sukses (toast/flash)
            return redirect()->route('cashier.index')
                ->with('success', "Pesanan #{$order->order_code} berhasil diproses!");
        } catch (\Exception $e) {
            // Jika ada error (seperti stok habis di tengah jalan)
            return back()->withErrors([
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ]);
        }
    }
}
