<?php

require '../../vendor/autoload.php';

$conn = Database::getConnection();

class User {
    private int $id;
    private string $username;
    private string $passHash;
    private string $email;
    private string $createdAt;

    public function __construct($uname, $pass, $mail) {
        $this->username = $uname;
        $this->passHash = $pass;
        $this->email = $mail;
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

    public static function create($username, $email, $password) {
        $user = new User($username, $password, $email);
        $user->save();
        return $user;
    }
    public function save() {
        $conn = Database::getConnection();
        $sql = "INSERT INTO `users` (id, username, email, password) VALUES (NULL, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $this->username, $this->email, $this->passHash);
        $stmt->execute();
        $stmt->close();
        $conn->close();
    }
}
