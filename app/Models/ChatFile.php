<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'chat_message_id',
    'chat_jid',
    'filename',
    'url',
    'media_type',
    'file_length',
    'timestamp',
])]
class ChatFile extends Model
{
    /** @var array<string, string> */
    protected $casts = [
        'timestamp' => 'datetime',
        'file_length' => 'integer',
    ];

    /**
     * Get the message that owns the file.
     *
     * @return BelongsTo<ChatMessage, ChatFile>
     */
    public function message(): BelongsTo
    {
        return $this->belongsTo(ChatMessage::class, 'chat_message_id');
    }

    /**
     * Get the chat that owns the file.
     *
     * @return BelongsTo<Chat, ChatFile>
     */
    public function chat(): BelongsTo
    {
        return $this->belongsTo(Chat::class, 'chat_jid', 'jid');
    }
}
