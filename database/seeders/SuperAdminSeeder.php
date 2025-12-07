<?php

namespace Database\Seeders;

use App\Models\RoleType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Temukan atau buat pengguna superadmin
        $superAdmin = User::updateOrCreate(
            ['email' => 'superadmin@ardana.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('superadmin1234'),
            ]
        );

        // Temukan peran superadmin
        $superadminRole = RoleType::where('role_name', 'superadmin')->first();

        // Lampirkan peran ke pengguna jika ada dan belum terpasang
        if ($superadminRole && ! $superAdmin->roles->contains($superadminRole)) {
            $superAdmin->roles()->attach($superadminRole->id, ['id' => Str::uuid()]);
        }
    }
}
