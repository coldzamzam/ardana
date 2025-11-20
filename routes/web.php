<?php

use App\Http\Controllers\OnboardingController;
use App\Models\Submisi;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('tor', function () {
        $tors = Submisi::with('statusSubmisi')
            ->where('created_by', Auth::id())
            ->where('type', 'TOR')
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('tor', ['tors' => $tors]);
    })->name('tor');

    Route::post('tor', [\App\Http\Controllers\TorController::class, 'store'])->name('tor.store');

    Route::get('lpj', function () {
        return Inertia::render('lpj');
    })->name('lpj');

    Route::post('/onboarding/mahasiswa', [OnboardingController::class, 'storeMahasiswa'])->name('onboarding.mahasiswa.store');
    Route::post('/onboarding/dosen', [OnboardingController::class, 'storeDosen'])->name('onboarding.dosen.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
