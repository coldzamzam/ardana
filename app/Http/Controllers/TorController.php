<?php

namespace App\Http\Controllers;

use App\Models\StatusSubmisi;
use App\Models\Submisi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class TorController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'jenis_kegiatan' => 'required|string|max:100',
        ]);

        Submisi::create([
            'judul' => $request->judul,
            'jenis_kegiatan' => $request->jenis_kegiatan,
            'type' => 'TOR',
            'created_by' => Auth::id(),
        ]);

        return Redirect::route('tor')->with('success', 'TOR berhasil dibuat.');
    }

    public function show(Request $request, Submisi $submisi)
    {
        $draft = $request->session()->get('tor_draft_'.$submisi->id, []);

        return Inertia::render('tor/detail', [
            'submisi' => $submisi,
            'draft' => $draft,
        ]);
    }

    public function update(Request $request, Submisi $submisi)
    {
        $request->validate([
            'judul' => 'sometimes|required|string|max:255',
            'jenis_kegiatan' => 'sometimes|required|string|max:100',
        ]);

        $submisi->update($request->all());

        return Redirect::back()->with('success', 'TOR berhasil diperbarui.');
    }

    public function saveDraft(Request $request, Submisi $submisi)
    {
        $request->session()->put('tor_draft_'.$submisi->id, $request->all());

        return Redirect::back()->with('success', 'Draft berhasil disimpan.');
    }

    public function verifikasi()
    {
        $tors = Submisi::with('statusSubmisi')
            ->where('type', 'TOR')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('verifikasi/index', ['tors' => $tors]);
    }

    public function approveOrReject(Request $request, Submisi $submisi)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
        ]);

        $status = $request->action === 'approve' ? 'Disetujui' : 'Ditolak';

        StatusSubmisi::create([
            'submisi_id' => $submisi->id,
            'status' => $status,
            'created_by' => Auth::id(),
        ]);

        return Redirect::back()->with('success', 'Status TOR berhasil diperbarui.');
    }
}
