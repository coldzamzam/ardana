<?php

namespace App\Notifications;

use App\Models\StatusSubmisi;
use App\Models\Submisi;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class SubmissionReviewedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Submisi $submisi, public StatusSubmisi $newStatus)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $statusName = trim($this->newStatus->statusType->nama);
        $reviewerName = $this->newStatus->createdBy->name;

        return [
            'actor_name' => $reviewerName,
            'action_text' => "telah mengubah status TOR Anda menjadi '{$statusName}' untuk:",
            'object_title' => $this->submisi->judul,
            'link' => route('tor.show', $this->submisi),
        ];
    }
}
