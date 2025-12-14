<?php

namespace App\Http\Controllers;

use App\Models\KegiatanType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KegiatanTypeController extends Controller
{
    public function index()
    {
        $kegiatanTypes = KegiatanType::all();

        return Inertia::render('Admin/KegiatanType/Index', [
            'kegiatanTypes' => $kegiatanTypes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
        ]);

        KegiatanType::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, KegiatanType $kegiatanType)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
        ]);

        $kegiatanType->update($validated);

        return redirect()->back();
    }

    public function destroy(KegiatanType $kegiatanType)
    {
        $kegiatanType->delete();

        return redirect()->back();
    }
}
