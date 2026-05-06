<?php

namespace App\Jobs;

use App\Models\Chat;
use App\Services\ChatService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SyncChatMessages implements ShouldQueue
{
    use Queueable;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds the job can run before timing out.
     */
    public int $timeout = 1800;

    /**
     * Create a new job instance.
     */
    public function __construct(public readonly Chat $chat) {}

    /**
     * Execute the job.
     */
    public function handle(ChatService $chatService): void
    {
        $chatService->syncMessages($this->chat);
    }
}
