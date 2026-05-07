<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChatSummaryResource;
use App\Jobs\SummarizeChat;
use App\Models\Chat;
use App\Models\ChatSummary;
use App\Services\SummarizationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChatSummaryController extends Controller
{
    public function __construct(private readonly SummarizationService $summarizationService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = ChatSummary::with('chat')->latest();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('summary_title', 'like', "%{$request->search}%")
                    ->orWhere('summary_result', 'like', "%{$request->search}%")
                    ->orWhereHas('chat', function ($q) use ($request) {
                        $q->where('name', 'like', "%{$request->search}%")
                            ->orWhere('jid', 'like', "%{$request->search}%");
                    });
            });
        }

        return Inertia::render('summaries/index', [
            'summaries' => ChatSummaryResource::collection($query->paginate($request->input('limit', 10))->withQueryString()),
            'filters' => $request->only(['search', 'limit']),
        ]);
    }

    /**
     * Generate summaries for all chats in the background.
     */
    public function summarizeAll(): RedirectResponse
    {
        $chats = Chat::all();

        foreach ($chats as $chat) {
            SummarizeChat::dispatch($chat);
        }

        return back()->with('success', 'Proses rangkuman semua chat telah dijadwalkan di background.');
    }

    /**
     * Generate and store an AI summary for the given chat.
     */
    public function store(Request $request, Chat $chat): RedirectResponse
    {
        $summary = $this->summarizationService->summarize($chat);

        if (! $summary) {
            return back()->with('error', 'Gagal merangkum chat. Pastikan ada pesan teks yang cukup atau coba lagi nanti.');
        }

        return back()->with('success', 'Ringkasan berhasil dibuat.');
    }
}
