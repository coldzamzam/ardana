<?php

namespace App\Http\Controllers;

use App\Models\MataKuliah;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MataKuliahController extends Controller
{
    public function index()
    {
        $mataKuliahs = MataKuliah::all();

        return Inertia::render('Admin/MataKuliah/Index', [
            'mataKuliahs' => $mataKuliahs,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'semester' => 'required|integer|min:1|max:8',
            'sks' => 'required|integer|min:1|max:6',
        ]);

        MataKuliah::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, MataKuliah $mataKuliah)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'semester' => 'required|integer|min:1|max:8',
            'sks' => 'required|integer|min:1|max:6',
        ]);

        $mataKuliah->update($validated);

        return redirect()->back();
    }

    public function destroy(MataKuliah $mataKuliah)
    {
        $mataKuliah->delete();

        return redirect()->back();
    }
}
