<?php

namespace App\Jobs;

use App\Models\Chat;
use App\Services\SummarizationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SummarizeChat implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of seconds the job can run before timing out.
     *
     * @var int
     */
    public $timeout = 600;

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
}
