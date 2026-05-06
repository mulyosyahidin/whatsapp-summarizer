<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChatResource;
use App\Http\Resources\ContactResource;
use App\Models\Chat;
use App\Models\ChatMessage;
use App\Models\Contact;
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
