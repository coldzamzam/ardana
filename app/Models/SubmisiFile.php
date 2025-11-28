<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class SubmisiFile extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'submisi_file';

    protected $fillable = [
        'submisi_id',
        'file_location',
        'deskripsi',
        'nama',
    ];

    public function submisi(): BelongsTo
    {
        return $this->belongsTo(Submisi::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::forceDeleted(function ($submisiFile) {
            if ($submisiFile->file_location) {
                Storage::delete($submisiFile->file_location);
            }
        });
    }
}
