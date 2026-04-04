<?php

return [
    'superadmin' => [
        'name' => env('SUPER_NAME', 'superadmin'),
        'email' => env('SUPER_EMAIL', 'superadmin@gmail.com'),
        'password' => env('SUPER_PASS', 'password'),
    ],

    'admin' => [
        'name' => env('ADMIN_NAME', 'admin'),
        'email' => env('ADMIN_EMAIL', 'admin@gmail.com'),
        'password' => env('ADMIN_PASS', 'password'),
    ],
];
