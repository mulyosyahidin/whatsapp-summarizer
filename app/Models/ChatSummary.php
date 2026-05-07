<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['chat_id', 'summary_title', 'summary_result', 'message_count'])]
class ChatSummary extends Model
{
    /**
     * Get the chat that owns this summary.
     */
    public function chat(): BelongsTo
    {
        return $this->belongsTo(Chat::class);
    }
}
