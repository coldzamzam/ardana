<?php

namespace App\Listeners;

use App\Events\SubmissionReviewed;
use App\Models\DatabaseNotification;
use App\Models\StatusSubmisi;
use App\Models\Submisi;
use App\Models\User;
use App\Notifications\SubmissionReviewedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendReviewedNotification
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
    public function handle(SubmissionReviewed $event): void
    {
        $submisi = $event->submisi;
        $newStatus = $event->statusSubmisi;
        $submisiCreator = $submisi->createdBy;

        // --- IDEMPOTENCY CHECK ---
        $alreadyExists = DatabaseNotification::where('notifiable_type', StatusSubmisi::class)
            ->where('notifiable_id', $newStatus->id)
            ->where('user_id', $submisiCreator->id)
            ->exists();

        if ($alreadyExists) {
            Log::warning("Notifikasi untuk StatusSubmisi ID {$newStatus->id} sudah ada. Melewatkan pembuatan duplikat.");
            return;
        }

        // Eager load relasi yang dibutuhkan oleh kelas notifikasi
        $newStatus->load(['statusType', 'createdBy']);

        Log::info("Menyiapkan notifikasi review untuk user ID: {$submisiCreator->id}");

        $notificationObject = new SubmissionReviewedNotification($submisi, $newStatus);
        $notificationData = $notificationObject->toArray($submisiCreator);

        DatabaseNotification::create([
            'user_id' => $submisiCreator->id,
            'type' => get_class($notificationObject),
            'notifiable_type' => StatusSubmisi::class,
            'notifiable_id' => $newStatus->id,
            'data' => $notificationData,
        ]);

        Log::info("Notifikasi review DIBUAT untuk user ID: {$submisiCreator->id}");
    }
}
