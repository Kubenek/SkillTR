<?php

require '../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

class Database {
    private static $conn = null;

    public static function getConnection() {
        if(self::$conn !== null) return self::$conn;

        $dbHost = $_ENV['DB_HOST'];
        $dbUser = $_ENV['DB_USERNAME'];
        $dbPass = $_ENV['DB_PASSWORD'];
        $dbDatabase = $_ENV['DB_DATABASE'];

        self::$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbDatabase);

        if(self::$conn->connect_error) die("Connection failed: ".self::$conn->connect_error);
        
        return self::$conn;
    }
}