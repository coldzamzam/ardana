<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class DatabaseNotification extends Model
{
    use HasUuids;

    protected $table = 'notifications';

    protected $guarded = []; // Allow mass assignment for all fields

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
    ];
}
