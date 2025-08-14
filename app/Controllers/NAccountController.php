<?php

namespace App\Controllers;

use Database;

require_once __DIR__ . "/../Models/User.php";

class NAccountController {
    public static function showPage() {
        require_once __DIR__ . "/../Views/new-account.php";
    }
    public static function createAccount() {
        $mail = $_POST['email-input'];
        $pass = $_POST['pass-input'];
        $repeat = $_POST['pass-input-repeat'];
        
        if($pass !== $repeat) return;

        try {
            \User::create($mail, $pass);
            header("Location: /login");
            exit;
        } catch (\Exception $e) {
            error_log("Account creation failed: " . $e->getMessage());
            header("Location: /new-account");
            exit;
        }
    }
}