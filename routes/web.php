<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\ChatMessageController;
use App\Http\Controllers\ChatSummaryController;
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
        Route::post('{chat}/sync', [ChatMessageController::class, 'sync'])->name('messages.sync');
        Route::post('{chat}/summarize', [ChatSummaryController::class, 'store'])->name('summarize');
    });
});

require __DIR__.'/settings.php';
