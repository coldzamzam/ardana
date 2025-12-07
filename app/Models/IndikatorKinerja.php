<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class IndikatorKinerja extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'indikator_kinerja';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'bulan',
        'keberhasilan',
        'target',
        'submisi_id',
    ];

    public function submisi(): BelongsTo
    {
        return $this->belongsTo(Submisi::class);
    }
}
