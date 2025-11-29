<?php

namespace App\Http\Controllers;

use App\Models\SubmisiFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class SubmisiFileController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'submisi_id' => 'required|exists:submisi,id',
            'file' => 'required|file|mimes:pdf,jpg,png,jpeg|max:2048',
            'deskripsi' => 'required|string',
            'nama' => 'required|string',
        ]);

        $file = $request->file('file');
        $path = $file->store('public/submisi_files/' . $request->submisi_id);

        SubmisiFile::create([
            'submisi_id' => $request->submisi_id,
            'nama' => $request->nama,
            'file_location' => $path,
            'deskripsi' => $request->deskripsi,
        ]);

        return redirect()->back()->with('success', 'File berhasil diunggah.');
    }

    public function update(Request $request, SubmisiFile $submisiFile)
    {
        $request->validate([
            'deskripsi' => 'required|string',
            'file' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:2048',
            'nama' => 'required|string',
        ]);

        if ($request->hasFile('file')) {
            // Delete old file
            if ($submisiFile->file_location) {
                Storage::delete($submisiFile->file_location);
            }

            $file = $request->file('file');
            $path = $file->store('public/submisi_files/' . $submisiFile->submisi_id);
            $submisiFile->update([
                'nama' => $request->nama,
                'file_location' => $path,
                'deskripsi' => $request->deskripsi,
            ]);
        } else {
            $submisiFile->update([
                'nama' => $request->nama,
                'deskripsi' => $request->deskripsi,
            ]);
        }

        return redirect()->back()->with('success', 'File berhasil diperbarui.');
    }

    public function destroy(SubmisiFile $submisiFile)
    {
        $submisiFile->delete();

        return redirect()->back()->with('success', 'File berhasil dihapus.');
    }

    public function download(SubmisiFile $submisiFile)
    {
        $submisiFile->load('submisi');
        $user = Auth::user();

        $isCreator = $user->id === $submisiFile->submisi->created_by;

        $verifierRoles = ['admin', 'sekjur', 'kajur'];
        $isVerifier = false;
        foreach ($verifierRoles as $role) {
            if ($user->hasRole($role)) {
                $isVerifier = true;
                break;
            }
        }

        if (!$isCreator && !$isVerifier) {
            abort(403, 'Anda tidak memiliki izin untuk mengakses file ini.');
        }

        if (!Storage::exists($submisiFile->file_location)) {
            abort(404, 'File tidak ditemukan.');
        }

        return Storage::response($submisiFile->file_location, $submisiFile->nama);
    }
}
