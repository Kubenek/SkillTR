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
        $uname = $_POST['username-input'];
        $passHash = password_hash($pass, PASSWORD_DEFAULT);

        $newUser = \User::create($uname, $mail, $passHash);
    }
}