<?php

require_once __DIR__ . "/Database.php";

$conn = Database::getConnection();

function ensureTables($conn) {
    $tables = [
        'users' => "CREATE TABLE IF NOT EXISTS `users` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `username` VARCHAR(30) NOT NULL,
            `email` VARCHAR(50) NOT NULL,
            `password` TEXT NOT NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )"
    ];

    foreach($tables as $name => $sql) {
        if (!$conn->query($sql)) {
            die("Error creating table ".$name.": " . $conn->error);
        }
    }
}

ensureTables($conn);