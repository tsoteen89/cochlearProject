<?php

  if (isset($_SERVER['HTTP_ORIGIN'])) {
      header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
      header('Access-Control-Allow-Credentials: true');
      header('Access-Control-Max-Age: 86400');    // cache for 1 day
  }
/*
$username = $_POST['UserName'];
$email = $_POST['Email'];
$password = $_POST['pwd'];
*/
    
$pID = $_POST['patientId'];
$fName = $_POST['fName'];
$lName = $_POST['lName'];
$dob = $_POST['dob'];
$careStatus = $_POST['careStatus'];
$ear = $_POST['ear'];
$treatment = $_POST['treatment'];

echo $pID;
echo $fName;
echo $lName;
echo $dob;
echo $careStatus;
echo $ear;
echo $treatment;


/*
patientId
fName
lName
dob
careStatus
ear
treatment
*/



    //$con = mysqli_connect("msu2u.net", "root", "rugger31", "Aii") or die("Server did not respond");
    $con = mysqli_connect("localhost", "root", "", "sananaii") or die("Server did not respond");
    mysqli_query($con,"INSERT INTO patients(patientID, fName, lName, DOB, careStatus, ear, treatment) VALUES ('$pID', '$fName', '$lName', '$dob', '$careStatus', '$ear', '$treatment')");

    echo "1 record was inserted \n";

  mysqli_close($con);


?>
