<?php

namespace App\Http\Controllers;

use App\Models\Biaya;
use App\Models\Submisi;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Fetch data for reviewer roles (admin, sekjur, kajur).
     */
    private function getReviewerData(): array
    {
        // 1. Submission Statistics
        $statusCounts = Submisi::with('latestStatus.statusType')
            ->whereHas('latestStatus.statusType')
            ->whereIn('type', ['TOR', 'LPJ'])
            ->get()
            ->groupBy('type')
            ->map(function ($submissions) {
                return $submissions->groupBy(function ($sub) {
                    return trim($sub->latestStatus->statusType->nama);
                })->map->count();
            });

        $torStats = $statusCounts->get('TOR', collect());
        $lpjStats = $statusCounts->get('LPJ', collect());

        // 2. Financials
        $calculateTotal = function (string $type) {
            return Biaya::where('type', $type)
                ->whereHas('submisi.latestStatus.statusType', function ($query) {
                    $query->where('nama', 'Disetujui');
                })
                ->sum(DB::raw('biaya_satuan * jumlah_kali * jumlah_org'));
        };

        $totalAlokasi = $calculateTotal('TOR');
        $totalRealisasi = $calculateTotal('LPJ');

        // 3. Submission Activity Chart (Last 6 months)
        $activity = Submisi::selectRaw("type, TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as count")
            ->whereHas('latestStatus.statusType', function ($query) {
                $query->where('nama', 'Disetujui');
            })
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('type', 'month')
            ->orderBy('month', 'asc')
            ->get()
            ->groupBy('type');

        $activityData = [
            'tor' => $activity->get('TOR', collect()),
            'lpj' => $activity->get('LPJ', collect()),
        ];

        return [
            'tor_stats' => $torStats,
            'lpj_stats' => $lpjStats,
            'financials' => [
                'total_alokasi' => $totalAlokasi,
                'total_realisasi' => $totalRealisasi,
            ],
            'activity' => $activityData,
        ];
    }

    /**
     * Fetch data for superadmin role.
     */
    private function getSuperadminData(): array
    {
        return [
            'total_users' => User::count(),
        ];
    }

    /**
     * Fetch data for user roles (mahasiswa, dosen).
     */
    private function getUserData(User $user): array
    {
        $submissions = Submisi::where('created_by', $user->id)
            ->with('latestStatus.statusType')
            ->get();

        $stats = $submissions->groupBy('type')->map(function ($items, $type) {
            $approved = $items->filter(function ($sub) {
                return $sub->latestStatus && $sub->latestStatus->statusType && trim($sub->latestStatus->statusType->nama) === 'Disetujui';
            })->count();

            // "Dibuat" is everything that isn't approved from the user's perspective.
            $created = $items->count() - $approved;

            return [
                'dibuat' => $created,
                'disetujui' => $approved,
            ];
        });

        $revisions = $submissions->filter(function ($sub) {
            return $sub->latestStatus && trim($sub->latestStatus->statusType->nama) === 'Revisi';
        })->map(function ($sub) {
            return [
                'id' => $sub->id,
                'judul' => $sub->judul,
                'type' => $sub->type,
                'keterangan' => $sub->latestStatus->keterangan,
                'updated_at' => $sub->latestStatus->created_at,
            ];
        })->values();

        return [
            'stats' => [
                'tor_dibuat' => $stats->get('TOR')['dibuat'] ?? 0,
                'lpj_dibuat' => $stats->get('LPJ')['dibuat'] ?? 0,
                'tor_disetujui' => $stats->get('TOR')['disetujui'] ?? 0,
                'lpj_disetujui' => $stats->get('LPJ')['disetujui'] ?? 0,
            ],
            'recent_revisions' => $revisions,
        ];
    }

    public function index()
    {
        $user = Auth::user();
        $role = strtolower(trim($user->roles->first()->role_name ?? ''));

        $data = [];
        if (in_array($role, ['admin', 'sekjur', 'kajur'])) {
            $data = $this->getReviewerData();
        } elseif ($role === 'superadmin') {
            $data = $this->getSuperadminData();
        } elseif (in_array($role, ['mahasiswa', 'dosen'])) {
            $data = $this->getUserData($user);
        }

        return Inertia::render('dashboard', ['dashboard_data' => $data]);
    }
}
