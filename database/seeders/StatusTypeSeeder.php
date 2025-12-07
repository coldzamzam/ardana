<?php

namespace Database\Seeders;

use App\Models\StatusType;
use Illuminate\Database\Seeder;

class StatusTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            'Diajukan',
            'Revisi',
            'Divalidasi',
            'Diverifikasi',
            'Disetujui',
            'Ditolak',
        ];

        foreach ($statuses as $status) {
            StatusType::updateOrCreate(['nama' => $status]);
        }
    }
}
