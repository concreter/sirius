<?php

    session_start();
    if(isset($_SESSION['name'])) {
?>
<!doctype html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <div id="wraper-top">
        <a href="php_scripts/logout.php">Log me off</a>
        <span id="user"><?php echo $_SESSION['name']; ?></span>
    </div>
</body>
</html>
  
<?php
        
    } else {
        echo 'u are not loged in';
        header("location: /sirius/site/index.php");   
    }

?>