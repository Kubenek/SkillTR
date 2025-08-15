<?php

namespace App\Controllers;

require_once __DIR__ . "/../Models/AuthService.php";
require_once __DIR__ . "/../Models/User.php";

use AuthService;
use Database;

class AuthController {
    public static function showLogin() {
        require_once __DIR__ . "/../Views/login.php";
    }
    public static function login() {
        $mail = $_POST['email-input'];
        $pass = $_POST['pass-input'];

        $conn = Database::getConnection();
        $authService = new AuthService($conn);

        $user = $authService->userCheck($mail); 

        if(!$user) return; //! add error message

        $passHash = $user["password"];
        if(!password_verify($pass, $passHash)) return; //! add error msg

        $userModel = new \User($passHash, $mail, $user["username"]);
        $_SESSION["user"] = $userModel;

        header("Location: /creator"); //? Redirect to dashboard
      
    }
}