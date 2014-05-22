<?php

$street = $_POST["street"];
$city = $_POST["city"];
$state = $_POST["state"];
$zip = $_POST["zip"];

if($street && $city && $state && $zip)
{
	$con = mysqli_connect("localhost", "root", "","aii") or die("Server did not respond");
	mysqli_query($con,"INSERT INTO patient(street, city, state, zip) VALUES ('$fname','$lname','$age')");
	
	
	echo "1 record was inserted";
}
else
{
	echo "Please fill out all required fields";
	
}

mysqli_close($con);

?>

<html>
	<a href="index2.php"> Go Back to form </a>
</html>