<!DOCTYPE html>
<html lang="en"> 
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | SkillTR</title>
    <link rel="stylesheet" href="/styles/login.css">
    <link rel="stylesheet" href="/styles/basics.css">

    <script src="/js/login.js" type="module" defer></script>
    <script src="/js/close.js" type="module" defer></script>
</head>
<body>
    <main class="site-container">
        <section class="login-body">

            <section class="content-wrapper">

                <div class="upper-text">
                    <p class="main">Welcome Back!</p>
                    <p class="secondary">Let's get you back in...</p>
                </div>

                <form method="POST" action="/login" class="input-fields">
                    <div class="inputBox email">
                        <img src="/../images/icons/bx-envelope-alt.png" class="icon">
                        <input type="text" class="email-input" name="email-input" placeholder="Email"/>
                    </div>
        
                    <div class="inputBox password">
                        <img src="/../images/icons/bx-lock.png" class="icon">
                        <input type="password" class="pass-input" name="pass-input" placeholder="Password"/>
                        <img src="/../images/icons/bx-eye-closed.png" id="eyeIcon" class="iconSmall eyeIcon" data-icon="1">
                    </div>

                    <a href="..." class="forgot-password">Forgot password</a>

                    <button class="submit-login">Sign In</button> 
                </form>

                <div class="socials-hr">
                    <span>or sign in with</span>
                </div>

                <div class="socials">
                    <div class="social-box">
                        <img src="../images/icons/facebook.png" class="social-icon">
                    </div>
                    <div class="social-box">
                        <img src="../images/icons/google.png" class="social-icon">
                    </div>
                    <div class="social-box">
                        <img src="../images/icons/github.png" class="social-icon">
                    </div>
                </div>

                <div class="accC"> <p>Don't have an account?</p> <a href="/new-account">Create one!</a></div>

            </section>

        </section>

    </main>
    <?php if ($errorMSG !== null) : ?>
        <div class="error">
            <div class="error-body">
                <img class="erIcon" src="../images/icons/error.png">
                <p class="header">Something went wrong</p>
                <p class="text"><?php echo $errorMSG ?></p>
            </div>
        </div>
    <?php endif; ?>

</body>
</html>