<?php

namespace App\Http\Controllers;

use App\Events\SubmissionReviewed;
use App\Models\StatusSubmisi;
use App\Models\StatusType;
use App\Models\Submisi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $role = trim($user->roles()->first()->role_name);
        Log::info('Review index for user role: '.$role);

        // Tentukan status yang harus direview berdasarkan peran
        $statusToReviewName = match ($role) {
            'admin' => 'Diajukan',
            'sekjur' => 'Divalidasi',
            'kajur' => 'Diverifikasi',
            default => null,
        };

        $pageTitle = match ($role) {
            'admin' => 'Validasi TOR',
            'sekjur' => 'Verifikasi TOR',
            'kajur' => 'Persetujuan TOR',
            default => 'Review Submisi',
        };

        // Jika peran tidak memiliki status untuk direview, kembalikan halaman kosong
        if (! $statusToReviewName) {
            Log::warning('Peran "'.$role.'" tidak memiliki status untuk direview.');

            return Inertia::render('review/index', [
                'submissions' => (object) ['data' => []],
                'pageTitle' => $pageTitle,
            ]);
        }

        Log::info('Mencari submisi dengan status terbaru: '.$statusToReviewName);
        $statusToReview = StatusType::where('nama', $statusToReviewName)->first();

        if (! $statusToReview) {
            Log::error('StatusType tidak ditemukan untuk nama: '.$statusToReviewName);

            return Inertia::render('review/index', [
                'submissions' => (object) ['data' => []],
                'pageTitle' => $pageTitle,
            ]);
        }
        Log::info('Status ID yang dicari: '.$statusToReview->id);

        // Query untuk mendapatkan submisi dimana status terbarunya adalah status yang perlu direview
        $query = Submisi::whereHas('statusSubmisi', function ($query) use ($statusToReview) {
            $query->where('id', function ($subQuery) {
                $subQuery->select('id')
                    ->from('status_submisi')
                    ->whereColumn('submisi_id', 'submisi.id')
                    ->latest()
                    ->limit(1);
            })->where('status_type_id', $statusToReview->id);
        })
            ->with(['kegiatanType', 'createdBy'])
            ->orderBy('created_at', 'desc');

        Log::info('SQL Query:', ['sql' => $query->toSql(), 'bindings' => $query->getBindings()]);

        $submissions = $query->paginate(10);
        Log::info('Menemukan '.$submissions->total().' submisi.');

        return Inertia::render('review/index', [
            'submissions' => $submissions,
            'pageTitle' => $pageTitle,
        ]);
    }

    public function show(Submisi $submisi)
    {
        $user = Auth::user();
        $roleIds = $user->roles()->pluck('role_types.id');

        // Ambil status yang tersedia untuk peran pengguna saat ini
        $availableStatuses = StatusType::whereHas('roles', function ($query) use ($roleIds) {
            $query->whereIn('role_type_id', $roleIds);
        })->get();

        $submisi->load('detailSubmisi.pic', 'anggotaTim.user.mahasiswa', 'kegiatanType', 'createdBy', 'statusSubmisi.statusType', 'biaya', 'submisiFile');

        return Inertia::render('review/detail', [
            'submisi' => $submisi,
            'availableStatuses' => $availableStatuses,
        ]);
    }

    public function storeStatus(Request $request, Submisi $submisi)
    {
        $user = Auth::user();
        $roleIds = $user->roles()->pluck('role_types.id');

        // Validasi bahwa status_type_id yang dipilih adalah salah satu yang diizinkan untuk peran pengguna
        $request->validate([
            'status_type_id' => [
                'required',
                'uuid',
                Rule::exists('status_type_roles', 'status_type_id')->whereIn('role_type_id', $roleIds),
            ],
            'keterangan' => 'nullable|string',
        ]);

        $statusType = StatusType::find($request->status_type_id);

        // Validasi tambahan: jika statusnya 'Revisi' atau 'Ditolak', keterangan wajib diisi
        if (in_array($statusType->nama, ['Revisi', 'Ditolak'])) {
            $request->validate([
                'keterangan' => 'required|string',
            ]);
        }

        $newStatus = StatusSubmisi::create([
            'submisi_id' => $submisi->id,
            'detail_submisi_id' => $submisi->detailSubmisi->id,
            'status_type_id' => $request->status_type_id,
            'created_by' => $user->id,
            'keterangan' => $request->keterangan,
        ]);

        // Dispatch event
        Log::info('Akan men-dispatch SubmissionReviewed event...');
        SubmissionReviewed::dispatch($submisi, $newStatus);
        Log::info('SubmissionReviewed event telah di-dispatch.');

        return Redirect::route('review.index')->with('success', 'Status submisi berhasil diperbarui.');
    }
}
