<!DOCTYPE html>
<html lang="en"> 
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | SkillTR</title>
    <link rel="stylesheet" href="/styles/login.css">
    <link rel="stylesheet" href="/styles/basics.css">

    <script src="/js/login.js" type="module" defer></script>
</head>
<body>
    <main class="site-container">

        <section class="login-body">

            <section class="content-wrapper">

                <div class="upper-text">
                    <p class="main">Welcome Back!</p>
                    <p class="secondary">Let's get you back in...</p>
                </div>

                <div class="input-fields">
                    <div class="inputBox email">
                        <img src="/../images/icons/bx-envelope-alt.png" class="icon">
                        <input type="text" class="email-input" placeholder="Email"/>
                    </div>
        
                    <div class="inputBox password">
                        <img src="/../images/icons/bx-lock.png" class="icon">
                        <input type="password" class="pass-input" placeholder="Password"/>
                        <img src="/../images/icons/bx-eye-alt.png" id="eyeIcon" class="iconSmall">
                    </div>

                    <a href="..." class="forgot-password">Forgot password</a>

                    <button class="submit-login">Sign In</button> 
                </div>

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

            </section>

        </section>

    </main>
</body>
</html>