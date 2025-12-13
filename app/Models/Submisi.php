<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Submisi extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $table = 'submisi';

    protected $fillable = [
        'judul',
        'type',
        'kegiatan_type_id',
        'created_by',
        'parent_tor_id',
    ];

    protected $appends = ['total_anggaran'];

    public function getTotalAnggaranAttribute()
    {
        return $this->biaya()->sum(DB::raw('biaya_satuan * jumlah_kali * jumlah_org'));
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function kegiatanType(): BelongsTo
    {
        return $this->belongsTo(KegiatanType::class);
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

    public function submisiFile(): HasMany
    {
        return $this->hasMany(SubmisiFile::class);
    }

    public function biaya(): HasMany
    {
        return $this->hasMany(Biaya::class);
    }

    public function detailSubmisi(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(DetailSubmisi::class)->orderBy('created_at', 'desc');
    }

    public function generatedLpj(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(self::class, 'parent_tor_id', 'id');
    }

    public function parentTor(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_tor_id');
    }

    public function latestStatus(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(StatusSubmisi::class)->orderBy('created_at', 'desc');
    }
}
