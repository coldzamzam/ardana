<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('detail_submisi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('gambaran_umum')->nullable();
            $table->text('tujuan')->nullable();
            $table->text('manfaat')->nullable();
            $table->date('tanggal_mulai')->nullable();
            $table->date('tanggal_selesai')->nullable();
            $table->string('iku')->nullable();
            $table->text('metode_pelaksanaan')->nullable();
            $table->text('waktu_pelaksanaan')->nullable();
            $table->foreignUuid('pic_id')->constrained('users');
            $table->foreignUuid('submisi_id')->constrained('submisi');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_submisi');
    }
};
