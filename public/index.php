<?php

require_once __DIR__ . "/../vendor/autoload.php";

$path = parse_url($_SERVER["REQUEST_URL"], PHP_URL_PATH);

switch($path) {
    case "/login":
        App\Controllers\AuthController::showLogin();
        break;
    default:
        http_response_code(404);
        echo "404 Not Found";
        break;
}