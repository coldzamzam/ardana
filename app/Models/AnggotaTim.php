<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class AnggotaTim extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'anggota_tim';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'submisi_id',
        'anggota_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'anggota_id');
    }

    public function submisi(): BelongsTo
    {
        return $this->belongsTo(Submisi::class);
    }
}
