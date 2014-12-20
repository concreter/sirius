<?php
    session_start();
    if(!isset($_SESSION['name'])) {
?>
<!doctype html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="styles/index_style.css">
    <!-- script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script -->
    <script src="javascript/jquery.js"></script>
    <script src="javascript/register.js"></script>
    <script src="javascript/login.js"></script>
    <meta name="author" content="Jan Lipnican">
    <meta name="description" content="BomberMan clone MOBA game">
    <meta name="application-name" content="Legend of Ancient Fire">
    <title>Legend of Ancient Fire - main page</title>
</head>
<body>
    <h1 id="logo">
        <a href="index.php">Legend of Ancient Fire</a>
    </h1>
    <form action="#">
        <label for="log_name">Name</label>
        <input type="text" id="log_name">
        <label for="user_name">Password</label>
        <input type="password" id="log_pass">
        <input type="submit" class="submit" id="log_submit" value="Log me in">
    </form>
    <a href="" id="register_btn">I've never played</a>
    <div id="register_wraper">
        <form>
            <label for="reg_name">Name</label>
            <input type="text" id="reg_name">
            <label for="reg_mail">E-mail</label>
            <input type="text" id="reg_mail">
            <label for="reg_password">Password</label>
            <input type="password" id="reg_pass">
            <label for="reg_pass_again">Password again</label>
            <input type="password" id="reg_pass_again">
            <input type="submit" class="submit" id="reg_submit" value="Register me">
        </form>
    </div>
</body>
</html>

<?php
        
    } else {
        header('Location: home.php');
    }