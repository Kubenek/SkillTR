<?php

namespace App\Controllers;

require_once __DIR__ . "/../Models/AuthService.php";
require_once __DIR__ . "/../Models/User.php";

use AuthService;
use Database;

class AuthController {
    public static function showLogin($errorMSG = null) {
        require_once __DIR__ . "/../Views/login.php";
    }
    public static function login() {
        $mail = $_POST['email-input'];
        $pass = $_POST['pass-input'];

        $conn = Database::getConnection();
        $authService = new AuthService($conn);

        $user = $authService->userCheck($mail); 

        if(!$user) { self::showLogin("Could not find specified user"); return; }

        $passHash = $user["password"];
        if(!password_verify($pass, $passHash)) {  self::showLogin("Incorrect password submitted"); return; }

        $userModel = new \User($passHash, $mail, $user["username"]);
        $_SESSION["user"] = $userModel;

        header("Location: /dashboard");
      
    }
}