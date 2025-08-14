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
        $repeat = $_POST['pass-input-2'];
        
        if($pass !== $repeat) return;

        $newUser = \User::create($mail, $pass);
    }
}