<?php


if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

$con = mysqli_connect("localhost", "root", "","aii") or die("Server did not respond");
//$con = mysqli_connect("msu2u.net", "root", "rugger31","Aii") or die("Server did not respond");
$result = mysqli_query($con,"SELECT * FROM patient");

while($row = mysqli_fetch_assoc($result))
{
	$data[] = $row;
}

echo json_encode($data);


?>