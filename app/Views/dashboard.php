<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard | SkillTR</title>
</head>
<body>
    <?php
        $userObject = $_SESSION["user"];
        $username = $userObject->getUsername();
        echo "Logged in as " . $username;
    ?>
</body>
</html>