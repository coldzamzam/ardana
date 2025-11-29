<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Biaya extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'biaya';

    protected $fillable = [
        'type',
        'biaya_satuan',
        'jumlah_kali',
        'jumlah_org',
        'deskripsi',
        'satuan',
        'submisi_id',
    ];

    public function submisi(): BelongsTo
    {
        return $this->belongsTo(Submisi::class);
    }
}
