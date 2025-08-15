<?php

class AuthService {
    protected $conn;

    public function __construct(mysqli $conn) {
        $this->conn = $conn;
    }

    public static function checkUNameUniqueness(mysqli $conn, $username) {
        $sql = "SELECT `username` FROM `users`";
        $result = $conn->query($sql);
        while($row = $result->fetch_assoc()) {
            if ($row === $username) {
                return false;
            }
        }
        return true;
    }

}