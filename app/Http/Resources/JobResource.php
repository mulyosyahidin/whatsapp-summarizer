<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $payload = is_string($this->payload) ? json_decode($this->payload, true) : ($this->payload ?? []);

        return [
            'id' => $this->id,
            'queue' => $this->queue,
            'display_name' => $payload['displayName'] ?? ($this->display_name ?? 'Unknown'),
            'attempts' => $this->attempts ?? 0,
            'available_at' => isset($this->available_at) ? (is_numeric($this->available_at) ? date('Y-m-d H:i:s', $this->available_at) : $this->available_at) : null,
            'created_at' => isset($this->created_at) ? (is_numeric($this->created_at) ? date('Y-m-d H:i:s', $this->created_at) : $this->created_at) : null,
            'status' => $this->status ?? 'pending',
            'uuid' => $this->uuid ?? null,
            'failed_at' => $this->failed_at ?? null,
        ];
    }
}
