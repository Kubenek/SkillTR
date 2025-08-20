<!DOCTYPE html>
<html lang="en"> 
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Account | SkillTR</title>
    <link rel="stylesheet" href="/styles/account.css">
    <link rel="stylesheet" href="/styles/basics.css">

    <script src="/js/login.js" type="module" defer></script>
</head>
<body>
    <main class="site-container">
        <section class="login-body">

            <section class="content-wrapper">

                <div class="upper-text">
                    <p class="main">Create an account</p>
                    <p class="secondary">…and explore endless possibilities<p>
                </div>

                <form method="POST" action="/new-account" class="input-fields">
                    <div class="inputBox email">
                        <img src="/../images/icons/bx-envelope-alt.png" class="icon">
                        <input type="text" class="email-input" name="email-input" placeholder="Email" required/>
                    </div>
        
                    <div class="inputBox password">
                        <img src="/../images/icons/bx-lock.png" class="icon">
                        <input type="password" class="pass-input" name="pass-input" placeholder="Password" required/>
                        <img src="/../images/icons/bx-eye-closed.png" id="eyeIcon" class="iconSmall eyeIcon" data-icon="1">
                    </div>

                    <div class="inputBox password">
                        <img src="/../images/icons/bx-lock.png" class="icon">
                        <input type="password" class="pass-input" name="pass-input-repeat" placeholder="Repeat" required/>
                        <img src="/../images/icons/bx-eye-closed.png" id="eyeIcon" class="iconSmall eyeIcon" data-icon="1">
                    </div>

                    <button class="submit-login">Create</button> 
                </form>

                <div class="accC"> <p>Already have an account?</p> <a href="/login">Log in here!</a></div>

            </section>

        </section>

    </main>
</body>
</html>