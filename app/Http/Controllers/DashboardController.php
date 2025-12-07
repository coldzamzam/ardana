<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $roleRaw = $user->roles->first()->role_name ?? 'mahasiswa';
        $role = strtolower(trim($roleRaw));

        $data = [];
        // DUMMY DATA
        if ($role === 'mahasiswa') {
            $data = [
                'stats' => [
                    'tor_created' => 5,
                    'lpj_created' => 2,
                    'approved_items' => 3,
                ],
                'recent_revisions' => [
                    'tor' => [
                        [
                            'judul_tor' => 'Workshop UI/UX Design 2024',
                            'catatan_revisi' => 'RAB konsumsi terlalu besar, mohon sesuaikan dengan standar SBM.',
                            'updated_at' => '2024-12-01 10:00:00',
                        ],
                        [
                            'judul_tor' => 'Seminar Cyber Security',
                            'catatan_revisi' => 'Lampiran jadwal acara belum ada tanda tangan Kaprodi.',
                            'updated_at' => '2024-11-28 14:30:00',
                        ],
                    ],
                    'lpj' => [
                        [
                            'judul_lpj' => 'Lomba Coding Nasional',
                            'catatan_revisi' => 'Bukti nota sewa gedung tidak terbaca/blur.',
                            'updated_at' => '2024-12-02 09:15:00',
                        ],
                    ],
                ],
            ];
        } elseif (in_array($role, ['admin', 'sekjur', 'kajur'])) {
            $data = [
                'tor_stats' => [
                    'diajukan' => 12,
                    'revisi' => 4,
                    'tervalidasi' => 8,
                    'terverifikasi' => 6,
                    'disetujui' => 5,
                ],
                'lpj_stats' => [
                    'diajukan' => 8,
                    'revisi' => 2,
                    'tervalidasi' => 5,
                    'terverifikasi' => 3,
                    'disetujui' => 3,
                ],
                'financials' => [
                    'total_alokasi' => 150000000,
                    'total_realisasi' => 125000000,
                ],
            ];
        } elseif ($role === 'superadmin') {
            $data = [
                'total_users' => 1250,
            ];
        }

        return Inertia::render('dashboard', $data);
    }
}
