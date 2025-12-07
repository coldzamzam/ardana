<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DetailSubmisi extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $table = 'detail_submisi';

    protected $fillable = [
        'gambaran_umum',
        'tujuan',
        'manfaat',
        'metode_pelaksanaan',
        'waktu_pelaksanaan',
        'iku',
        'tanggal_mulai',
        'tanggal_selesai',
        'pic_id',
        'submisi_id',
    ];

    public function pic(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'pic_id');
    }

    // Relationships if any, though not directly inferable from the migration for this model itself
}
