<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Submisi extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'submisi';

    protected $fillable = [
        'judul',
        'type',
        'jenis_kegiatan',
        'created_by',
        'parent_tor_id',
    ];

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function statusSubmisi(): HasMany
    {
        return $this->hasMany(StatusSubmisi::class);
    }

    public function anggotaTim(): HasMany
    {
        return $this->hasMany(AnggotaTim::class);
    }

    public function indikatorKinerja(): HasMany
    {
        return $this->hasMany(IndikatorKinerja::class);
    }
}
