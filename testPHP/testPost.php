<?php

  if (isset($_SERVER['HTTP_ORIGIN'])) {
      header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
      header('Access-Control-Allow-Credentials: true');
      header('Access-Control-Max-Age: 86400');    // cache for 1 day
  }
/*
  $PatientID = $_POST['list.PatientID'];
  $fname = $_POST['list.fname'];
  $lname = $_POST['list.lname'];
  $mi = $_POST['list.mi'];
  $DOB = $_POST['list.DOB'];
  $streetAddress = $_POST['list.streetAddress'];
  $city = $_POST['list.city'];
  $state = $_POST['list.state'];
  $zip = $_POST['list.zip'];
  $Sex = $_POST['list.Sex'];
  $Race = $_POST['list.Race'];
  $BMI = $_POST['list.BMI'];
  $Height = $_POST['list.Height'];
  $Weight = $_POST['list.Weight'];


    $con = mysqli_connect("msu2u.net", "root", "rugger31", "Aii") or die("Server did not respond");
    mysqli_query($con,"INSERT INTO patient(PatientID, fname, lname, mi, DOB, streetAddress, city, state, zip,
    Sex, Race, BMI, Height, Weight) VALUES ('$PatientID','$fname','$lname','$mi', '$DOB', '$streetAddress', '$city', '$state', '$zip',
    '$Sex', '$Race', '$BMI', '$Height', '$Weight')");

    echo "1 record was inserted \n";
    echo "Record: ". $_POST['list.fname'];



  mysqli_close($con);

  echo "Pat ID:".$_POST["PatientID"];
  echo "First: ".$_POST["fname"];
  echo "Last: ".$_POST["lname"];
  echo "Middle: ".$_POST["mi"];
  echo "DOB: ".$_POST["DOB"];
  echo "Street Address: ".$_POST["streetAddress"];
  echo "City: ".$_POST["city"];
  echo "State: ".$_POST["state"];
  echo "Zip: ".$_POST["zip"];
  echo "Sex: ".$_POST["Sex"];
  echo "Race: ".$_POST["Race"];
  echo "BMI: ".$_POST["BMI"];
  echo "Height: ".$_POST["Height"];
  echo "Weight: ".$_POST["Weight"];

*/


  echo "First:".$_POST["newOb[0].fname"];

?>
