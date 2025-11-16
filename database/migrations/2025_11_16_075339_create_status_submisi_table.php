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
        Schema::create('status_submisi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->char('status', 10);
            $table->string('keterangan')->nullable();
            $table->foreignUuid('user_id')->constrained('users');
            $table->foreignUuid('detail_submisi_id')->constrained('detail_submisi');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('status_submisi');
    }
};