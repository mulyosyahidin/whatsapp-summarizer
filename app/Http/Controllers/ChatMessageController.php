<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Services\ChatService;

class ChatMessageController extends Controller
{
    public function __construct(private readonly ChatService $chatService) {}

    /**
     * Sync messages for the specified chat.
     */
    public function sync(Chat $chat)
    {
        $totalSynced = $this->chatService->syncMessages($chat);

        return back()->with('success', "Berhasil sinkronisasi {$totalSynced} pesan");
    }
}
