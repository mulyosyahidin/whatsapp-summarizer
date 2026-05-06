<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\ChatMessageController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('chats', ChatController::class)->only(['index', 'show']);
    Route::post('chats/sync', [ChatController::class, 'sync'])->name('chats.sync');
    Route::post('chats/{chat}/sync', [ChatMessageController::class, 'sync'])->name('chats.messages.sync');
});

require __DIR__.'/settings.php';
