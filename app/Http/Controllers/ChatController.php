<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChatResource;
use App\Models\Chat;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
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
     * Display the specified resource.
     */
    public function show(Chat $chat)
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
