<?php

namespace App\Http\Controllers;

use App\Models\Submisi;
use Inertia\Inertia;

class ArsipController extends Controller
{
    public function index()
    {
        $arsip = Submisi::with([
            'createdBy',
            'kegiatanType',
            'indikatorKinerja',
            'detailSubmisi',
        ])
            ->whereHas('statusSubmisi', function ($q) {
                $q->whereHas('statusType', function ($q2) {
                    $q2->where('nama', 'Disetujui');
                });
            })
            ->select('*')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Arsip/Index', [
            'arsip' => $arsip,
        ]);
    }
}
