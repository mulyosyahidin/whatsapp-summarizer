<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['jid', 'name', 'last_message_time', 'ephemeral_expiration', 'archived'])]
class Chat extends Model
{
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'last_message_time' => 'datetime',
            'archived' => 'boolean',
        ];
    }
}
