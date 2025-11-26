<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superadminRole = DB::table('role_types')->where('role_name', 'superadmin')->first();

        if ($superadminRole) {
            $userId = Str::uuid();
            DB::table('users')->insert([
                'id' => $userId,
                'name' => 'Super Admin',
                'email' => 'superadmin@ardana.com',
                'password' => Hash::make('superadmin1234'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('user_roles')->insert([
                'id' => Str::uuid(),
                'user_id' => $userId,
                'role_id' => $superadminRole->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
