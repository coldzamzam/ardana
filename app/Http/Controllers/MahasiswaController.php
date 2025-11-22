<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MahasiswaController extends Controller
{
    public function index(Request $request)
    {
        $users = User::whereHas('roles', function ($query) {
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
}
