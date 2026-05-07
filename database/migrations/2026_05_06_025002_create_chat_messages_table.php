<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('chat_jid')->index();
            $table->string('sender_jid')->nullable();
            $table->text('content')->nullable();
            $table->timestamp('timestamp')->nullable();
            $table->boolean('is_from_me')->default(false);
            $table->string('media_type')->nullable();
            $table->string('filename')->nullable();
            $table->text('url')->nullable();
            $table->unsignedBigInteger('file_length')->default(0);
            $table->timestamps();

            $table->foreign('chat_jid')->references('jid')->on('chats')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_messages');
    }
};
