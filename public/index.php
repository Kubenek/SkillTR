<?php

require_once __DIR__ . "/../vendor/autoload.php";
require_once __DIR__ . "/../app/Core/dbLoader.php";
require_once __DIR__ . "/../app/Models/User.php";

$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

if (session_status() === PHP_SESSION_NONE) {
    session_start();
    $_SESSION["ssid"] = session_id();
}

$fullStaticPath = __DIR__ . $path;
if ($path !== '/' && file_exists($fullStaticPath)) {
    return false;
}

try {
    switch ($path) {
        case "/login":
            ($method === "GET") ? App\Controllers\AuthController::showLogin() : App\Controllers\AuthController::login();
            break;
        case "/creator":
            App\Controllers\CreatorController::showCreator();
            break;
        case "/new-account":
            ($method === "GET") ? App\Controllers\NAccountController::showPage() : App\Controllers\NAccountController::createAccount();
            break;
        case "/dashboard":
            App\Controllers\DashboardController::showPage();
            break;
        case "/logout":
            App\Controllers\AuthController::logout();
        default:
            http_response_code(404);
            echo "404 Not Found";
            break;
    }
} catch (\Exception $e) {
    http_response_code(500);
    echo "Error: " . $e->getMessage();
}