<?php

// some cheat sheet 

include 'include/prepared_statements.php';

/*$db = new DB('root', '', 'test');
print_r($db->select('SELECT * FROM objects WHERE ID = ?', array(10), array('%d')));*/

//                                                              ^          ^ 
//                                                          variables   data-type ... remember to put as much %d(integer or %s as string) as much variables are there 
// result returns object !! echo $result->shit
?>