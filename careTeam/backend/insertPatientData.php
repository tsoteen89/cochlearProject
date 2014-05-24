<?php

  if (isset($_SERVER['HTTP_ORIGIN'])) {
      header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
      header('Access-Control-Allow-Credentials: true');
      header('Access-Control-Max-Age: 86400');    // cache for 1 day
  }

$username = $_POST['UserName'];
$email = $_POST['Email'];
$password = $_POST['pwd'];

echo $username;
echo $email;
echo $password;



    //$con = mysqli_connect("msu2u.net", "root", "rugger31", "Aii") or die("Server did not respond");
    $con = mysqli_connect("localhost", "root", "", "sananaii") or die("Server did not respond");
    mysqli_query($con,"INSERT INTO users(name, email, pass) VALUES ('$username', '$email', '$password')");

    echo "1 record was inserted \n";

  mysqli_close($con);


?>
