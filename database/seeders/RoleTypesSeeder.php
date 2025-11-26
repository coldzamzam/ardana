<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RoleTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            'superadmin',
            'admin',
            'sekjur',
            'kajur',
            'mahasiswa',
            'dosen',
        ];

        foreach ($roles as $role) {
            DB::table('role_types')->insert([
                'id' => Str::uuid(),
                'role_name' => $role,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
