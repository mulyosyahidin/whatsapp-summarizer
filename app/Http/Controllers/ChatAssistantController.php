<?php

namespace App\Http\Controllers;

use App\Ai\Agents\ChatAssistant;
use App\Models\AiLog;
use App\Models\Chat;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatAssistantController extends Controller
{
    /**
     * Handle AI chat request for a specific chat.
     */
    public function chat(Request $request, Chat $chat)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $model = config('ai.chat_assistant.model');
        $provider = config('ai.chat_assistant.provider');

        // Save user message to database
        $chat->aiChatMessages()->create([
            'role' => 'user',
            'content' => $request->message,
            'model' => $model,
        ]);

        // Get chat messages as context (limit to last 100 to avoid token issues)
        $messages = ChatMessage::where('chat_jid', $chat->jid)
            ->orderBy('timestamp', 'desc')
            ->take(100)
            ->get()
            ->reverse()
            ->values()
            ->map(fn ($m) => [
                'sender' => $m->sender_jid === $chat->jid ? ($chat->name ?: $chat->jid) : 'Me',
                'content' => $m->content,
                'timestamp' => $m->timestamp,
                'is_from_me' => $m->is_from_me,
            ])
            ->toArray();

        $agent = new ChatAssistant($messages, $chat->name ?: $chat->jid);

        $result = null;
        $error = null;

        try {
            // Send user message to AI with chat history as context
            $result = $agent->prompt(
                $request->message,
                provider: $provider,
                model: $model,
            );
        } catch (\Throwable $e) {
            $error = $e->getMessage();
        }

        // Create AI log
        $log = AiLog::create([
            'user_id' => Auth::id(),
            'provider' => $provider,
            'model' => $model,
            'prompt' => $request->message,
            'response' => $result ? (string) $result : null,
            'tokens_input' => $result?->usage?->promptTokens ?? 0,
            'tokens_output' => $result?->usage?->completionTokens ?? 0,
            'status' => $error ? 'failed' : 'success',
            'error_message' => $error,
        ]);

        if ($result) {
            // Save assistant message to database
            $chat->aiChatMessages()->create([
                'role' => 'assistant',
                'content' => (string) $result,
                'model' => $model,
                'ai_log_id' => $log->id,
            ]);
        }

        return response()->json([
            'message' => (string) $result,
        ]);
    }
}
