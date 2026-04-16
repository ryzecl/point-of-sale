<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('snap_token')->nullable()->after('note');
            $table->string('midtrans_transaction_id')->nullable()->after('snap_token');

            $table->string('status')->default('pending')->change();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'snap_token',
                'midtrans_transaction_id'
            ]);

            $table->enum('status', [
                'pending',
                'settlement',
                'cancel',
                'cooked',
                'served'
            ])->default('pending')->change();
        });
    }
};
