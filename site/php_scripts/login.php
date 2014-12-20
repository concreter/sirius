<?php

$name = $_POST['name'];
$pass = $_POST['pass'];

if(isset($name) && isset($pass)) {
       
    if(!empty($name) && !empty($name)) {
            
            require 'include/pdo_connect.php';
            
            try {
                
                $stmt = $pdo->prepare('SELECT * FROM users WHERE name=:name');
                $stmt->execute(array('name' => $name));
                
                if($stmt->rowCount() > 0) {
                
                    $row = $stmt->fetch();
                    
                    if (password_verify($pass, $row['pass'])) {
                        
                        session_start();
                        $_SESSION['name'] = $row['name'];
                        
                        echo 'success';
                        
                    }
                    else echo 'password is invalid';
    
                } else echo "user doesnt exists";
                
            } catch(PDOException $e) {
                
              echo 'Error: ' . $e->getMessage();
                
            }
        
    } else echo "empty error";   
    
} else echo "isset error";

?>