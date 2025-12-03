<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\KegiatanType;
use Illuminate\Support\Str;

class KegiatanTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kegiatanTypes = [
            'Pelatihan dan Sertifikasi Kompetensi Dosen',
            'Lomba Mahasiswa',
            'Acara Pameran dan Kompetensi',
            'Pengabdian Masyarakat',
            'Acara Kompetisi',
        ];

        foreach ($kegiatanTypes as $type) {
            KegiatanType::create([
                'id' => Str::uuid(),
                'nama' => $type,
            ]);
        }
    }
}