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
        Schema::create('submisi_file', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('file_location');
            $table->string('deskripsi');
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
        Schema::dropIfExists('submisi_file');
    }
};