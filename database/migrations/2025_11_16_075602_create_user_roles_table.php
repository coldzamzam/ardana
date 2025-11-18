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
        // 1) Buat tabel role_types dulu (karena user_roles butuh FK ke sini)
        Schema::create('role_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');           // contoh: Admin, Dosen, Mahasiswa
            $table->string('slug')->unique(); // contoh: admin, dosen, mahasiswa
            $table->timestamps();
            $table->softDeletes();
        });

        // 2) Baru kemudian buat tabel pivot user_roles
        Schema::create('user_roles', function (Blueprint $table) {
            $table->uuid('id')->primary();

            // FK ke role_types (uuid)
            $table->foreignUuid('role_id')
                ->constrained('role_types')
                ->cascadeOnDelete();

            // FK ke users (uuid)
            $table->foreignUuid('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Urutan drop dibalik biar FK nggak ganggu
        Schema::dropIfExists('user_roles');
        Schema::dropIfExists('role_types');
    }
};
