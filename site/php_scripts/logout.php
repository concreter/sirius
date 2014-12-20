<?php

    session_start();

    unset($_SESSION['name']);
    session_destroy();

    echo 'success';
    header("location: /sirius/site/index.php");