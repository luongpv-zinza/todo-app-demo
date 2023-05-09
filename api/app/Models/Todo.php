<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string title
 * @property string date
 * @property bool is_completed
 */
class Todo extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'date', 'is_completed'];

    protected $casts = [
        'is_completed' => 'boolean',
    ];
}
