<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema; // Added this import

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Step 1: Normalize existing 'type' data by trimming spaces
        DB::statement('UPDATE submisi SET type = TRIM(type) WHERE type IS NOT NULL');

        Schema::table('submisi', function (Blueprint $table) {
            // Step 2: Drop the old column
            $table->dropColumn('type');
        });

        Schema::table('submisi', function (Blueprint $table) {
            // Step 3: Add new 'type' column with VARCHAR(3) and CHECK constraint
            $table->string('type', 3)
                ->after('judul') // Assumed original placement
                ->default('TOR') // Assuming 'TOR' is the default for existing records
                ->check('type IN (\'TOR\', \'LPJ\')', 'submisi_type_enum_check');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submisi', function (Blueprint $table) {
            // Step 1: Remove the check constraint
            $table->dropCheck('submisi_type_enum_check');
            // Step 2: Drop the new type column
            $table->dropColumn('type');
        });

        Schema::table('submisi', function (Blueprint $table) {
            // Step 3: Re-add the original CHAR(5) column
            $table->char('type', 5)
                ->after('judul')
                ->default('TOR'); // Assuming 'TOR' was the default
        });
    }
};
