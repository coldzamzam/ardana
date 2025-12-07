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
        Schema::create('biaya', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->char('type', 10);
            $table->integer('biaya_satuan');
            $table->integer('jumlah_kali');
            $table->integer('jumlah_org');
            $table->string('deskripsi');
            $table->char('satuan', 10);
            $table->foreignUuid('tor_id')->constrained('submisi');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('biaya');
    }
};
