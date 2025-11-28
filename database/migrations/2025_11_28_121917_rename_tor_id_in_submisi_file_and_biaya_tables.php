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
        Schema::table('submisi_file', function (Blueprint $table) {
            $table->renameColumn('tor_id', 'submisi_id');
        });

        Schema::table('biaya', function (Blueprint $table) {
            $table->renameColumn('tor_id', 'submisi_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submisi_file', function (Blueprint $table) {
            $table->renameColumn('submisi_id', 'tor_id');
        });

        Schema::table('biaya', function (Blueprint $table) {
            $table->renameColumn('submisi_id', 'tor_id');
        });
    }
};