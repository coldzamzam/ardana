<?php

namespace App\Http\Controllers;

use App\Models\DetailSubmisi;
use App\Models\StatusSubmisi;
use App\Models\Submisi;
use App\Models\User;
use App\Models\KegiatanType;
use App\Models\StatusType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class TorController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'kegiatan_type_id' => 'required|uuid|exists:kegiatan_types,id',
        ]);

        Submisi::create([
            'judul' => $request->judul,
            'kegiatan_type_id' => $request->kegiatan_type_id,
            'type' => 'TOR',
            'created_by' => Auth::id(),
        ]);

        return Redirect::route('tor')->with('success', 'TOR berhasil dibuat.');
    }

    public function show(Request $request, Submisi $submisi)
    {
        $submisi->load('anggotaTim.user.mahasiswa', 'statusSubmisi.statusType', 'indikatorKinerja', 'submisiFile', 'biaya', 'detailSubmisi', 'kegiatanType', 'createdBy');

        $rolesToInclude = ['dosen', 'sekjur', 'kajur'];
        $dosens = User::whereHas('roles', function ($q) use ($rolesToInclude) {
            $q->whereIn(DB::raw('TRIM(role_name)'), $rolesToInclude);
        })
            ->with('dosen')
            ->get()
            ->map(function ($user) {
                if ($user->dosen) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'nip' => $user->dosen->nip,
                    ];
                }
                return null;
            })->filter()->values();

        $kegiatanTypes = KegiatanType::all();

        return Inertia::render('tor/detail', [
            'submisi' => $submisi,
            'dosens' => $dosens,
            'kegiatanTypes' => $kegiatanTypes,
        ]);
    }

    public function update(Request $request, Submisi $submisi)
    {
        $request->validate([
            'judul' => 'sometimes|required|string|max:255',
            'kegiatan_type_id' => 'sometimes|required|uuid|exists:kegiatan_types,id',
        ]);

        $submisi->update($request->all());

        return Redirect::back()->with('success', 'TOR berhasil diperbarui.');
    }

    public function updateDetail(Request $request, Submisi $submisi)
    {
        $validatedData = $request->validate([
            'indikator_kinerja' => 'required|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'gambaran_umum' => 'required|string',
            'tujuan' => 'required|string',
            'manfaat' => 'required|string',
            'metode_pelaksanaan' => 'required|string',
            'waktu_pelaksanaan' => 'required|string',
            'pic_id' => 'required|string|exists:users,id',
        ]);

        $dbData = [
            'iku' => $validatedData['indikator_kinerja'],
            'tanggal_mulai' => $validatedData['tanggal_mulai'],
            'tanggal_selesai' => $validatedData['tanggal_selesai'],
            'gambaran_umum' => $validatedData['gambaran_umum'],
            'tujuan' => $validatedData['tujuan'],
            'manfaat' => $validatedData['manfaat'],
            'metode_pelaksanaan' => $validatedData['metode_pelaksanaan'],
            'waktu_pelaksanaan' => $validatedData['waktu_pelaksanaan'],
            'pic_id' => $validatedData['pic_id'],
        ];

        DetailSubmisi::updateOrCreate(
            ['submisi_id' => $submisi->id],
            $dbData
        );

        return Redirect::back()->with('success', 'Detail TOR berhasil disimpan.');
    }

    public function verifikasi()
    {
        $tors = Submisi::with('statusSubmisi.statusType')
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

        $statusNama = $request->action === 'approve' ? 'Disetujui' : 'Ditolak';
        $statusType = StatusType::where('nama', $statusNama)->firstOrFail();

        StatusSubmisi::create([
            'submisi_id' => $submisi->id,
            'status_type_id' => $statusType->id,
            'created_by' => Auth::id(),
        ]);

        return Redirect::back()->with('success', 'Status TOR berhasil diperbarui.');
    }

    public function submit(Request $request, Submisi $submisi)
    {
        // Pastikan detail submisi sudah diisi
        if (!$submisi->detailSubmisi) {
            return Redirect::back()->with('error', 'Detail TOR harus diisi lengkap sebelum diajukan.');
        }

        $statusType = StatusType::where('nama', 'Diajukan')->firstOrFail();

        StatusSubmisi::create([
            'submisi_id' => $submisi->id,
            'detail_submisi_id' => $submisi->detailSubmisi->id,
            'status_type_id' => $statusType->id,
            'created_by' => Auth::id(),
        ]);

        return Redirect::route('tor')->with('success', 'TOR berhasil diajukan.');
    }
}
