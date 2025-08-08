<?php

require '../../vendor/autoload.php';

$conn = Database::getConnection();

class User {
    private int $id;
    private string $username;
    private string $passHash;
    private string $email;
    private string $createdAt;

    function getMail() {
        return $this->email;
    }
    function getUsername(){
        return $this->username;
    }
    function getID() {
        return $this->id;
    }
    function getCreateDate() {
        return $this->createdAt;
    }
}
