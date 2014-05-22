<?php


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


    $con = mysqli_connect("localhost", "travis", "scooter", "aii") or die("Server did not respond");
    mysqli_query($con,"INSERT INTO Patient(PatientID, fname, lname, mi, DOB, streetAddress, city, state, zip,
    Sex, Race, BMI, Height, Weight) VALUES ('$PatientID','$fname','$lname','$mi', '$DOB', '$streetAddress', '$city', '$state', '$zip',
    '$Sex', '$Race', '$BMI', '$Height', '$Weight')");

    echo "1 record was inserted";



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

?>
