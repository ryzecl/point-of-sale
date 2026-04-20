<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class OfflineOrderStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customerName'   => 'required|string|max:100',
            'paymentMethod'  => 'required|in:cash,transfer',
            'paymentAmount'  => $this->paymentMethod === 'cash'
                ? 'required|numeric|min:0'
                : 'nullable|numeric|min:0',
            'tableNumber'    => 'required|integer|min:1',
            'note'           => 'nullable|string|max:255',
            'cart'           => 'required|array|min:1',
            'cart.*.id'      => 'required|exists:items,id',
            'cart.*.quantity' => 'required|integer|min:1',
        ];
    }

    /**
     * Custom error messages (Opsional)
     */
    public function messages(): array
    {
        return [
            'cart.required' => 'Keranjang belanja tidak boleh kosong.',
            'paymentAmount.min' => 'Jumlah bayar tidak valid.',
            'tableNumber.required' => 'Nomor meja harus diisi.',
        ];
    }
}
