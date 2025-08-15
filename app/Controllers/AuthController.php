<?php

namespace App\Controllers;

class AuthController {
    public static function showLogin() {
        require_once __DIR__ . "/../Views/login.php";
    }
    public static function login() {
        $mail = $_POST['email-input'];
        $pass = $_POST['pass-input'];

        //TODO
        //* query databse, look for user with same email
        //* not found -> error message, email not logged in service
        //* found -> get hashed password compare it with $pass using password_verify
        //* incorrect pass -> error message, incorrect password
        //* correct pass -> start a session, put the user model into it, redirect to dashboard

        
        
    }
}