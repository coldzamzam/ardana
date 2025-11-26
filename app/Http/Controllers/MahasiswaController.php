<?php

namespace App\Http\Controllers;

use App\Models\AnggotaTim;
use App\Models\Mahasiswa;
use App\Models\Submisi;
use App\Models\User as UserModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->roles->pluck('role_name')->implode(', '),
                    'prodi' => $user->mahasiswa->prodi ?? 'N/A',
                ];
            });

        return Inertia::render('Mahasiswa/Index', [
            'users' => $users,
        ]);
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

        if (!$mahasiswaUser) {
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
