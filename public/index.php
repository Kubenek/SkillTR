<?php

require_once __DIR__ . "/../vendor/autoload.php";

$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

$fullStaticPath = __DIR__ . $path;
if ($path !== '/' && file_exists($fullStaticPath)) {
    return false;
}

switch ($path) {
    case "/login":
        App\Controllers\AuthController::showLogin();
        break;
    case "/creator":
        App\Controllers\CreatorController::showCreator();
        break;
    default:
        http_response_code(404);
        echo "404 Not Found";
        break;
}
