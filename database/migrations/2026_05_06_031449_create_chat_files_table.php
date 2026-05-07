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
        Schema::create('chat_files', function (Blueprint $table) {
            $table->id();
            $table->string('chat_message_id')->index();
            $table->string('chat_jid')->index();
            $table->string('filename')->nullable();
            $table->text('url');
            $table->string('media_type')->nullable();
            $table->bigInteger('file_length')->default(0);
            $table->timestamp('timestamp')->nullable();
            $table->timestamps();

            $table->foreign('chat_message_id')->references('id')->on('chat_messages')->onDelete('cascade');
            $table->foreign('chat_jid')->references('jid')->on('chats')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_files');
    }
};
