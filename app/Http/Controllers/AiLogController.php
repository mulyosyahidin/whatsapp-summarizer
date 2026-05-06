<?php

namespace App\Http\Controllers;

use App\Http\Resources\AiLogResource;
use App\Models\AiLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiLogController extends Controller
{
    public function index(Request $request): Response
    {
        $logs = AiLog::with('user')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $stats = AiLog::select('model')
            ->selectRaw('count(*) as count')
            ->selectRaw('sum(tokens_input) as input_tokens')
            ->selectRaw('sum(tokens_output) as output_tokens')
            ->groupBy('model')
            ->get();

        return Inertia::render('ai-logs/index', [
            'logs' => AiLogResource::collection($logs),
            'stats' => [
                'models' => $stats,
                'total_count' => AiLog::count(),
                'total_input_tokens' => AiLog::sum('tokens_input'),
                'total_output_tokens' => AiLog::sum('tokens_output'),
            ],
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
