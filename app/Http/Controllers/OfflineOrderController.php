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

        // Use the same service
        $query = $itemService->applyFilters($query, $request->all());

        // Detect if request is from mobile
        $isMobile = \Illuminate\Support\Str::contains(
            strtolower($request->userAgent()),
            ['mobile', 'android', 'iphone', 'ipad']
        );

        // If mobile take 10 (to be fast & fit 2 cols x 5), if Desktop 25 (fits 8 or 6 cols)
        $defaultPerPage = $isMobile ? 10 : 25;
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

            // If cash method: redirect as usual
            if ($validated['paymentMethod'] === 'cash') {
                return back()->with('orderSuccess', [
                    'orderCode'  => $order->order_code,
                    'grandTotal' => $order->grand_total,
                    'message'    => "Order #{$order->order_code} processed successfully!",
                ]);
            }

            // If transfer method: return snap token to frontend
            return back()->with('orderSuccess', [
                'orderCode'  => $order->order_code,
                'grandTotal' => $order->grand_total,
                'snapToken'  => $snapToken,
                'message'    => "Please complete the payment.",
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Order Error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return back()->withErrors([
                'message' => 'An error occurred: ' . $e->getMessage()
            ]);
        }
    }
}
