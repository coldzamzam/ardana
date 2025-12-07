<?php

namespace App\Http\Controllers;

use App\Models\AnggotaTim;
use App\Models\Mahasiswa;
use App\Models\Submisi;
use App\Models\User as UserModel;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MahasiswaController extends Controller
{
    public function index(Request $request)
    {
        $users = UserModel::whereHas('roles', function ($query) {
            $query->where('role_name', 'mahasiswa');
        })
            ->whereNull('deleted_at')
            ->with('mahasiswa', 'roles')
            ->get();

        return Inertia::render('Mahasiswa/Index', [
            'users' => $users,
        ]);
    }

    public function edit(Mahasiswa $mahasiswa)
    {
        $mahasiswa->load('user');

        return Inertia::render('Mahasiswa/Edit', [
            'mahasiswa' => $mahasiswa,
        ]);
    }

    public function update(Request $request, Mahasiswa $mahasiswa)
    {
        $user = $mahasiswa->user;

        $prodiOptions = [
            'Teknik Informatika',
            'Teknik Multimedia Digital',
            'Teknik Multimedia Jaringan',
            'Teknik Konstruksi Jaringan',
        ];

        $request->validate([
            'name' => 'required|string|max:255',
            'nim' => ['required', 'string', 'max:255', Rule::unique('mahasiswa')->ignore($mahasiswa->id)],
            'prodi' => ['required', 'string', Rule::in($prodiOptions)],
        ]);

        $user->update([
            'name' => $request->name,
        ]);

        $mahasiswa->update([
            'nim' => $request->nim,
            'prodi' => $request->prodi,
        ]);

        return redirect()->route('mahasiswa.index')->with('success', 'Data mahasiswa berhasil diperbarui.');
    }

    public function search(Request $request)
    {
        $request->validate(
            [
                'nim' => 'required|string',
                'submisi_id' => 'required|string|exists:submisi,id',
            ],
            [
                'nim.required' => 'NIM tidak boleh kosong.',
            ]
        );

        $nim = $request->input('nim');
        $submisiId = $request->input('submisi_id');
        $submisi = Submisi::findOrFail($submisiId);

        $mahasiswaUser = UserModel::whereHas('mahasiswa', function ($q) use ($nim) {
            $q->where('nim', $nim);
        })
            ->with('mahasiswa')
            ->first();

        if (! $mahasiswaUser) {
            return response()->json(['message' => 'Data NIM tidak ditemukan'], 404);
        }

        if ($mahasiswaUser->id == $submisi->created_by) {
            return response()->json(['message' => 'Peserta adalah pembuat TOR.'], 404);
        }

        $isAlreadyAnggota = AnggotaTim::where('submisi_id', $submisiId)
            ->where('anggota_id', $mahasiswaUser->id)
            ->whereNull('deleted_at')
            ->exists();

        if ($isAlreadyAnggota) {
            return response()->json(['message' => 'Peserta telah terdaftar.'], 404);
        }

        return response()->json([
            'id' => $mahasiswaUser->id,
            'name' => $mahasiswaUser->name,
            'nim' => $mahasiswaUser->mahasiswa->nim,
            'prodi' => $mahasiswaUser->mahasiswa->prodi,
        ]);
    }
}
