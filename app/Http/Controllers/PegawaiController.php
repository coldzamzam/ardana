<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PegawaiController extends Controller
{
    public function index(Request $request)
    {
        $users = User::whereHas('roles', function ($query) {
            $query->whereIn('role_name', ['admin', 'dosen', 'kajur', 'sekjur']);
        })
            ->whereNull('deleted_at')
            ->with('roles')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->roles->pluck('role_name')->implode(', '),
                ];
            });

        return Inertia::render('Pegawai/Index', [
            'users' => $users,
        ]);
    }
}
