<?php

namespace App\Http\Controllers;

use App\Ai\Agents\Summarizer;
use App\Models\Chat;
use App\Models\ChatSummary;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ChatSummaryController extends Controller
{
    /**
     * Generate and store an AI summary for the given chat.
     */
    public function store(Request $request, Chat $chat): RedirectResponse
    {
        $messages = $chat->messages()
            ->oldest('timestamp')
            ->whereNotNull('content')
            ->where('content', '!=', '')
            ->get(['sender_jid', 'content', 'timestamp', 'is_from_me']);

        if ($messages->isEmpty()) {
            return back()->with('error', 'Tidak ada pesan teks untuk dirangkum.');
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

        ChatSummary::create([
            'chat_id' => $chat->id,
            'summary_title' => data_get($result, 'summary_title'),
            'summary_result' => data_get($result, 'summary_result'),
            'message_count' => $messages->count(),
        ]);

        return back()->with('success', 'Ringkasan berhasil dibuat.');
    }
}
