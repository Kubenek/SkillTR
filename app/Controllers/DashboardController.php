<?php

namespace App\Controllers;

class DashboardController {
    public static function showPage() {
        require_once __DIR__ ."/../Views/dashboard.php";
    }
}