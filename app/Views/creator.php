<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tree Creator | SkillTR</title>
    <link rel="stylesheet" href="/styles/creator.css">
    <link rel="stylesheet" href="/styles/node.css">
    <link rel="stylesheet" href="/styles/zoom.css">
    <link rel="stylesheet" href="/styles/tools.css" />
    <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css" />
    
    <!--<script src="/js/creator/tools.js" defer></script>-->
    <script src="/js/creator/creator.js" defer></script>
    <script src="/js/creator/drag.js"></script>
    <script src="/js/zoom.js" defer></script>
</head>
<body>

    <?php
    
        require_once __DIR__."/Components/creator-tools.php";

    ?>

    <main class="site-container">

        <section class="creator-area">

            <div class="canvas-content">

            </div>

            <div class="zoom-tracker">1x</div>

        </section>

    </main>
    
</body>
</html>