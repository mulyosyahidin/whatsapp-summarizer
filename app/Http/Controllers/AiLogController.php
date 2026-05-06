<?php

namespace App\Http\Controllers;

use App\Http\Resources\AiLogResource;
use App\Models\AiLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiLogController extends Controller
{
    /**
     * Display a listing of the AI logs.
     */
    public function index(Request $request): Response
    {
        $logs = AiLog::with('user')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('ai-logs/index', [
            'logs' => AiLogResource::collection($logs),
        ]);
    }

    /**
     * Display the specified AI log.
     */
    public function show(AiLog $log): Response
    {
        return Inertia::render('ai-logs/show', [
            'log' => (new AiLogResource($log))->resolve(),
        ]);
    }
}
