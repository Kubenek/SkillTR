<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/../../vendor/autoload.php';

$conn = Database::getConnection();

class User {
    private int $id;
    private string $username;
    private string $passHash;
    private string $email;
    private string $createdAt;

    private static function randomUName() {
        return "user" . random_int(10000, 99999);
    }

    private static function checkUNameUniqueness(mysqli $conn, $username) {
        $sql = "SELECT `username` FROM `users`";
        $result = $conn->query($sql);
        while($row = $result->fetch_assoc()) {
            if ($row === $username) {
                return false;
            }
        }
        return true;
    }

    public function __construct($pass, $mail, $username) {
        $this->passHash = $pass;
        $this->email = $mail;
        $this->username = $username;
    }

    public function getMail() {
        return $this->email;
    }

    public function getUsername(){
        return $this->username;
    }

    public function getID() {
        return $this->id;
    }

    public function getCreateDate() {
        return $this->createdAt;
    }

    public static function create($email, $password) {
        $conn = Database::getConnection();

        $username = self::randomUName();
        
        if(!(self::checkUNameUniqueness($conn, $username))) {
            return;
        }

        $hashed = password_hash($password, PASSWORD_DEFAULT);

        $user = new User($hashed, $email, $username);
        $user->save($conn);
        $conn->close();

        return $user;
    }
    public function save(mysqli $conn) {
        $sql = "INSERT INTO `users` (id, username, email, password) VALUES (NULL, ?, ?, ?)";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            die("Prepare failed: " . $conn->error);
        }

        $stmt->bind_param("sss", $this->username, $this->email, $this->passHash);
        
        if (!$stmt->execute()) {
            die("Execute failed: " . $stmt->error);
        }

        $stmt->close();
    }

}
