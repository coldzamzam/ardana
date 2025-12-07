<?php

namespace App\Http\Controllers;

use App\Models\Dosen;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
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
            ->get();

        return Inertia::render('Pegawai/Index', [
            'users' => $users,
        ]);
    }

    public function edit(User $user)
    {
        $user->load('roles', 'dosen');

        return Inertia::render('Pegawai/Edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $user->update([
            'name' => $request->name,
        ]);

        $isDosen = $user->hasRole('dosen') || $user->hasRole('kajur') || $user->hasRole('sekjur');

        if ($isDosen) {
            $request->validate([
                'nip' => ['required', 'string', 'max:255', Rule::unique('dosen')->ignore($user->dosen->id ?? null)],
            ]);

            Dosen::updateOrCreate(
                ['user_id' => $user->id],
                ['nip' => $request->nip]
            );
        }

        return redirect()->route('pegawai.index')->with('success', 'Data pegawai berhasil diperbarui.');
    }
}
