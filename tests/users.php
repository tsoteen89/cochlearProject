<html>
<head><title>'users' Testing</title></head>
<body>
	<?php
	/*
	Tests users for:
	-Unique User ID's
	-
	*/
	//Disable notices and error reporting
	error_reporting(E_ERROR);
	
	//Output Log
	$output = "USERS_LOG.txt";
	
	//Record time of testing
	$timestamp = (new DateTime())->getTimeStamp();
	$data = "Time: $timestamp\n";
	file_put_contents($output, $data, FILE_APPEND);
	
	//Tests for the users table
	$response = file_get_contents('http://www.killzombieswith.us/aii-api/v1/users');
	$response = json_decode($response, true);
	
	//Determine the range of the userID's by finding the min and max ID's
	$minID = PHP_INT_MAX;
	$maxID = -1;
	
	
	//'Failed Test' flag
	$failedTests = false;
	
	//Unique username/id tables
	$uniqueNames = [];
	$uniqueID = [];
	
	$count = 0;
	
	echo "<h1>Testing 'aii-api/v1/users' query...</h1>";
	//Perform tests on 'aii-api/v1/users'
	//for($i = 0; $i < count($response); $i++)
	foreach($response['records'] as $user)
	{
		//Test users for desired attributes
		
		//User properties
		$userID = $user['UserID'];
		$username = $user['username'];
		$password = $user['password'];
		
		//Determine the maximum and minimun ID's
		if($minID > $userID)
			$minID = $userID;
		if($maxID < $userID)
			$maxID = $userID;
		
		//Insure each userID is unique
		if($uniqueID[(int)$userID] == 1)
		{
			//Record errors
			$data = "users (GET) - UserID: $userID - DUPLICATE USERID (username: $username)\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "UserID: $userID - DUPLICATE USERID (username: $username)<br>";
			$failedTests = true;
		}
		$uniqueID[(int)$userID] = 1;
		//Insure each user has a valid username 
		if($username == '')
		{
			$data = "users (GET) - UserID: $userID - EMPTY USERNAME\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "UserID: $userID - EMPTY USERNAME <br>";
			$failedTests = true;
		}
		//Insure username is unique
		if($uniqueNames[$username] == 1)
		{
			$data = "users (GET) - UserID: $userID - DUPLICATE USERNAME (username: $username)\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "UserID: $userID - DUPLICATE USERNAME (username: $username)<br>";
			$failedTests = true;
		}
		$uniqueNames[$username] = 1;
		//Insure password is valid
		if(strlen($password) < 6)
		{
			$data = "users (GET) - UserID: $userID - PASSWORD LESS THAN 6 CHARACTERS (password: $password)\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "UserID: $userID - PASSWORD LESS THAN 6 CHARACTERS (password: $password)<br>";
			$failedTests = true;
		}
		
	}
	//Insure that userID's do not contain any gaps (are sequential)
	if((count($response['records']) - 1) != ($maxID - $minID))
	{
		$data = "users (GET) - UserID's are not sequential\n";
		file_put_contents($output, $data, FILE_APPEND);
		echo "UserID's are not sequential<br>";
		//$failedTests = true;
	}
	else
	{
		echo "UserID's are sequential<br>";
	}
	
	//Display Test Results
	echo "<h3>'aii-api/v1/users' (GET) - TESTS COMPLETED</h3>";
	if($failedTests == false)
	{
		$data = "users (GET) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h4>Tests Successful!</h4>";
		echo "<ul><h5>No duplicate user ID's</h5>";
		echo "<h5>No blank usernames</h5>";
		echo "<h5>No duplicate usernames</h5>";
		echo "<h5>Passwords are all 6 characters or longer</h5></ul>";
	}
	
	//===================================================================
	
	//Test the POST method for 'users'
	echo "<h3>'aii-api/v1/users' (POST) - CREATING NEW USER</h3>";
	
	//Generate a random number to help distinguish this Test user from other Test users 
	$uniqueUsername = "TEST" . ($maxID + 1);
	
	//Insert the Test user into the database
	$url = 'http://www.killzombieswith.us/aii-api/v1/users/';
	$postData = array(
		"username" => $uniqueUsername, 
		"password" => "TEST",
		"email" => "TEST",
		"phone" => "5555555555",
		"FacilityID" => "42",
		"UserLevelID" => "42",
		"created_on" => "42",
		"first_name" => "TEST",
		"last_name" => "TEST",
		"TitleID" => "42");

	$options = array(
		'http' => array(
			'header'  => "Content-Type: application/json\r\n" .
						 "Accept: application/json\r\n",
			'method'  => 'POST',
			'content' => json_encode($postData),
		),
	);
	$context  = stream_context_create($options);
	$result = file_get_contents($url, false, $context);
	
	echo "<h5>POST REQUEST SUBMITTED - Test User</h5>";
	
	//Check if the user is now in the database
	$testUserResponse = file_get_contents('http://www.killzombieswith.us/aii-api/v1/users');
	$testUserResponse = json_decode($testUserResponse, true);
	
	$foundUser = false;
	
	foreach($testUserResponse['records'] as $user)
	{
		//User properties
		$userID = $user['UserID'];
		$username = $user['username'];
		$password = $user['password'];
		$facilityID = $user['FacilityID'];
		
		if($username == $uniqueUsername && $password == 'TEST' && $facilityID == '42')
		{
			$foundUser = true;
		}
	}

	if($foundUser)
	{
	$data = "users (POST) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h5>POST SUCCESSFUL - Test User inserted into the database</h5>";
	}
	else
	{
		$data = "users (POST) - POSTED USER NOT FOUND (Result: $result)\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h5>POST FAILED - Test User not found</h5>\nResult: $result";
	}
	
	//=================================================================
	//Test 'users/id' query
	
	//Determine if the first user returned with the 'users' query can be 
	//located with the 'users/id' query
	
	echo "<h1>Testing 'aii-api/v1/users/(id)' query...</h1>";
	
	$firstUser = $testUserResponse['records'][0];
	$firstID = $firstUser['UserID'];
	
	$url = 'http://www.killzombieswith.us/aii-api/v1/users/' . $firstID;
	$specificUserResponse = file_get_contents($url);
	$specificUserResponse = json_decode($specificUserResponse, true);
	
	if($specificUserResponse['records'][0] == $testUserResponse['records'][0])
	{
		$data = "users/(id) (GET) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h4>Tests Successful!</h4>";
		echo "<ul><h5>Test user $firstID matches their record in the users query</h5></ul>";
	}
	else
	{
		$data = "users/(id) (GET) - 'users/(id)' RECORD DOES NOT MATCH THE 'users' RECORD\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "users/(id) record does not match the users record<br>";
	}
	
	
	//=================================================================
	//Test users/id/inbox
	
	echo "<h1>Testing 'aii-api/v1/users/(id)/inbox' query...</h1>";

	$testUser = 30;
	
	//Check to see if the first user has messages associated with it	 
	$url = 'http://www.killzombieswith.us/aii-api/v1/users/' . $testUser . '/inbox';
	$inboxResponse = file_get_contents($url);
	$inboxResponse = json_decode($inboxResponse, true);
	
	$numInbox = count($inboxResponse['records']);
	if($numInbox == 0)
	{
		$data = "users/(id)/inbox (GET) - NO INBOX MESSAGES FOUND FOR TEST USER (UserID: $testUser)\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "No inbox messages found for test user (UserID: $testUser)<br>";
	}
	else
	{
		$data = "users/(id)/inbox (GET) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h4>Tests Successful!</h4>";
		echo "<ul><h5>Test user $testUser contains inbox messages</h5></ul>";
	}
	 
	//=================================================================
	//Test users/id/sent
	echo "<h1>Testing 'aii-api/v1/users/(id)/sent' query...</h1>";
	
	//Check to see if the first user has messages associated with it 
	$url = 'http://www.killzombieswith.us/aii-api/v1/users/' . $testUser . '/sent';
	$sentResponse = file_get_contents($url);
	$sentResponse = json_decode($sentResponse, true);
	 
	$numSent = count($sentResponse['records']);
	if($numSent == 0)
	{
		$data = "users/(id)/sent (GET) - NO SENT MESSAGES FOUND FOR TEST USER (UserID: $testUser)\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "No sent messages found for test user (UserID: $testUser)<br>";
	}
	else
	{
		$data = "users/(id)/sent (GET) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h4>Tests Successful!</h4>";
		echo "<ul><h5>Test user $testUser contains sent messages</h5></ul>";
	}
	 
	//=================================================================
	//Test users/id/drafts
	echo "<h1>Testing 'aii-api/v1/users/(id)/drafts' query...</h1>";
	
	//Check to see if the first user has messages associated with it 
	$url = 'http://www.killzombieswith.us/aii-api/v1/users/' . $testUser . '/drafts';
	$draftsResponse = file_get_contents($url);
	$draftsResponse = json_decode($draftsResponse, true);
	 
	$numDrafts = count($draftsResponse['records']);
	if($numDrafts == 0)
	{
		$data = "users/(id)/drafts (GET) - NO DRAFT MESSAGES FOUND FOR TEST USER (UserID: $testUser)\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "No draft messages found for test user (UserID: $testUser)<br>";
	}
	else
	{
		$data = "users/(id)/drafts (GET) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h4>Tests Successful!</h4>";
		echo "<ul><h5>Test user $testUser contains draft messages</h5></ul>";
	}
	 
	//=================================================================
	//Test users/id/deletedMessages
	
	echo "<h1>Testing 'aii-api/v1/users/(id)/deleted' query...</h1>";
	
	//Check to see if the first user has messages associated with it 
	$url = 'http://www.killzombieswith.us/aii-api/v1/users/' . $testUser . '/deleted';
	$deletedResponse = file_get_contents($url);
	$deletedResponse = json_decode($deletedResponse, true);
	 
	$numDeleted = count($deletedResponse['records']);
	if($numDeleted == 0)
	{
		$data = "users/(id)/deleted (GET) - NO DELETED MESSAGES FOUND FOR TEST USER (UserID: $testUser)\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "No deleted messages found for test user (UserID: $testUser)<br>";
	}
	else
	{
		$data = "users/(id)/deleted (GET) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h4>Tests Successful!</h4>";
		echo "<ul><h5>Test user $testUser contains deleted messages</h5></ul>";
	}
	 
	//Add new line at end of the entry for formatting
	$data = "\n";
	file_put_contents($output, $data, FILE_APPEND);
	?>
</body>
</html>