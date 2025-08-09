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
}
