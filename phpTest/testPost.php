<?php

  if (isset($_SERVER['HTTP_ORIGIN'])) {
      header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
      header('Access-Control-Allow-Credentials: true');
      header('Access-Control-Max-Age: 86400');    // cache for 1 day
  }

  $PatientID = $_POST['PatientID'];
  $fname = $_POST['fname'];
  $lname = $_POST['lname'];
  $mi = $_POST['mi'];
  $DOB = $_POST['DOB'];
  $streetAddress = $_POST['streetAddress'];
  $city = $_POST['city'];
  $state = $_POST['state'];
  $zip = $_POST['zip'];
  $Sex = $_POST['Sex'];
  $Race = $_POST['Race'];
  $BMI = $_POST['BMI'];
  $Height = $_POST['Height'];
  $Weight = $_POST['Weight'];


    //$con = mysqli_connect("msu2u.net", "root", "rugger31", "Aii") or die("Server did not respond");
    $con = mysqli_connect("localhost", "root", "", "aii") or die("Server did not respond");
    mysqli_query($con,"INSERT INTO Patient(PatientID, fname, lname, mi, DOB, streetAddress, city, state, zip,
    Sex, Race, BMI, Height, Weight) VALUES ('$PatientID','$fname','$lname','$mi', '$DOB', '$streetAddress', '$city', '$state', '$zip',
    '$Sex', '$Race', '$BMI', '$Height', '$Weight')");

    echo "1 record was inserted \n";

  mysqli_close($con);


?>
