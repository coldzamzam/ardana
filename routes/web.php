<?php

use App\Http\Controllers\OnboardingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::post('/onboarding/mahasiswa', [OnboardingController::class, 'storeMahasiswa'])->name('onboarding.mahasiswa.store');
    Route::post('/onboarding/dosen', [OnboardingController::class, 'storeDosen'])->name('onboarding.dosen.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
