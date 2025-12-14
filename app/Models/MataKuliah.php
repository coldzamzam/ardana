<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class MataKuliah extends Model
{
    use HasUuids;

    protected $table = 'mata_kuliah';

    protected $fillable = [
        'nama',
        'semester',
        'sks',
    ];

    protected $casts = [
        'id' => 'string',
        'semester' => 'integer',
        'sks' => 'integer',
    ];
}
