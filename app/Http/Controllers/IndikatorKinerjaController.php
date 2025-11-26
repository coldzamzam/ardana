<?php

namespace App\Http\Controllers;

use App\Models\IndikatorKinerja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;

class IndikatorKinerjaController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'bulan' => 'required|string',
            'keberhasilan' => 'required|string',
            'target' => 'required|integer|min:1|max:100',
            'submisi_id' => 'required|string|exists:submisi,id',
        ]);

        IndikatorKinerja::create([
            'id' => Str::uuid(),
            'bulan' => $request->bulan,
            'keberhasilan' => $request->keberhasilan,
            'target' => $request->target,
            'submisi_id' => $request->submisi_id,
        ]);

        return Redirect::back()->with('success', 'Indikator Kinerja berhasil ditambahkan.');
    }

    public function update(Request $request, IndikatorKinerja $indikator_kinerja)
    {
        $request->validate([
            'bulan' => 'required|string',
            'keberhasilan' => 'required|string',
            'target' => 'required|integer|min:1|max:100',
        ]);

        $indikator_kinerja->update($request->all());

        return Redirect::back()->with('success', 'Indikator Kinerja berhasil diperbarui.');
    }

    public function destroy(IndikatorKinerja $indikator_kinerja)
    {
        $indikator_kinerja->delete();

        return Redirect::back()->with('success', 'Indikator Kinerja berhasil dihapus.');
    }
}
