<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('submisi', function (Blueprint $table) {
            $table->foreignUuid('parent_tor_id')->nullable()->constrained('submisi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submisi', function (Blueprint $table) {
            $table->dropForeign(['parent_tor_id']);
            $table->dropColumn('parent_tor_id');
        });
    }
};