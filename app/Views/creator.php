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
    <link rel="stylesheet" href="/styles/basics.css">
    <link rel="stylesheet" href="/styles/deletePopup.css"/>
    <link rel="stylesheet" href="/styles/lines.css"/>

    <link href='https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css' rel='stylesheet'>
    
    <script src="/js/creator/tools.js" defer type="module"></script>
    <script src="/js/creator/creator.js" defer type="module"></script>
    <script src="/js/creator/drag.js" type="module"></script>
    <script src="/js/zoom.js" defer></script>
</head>
<body>

    <main class="site-container">

        <section class="creator-area">

            <svg class="connection-layer"></svg>

            <?php require_once __DIR__."/Components/creator-tools.php"; ?>

            <div class="canvas-content">

            </div>

            <div class="zoom-tracker">1x</div>

        </section>

    </main>
    
</body>
</html>