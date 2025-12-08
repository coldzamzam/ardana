<?php

namespace App\Notifications;

use App\Models\Submisi;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class SubmissionSubmitted extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Submisi $submisi)
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
        $actorName = $this->submisi->createdBy->name;

        return [
            'actor_name' => $actorName,
            'action_text' => 'telah mengajukan '.$this->submisi->type.' baru:',
            'object_title' => $this->submisi->judul,
            'link' => route('review.index'), // Link for the reviewer
        ];
    }
}
