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
    $con = mysqli_connect("localhost", "root", "root", "aii") or die("Server did not respond");
    mysqli_query($con,"INSERT INTO Patient(PatientID, fname, lname, mi, DOB, streetAddress, city, state, zip,
    Sex, Race, BMI, Height, Weight) VALUES ('$PatientID','$fname','$lname','$mi', '$DOB', '$streetAddress', '$city', '$state', '$zip',
    '$Sex', '$Race', '$BMI', '$Height', '$Weight')");

    echo "1 record was inserted \n";



  mysqli_close($con);
/*
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




/*
    echo $_POST['name'];
    echo $_POST['superheroAlias'];


$errors         = array();  	// array to hold validation errors
$data 			= array(); 		// array to pass back data

// validate the variables ======================================================
	if (empty($_POST['name']))
		$errors['name'] = 'Name is required.';

	if (empty($_POST['superheroAlias']))
		$errors['superheroAlias'] = 'Superhero alias is required.';

// return a response ===========================================================

	// response if there are errors
	if ( ! empty($errors)) {

		// if there are items in our errors array, return those errors
		$data['success'] = false;
		$data['errors']  = $errors;
	} else {

		// if there are no errors, return a message
		$data['success'] = true;
		$data['message'] = 'Success!';
	}

	// return all our data to an AJAX call
	echo json_encode($data);
*/

?>
