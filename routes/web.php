<?php

use App\Http\Controllers\ChatController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('chats', ChatController::class)->only(['index', 'show']);
    Route::post('chats/sync', [ChatController::class, 'sync'])->name('chats.sync');
});

require __DIR__.'/settings.php';
