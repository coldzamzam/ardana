<?php

namespace App\Http\Controllers;

use App\Models\Biaya;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;

class BiayaController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'biaya_satuan' => 'required|integer|min:0|max:999999999',
            'satuan' => 'required|string|max:10',
            'jumlah_kali' => 'required|integer|min:0|max:999',
            'jumlah_org' => 'required|integer|min:0|max:999',
            'deskripsi' => 'required|string',
            'submisi_id' => 'required|string|exists:submisi,id',
        ]);

        Biaya::create([
            'type' => 'TOR',
            'biaya_satuan' => $request->biaya_satuan,
            'satuan' => Str::upper($request->satuan),
            'jumlah_kali' => $request->jumlah_kali,
            'jumlah_org' => $request->jumlah_org,
            'deskripsi' => $request->deskripsi,
            'submisi_id' => $request->submisi_id,
        ]);

        return Redirect::back()->with('success', 'Anggaran Biaya berhasil ditambahkan.');
    }

    public function update(Request $request, Biaya $biaya)
    {
        $request->validate([
            'biaya_satuan' => 'required|integer|min:0|max:999999999',
            'satuan' => 'required|string|max:10',
            'jumlah_kali' => 'required|integer|min:0|max:999',
            'jumlah_org' => 'required|integer|min:0|max:999',
            'deskripsi' => 'required|string',
        ]);

        $data = $request->all();
        $data['satuan'] = Str::upper($data['satuan']);

        $biaya->update($data);

        return Redirect::back()->with('success', 'Anggaran Biaya berhasil diperbarui.');
    }

    public function destroy(Biaya $biaya)
    {
        $biaya->delete();

        return Redirect::back()->with('success', 'Anggaran Biaya berhasil dihapus.');
    }
}
