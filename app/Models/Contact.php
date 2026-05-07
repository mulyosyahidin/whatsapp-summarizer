<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['jid', 'name'])]
class Contact extends Model
{
    /**
     * Get the chat associated with the contact.
     */
    public function chat(): HasOne
    {
        return $this->hasOne(Chat::class, 'jid', 'jid');
    }
}
