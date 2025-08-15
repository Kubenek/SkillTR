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

    public static function doesEmailExist($email) {
        $stmt = self::$conn->prepare("SELECT 1 FROM `users` WHERE `email` = ? LIMIT 1");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();
        $result = $stmt->num_rows > 0;
        $stmt->close();

        return $result; 
    }
}