<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'user_id',
    'provider',
    'model',
    'prompt',
    'response',
    'tokens_input',
    'tokens_output',
    'cost',
    'status',
    'error_message',
    'metadata',
])]
class AiLog extends Model
{
    protected $casts = [
        'metadata' => 'array',
        'cost' => 'decimal:6',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function aiChatMessages(): HasMany
    {
        return $this->hasMany(AiChatMessage::class);
    }
}
