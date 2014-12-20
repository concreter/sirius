<?php

$name = $_POST['name'];
$pass = $_POST['pass'];
$mail = $_POST['mail'];

if(isset($name) && isset($pass) && isset($mail)) {
       
    if(!empty($name) && !empty($name) && !empty($name)) {
    
        if(filter_var($mail, FILTER_VALIDATE_EMAIL)) {
            
            require 'include/pdo_connect.php';
            
            try {
                
                $stmt = $pdo->prepare('SELECT mail FROM users WHERE mail=:mail');
                $stmt->execute(array('mail' => $mail));
                
                if($stmt->rowCount() == 0) {
                
                    $stmt = $pdo->prepare('SELECT name FROM users WHERE name=:name');
                    $stmt->execute(array('name' => $name));

                    if($stmt->rowCount() == 0){

                        $pass = password_hash($pass, PASSWORD_DEFAULT);

                        $stmt = $pdo->prepare('INSERT INTO users (name, pass, mail) VALUES (:name, :pass, :mail)');
                        $stmt->execute(array('name' => $name, 'pass' => $pass, 'mail' => $mail));
                        
                        echo "success";

                    } else echo "user with this name exists";
                    
                } else echo "mail is used";
                
            } catch(PDOException $e) {
                
              echo 'Error: ' . $e->getMessage();
                
            }
        
        } else echo "mail error";
        
    } else echo "empty error";   
    
} else echo "isset error";

?>