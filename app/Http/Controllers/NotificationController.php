<?php

namespace App\Http\Controllers;

use App\Models\Submisi;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
public function index()
{
    $userId = Auth::id();

    $submissions = Submisi::with(['statusSubmisi.statusType', 'kegiatanType'])
        ->where('created_by', $userId)
        ->orderBy('created_at', 'desc')
        ->get();

    $notifications = $submissions->map(function ($submisi) {
        // ambil status terakhir (mis. berdasarkan created_at atau urutan koleksi)
        $latestStatus = $submisi->statusSubmisi
            ? $submisi->statusSubmisi->sortByDesc('created_at')->first()
            : null;

        return [
            'id' => $submisi->id,
            'title' => $submisi->judul_kegiatan
                ?? $submisi->nama_kegiatan
                ?? 'Pengajuan Kegiatan',

            'indikator_kinerja' => optional($submisi->kegiatanType)->nama ?? '-',

            'tahun' => (int) ($submisi->tahun ?? $submisi->created_at->year),

            'dana_diajukan' => $submisi->total_biaya ?? '-',

            // ⬇️ ini yang tadinya error
            'status_pengajuan' => optional(optional($latestStatus)->statusType)->name ?? '-',

            'category' => $submisi->type === 'TOR' ? 'pengajuan' : 'sistem',

            'is_read' => true,
            'is_starred' => false,

            'created_at' => $submisi->created_at->toIso8601String(),
        ];
    });

    $years = $submissions
        ->pluck('tahun')
        ->filter()
        ->unique()
        ->sort()
        ->values()
        ->all();

    return Inertia::render('notifikasi', [
        'notifications' => $notifications,
        'years' => $years,
    ]);
}

}
