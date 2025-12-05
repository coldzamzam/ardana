<?php

namespace App\Events;

use App\Models\StatusSubmisi;
use App\Models\Submisi;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SubmissionReviewed
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Submisi $submisi, public StatusSubmisi $statusSubmisi)
    {
        //
    }
}
