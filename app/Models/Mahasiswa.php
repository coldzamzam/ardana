<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mahasiswa extends Model
{
    use HasFactory, HasUuids;
    protected $table = 'mahasiswa';

    protected $fillable = [
        'user_id',
        'nim',
        'prodi',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
