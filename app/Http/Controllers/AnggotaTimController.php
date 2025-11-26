<?php

namespace App\Http\Controllers;

use App\Models\AnggotaTim;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;

class AnggotaTimController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'submisi_id' => 'required|string|exists:submisi,id',
            'anggota_id' => 'required|string|exists:users,id',
        ]);

        $anggotaTim = new AnggotaTim;
        $anggotaTim->id = Str::uuid();
        $anggotaTim->submisi_id = $request->submisi_id;
        $anggotaTim->anggota_id = $request->anggota_id;
        $anggotaTim->save();

        return Redirect::back()->with('success', 'Anggota berhasil ditambahkan.');
    }


    public function destroy(AnggotaTim $anggota_tim)
    {
        $anggota_tim->delete();

        return Redirect::back()->with('success', 'Anggota berhasil dihapus.');
    }
}
