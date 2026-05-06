<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['chat_id', 'ai_log_id', 'role', 'content', 'model'])]
class AiChatMessage extends Model
{
    use HasFactory;

    /**
     * Get the chat that owns the message.
     */
    public function chat(): BelongsTo
    {
        return $this->belongsTo(Chat::class);
    }

    /**
     * Get the AI log associated with the message.
     */
    public function aiLog(): BelongsTo
    {
        return $this->belongsTo(AiLog::class);
    }
}
