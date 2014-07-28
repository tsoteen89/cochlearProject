<html>
<head><title>'phases' Testing</title></head>
<body>
	<?php
	//Disable notices and error reporting
	error_reporting(E_ERROR);
	
	//Output Log
	$output = "PHASES_LOG.txt";
	
	//Record time of testing
	$timestamp = (new DateTime())->getTimeStamp();
	$data = "Time: $timestamp\n";
	file_put_contents($output, $data, FILE_APPEND);
	
	//Tests for the phases table
	$response = file_get_contents('http://www.killzombieswith.us/aii-api/v1/phases');
	$response = json_decode($response, true);
	
	//Determine the range of the facilityID's by finding the min and max ID's
	$minID = PHP_INT_MAX;
	$maxID = -1;
	
	//'Failed Test' flag
	$failedTests = false;
	
	//Unique name/id tables
	$uniqueNames = [];
	$uniqueID = [];
	
	echo "<h1>Testing 'aii-api/v1/phases' query...</h1>";
	
	//Perform tests on 'aii-api/v1/phases'
	foreach($response['records'] as $phase)
	{
		//Test phases for desired attributes
		
		//Phase properties
		$phaseID = $phase['PhaseID'];
		$name = $phase['Name'];
		
		//Determine the maximum and minimum ID's
		if($minID > $phaseID)
			$minID = $phaseID;
		if($maxID < $phaseID)
			$maxID = $phaseID;
		
		//Insure each phase ID is unique
		if($uniqueID[(int)$phaseID] == 1)
		{
			$data = "phases (GET) - PhaseID: $phaseID - DUPLICATE PHASEID (Name: $name)\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "PhaseID: $phaseID - DUPLICATE PHASEID (Name: $name)<br>";
			$failedTests = true;
		}
		$uniqueID[(int)$phaseID] = 1;
		//Insure each phase has a valid name 
		if($name == '')
		{
			$data = "phases (GET) - PhaseID: $phaseID - EMPTY PHASE NAME\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "PhaseID: $phaseID - EMPTY PHASE NAME <br>";
			$failedTests = true;
		}
		//Insure phase name is unique
		if($uniqueNames[$name] == 1)
		{
			$data = "phases (GET) - PhaseID: $phaseID - DUPLICATE PHASE NAME\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "PhaseID: $phaseID - DUPLICATE PHASE NAME <br>";
			$failedTests = true;
		}
		$uniqueNames[$username] = 1;
	}
	//Insure that phaseID's do not contain any gaps (are sequential)
	if((count($response['records']) - 1) != ($maxID - $minID))
	{
		$data = "phases (GET) - PhaseID's are not sequential\n";
		file_put_contents($output, $data, FILE_APPEND);
		echo "PhaseID's are not sequential<br>";
	}
	
	//Display Test Results
	echo "<h3>'aii-api/v1/phases' (GET) - TESTS COMPLETED</h3>";
	if($failedTests == false)
	{
		$data = "phases (GET) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h4>Tests Successful!</h4>";
		echo "<ul><h5>No duplicate phase ID's</h5>";
		echo "<h5>No empty phase names</h5>";
		echo "<h5>No duplicate phase names</h5></ul>";
	}
	
	//===================================================================
	
	/*
	//Test the POST method for 'phases'
	echo "<h3>'aii-api/v1/phases' (POST) - CREATING NEW PHASE</h3>";
	
	//Generate a random number to help distinguish this Test phase from other Test phases 
	$uniqueName = "TEST" . ($maxID + 1);
	
	//Insert the Test phase into the database
	$url = 'http://www.killzombieswith.us/aii-api/v1/phases/';
	$postData = array(
		"PhaseID" => ($maxID + 1), 
		"Name" => "TEST",
		"Description" => "TEST");
		
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
	
	echo "<h5>POST REQUEST SUBMITTED - Test phase</h5>";
	
	//Check if the phase is now in the database
	$testPhaseResponse = file_get_contents('http://www.killzombieswith.us/aii-api/v1/phases');
	$testPhaseResponse = json_decode($testPhaseResponse, true);
	
	$foundPhase = false;
	
	foreach($testPhaseResponse['records'] as $phase)
	{
		//phase properties
		$phaseID = $phase['PhaseID'];
		$name = $phase['Name'];
		$description = $phase['Description'];
		
		if($phaseID == ($maxID + 1) && $name == 'TEST' && $description == 'TEST')
		{
			$foundPhase = true;
		}
	}

	if($foundPhase)
	{
	$data = "phases (POST) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h5>POST SUCCESSFUL - Test phase inserted into the database</h5>";
	}
	else
	{
		$data = "phases (POST) - POSTED PHASE NOT FOUND (Result: $result)\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h5>POST FAILED - Test phase not found</h5>\nResult: ";
		var_dump($result);
	}
	*/
	
	//=================================================================
	//Test 'phases/id' query
	
	//Determine if the first phase returned with the 'phases' query can be 
	//located with the 'phases/id' query
	
	echo "<h1>Testing 'aii-api/v1/phases/(id)' query...</h1>";
	
	$firstPhase = $response['records'][0];
	$firstID = $firstPhase['PhaseID'];
	
	$url = 'http://www.killzombieswith.us/aii-api/v1/phases/' . $firstID;
	$specificPhaseResponse = file_get_contents($url);
	$specificPhaseResponse = json_decode($specificPhaseResponse, true);
	
	if($specificPhaseResponse['records'][0] == $response['records'][0])
	{
		$data = "phases/(id) (GET) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h4>Tests Successful!</h4>";
		echo "<ul><h5>Test phase $firstID matches their record in the phases query</h5></ul>";
	}
	else
	{
		$data = "phases/(id) (GET) - 'phases/(id)' RECORD DOES NOT MATCH THE 'phases' RECORD\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "phases/(id) record does not match the phases record<br>";
	}
	
	//=================================================================
	 //Test phases/id/questions
	 
	 echo "<h1>Testing 'aii-api/v1/phases/(id)/questions' query...</h1>";
	 
	 $failedQuestionTests = false;
	 
	 //Determine how many phases exist
	 $numPhases = count($response['records']);
	 
	 //For each phase, get its questions and insure that questions exist
	 for($i = 1; $i <= $numPhases; $i++)
	 {
		$url = 'http://www.killzombieswith.us/aii-api/v1/phases/' . $i . '/questions';
		$phaseQuestions = file_get_contents($url);
		$phaseQuestions = json_decode($phaseQuestions, true);
		$phaseQuestions = $phaseQuestions['records'];
		
		//Test the response
		if(count($phaseQuestions) == 0)
		{
			$data = "phases/(id)/questions (GET) - PhaseID: $i - NO QUESTIONS EXIST\n";
			file_put_contents($output, $data, FILE_APPEND);
			
			echo "<h5>No questions exist for phase " . $i . "</h5>";
			$failedQuestionTests = true;
		}
	 }
	 echo "<h3>'aii-api/v1/phases/(id)/questions' (GET) - TESTS COMPLETED</h3>";
	 
	 if($failedQuestionTests == false)
	 {
		$data = "phases/(id)/questions (GET) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h4>Tests Successful!</h4>";
		echo "<ul><h5>Every phase contains questions</h5></ul>";
	 }
	 
	 //Add new line at end of the entry for formatting
	$data = "\n";
	file_put_contents($output, $data, FILE_APPEND);
	?>
</body>
</html>