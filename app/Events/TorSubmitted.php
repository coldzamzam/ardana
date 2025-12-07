<?php

namespace App\Events;

use App\Models\Submisi;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TorSubmitted
{
    use Dispatchable;
    use SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Submisi $submisi)
    {
        //
    }
}
