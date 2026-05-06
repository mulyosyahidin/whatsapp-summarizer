<?php

namespace App\Services;

use App\Models\Chat;
use App\Models\ChatFile;
use App\Models\ChatMessage;
use App\Models\Contact;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;

class ChatService
{
    /**
     * Sync all chats from the WAG API.
     *
     * @return array{synced: int, chats: Chat[]}
     */
    public function syncChats(): array
    {
        $offset = 0;
        $limit = 100;
        $totalSynced = 0;
        $syncedChats = [];

        do {
            $result = $this->fetchChats($offset, $limit);

            if (! $result) {
                break;
            }

            foreach ($result['data'] as $chatData) {
                $chat = Chat::updateOrCreate(
                    ['jid' => $chatData['jid']],
                    [
                        'name' => $chatData['name'],
                        'last_message_time' => $this->parseTimestamp($chatData['last_message_time']),
                        'ephemeral_expiration' => $chatData['ephemeral_expiration'],
                        'archived' => $chatData['archived'],
                    ]
                );

                Contact::updateOrCreate(
                    ['jid' => $chatData['jid']],
                    ['name' => $chatData['name']]
                );

                $syncedChats[] = $chat;
            }

            $totalSynced += count($result['data']);
            $pagination = $result['pagination'];
            $offset += $limit;
        } while ($offset < $pagination['total']);

        return [
            'synced' => $totalSynced,
            'chats' => $syncedChats,
        ];
    }

    /**
     * Sync all messages and files for a single chat from the WAG API.
     */
    public function syncMessages(Chat $chat): int
    {
        $offset = 0;
        $limit = 100;
        $totalSynced = 0;

        do {
            $result = $this->fetchMessages($chat, $offset, $limit);

            if (! $result) {
                break;
            }

            foreach ($result['data'] as $msgData) {
                ChatMessage::updateOrCreate(
                    ['id' => $msgData['id']],
                    [
                        'chat_jid' => $msgData['chat_jid'],
                        'sender_jid' => $msgData['sender_jid'],
                        'content' => $msgData['content'] ?? '',
                        'timestamp' => $this->parseTimestamp($msgData['timestamp']),
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
                            'timestamp' => $this->parseTimestamp($msgData['timestamp']),
                        ]
                    );
                }
            }

            $totalSynced += count($result['data']);
            $pagination = $result['pagination'];
            $offset += $limit;
        } while ($offset < $pagination['total']);

        return $totalSynced;
    }

    /**
     * Fetch a page of chats from the WAG API.
     *
     * @return array{data: array<mixed>, pagination: array<string, mixed>}|null
     */
    private function fetchChats(int $offset, int $limit): ?array
    {
        try {
            $response = Http::withBasicAuth(config('wag.auth.username'), config('wag.auth.password'))
                ->get(config('wag.base_url').'/chats', [
                    'offset' => $offset,
                    'limit' => $limit,
                ]);

            if (! $response->successful()) {
                return null;
            }

            return [
                'data' => $response->json('results.data') ?? [],
                'pagination' => $response->json('results.pagination'),
            ];
        } catch (\Exception) {
            return null;
        }
    }

    /**
     * Fetch a page of messages for a chat from the WAG API.
     *
     * @return array{data: array<mixed>, pagination: array<string, mixed>}|null
     */
    private function fetchMessages(Chat $chat, int $offset, int $limit): ?array
    {
        try {
            $response = Http::withBasicAuth(config('wag.auth.username'), config('wag.auth.password'))
                ->get(config('wag.base_url')."/chat/{$chat->jid}/messages", [
                    'offset' => $offset,
                    'limit' => $limit,
                ]);

            if (! $response->successful()) {
                return null;
            }

            return [
                'data' => $response->json('results.data') ?? [],
                'pagination' => $response->json('results.pagination'),
            ];
        } catch (\Exception) {
            return null;
        }
    }

    /**
     * Parse a timestamp string, returning null for empty, zero, or pre-epoch values
     * that MySQL cannot store (e.g. '0001-01-01 00:00:00' from the WAG API).
     */
    private function parseTimestamp(?string $value): ?Carbon
    {
        if (empty($value)) {
            return null;
        }

        try {
            $carbon = Carbon::parse($value);

            // MySQL DATETIME minimum is 1000-01-01; treat anything earlier as null.
            if ($carbon->year < 1000) {
                return null;
            }

            return $carbon;
        } catch (\Exception) {
            return null;
        }
    }
}
