<?php

require '../../vendor/autoload.php';

$conn = Database::getConnection();

class User {
    private int $id;
    private string $username;
    private string $passHash;
    private string $email;
    private string $createdAt;
}
