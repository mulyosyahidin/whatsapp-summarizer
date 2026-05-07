<?php

use App\Http\Controllers\AiLogController;
use App\Http\Controllers\ChatAssistantController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ChatMessageController;
use App\Http\Controllers\ChatSummaryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\JobController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('chats')->name('chats.')->group(function () {
        Route::get('/', [ChatController::class, 'index'])->name('index');
        Route::get('{chat}', [ChatController::class, 'show'])->name('show');
        Route::post('sync', [ChatController::class, 'sync'])->name('sync');
        Route::post('sync-all', [ChatController::class, 'syncAll'])->name('sync-all');
        Route::post('{chat}/sync', [ChatMessageController::class, 'sync'])->name('messages.sync');
        Route::post('{chat}/summarize', [ChatSummaryController::class, 'store'])->name('summarize');
        Route::post('{chat}/ai-chat', [ChatAssistantController::class, 'chat'])->name('ai-chat');
    });

    Route::get('summaries', [ChatSummaryController::class, 'index'])->name('summaries.index');
    Route::post('summaries/summarize-all', [ChatSummaryController::class, 'summarizeAll'])->name('summaries.summarize-all');

    Route::prefix('contacts')->name('contacts.')->group(function () {
        Route::get('/', [ContactController::class, 'index'])->name('index');
        Route::post('sync', [ContactController::class, 'sync'])->name('sync');
    });

    Route::prefix('jobs')->name('jobs.')->group(function () {
        Route::get('/', [JobController::class, 'index'])->name('index');
        Route::get('{type}/{id}', [JobController::class, 'show'])->name('show');
        Route::post('retry-all', [JobController::class, 'retryAll'])->name('retry-all');
        Route::post('{id}/retry', [JobController::class, 'retry'])->name('retry');
        Route::delete('{type}/{id}', [JobController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('ai-logs')->name('ai-logs.')->group(function () {
        Route::get('/', [AiLogController::class, 'index'])->name('index');
        Route::get('{log}', [AiLogController::class, 'show'])->name('show');
    });
});

require __DIR__.'/settings.php';
