<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AnggotaTimController;
use App\Http\Controllers\BiayaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\IndikatorKinerjaController;
use App\Http\Controllers\KegiatanTypeController;
use App\Http\Controllers\MahasiswaController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\ReviewController; // <- dipakai
use App\Http\Controllers\SubmisiController;
use App\Http\Controllers\SubmisiFileController;
use App\Models\Submisi;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->prefix('dashboard')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    /**
     * NOTIFIKASI
     * Inertia page: resources/js/Pages/notifikasi.tsx  ->  'notifikasi'
     */
    Route::get('notifikasi', [NotificationController::class, 'index'])
        ->name('notifikasi.index');

    Route::post('notifikasi/mark-read', [NotificationController::class, 'markRead'])
        ->name('notifikasi.markRead');
    Route::post('notifikasi/mark-unread', [NotificationController::class, 'markUnread'])
        ->name('notifikasi.markUnread');
    Route::post('notifikasi/delete', [NotificationController::class, 'destroy'])
        ->name('notifikasi.delete');

    Route::get('history/{detail_submisi}', [HistoryController::class, 'show'])->name('history.show');

    Route::middleware(['role:admin,sekjur,kajur'])->group(function () {
        Route::get('review', [ReviewController::class, 'index'])->name('review.index');
        Route::get('review/{submisi}', [ReviewController::class, 'show'])->name('review.show');
        Route::post('review/{submisi}/status', [ReviewController::class, 'storeStatus'])->name('review.storeStatus');
    });

    Route::middleware(['role:mahasiswa,dosen'])->group(function () {
        // More specific routes first
        Route::post('submisi/{submisi}/draft', [SubmisiController::class, 'updateDetail'])->name('submisi.saveDraft');
        Route::post('submisi/{submisi}/new-version', [SubmisiController::class, 'storeNewVersion'])->name('submisi.newVersion');
        Route::post('submisi/{submisi}/submit', [SubmisiController::class, 'submit'])->name('submisi.submit');
        Route::get('submisi/{submisi}/template', function (\App\Models\Submisi $submisi) {
            $submisi->load('detailSubmisi');

            return Inertia::render('tor/detail-template', [
                'submisi' => $submisi,
            ]);
        })->name('submisi.template');

        // General routes
        Route::get('submisi/{type}', [SubmisiController::class, 'index'])
            ->whereIn('type', ['tor', 'lpj'])
            ->name('submisi.index');
        Route::post('submisi/{type}', [SubmisiController::class, 'store'])->whereIn('type', ['tor', 'lpj'])->name('submisi.store');
        Route::get('submisi/{submisi}', [SubmisiController::class, 'show'])->name('submisi.show');
        Route::put('submisi/{submisi}', [SubmisiController::class, 'update'])->name('submisi.update');

        // Other routes
        Route::get('arsip', function () {
            $arsip = Submisi::with([
                'kegiatanType',
                'createdBy',
                'detailSubmisi',
            ])
                ->where('type', 'TOR') // atau ->whereIn('type', ['TOR','LPJ'])
                ->whereHas('statusSubmisi', function ($q) {
                    $q->whereHas('statusType', function ($q2) {
                        $q2->where('nama', 'Disetujui');
                    });
                })
                ->orderByDesc('created_at')
                ->get();

            return Inertia::render('arsip', [
                'arsip' => $arsip,
            ]);
        })->name('arsip.index');

        Route::post('lpj/generate-from/{tor}', [SubmisiController::class, 'generateLpj'])->name('lpj.generate');

        Route::get('dosen/search', [SubmisiController::class, 'searchDosen'])->name('dosen.search');
        Route::get('mahasiswa/search', [MahasiswaController::class, 'search'])->name('mahasiswa.search');

        Route::post('anggota-tim', [AnggotaTimController::class, 'store'])->name('anggota-tim.store');
        Route::delete('anggota-tim/{anggota_tim}', [AnggotaTimController::class, 'destroy'])->name('anggota-tim.destroy');

        Route::post('indikator-kinerja', [IndikatorKinerjaController::class, 'store'])->name('indikator-kinerja.store');
        Route::put('indikator-kinerja/{indikator_kinerja}', [IndikatorKinerjaController::class, 'update'])->name('indikator-kinerja.update');
        Route::delete('indikator-kinerja/{indikator_kinerja}', [IndikatorKinerjaController::class, 'destroy'])->name('indikator-kinerja.destroy');

        Route::post('submisi-file', [SubmisiFileController::class, 'store'])->name('submisi-file.store');
        Route::put('submisi-file/{submisi_file}', [SubmisiFileController::class, 'update'])->name('submisi-file.update');
        Route::delete('submisi-file/{submisi_file}', [SubmisiFileController::class, 'destroy'])->name('submisi-file.destroy');
        Route::get('submisi-file/{submisi_file}/download', [SubmisiFileController::class, 'download'])->name('submisi-file.download');

        Route::post('biaya', [BiayaController::class, 'store'])->name('biaya.store');
        Route::put('biaya/{biaya}', [BiayaController::class, 'update'])->name('biaya.update');
        Route::delete('biaya/{biaya}', [BiayaController::class, 'destroy'])->name('biaya.destroy');

        Route::get('faq', [FaqController::class, 'index'])->name('faq.index');
    });

    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('index');
        Route::resource('faq', FaqController::class);
        Route::resource('kegiatan-type', KegiatanTypeController::class);
    });

    Route::post('/onboarding/mahasiswa', [OnboardingController::class, 'storeMahasiswa'])->name('onboarding.mahasiswa.store');
    Route::post('/onboarding/dosen', [OnboardingController::class, 'storeDosen'])->name('onboarding.dosen.store');

    Route::middleware(['role:superadmin'])->group(function () {
        Route::get('list-mahasiswa', [MahasiswaController::class, 'index'])->name('mahasiswa.index');
        Route::get('list-mahasiswa/{mahasiswa}/edit', [MahasiswaController::class, 'edit'])->name('mahasiswa.edit');
        Route::put('list-mahasiswa/{mahasiswa}', [MahasiswaController::class, 'update'])->name('mahasiswa.update');

        Route::get('list-pegawai', [PegawaiController::class, 'index'])->name('pegawai.index');
        Route::get('list-pegawai/{user}/edit', [PegawaiController::class, 'edit'])->name('pegawai.edit');
        Route::put('list-pegawai/{user}', [PegawaiController::class, 'update'])->name('pegawai.update');
    });

    require __DIR__.'/settings.php';
});

require __DIR__.'/auth.php';
