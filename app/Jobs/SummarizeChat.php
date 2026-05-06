<?php

namespace App\Jobs;

use App\Models\Chat;
use App\Services\SummarizationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SummarizeChat implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 5;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var int|array
     */
    public $backoff = [30, 60, 120];

    /**
     * The number of seconds the job can run before timing out.
     *
     * @var int
     */
    public $timeout = 1200;

    /**
     * Create a new job instance.
     */
    public function __construct(public Chat $chat) {}

    /**
     * Execute the job.
     */
    public function handle(SummarizationService $service): void
    {
        $service->summarize($this->chat);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("SummarizeChat failed for chat {$this->chat->jid}: ".$exception->getMessage());
    }
}
