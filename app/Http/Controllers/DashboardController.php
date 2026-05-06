<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChatResource;
use App\Http\Resources\ContactResource;
use App\Models\AiLog;
use App\Models\Chat;
use App\Models\ChatMessage;
use App\Models\Contact;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('dashboard', [
            'stats' => [
                'total_chats' => Chat::count(),
                'total_messages' => ChatMessage::count(),
                'total_contacts' => Contact::count(),
            ],
            'ai_stats' => [
                'total_cost' => AiLog::sum('cost'),
                'total_tokens_input' => AiLog::sum('tokens_input'),
                'total_tokens_output' => AiLog::sum('tokens_output'),
                'top_model' => ($topModel = AiLog::select('model', DB::raw('count(*) as total'))
                    ->groupBy('model')
                    ->orderBy('total', 'desc')
                    ->first())?->model ?? 'N/A',
                'top_model_usage_count' => $topModel?->total ?? 0,
            ],
            'latest_chats' => ChatResource::collection(
                Chat::latest('last_message_time')
                    ->take(5)
                    ->get()
            ),
            'latest_contacts' => ContactResource::collection(
                Contact::latest()
                    ->take(5)
                    ->get()
            ),
        ]);
    }
}
