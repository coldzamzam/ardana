<?php

namespace App\Http\Controllers;

use App\Models\Submisi;
use Barryvdh\DomPDF\Facade\Pdf;

class TorPdfController extends Controller
{
    public function exportPdf(Submisi $submisi)
    {
        // Load relationships needed for the PDF
        $submisi->load([
            'detailSubmisi',
            'indikatorKinerja',
            'biaya',
            'anggotaTim.user.mahasiswa',
            'submisiFile',
        ]);

        $detail = $submisi->detailSubmisi;

        // --- Helper Helpers for View ---

        // 1. Periode Pelaksanaan
        $mulai = $detail?->tanggal_mulai ? \Carbon\Carbon::parse($detail->tanggal_mulai) : null;
        $selesai = $detail?->tanggal_selesai ? \Carbon\Carbon::parse($detail->tanggal_selesai) : null;

        $periode = '-';
        if ($mulai && $selesai) {
            $periode = $mulai->isoFormat('D MMMM Y').' s.d. '.$selesai->isoFormat('D MMMM Y');
        } elseif ($mulai) {
            $periode = $mulai->isoFormat('D MMMM Y');
        }

        // 2. PIC Name & NIP
        $picName = $detail?->pic_name ?? '-';
        $picNip = $detail?->pic_nip ?? '-';

        // Fallback logic matches the frontend getPicNama() / getPicNip()
        if ($picName === '-' && ! empty($detail?->pic)) {
            // Check if pic is JSON/array or string
            if (is_string($detail->pic)) {
                $picName = $detail->pic;
            } elseif (is_array($detail->pic) || is_object($detail->pic)) {
                $obj = (object) $detail->pic;
                $picName = $obj->name ?? '-';
                $picNip = $obj->nip ?? $obj->dosen->nip ?? '-';
            }
        }

        // Render PDF
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.tor', [
            'submisi' => $submisi,
            'detail' => $detail,
            'periode' => $periode,
            'picName' => $picName,
            'picNip' => $picNip,
        ]);

        // Setup paper
        $pdf->setPaper('a4', 'portrait');

        // Filename
        $safeTitle = preg_replace('/[^A-Za-z0-9\- ]/', '', $submisi->judul);
        $filename = 'TOR - '.substr($safeTitle, 0, 50).'.pdf';

        return $pdf->download($filename);
    }
}
