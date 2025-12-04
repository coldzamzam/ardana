<?php

use App\Http\Controllers\MahasiswaController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\AnggotaTimController;
use App\Http\Controllers\TorController;
use App\Http\Controllers\IndikatorKinerjaController;
use App\Http\Controllers\SubmisiFileController;
use App\Http\Controllers\BiayaController;
use App\Http\Controllers\NotificationController; // <- dipakai
use App\Models\KegiatanType;
use App\Models\Submisi;
use Illuminate\Support\Facades\Auth;
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

    Route::middleware(['role:admin,sekjur,kajur'])->group(function () {
        Route::get('verifikasi', [TorController::class, 'verifikasi'])->name('verifikasi.index');
        Route::post('verifikasi/{submisi}', [TorController::class, 'approveOrReject'])->name('verifikasi.approveOrReject');
    });

    Route::middleware(['role:mahasiswa,dosen'])->group(function () {
        Route::get('tor', function () {
            $tors = Submisi::with('statusSubmisi.statusType', 'kegiatanType', 'createdBy')
                ->where('created_by', Auth::id())
                ->where('type', 'TOR')
                ->orderBy('created_at', 'desc')
                ->get();

            $kegiatanTypes = KegiatanType::all();

            return Inertia::render('tor/index', [
                'tors' => $tors,
                'kegiatanTypes' => $kegiatanTypes,
            ]);
        })->name('tor');

        Route::post('tor', [TorController::class, 'store'])->name('tor.store');
        Route::get('tor/{submisi}', [TorController::class, 'show'])->name('tor.show');
        Route::put('tor/{submisi}', [TorController::class, 'update'])->name('tor.update');
        Route::post('tor/{submisi}/draft', [TorController::class, 'updateDetail'])->name('tor.saveDraft');
        Route::post('tor/{submisi}/submit', [TorController::class, 'submit'])->name('tor.submit');

        Route::get('dosen/search', [TorController::class, 'searchDosen'])->name('dosen.search');
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

        Route::get('lpj', function () {
            return Inertia::render('lpj');
        })->name('lpj');
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

    require __DIR__ . '/settings.php';
});

require __DIR__ . '/auth.php';
