<?php

$data = json_decode(file_get_contents("php://input"));

$usrname = mysql_real_escape_string($data->uname);
$upswd = mysql_real_escape_string($data->pswd);
$uemail = mysql_real_escape_string($data->email);

$con = mysql_connect('localhost', 'root', '');
mysql_select_db('sananaii', $con);

$result = mysql_query("INSERT INTO users (name, email, pass) VALUES ('$username', '$upswd', '$uemail')");

echo $result;


?>