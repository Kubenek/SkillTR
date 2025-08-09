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

        $conn = Database::getConnection();

        $sql = "INSERT INTO `users` (id, username, email, password) VALUES (NULL, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $uname, $mail, $passHash);
        $stmt->execute();
        $stmt->close();

    }
}