<?php

// app/Http/Controllers/NotificationController.php

namespace App\Http\Controllers;

use App\Models\Submisi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $submissions = Submisi::with(['statusSubmisi.statusType', 'kegiatanType'])
            ->where('created_by', $userId)
            ->where('is_archived', false) // jangan tampilkan yang sudah diarsip
            ->orderBy('created_at', 'desc')
            ->get();

        $notifications = $submissions->map(function ($submisi) {
            $latestStatus = $submisi->statusSubmisi
                ? $submisi->statusSubmisi->sortByDesc('created_at')->first()
                : null;

            return [
                'id' => $submisi->id,
                'title' =>
                    $submisi->judul_tor
                    ?? $submisi->judul_kegiatan
                    ?? $submisi->nama_kegiatan
                    ?? $submisi->nama
                    ?? 'Pengajuan Kegiatan',
                'indikator_kinerja' => optional($submisi->kegiatanType)->nama ?? '-',
                'tahun' => (int) ($submisi->tahun ?? $submisi->created_at->year),
                'dana_diajukan' => $submisi->total_biaya ?? '-',
                'status_pengajuan' => optional(optional($latestStatus)->statusType)->name ?? '-',
                'category' => $submisi->type === 'TOR' ? 'pengajuan' : 'sistem',
                'is_read' => (bool) $submisi->is_read,
                'is_starred' => false, // kalau mau, bisa tambahkan kolom is_starred juga
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

    public function markRead(Request $request)
    {
        $ids = $request->input('ids', []);
        Submisi::whereIn('id', $ids)
            ->where('created_by', Auth::id())
            ->update(['is_read' => true]);

        return back();
    }

    public function markUnread(Request $request)
    {
        $ids = $request->input('ids', []);
        Submisi::whereIn('id', $ids)
            ->where('created_by', Auth::id())
            ->update(['is_read' => false]);

        return back();
    }

    public function archive(Request $request)
    {
        $ids = $request->input('ids', []);
        Submisi::whereIn('id', $ids)
            ->where('created_by', Auth::id())
            ->update(['is_archived' => true]);

        return back();
    }

    public function destroy(Request $request)
    {
        $ids = $request->input('ids', []);
        Submisi::whereIn('id', $ids)
            ->where('created_by', Auth::id())
            ->delete();

        return back();
    }
}
