<?php

namespace App\Controllers;

class AuthController {
    public static function showLogin() {
        require_once __DIR__ . "/../Views/login.php";
    }
}