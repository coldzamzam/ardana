<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\DetailSubmisi;

class StatusSubmisi extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'status_submisi';

    protected $fillable = [
        'status_type_id',
        'keterangan',
        'created_by',
        'submisi_id',
        'detail_submisi_id',
    ];

    public function statusType(): BelongsTo
    {
        return $this->belongsTo(StatusType::class);
    }

    public function submisi(): BelongsTo
    {
        return $this->belongsTo(Submisi::class);
    }

    public function detailSubmisi(): BelongsTo
    {
        return $this->belongsTo(DetailSubmisi::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
