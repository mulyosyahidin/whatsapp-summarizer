<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    /**
     * Get the messages for the chat.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class, 'chat_jid', 'jid');
    }

    /**
     * Get the files for the chat.
     */
    public function files(): HasMany
    {
        return $this->hasMany(ChatFile::class, 'chat_jid', 'jid');
    }
}
