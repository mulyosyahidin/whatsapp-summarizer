<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChatFileResource;
use App\Http\Resources\ChatMessageResource;
use App\Http\Resources\ChatResource;
use App\Jobs\SyncChatMessages;
use App\Models\Chat;
use App\Services\ChatService;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function __construct(private readonly ChatService $chatService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Chat::withCount('messages')->withExists('summaries')->latest('last_message_time');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('jid', 'like', "%{$request->search}%")
                    ->orWhere('name', 'like', "%{$request->search}%");
            });
        }

        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('archived', false);
            } elseif ($request->status === 'archived') {
                $query->where('archived', true);
            }
        }

        $sortBy = $request->input('sort_by', 'last_message_time');
        $sortOrder = $request->input('sort_order', 'desc');

        $sortMap = [
            'messages' => 'messages_count',
            'summary' => 'summaries_exists',
            'last_seen' => 'last_message_time',
        ];

        $column = $sortMap[$sortBy] ?? $sortBy;

        if (in_array($column, ['messages_count', 'summaries_exists', 'last_message_time', 'name', 'jid'])) {
            $query->reorder($column, $sortOrder === 'desc' ? 'desc' : 'asc');
        }

        return inertia('chats/index', [
            'chats' => ChatResource::collection($query->paginate($request->input('limit', 10))->withQueryString()),
            'filters' => $request->only(['search', 'status', 'limit', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Chat $chat)
    {
        $query = $chat->messages()->oldest('timestamp');

        if ($request->filled('search')) {
            $query->where('content', 'like', "%{$request->search}%");
        }

        $messages = $query->paginate(50)->withQueryString();

        if (! $request->has('page') && ! $request->has('search') && $messages->lastPage() > 1) {
            return redirect()->route('chats.show', ['chat' => $chat->id, 'page' => $messages->lastPage()]);
        }

        return inertia('chats/show', [
            'chat' => (new ChatResource($chat))->resolve(),
            'messages' => ChatMessageResource::collection($messages),
            'files' => ChatFileResource::collection($chat->files()->latest('timestamp')->paginate(10, ['*'], 'files_page')->withQueryString()),
            'files_count' => $chat->files()->count(),
            'filters' => $request->only(['search']),
            'latest_summary' => $chat->latestSummary,
        ]);
    }

    /**
     * Sync all chats from WAG API (chat list only).
     */
    public function sync()
    {
        $result = $this->chatService->syncChats();

        return back()->with('success', "Berhasil sinkronisasi {$result['synced']} chat");
    }

    /**
     * Sync all chats then dispatch a queue job per chat to sync messages.
     */
    public function syncAll()
    {
        $result = $this->chatService->syncChats();

        foreach ($result['chats'] as $chat) {
            SyncChatMessages::dispatch($chat);
        }

        return back()->with('success', "Berhasil sinkronisasi {$result['synced']} chat. Sinkronisasi pesan sedang diproses di background.");
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Chat $chat)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Chat $chat)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Chat $chat)
    {
        //
    }
}
