<?php

namespace App\Services;

use App\Ai\Agents\Summarizer;
use App\Models\Chat;
use App\Models\ChatSummary;

class SummarizationService
{
    /**
     * Generate and store an AI summary for the given chat.
     */
    public function summarize(Chat $chat): ?ChatSummary
    {
        $messages = $chat->messages()
            ->oldest('timestamp')
            ->whereNotNull('content')
            ->where('content', '!=', '')
            ->get(['sender_jid', 'content', 'timestamp', 'is_from_me']);

        if ($messages->isEmpty()) {
            return null;
        }

        $payload = $messages->map(fn ($m) => [
            'sender' => $m->is_from_me ? 'Me' : ($m->sender_jid ?: 'Contact'),
            'content' => $m->content,
            'timestamp' => $m->timestamp?->format('Y-m-d H:i'),
            'is_from_me' => $m->is_from_me,
        ])->all();

        $result = (new Summarizer($payload))->prompt(
            'Summarize the conversation in the context.',
            provider: config('ai.summarizer.provider'),
            model: config('ai.summarizer.model'),
        );

        $summaryTitle = data_get($result, 'summary_title');
        $summaryResult = data_get($result, 'summary_result');

        if (empty($summaryResult)) {
            return null;
        }

        return ChatSummary::create([
            'chat_id' => $chat->id,
            'summary_title' => $summaryTitle ?: 'Conversation Summary',
            'summary_result' => $summaryResult,
            'message_count' => $messages->count(),
        ]);
    }
}
