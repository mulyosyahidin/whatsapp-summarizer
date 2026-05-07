<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatFileResource extends JsonResource
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
            'chat_message_id' => $this->chat_message_id,
            'chat_jid' => $this->chat_jid,
            'filename' => $this->filename,
            'url' => $this->url,
            'media_type' => $this->media_type,
            'file_length' => $this->file_length,
            'timestamp' => $this->timestamp,
        ];
    }
}
