<?php

echo $_POST["street"];
echo $_POST["city"];
echo $_POST["state"];
echo $_POST["zip"]; 
echo $_POST["id"];

$street = $_POST["street"];
$newCity = $_POST["city"];
$newState = $_POST["state"];
$newZip = $_POST["zip"];
$id= $_POST["id"];

$conn = mysqli_connect("localhost", "root", "","aii") or die("Server did not respond");
if(! $conn )

// HMM.. DOO SOMETHING WITH THiSS
$sql = 'UPDATE patient
        SET streetAddress=street, city=newCity, state=newState, zip=newZip,
        WHERE PatientID=id';


$retval = mysql_query( $sql, $conn );
if(! $retval )
{
  die('Could not update data: ' . mysql_error());
}
echo "Updated data successfully\n";
mysql_close($conn);
?>