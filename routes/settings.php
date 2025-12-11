<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit')
        ->middleware([CheckRole::class.':superadmin,admin,sekjur,kajur,dosen']);

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware(['throttle:6,1', CheckRole::class.':superadmin,admin,sekjur,kajur,dosen'])
        ->name('password.update');

    // Route::get('settings/appearance', function () {
    //     return Inertia::render('settings/appearance');
    // })->name('appearance.edit');
});
