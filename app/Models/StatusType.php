<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class StatusType extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'status_types';

    protected $fillable = [
        'nama',
    ];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(RoleType::class, 'status_type_roles', 'status_type_id', 'role_type_id');
    }
}
