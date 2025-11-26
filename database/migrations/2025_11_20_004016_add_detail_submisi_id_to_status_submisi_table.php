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
        Schema::table('status_submisi', function (Blueprint $table) {
            $table->foreignUuid('detail_submisi_id')->nullable()->constrained('detail_submisi')->after('submisi_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('status_submisi', function (Blueprint $table) {
            $table->dropForeign(['detail_submisi_id']);
            $table->dropColumn('detail_submisi_id');
        });
    }
};
