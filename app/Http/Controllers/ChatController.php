<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChatFileResource;
use App\Http\Resources\ChatMessageResource;
use App\Http\Resources\ChatResource;
use App\Models\Chat;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
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

    public function sync()
    {
        $offset = 0;
        $limit = 100;
        $totalSynced = 0;

        do {
            $result = $this->fetchAndSync($offset, $limit);

            if (! $result) {
                return back()->with('error', "Gagal sinkronisasi pada offset {$offset}");
            }

            $totalSynced += count($result['data']);
            $pagination = $result['pagination'];
            $offset += $limit;
        } while ($offset < $pagination['total']);

        return back()->with('success', "Berhasil sinkronisasi {$totalSynced} chat");
    }

    private function fetchAndSync($offset = 0, $limit = 100)
    {
        $baseUrl = config('wag.base_url');
        $username = config('wag.auth.username');
        $password = config('wag.auth.password');

        try {
            $response = Http::withBasicAuth($username, $password)
                ->get($baseUrl.'/chats', [
                    'offset' => $offset,
                    'limit' => $limit,
                ]);

            if (! $response->successful()) {
                return null;
            }

            $data = $response->json('results.data') ?? [];
            $pagination = $response->json('results.pagination');

            foreach ($data as $chatData) {
                Chat::updateOrCreate(
                    ['jid' => $chatData['jid']],
                    [
                        'name' => $chatData['name'],
                        'last_message_time' => $chatData['last_message_time'] ? Carbon::parse($chatData['last_message_time']) : null,
                        'ephemeral_expiration' => $chatData['ephemeral_expiration'],
                        'archived' => $chatData['archived'],
                    ]
                );
            }

            return [
                'data' => $data,
                'pagination' => $pagination,
            ];
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Chat::latest('last_message_time');

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

        return inertia('chats/index', [
            'chats' => ChatResource::collection($query->paginate($request->input('limit', 10))->withQueryString()),
            'filters' => $request->only(['search', 'status', 'limit']),
        ]);
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
