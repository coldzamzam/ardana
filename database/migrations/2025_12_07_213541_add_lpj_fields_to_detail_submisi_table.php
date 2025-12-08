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
        Schema::table('detail_submisi', function (Blueprint $table) {
            $table->text('peserta_kegiatan')->nullable()->after('pic_id');
            $table->text('hasil_kegiatan')->nullable()->after('peserta_kegiatan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('detail_submisi', function (Blueprint $table) {
            $table->dropColumn(['peserta_kegiatan', 'hasil_kegiatan']);
        });
    }
};
