<?php
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

$con = mysqli_connect("localhost", "root", "","sananaii") or die("Server did not respond");
$result = mysqli_query($con,"SELECT * FROM patient_data");

while($row = mysqli_fetch_assoc($result))
{
	$data[] = $row;
}

echo json_encode($data);
?>