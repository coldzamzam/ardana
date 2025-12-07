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
        Schema::table('status_submisi', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->foreignUuid('status_type_id')->constrained('status_types')->after('submisi_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('status_submisi', function (Blueprint $table) {
            $table->dropForeign(['status_type_id']);
            $table->dropColumn('status_type_id');
            $table->string('status', 100);
        });
    }
};
