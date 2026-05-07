<?php

use App\Ai\Agents\Summarizer;
use App\Models\Chat;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

it('stores a chat summary and redirects back', function () {
    $chat = Chat::create([
        'jid' => '628123456789@s.whatsapp.net',
        'name' => 'Test Contact',
        'ephemeral_expiration' => 0,
        'archived' => false,
    ]);

    ChatMessage::create([
        'id' => 'msg-abc-001',
        'chat_jid' => $chat->jid,
        'sender_jid' => '628123456789@s.whatsapp.net',
        'content' => 'Halo, apa kabar?',
        'timestamp' => now()->subMinutes(10),
        'is_from_me' => false,
        'file_length' => 0,
    ]);

    ChatMessage::create([
        'id' => 'msg-abc-002',
        'chat_jid' => $chat->jid,
        'sender_jid' => null,
        'content' => 'Baik, terima kasih!',
        'timestamp' => now()->subMinutes(5),
        'is_from_me' => true,
        'file_length' => 0,
    ]);

    // When called with no args on a structured agent, Laravel auto-generates fake data matching the schema.
    Summarizer::fake();

    $response = $this->post(route('chats.summarize', $chat));

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('chat_summaries', [
        'chat_id' => $chat->id,
        'message_count' => 2,
    ]);
});

it('returns an error when the chat has no text messages', function () {
    $chat = Chat::create([
        'jid' => '628111222333@s.whatsapp.net',
        'name' => 'Empty Chat',
        'ephemeral_expiration' => 0,
        'archived' => false,
    ]);

    $response = $this->post(route('chats.summarize', $chat));

    $response->assertRedirect();
    $response->assertSessionHas('error');

    $this->assertDatabaseCount('chat_summaries', 0);
});

it('requires authentication to summarize', function () {
    auth()->logout();

    $chat = Chat::create([
        'jid' => '628999888777@s.whatsapp.net',
        'name' => 'Auth Test Chat',
        'ephemeral_expiration' => 0,
        'archived' => false,
    ]);

    $this->post(route('chats.summarize', $chat))->assertRedirect(route('login'));
});
