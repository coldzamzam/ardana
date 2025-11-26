<?php

namespace Database\Seeders;

use App\Models\Dosen;
use App\Models\RoleType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DosenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dosenRole = RoleType::where('role_name', 'dosen')->first();

        $dosen = User::create([
            'name' => 'Dr. Dosen',
            'email' => 'dosen@pnj.ac.id',
            'password' => Hash::make('admin1234'),
        ]);

        $dosen->roles()->attach($dosenRole->id, ['id' => Str::uuid()]);

        Dosen::create([
            'user_id' => $dosen->id,
            'nip' => '1234567890',
        ]);
    }
}
