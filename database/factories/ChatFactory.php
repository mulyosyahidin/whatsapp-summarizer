<?php

namespace Database\Factories;

use App\Models\Chat;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Chat>
 */
class ChatFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'jid' => $this->faker->numerify('##########').'@s.whatsapp.net',
            'name' => $this->faker->name(),
            'last_message_time' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'ephemeral_expiration' => 0,
            'archived' => $this->faker->boolean(20),
        ];
    }
}
