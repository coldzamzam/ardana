<?php

namespace App\Providers;

use App\Events\SubmissionReviewed;
use App\Events\TorSubmitted;
use App\Listeners\SendReviewedNotification;
use App\Listeners\SendSubmissionNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        //
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        Event::listen(
            TorSubmitted::class,
            SendSubmissionNotification::class
        );

        Event::listen(
            SubmissionReviewed::class,
            SendReviewedNotification::class
        );
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
