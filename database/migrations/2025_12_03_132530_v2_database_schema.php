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
        Schema::create('kegiatan_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nama', 100);
            $table->timestamps();
        });

        Schema::create('faq', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('question', 255);
            $table->text('answer');
            $table->foreignUuid('user_id')->constrained('users');
            $table->timestamps();
        });

        Schema::create('status_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->char('nama');
            $table->timestamps();
        });

        Schema::create('status_type_roles', function (Blueprint $table) {
            $table->foreignUuid('role_type_id')->constrained('role_types');
            $table->foreignUuid('status_type_id')->constrained('status_types');
            $table->primary(['role_type_id', 'status_type_id']);
        });

        Schema::create('mata_kuliah', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nama', 100);
            $table->unsignedTinyInteger('semester');
            $table->unsignedTinyInteger('sks');
            $table->timestamps();
        });

        Schema::create('matkul_terkait', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('kesesuaian', 255);
            $table->foreignUuid('submisi_id')->constrained('submisi');
            $table->foreignUuid('mata_kuliah_id')->constrained('mata_kuliah');
            $table->timestamps();
        });

        Schema::table('submisi', function (Blueprint $table) {
            $table->dropColumn('jenis_kegiatan');
            $table->foreignUuid('kegiatan_type_id')->nullable()->constrained('kegiatan_types');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submisi', function (Blueprint $table) {
            $table->dropForeign(['kegiatan_type_id']);
            $table->dropColumn('kegiatan_type_id');
            $table->string('jenis_kegiatan', 100)->nullable();
        });

        Schema::dropIfExists('matkul_terkait');
        Schema::dropIfExists('mata_kuliah');
        Schema::dropIfExists('status_type_roles');
        Schema::dropIfExists('status_types');
        Schema::dropIfExists('faq');
        Schema::dropIfExists('kegiatan_types');
    }
};
