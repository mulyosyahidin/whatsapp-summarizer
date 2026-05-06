<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChatResource;
use App\Models\Chat;
use App\Models\ChatMessage;
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
            ],
            'latest_chats' => ChatResource::collection(
                Chat::latest('last_message_time')
                    ->take(5)
                    ->get()
            ),
        ]);
    }
}
