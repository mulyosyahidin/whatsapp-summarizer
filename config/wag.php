<?php

return [
    'base_url' => env('WAG_BASE_URL'),
    'auth' => [
        'username' => env('WAG_AUTH_USERNAME'),
        'password' => env('WAG_AUTH_PASSWORD'),
    ],
    'type' => env('WAG_AUTH_TYPE', 'basic'),
];
