<html>
<head><title>'facilities' Testing</title></head>
<body>
	<?php
	//Disable notices and error reporting
	error_reporting(E_ERROR);
	
	//Output Log
	$output = "FACILITIES_LOG.txt";
	
	//Record time of testing
	$timestamp = (new DateTime())->getTimeStamp();
	$data = "Time: $timestamp\n";
	file_put_contents($output, $data, FILE_APPEND);
	
	//Tests for the facilities table
	$response = file_get_contents('http://www.killzombieswith.us/aii-api/v1/facilities');
	$response = json_decode($response, true);
	
	//Determine the range of the facilityID's by finding the min and max ID's
	$minID = PHP_INT_MAX;
	$maxID = -1;
	
	
	//'Failed Test' flag
	$failedTests = false;
	
	//Unique name/id tables
	$uniqueNames = [];
	$uniqueID = [];
	
	echo "<h1>Testing 'aii-api/v1/facilities' query...</h1>";
	
	//Perform tests on 'aii-api/v1/facilities'
	foreach($response['records'] as $facility)
	{
		//Test facilities for desired attributes
		
		//Facility properties
		$facilityID = $facility['FacilityID'];
		$name = $facility['Name'];
		$address = $facility['Address1'];
		$zip = $facility['ZipCode'];
		$phone = $facility['Phone'];
		
		//Determine the maximum and minimum ID's
		if($minID > $facilityID)
			$minID = $facilityID;
		if($maxID < $facilityID)
			$maxID = $facilityID;
		
		//Insure each facility ID is unique
		if($uniqueID[(int)$facilityID] == 1)
		{
			$data = "facilities (GET) - FacilityID: $facilityID - DUPLICATE FACILITYID (Name: $name)\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "FacilityID: $facilityID - DUPLICATE FACILITYID (Name: $name)<br>";
			$failedTests = true;
		}
		$uniqueID[(int)$facilityID] = 1;
		//Insure each facility has a valid name 
		if($name == '')
		{
			$data = "facilities (GET) - FacilityID: $facilityID - EMPTY FACILITY NAME\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "FacilityID: $facilityID - EMPTY FACILITY NAME <br>";
			$failedTests = true;
		}
		//Insure facility name is unique
		if($uniqueNames[$name] == 1)
		{
			$data = "facilities (GET) - FacilityID: $facilityID - DUPLICATE FACILITY NAME\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "FacilityID: $facilityID - DUPLICATE FACILITY NAME <br>";
			$failedTests = true;
		}
		$uniqueNames[$username] = 1;
		//Insure address is valid
		if($address == '')
		{
			$data = "facilities (GET) - FacilityID: $facilityID - EMPTY ADDRESS FIELD\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "FacilityID: $facilityID - EMPTY ADDRESS FIELD <br>";
			$failedTests = true;
		}
		//Insure zipcode is valid
		if($zip == '')
		{
			$data = "facilities (GET) - FacilityID: $facilityID - EMPTY ZIPCODE FIELD\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "FacilityID: $facilityID - EMPTY ZIPCODE FIELD <br>";
			$failedTests = true;
		}
		//Insure phone number is valid
		if(strlen($phone) < 10)
		{
			$data = "facilities (GET) - FacilityID: $facilityID - PHONE NUMBER FEWER THAN 10 DIGITS\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "FacilityID: $facilityID - PHONE NUMBER FEWER THAN 10 DIGITS <br>";
			$failedTests = true;
		}
	}
	//Insure that facilityID's do not contain any gaps (are sequential)
	if((count($response['records']) - 1) != ($maxID - $minID))
	{
		$data = "facilities (GET) - FacilityID's are not sequential\n";
		file_put_contents($output, $data, FILE_APPEND);
		echo "FacilityID's are not sequential<br>";
	}
	
	//Display Test Results
	echo "<h3>'aii-api/v1/facilities' (GET) - TESTS COMPLETED</h3>";
	if($failedTests == false)
	{
		$data = "facilities (GET) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h4>Tests Successful!</h4>";
		echo "<ul><h5>No duplicate facility ID's</h5>";
		echo "<h5>No empty facility names</h5>";
		echo "<h5>No duplicate facility names</h5>";
		echo "<h5>No empty address fields</h5>";
		echo "<h5>No empty zipcode fields</h5>";
		echo "<h5>Phone numbers all have 10 or more digits</h5></ul>";
	}
	
	//===================================================================
	
	//Test the POST method for 'facilities'
	echo "<h3>'aii-api/v1/facilities' (POST) - CREATING NEW FACILITY</h3>";
	
	//Generate a random number to help distinguish this Test facility from other Test facilities 
	$uniqueName = "TEST" . ($maxID + 1);
	
	//Insert the Test facility into the database
	$url = 'http://www.killzombieswith.us/aii-api/v1/facilities/';
	$postData = array(
		"FacilityID" => ($maxID + 1), 
		"FacilityTypeID" => "555",
		"Name" => $uniqueName,
		"Address1" => "TEST",
		"ZipCode" => "55555",
		"Phone" => "5555555555",
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
	
	echo "<h5>POST REQUEST SUBMITTED - Test facility</h5>";
	
	//Check if the facility is now in the database
	$testFacilityResponse = file_get_contents('http://www.killzombieswith.us/aii-api/v1/facilities');
	$testFacilityResponse = json_decode($testFacilityResponse, true);
	
	$foundFacility = false;
	
	foreach($testFacilityResponse['records'] as $facility)
	{
		//facility properties
		$facilityID = $facility['FacilityID'];
		$name = $facility['Name'];
		$address = $facility['Address1'];
		$zipCode = $facility['ZipCode'];
		
		if($name == $uniqueName && $address == 'TEST' && $zipCode == '55555')
		{
			$foundFacility = true;
		}
	}

	if($foundFacility)
	{
	$data = "facilities (POST) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h5>POST SUCCESSFUL - Test facility inserted into the database</h5>";
	}
	else
	{
		$data = "facilities (POST) - POSTED FACILITY NOT FOUND (Result: $result)\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h5>POST FAILED - Test facility not found</h5>\nResult: $result";
	}
	
	//=================================================================
	//Test 'facilities/id' query
	
	//Determine if the first facility returned with the 'facilities' query can be 
	//located with the 'facilities/id' query
	
	echo "<h1>Testing 'aii-api/v1/facilities/(id)' query...</h1>";
	
	$firstFacility = $testFacilityResponse['records'][0];
	$firstID = $firstFacility['FacilityID'];
	
	$url = 'http://www.killzombieswith.us/aii-api/v1/facilities/' . $firstID;
	$specificFacilityResponse = file_get_contents($url);
	$specificFacilityResponse = json_decode($specificFacilityResponse, true);
	
	if($specificFacilityResponse['records'][0] == $testFacilityResponse['records'][0])
	{
		$data = "facilities/(id) (GET) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h4>Tests Successful!</h4>";
		echo "<ul><h5>Test facility $firstID matches their record in the facilities query</h5></ul>";
	}
	else
	{
		$data = "facilities/(id) (GET) - 'facilities/(id)' RECORD DOES NOT MATCH THE 'facilities' RECORD\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "facilities/(id) record does not match the facilities record<br>";
	}
	
	//=================================================================
	//Test facilities/id/patients
	echo "<h1>Testing 'aii-api/v1/facilities/(id)/patients' query...</h1>";
	
	//Check to see if the first facility has patients associated with it
	$firstFacility = $response['records'][0]['FacilityID'];
	 
	$url = 'http://www.killzombieswith.us/aii-api/v1/facilities/' . $firstFacility . '/patients';
	$patientsResponse = file_get_contents($url);
	$patientsResponse = json_decode($patientsResponse, true);
	 
	$numPatients = count($patientsResponse['records']);
	if($numPatients == 0)
	{
		$data = "facilities/(id)/patients (GET) - NO PATIENTS FOUND FOR TEST FACILITY (FacilityID: $firstFacility)\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "No patients found for test facility (FacilityID: $firstFacility)<br>";
	}
	else
	{
		$data = "facilities/(id)/patients (GET) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h4>Tests Successful!</h4>";
		echo "<ul><h5>Test facility $firstFacility contains patients</h5></ul>";
	}
	 
	//=================================================================
	//Test facilities/id/careTeams
	echo "<h1>Testing 'aii-api/v1/facilities/(id)/careTeams' query...</h1>";
	
	//Check to see if the first facility has care teams associated with it	 
	$url = 'http://www.killzombieswith.us/aii-api/v1/facilities/' . $firstFacility . '/careTeams';
	$careTeamResponse = file_get_contents($url);
	$careTeamResponse = json_decode($careTeamResponse, true);
	 
	$numTeams = count($careTeamResponse['records']);
	if($numTeams == 0)
	{
		$data = "facilities/(id)/careTeams (GET) - NO CARE TEAMS FOUND FOR TEST FACILITY (FacilityID: $firstFacility)\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "No care teams found for test facility (FacilityID: $firstFacility)<br>";
	}
	else
	{
		$data = "facilities/(id)/careTeams (GET) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h4>Tests Successful!</h4>";
		echo "<ul><h5>Test facility $firstFacility contains care teams</h5></ul>";
	}
	 
	//Add new line at end of the entry for formatting
	$data = "\n";
	file_put_contents($output, $data, FILE_APPEND);
	?>
</body>
</html>