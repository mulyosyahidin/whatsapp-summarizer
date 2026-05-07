<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatMessageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'chat_jid' => $this->chat_jid,
            'sender_jid' => $this->sender_jid,
            'content' => $this->content,
            'timestamp' => $this->timestamp,
            'is_from_me' => $this->is_from_me,
            'media_type' => $this->media_type,
            'filename' => $this->filename,
            'url' => $this->url,
            'file_length' => $this->file_length,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
