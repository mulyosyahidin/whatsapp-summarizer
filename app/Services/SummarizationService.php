<?php

namespace App\Services;

use App\Ai\Agents\Summarizer;
use App\Models\AiLog;
use App\Models\Chat;
use App\Models\ChatSummary;
use Illuminate\Support\Facades\Auth;

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

        $isGroup = str_ends_with($chat->jid, '@g.us');

        $payload = $messages->map(fn ($m) => [
            'sender' => $m->is_from_me ? 'Me' : ($isGroup ? explode('@', $m->sender_jid)[0] : 'User'),
            'content' => $m->content,
            'timestamp' => $m->timestamp?->format('H:i'),
            'is_from_me' => $m->is_from_me,
        ])->all();

        $result = null;
        $error = null;

        try {
            $result = (new Summarizer($payload))->prompt(
                'Summarize the conversation in the context.',
                provider: config('ai.summarizer.provider'),
                model: config('ai.summarizer.model'),
            );
        } catch (\Throwable $e) {
            $error = $e->getMessage();
        }

        AiLog::create([
            'user_id' => Auth::id(),
            'provider' => config('ai.summarizer.provider'),
            'model' => config('ai.summarizer.model'),
            'prompt' => json_encode($payload),
            'response' => $result ? json_encode($result) : null,
            'tokens_input' => $result?->usage?->promptTokens ?? 0,
            'tokens_output' => $result?->usage?->completionTokens ?? 0,
            'status' => $error ? 'failed' : 'success',
            'error_message' => $error,
        ]);

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
