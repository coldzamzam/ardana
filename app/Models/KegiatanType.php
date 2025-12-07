<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KegiatanType extends Model
{
    use HasFactory;
    use HasUuids;

    protected $table = 'kegiatan_types';

    protected $fillable = [
        'nama',
    ];
}
