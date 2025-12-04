<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('submisi', function (Blueprint $table) {
            $table->boolean('is_archived')->default(false);
            $table->boolean('is_read')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('submisi', function (Blueprint $table) {
            $table->dropColumn(['is_archived', 'is_read']);
        });
    }
};