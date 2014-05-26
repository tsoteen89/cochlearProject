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


    $con = mysqli_connect("localhost", "travis", "rugger31", "aii") or die("Server did not respond");
    mysqli_query($con,"INSERT INTO patient(PatientID, fname, lname, mi, DOB, streetAddress, city, state, zip,
    Sex, Race, BMI, Height, Weight) VALUES ('$PatientID','$fname','$lname','$mi', '$DOB', '$streetAddress', '$city', '$state', '$zip',
    '$Sex', '$Race', '$BMI', '$Height', '$Weight')");

    echo "1 record was inserted";

?>