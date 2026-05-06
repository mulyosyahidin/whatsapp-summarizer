<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\ChatFile;
use App\Models\ChatMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;

class ChatMessageController extends Controller
{
    /**
     * Sync messages for the specified chat.
     */
    public function sync(Chat $chat)
    {
        $offset = 0;
        $limit = 100;
        $totalSynced = 0;

        do {
            $result = $this->fetchAndSyncMessages($chat, $offset, $limit);

            if (! $result) {
                return back()->with('error', "Gagal sinkronisasi pesan pada offset {$offset}");
            }

            $totalSynced += count($result['data']);
            $pagination = $result['pagination'];
            $offset += $limit;

        } while ($offset < $pagination['total']);

        return back()->with('success', "Berhasil sinkronisasi {$totalSynced} pesan");
    }

    /**
     * Fetch messages from API and sync to local database.
     */
    private function fetchAndSyncMessages(Chat $chat, int $offset = 0, int $limit = 100): ?array
    {
        $baseUrl = config('wag.base_url');
        $username = config('wag.auth.username');
        $password = config('wag.auth.password');

        try {
            $response = Http::withBasicAuth($username, $password)
                ->get($baseUrl."/chat/{$chat->jid}/messages", [
                    'offset' => $offset,
                    'limit' => $limit,
                ]);

            if (! $response->successful()) {
                return null;
            }

            $data = $response->json('results.data') ?? [];
            $pagination = $response->json('results.pagination');

            foreach ($data as $msgData) {
                ChatMessage::updateOrCreate(
                    ['id' => $msgData['id']],
                    [
                        'chat_jid' => $msgData['chat_jid'],
                        'sender_jid' => $msgData['sender_jid'],
                        'content' => $msgData['content'] ?? '',
                        'timestamp' => $msgData['timestamp'] ? Carbon::parse($msgData['timestamp']) : null,
                        'is_from_me' => $msgData['is_from_me'],
                        'media_type' => $msgData['media_type'] ?? '',
                        'filename' => $msgData['filename'] ?? '',
                        'url' => $msgData['url'] ?? '',
                        'file_length' => $msgData['file_length'] ?? 0,
                    ]
                );

                if (! empty($msgData['url'])) {
                    ChatFile::updateOrCreate(
                        ['chat_message_id' => $msgData['id']],
                        [
                            'chat_jid' => $msgData['chat_jid'],
                            'filename' => $msgData['filename'] ?? null,
                            'url' => $msgData['url'],
                            'media_type' => $msgData['media_type'] ?? null,
                            'file_length' => $msgData['file_length'] ?? 0,
                            'timestamp' => $msgData['timestamp'] ? Carbon::parse($msgData['timestamp']) : null,
                        ]
                    );
                }
            }

            return [
                'data' => $data,
                'pagination' => $pagination,
            ];
        } catch (\Exception $e) {
            return null;
        }
    }
}
