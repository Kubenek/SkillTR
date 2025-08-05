<?php

require '../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$dbHost = $_ENV['DB_HOST'];
$dbUser = $_ENV['DB_USERNAME'];
$dbPass = $_ENV['DB_PASSWORD'];
$dbDatabase = $_ENV['DB_DATABASE'];

$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbDatabase);
