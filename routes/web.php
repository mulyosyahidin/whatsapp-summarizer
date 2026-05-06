<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\ChatMessageController;
use App\Http\Controllers\ChatSummaryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
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

    });

    Route::get('summaries', [ChatSummaryController::class, 'index'])->name('summaries.index');
    Route::post('summaries/summarize-all', [ChatSummaryController::class, 'summarizeAll'])->name('summaries.summarize-all');

    Route::prefix('contacts')->name('contacts.')->group(function () {
        Route::get('/', [ContactController::class, 'index'])->name('index');
        Route::post('sync', [ContactController::class, 'sync'])->name('sync');
    });
});

require __DIR__.'/settings.php';
