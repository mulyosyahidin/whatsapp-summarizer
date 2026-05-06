<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AiLogResource extends JsonResource
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
            'provider' => $this->provider,
            'model' => $this->model,
            'status' => $this->status,
            'tokens_input' => $this->tokens_input,
            'tokens_output' => $this->tokens_output,
            'cost' => $this->cost,
            'prompt' => $this->prompt,
            'response' => $this->response,
            'error_message' => $this->error_message,
            'created_at' => $this->created_at,
            'user' => [
                'name' => $this->user?->name,
            ],
        ];
    }
}
