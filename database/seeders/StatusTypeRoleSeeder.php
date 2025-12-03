<?php

namespace Database\Seeders;

use App\Models\RoleType;
use App\Models\StatusType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatusTypeRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Kosongkan tabel pivot terlebih dahulu untuk memastikan data bersih
        DB::table('status_type_roles')->truncate();

        $mapping = [
            'Diajukan' => ['mahasiswa', 'dosen'],
            'Revisi' => ['admin', 'sekjur'],
            'Divalidasi' => ['admin'],
            'Diverifikasi' => ['sekjur'],
            'Disetujui' => ['kajur'],
            'Ditolak' => ['kajur'],
        ];

        foreach ($mapping as $statusNama => $roles) {
            $statusType = StatusType::where('nama', $statusNama)->first();

            if ($statusType) {
                foreach ($roles as $roleNama) {
                    $roleType = RoleType::where('role_name', $roleNama)->first();

                    if ($roleType) {
                        // Masukkan data ke tabel pivot
                        DB::table('status_type_roles')->insert([
                            'status_type_id' => $statusType->id,
                            'role_type_id' => $roleType->id,
                        ]);
                    }
                }
            }
        }
    }
}
