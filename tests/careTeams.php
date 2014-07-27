<html>
<head><title>'careTeams' Testing</title></head>
<body>
	<?php
	//Disable notices and error reporting
	error_reporting(E_ERROR);
	
	//Output Log
	$output = "CARETEAMS_LOG.txt";
	
	//Record time of testing
	$timestamp = (new DateTime())->getTimeStamp();
	$data = "Time: $timestamp\n";
	file_put_contents($output, $data, FILE_APPEND);
	
	//Tests for the careTeams table
	$response = file_get_contents('http://www.killzombieswith.us/aii-api/v1/careTeams');
	$response = json_decode($response, true);
	
	//Determine the range of the careTeamID's by finding the min and max ID's
	$minID = PHP_INT_MAX;
	$maxID = -1;
	
	//Record all existing patient ID's
	$patientResponse = file_get_contents('http://www.killzombieswith.us/aii-api/v1/patients');
	$patientResponse = json_decode($patientResponse, true);
	$patientIDTable = [];
	foreach($patientResponse['records'] as $patient){
		if($patient['PatientID'] != '')
			$patientID = (int)$patient['PatientID'];
		$patientIDTable[$patientID] = 1;
	}
	
	//Record all existing facility ID's
	$facilityResponse = file_get_contents('http://www.killzombieswith.us/aii-api/v1/facilities');
	$facilityResponse = json_decode($facilityResponse, true);
	$facilityIDTable = [];
	foreach($facilityResponse['records'] as $facility){
		if($facility['FacilityID'] != '')
			$facilityID = (int)$facility['FacilityID'];
		$facilityIDTable[$facilityID] = 1;
	}
	
	//Record all existing phase ID's
	$phaseResponse = file_get_contents('http://www.killzombieswith.us/aii-api/v1/phases');
	$phaseResponse = json_decode($phaseResponse, true);
	$phaseIDTable = [];
	foreach($phaseResponse['records'] as $phase){
		if($phase['PhaseID'] != '')
			$phaseID = (int)$phase['PhaseID'];
		$phaseIDTable[$phaseID] = 1;
	}
	
	//'Failed Test' flag
	$failedTests = false;
	
	//Unique id table
	$uniqueID = [];
	
	echo "<h1>Testing 'aii-api/v1/careTeams' query...</h1>";
	
	//Perform tests on 'aii-api/v1/careTeams'
	foreach($response['records'] as $careTeam)
	{
		//Test care teams for desired attributes
		
		//Care Team properties
		$careTeamID = $careTeam['CareTeamID'];
		$patientID = $careTeam['PatientID'];
		$originalFacilityID = $careTeam['OriginalFacilityID'];
		$currentPhaseID = $careTeam['CurrentPhaseID'];
		
		//Determine the maximum and minimum ID's
		if($minID > $careTeamID)
			$minID = $careTeamID;
		if($maxID < $careTeamID)
			$maxID = $careTeamID;
		
		//Insure each care team has a unique id 
		if($uniqueNames[(int)$careTeamID] == 1)
		{
			$data = "careTeams (GET) - CareTeamID: $careTeamID - DUPLICATE CARETEAM ID\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "CareTeamID: $careTeamID - DUPLICATE CARETEAM ID <br>";
			$failedTests = true;
		}
		$uniqueNames[(int)$careTeamID] = 1;
		//Insure patient id corresponds with an existing patient
		if($patientIDTable[(int)$patientID] != 1)
		{
			$data = "careTeams (GET) - CareTeamID: $careTeamID - PATIENT DOES NOT EXIST (PatientID: $patientID)\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "CareTeamID: $careTeamID - PATIENT DOES NOT EXIST (PatientID: $patientID)<br>";
			$failedTests = true;
		}
		//Insure facility id corresponds with an existing facility
		if($facilityIDTable[(int)$originalFacilityID] != 1)
		{
			$data = "careTeams (GET) - CareTeamID: $careTeamID - FACILITY DOES NOT EXIST (FacilityID: $facilityID)\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "CareTeamID: $careTeamID - FACILITY DOES NOT EXIST (FacilityID: $facilityID)<br>";
			$failedTests = true;
		}
		//Insure current phase id corresponds with an existing phase
		if($phaseIDTable[(int)$currentPhaseID] != 1)
		{
			$data = "careTeams (GET) - CareTeamID: $careTeamID - PHASE DOES NOT EXIST (PhaseID: $currentPhaseID)\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "CareTeamID: $careTeamID - PHASE DOES NOT EXIST (PhaseID: $currentPhaseID)<br>";
			$failedTests = true;
		}
	}
	//Insure that care team ID's do not contain any gaps (are sequential)
	if((count($response['records']) - 1) != ($maxID - $minID))
	{
		$data = "careTeams (GET) - CareTeamID's are not sequential\n";
		file_put_contents($output, $data, FILE_APPEND);
		echo "CareTeamID's are not sequential<br>";
	}
	
	//Display Test Results
	echo "<h3>'aii-api/v1/careTeams' (GET) - TESTS COMPLETED</h3>";
	if($failedTests == false)
	{
		$data = "careTeams (GET) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h4>Tests Successful!</h4>";
		echo "<ul><h5>No duplicate care team ID's</h5>";
		echo "<h5>No nonexistent patients</h5>";
		echo "<h5>No nonexistent facilities</h5>";
		echo "<h5>No nonexistent phases</h5></ul>";
	}
	
	//===================================================================
	
	//Test the POST method for 'careTeams'
	echo "<h3>'aii-api/v1/careTeams' (POST) - CREATING NEW CARE TEAM</h3>";
	
	//Insert the Test care team into the database
	$url = 'http://www.killzombieswith.us/aii-api/v1/careTeams/';
	$postData = array(
		"CareTeamID" => ($maxID + 1), 
		"PatientID" => "55555",
		"OriginalFacilityID" => "55555",
		"CurrentPhaseID" => "55",
		"Description" => "TEST",
		"IsArchived" => "0",
		"CreatedOn" => "55");

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
	
	echo "<h5>POST REQUEST SUBMITTED - Test care team</h5>";
	
	//Check if the care team is now in the database
	$testCareTeamResponse = file_get_contents('http://www.killzombieswith.us/aii-api/v1/careTeams');
	$testCareTeamResponse = json_decode($testCareTeamResponse, true);
	
	$foundCareTeam = false;
	
	foreach($testCareTeamResponse['records'] as $careTeam)
	{
		//care team properties
		$careTeamID = $careTeam['CareTeamID'];
		$patientID = $careTeam['PatientID'];
		$originalFacilityID = $careTeam['OriginalFacilityID'];
		$description = $careTeam['Description'];
		
		if($careTeamID == ($maxID + 1) && $patientID == '55555' && $originalFacilityID == '55555' 
			&& $description == 'TEST')
		{
			$foundCareTeam = true;
		}
	}

	if($foundCareTeam)
	{
	$data = "careTeams (POST) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h5>POST SUCCESSFUL - Test care team inserted into the database</h5>";
	}
	else
	{
		$data = "careTeams (POST) - POSTED CARE TEAM NOT FOUND (Result: $result)\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h5>POST FAILED - Test care team not found</h5>\nResult: $result";
	}
	
	//=================================================================
	//Test 'careTeams/id' query
	
	//Determine if the first care team returned with the 'careTeams' query can be 
	//located with the 'careTeams/id' query
	
	echo "<h1>Testing 'aii-api/v1/careTeams/(id)' query...</h1>";
	
	$firstCareTeam = $testCareTeamResponse['records'][0];
	$firstID = $firstCareTeam['CareTeamID'];
	
	$url = 'http://www.killzombieswith.us/aii-api/v1/careTeams/' . $firstID;
	$specificCareTeamResponse = file_get_contents($url);
	$specificCareTeamResponse = json_decode($specificCareTeamResponse, true);
	
	if($specificCareTeamResponse['records'][0] == $testCareTeamResponse['records'][0])
	{
		$data = "careTeams/(id) (GET) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h4>Tests Successful!</h4>";
		echo "<ul><h5>Test care team $firstID matches their record in the careTeams query</h5></ul>";
	}
	else
	{
		$data = "careTeams/(id) (GET) - 'careTeams/(id)' RECORD DOES NOT MATCH THE 'careTeams' RECORD\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "careTeams/(id) record does not match the careTeams record<br>";
	}
	
	//=================================================================
	 //Test careTeams/(id)/facilities
	 
	 echo "<h1>Testing 'aii-api/v1/careTeams/(id)/facilities' query...</h1>";
	 
	 //Establish the patient to test against (the first patient)
	 $firstCareTeam = $response['records'][0]['CareTeamID'];
	 
	 $facilitiesResponse = file_get_contents('http://www.killzombieswith.us/aii-api/v1/careTeams/' . $firstCareTeam . '/facilities');
	 $facilitiesResponse = json_decode($facilitiesResponse, true);
	 
	 //Determine how many facilities exist
	 $numFacilities = count($facilitiesResponse['records']);
	 
	 //For each phase, get its questions and insure that questions exist
	 if($numFacilities == 0)
	{
		$data = "careTeams/(id)/facilities (GET) - NO CARE TEAMS FOUND FOR TEST PATIENT (PatientID: $firstPatient)\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "No facilities found for test care team (PatientID: $firstPatient)<br>";
	}
	else
	{
		$data = "careTeams/(id)/facilities (GET) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h4>Tests Successful!</h4>";
		echo "<ul><h5>Test careTeam $firstCareTeam contains care facilities</h5></ul>";
	}
	 
	//Add new line at end of the entry for formatting
	$data = "\n";
	file_put_contents($output, $data, FILE_APPEND);
	 
	?>
</body>
</html>