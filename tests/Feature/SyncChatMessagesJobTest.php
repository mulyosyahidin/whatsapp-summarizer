<?php

use App\Jobs\SyncChatMessages;
use App\Models\Chat;
use App\Models\User;
use App\Services\ChatService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

test('sync-all endpoint dispatches a SyncChatMessages job per chat', function () {
    Queue::fake();

    $chats = Chat::factory()->count(3)->create();

    $chatService = Mockery::mock(ChatService::class);
    $chatService->shouldReceive('syncChats')->once()->andReturn([
        'synced' => 3,
        'chats' => $chats->all(),
    ]);

    $this->app->instance(ChatService::class, $chatService);

    $response = $this->post(route('chats.sync-all'));

    $response->assertRedirect();

    Queue::assertPushed(SyncChatMessages::class, 3);

    foreach ($chats as $chat) {
        Queue::assertPushed(SyncChatMessages::class, fn ($job) => $job->chat->is($chat));
    }
});

test('SyncChatMessages job calls syncMessages on ChatService', function () {
    $chat = Chat::factory()->create();

    $chatService = Mockery::mock(ChatService::class);
    $chatService->shouldReceive('syncMessages')->once()->with(
        Mockery::on(fn ($arg) => $arg->is($chat))
    )->andReturn(42);

    $job = new SyncChatMessages($chat);
    $job->handle($chatService);
});

test('sync-all endpoint returns success flash message', function () {
    Queue::fake();

    $chatService = Mockery::mock(ChatService::class);
    $chatService->shouldReceive('syncChats')->once()->andReturn([
        'synced' => 5,
        'chats' => [],
    ]);

    $this->app->instance(ChatService::class, $chatService);

    $this->post(route('chats.sync-all'))
        ->assertSessionHas('success');
});
