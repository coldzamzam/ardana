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
        Schema::create('detail_lpj', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('detail_submisi_id')->constrained('detail_submisi');
            $table->text('peserta_kegiatan')->nullable();
            $table->text('hasil_kegiatan')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_lpj');
    }
};
