<?php

namespace Database\Seeders;

use App\Models\Mahasiswa;
use App\Models\RoleType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MahasiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mahasiswaRole = RoleType::where('role_name', 'mahasiswa')->first();

        $mahasiswas = [
            [
                'name' => 'Andi',
                'email' => 'andi.tik23@stu.pnj.ac.id',
                'nim' => '2307411990',
                'prodi' => 'Teknik Informatika',
            ],
            [
                'name' => 'Budi',
                'email' => 'budi.tik23@stu.pnj.ac.id',
                'nim' => '2307411991',
                'prodi' => 'Teknik Informatika',
            ],
            [
                'name' => 'Chika',
                'email' => 'chika.tik23@stu.pnj.ac.id',
                'nim' => '2307411992',
                'prodi' => 'Teknik Informatika',
            ],
            [
                'name' => 'Doni',
                'email' => 'doni.tik23@stu.pnj.ac.id',
                'nim' => '2307411993',
                'prodi' => 'Teknik Informatika',
            ],
            [
                'name' => 'Eko',
                'email' => 'eko.tik23@stu.pnj.ac.id',
                'nim' => '2307411994',
                'prodi' => 'Teknik Informatika',
            ],
        ];

        foreach ($mahasiswas as $mahasiswa) {
            $user = User::create([
                'name' => $mahasiswa['name'],
                'email' => $mahasiswa['email'],
                'password' => Hash::make('admin1234'),
            ]);

            $user->roles()->attach($mahasiswaRole->id, ['id' => Str::uuid()]);

            Mahasiswa::create([
                'user_id' => $user->id,
                'nim' => $mahasiswa['nim'],
                'prodi' => $mahasiswa['prodi'],
            ]);
        }
    }
}
