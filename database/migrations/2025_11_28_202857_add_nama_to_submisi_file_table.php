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
        Schema::table('submisi_file', function (Blueprint $table) {
            $table->string('nama')->after('file_location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submisi_file', function (Blueprint $table) {
            $table->dropColumn('nama');
        });
    }
};
