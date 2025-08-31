<?php
function isActive($path)
{
    $crPath = $_SERVER['REQUEST_URI'];
    $path = "/" . $path;
    return $crPath === $path ? 'activated' : '';
} ?>

<aside class="sidebar">
    <div class="sidebar-header">
        <img src="images/logo.png" alt="logo" />
        <h2>SkillTR</h2>
    </div>
    <ul class="sidebar-links">
        <h4>
            <span>Workspace</span>
            <div class="menu-separator"></div>
        </h4>
        <li>
            <a href="/dashboard" class="<?= isActive("dashboard") ?>">
                <span class="material-symbols-outlined"> dashboard </span>Dashboard</a>
        </li>
        <li>
            <a href="#"><span class="material-symbols-outlined"> search </span>Browser</a>
        </li>
        <li>
            <a href="/creator" class="<?= isActive("creator") ?>"><span class="material-symbols-outlined"> edit
                </span>Creator</a>
        </li>
        <li>
            <a href="#"><span class="material-symbols-outlined"> folder </span>Projects</a>
        </li>
        <h4>
            <span>General</span>
            <div class="menu-separator"></div>
        </h4>
        <li>
            <a href="#"><span class="material-symbols-outlined"> groups </span>Groups</a>
        </li>
        <li>
            <a href="#"><span class="material-symbols-outlined"> monitoring </span>Statistics</a>
        </li>
        <li>
            <a href="#"><span class="material-symbols-outlined">
                    notifications_active </span>Notifications</a>
        </li>
        <h4>
            <span>Account</span>
            <div class="menu-separator"></div>
        </h4>
        <li>
            <a href="#"><span class="material-symbols-outlined"> account_circle </span>Profile</a>
        </li>
        <li>
            <a href="#"><span class="material-symbols-outlined"> settings </span>Settings</a>
        </li>
        <li>
            <form method="post" action="/logout">
                <button type="submit"><span class="material-symbols-outlined"> logout </span>Logout</button>
            </form>
        </li>
    </ul>
    <div class="user-account">
        <div class="user-profile">
            <svg xmlns="http://www.w3.org/2000/svg" width="42px" fill="currentColor" viewBox="0 0 24 24">
                <path
                    d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2m0 5c1.73 0 3 1.27 3 3s-1.27 3-3 3-3-1.27-3-3 1.27-3 3-3m0 13a7.98 7.98 0 0 1-5.48-2.18C7.33 16.16 9.03 15 11 15h2c1.97 0 3.66 1.16 4.47 2.82A7.94 7.94 0 0 1 12 20">
                </path>
            </svg>
            <div class="user-detail">
                <h3><?php $user = $_SESSION['user'];
                echo $user->getUsername(); ?></h3>
                <span>Personal Account</span>
            </div>
        </div>
    </div>
</aside>