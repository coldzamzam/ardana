<?php

namespace App\Listeners;

use App\Events\TorSubmitted;
use App\Models\DatabaseNotification;
use App\Models\Submisi;
use App\Models\User;
use App\Notifications\SubmissionSubmitted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendSubmissionNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(TorSubmitted $event): void
    {
        $submisi = $event->submisi;
        Log::info('SendSubmissionNotification listener berjalan untuk submisi ID: ' . $submisi->id);

        // --- IDEMPOTENCY CHECK ---
        $alreadyExists = DatabaseNotification::where('notifiable_type', Submisi::class)
            ->where('notifiable_id', $submisi->id)
            ->where('type', SubmissionSubmitted::class)
            ->exists();

        if ($alreadyExists) {
            Log::warning('Notifikasi SubmissionSubmitted untuk submisi ID ' . $submisi->id . ' sudah ada. Melewatkan pembuatan duplikat.');
            return;
        }
        // --- END IDEMPOTENCY CHECK ---
        
        // Cari semua user yang memiliki peran 'admin'
        $reviewers = User::whereHas('roles', function ($query) {
            $query->where('role_name', 'admin');
        })->get();
        
        Log::info('Menemukan ' . $reviewers->count() . ' reviewer dengan peran "admin".');

        if ($reviewers->isEmpty()) {
            Log::warning('Tidak ada user dengan peran "admin" yang ditemukan untuk dikirimi notifikasi.');
            return;
        }

        $notificationData = (new SubmissionSubmitted($submisi))->toArray($submisi);

        Log::info('Data notifikasi yang akan disimpan:', $notificationData);

        foreach ($reviewers as $reviewer) {
            DatabaseNotification::create([
                'user_id' => $reviewer->id,
                'type' => SubmissionSubmitted::class,
                'notifiable_type' => Submisi::class,
                'notifiable_id' => $submisi->id,
                'data' => $notificationData, // Model akan handle json encode
            ]);
            Log::info('Notifikasi DIBUAT di database untuk user ID: ' . $reviewer->id);
        }
    }
}
