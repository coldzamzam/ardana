<?php

namespace App\Http\Controllers;

use App\Models\Dosen;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class OnboardingController extends Controller
{
    public function storeMahasiswa(Request $request)
    {
        $request->validate([
            'nim' => 'required|regex:/^[0-9]{10}$/|unique:mahasiswa,nim',
            'prodi' => ['required', Rule::in(['Teknik Informatika', 'Teknik Multimedia Digital', 'Teknik Multimedia Jaringan', 'Teknik Konstruksi Jaringan'])],
        ]);

        Mahasiswa::create([
            'user_id' => Auth::id(),
            'nim' => $request->nim,
            'prodi' => $request->prodi,
        ]);

        return redirect()->route('dashboard');
    }

    public function storeDosen(Request $request)
    {
        $request->validate([
            'nip' => 'required|regex:/^[0-9]{18}$/|unique:dosen,nip',
        ]);

        Dosen::create([
            'user_id' => Auth::id(),
            'nip' => $request->nip,
        ]);

        return redirect()->route('dashboard');
    }
}