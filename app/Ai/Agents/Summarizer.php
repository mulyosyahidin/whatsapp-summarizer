<?php

namespace App\Ai\Agents;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Promptable;
use Stringable;

class Summarizer implements Agent, Conversational, HasStructuredOutput
{
    use Promptable;

    /**
     * @param  array<int, array{sender: string, content: string, timestamp: string}>  $messages
     */
    public function __construct(private readonly array $messages) {}

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return <<<'PROMPT'
            You are an expert conversation analyst. Your task is to summarize WhatsApp conversations.
            Produce two things in Bahasa Indonesia:
            1. summary_title: A short, descriptive title (max 10 words) that captures the main topic of the conversation.
            2. summary_result: A clear, concise summary paragraph that captures:
               - The main topics discussed
               - Key decisions or outcomes
               - The overall tone of the conversation
            Do NOT include greetings or filler phrases in either field.
            PROMPT;
    }

    /**
     * Get the list of messages comprising the conversation so far.
     *
     * @return Message[]
     */
    public function messages(): iterable
    {
        return array_map(
            fn ($m) => new Message(
                role: $m['is_from_me'] ? 'assistant' : 'user',
                content: "[{$m['timestamp']}] {$m['sender']}: {$m['content']}",
            ),
            $this->messages,
        );
    }

    /**
     * Get the agent's structured output schema definition.
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'summary_title' => $schema->string()->required(),
            'summary_result' => $schema->string()->required(),
        ];
    }
}
