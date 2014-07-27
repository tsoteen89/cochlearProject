<html>
<head><title>'patients' Testing</title></head>
<body>
	<?php
	//Disable notices and error reporting
	error_reporting(E_ERROR);
	
	//Output Log
	$output = "PATIENTS_LOG.txt";
	
	//Record time of testing
	$timestamp = (new DateTime())->getTimeStamp();
	$data = "Time: $timestamp\n";
	file_put_contents($output, $data, FILE_APPEND);
	
	//Tests for the patients table
	$response = file_get_contents('http://www.killzombieswith.us/aii-api/v1/patients');
	$response = json_decode($response, true);
	
	//Determine the range of the patientID's by finding the min and max ID's
	$minID = PHP_INT_MAX;
	$maxID = -1;
	
	
	//'Failed Test' flag
	$failedTests = false;
	
	//Unique id table
	$uniqueID = [];
	
	echo "<h1>Testing 'aii-api/v1/patients' query...</h1>";
	
	//Perform tests on 'aii-api/v1/patients'
	foreach($response['records'] as $patient)
	{
		//Test patients for desired attributes
		
		//Patient properties
		$patientID = $patient['PatientID'];
		$fname = $patient['First'];
		$lname = $patient['Last'];
		$dob = $patient['DOB'];
		$sex = $patient['Sex'];
		$race = $patient['Race'];
		$bmi = $patient['BMI'];
		$height = $patient['Height'];
		$weight = $patient['Weight'];
		
		//Determine the maximum and minimum ID's
		if($minID > $patientID)
			$minID = $patientID;
		if($maxID < $patientID)
			$maxID = $patientID;
		
		//Insure patient ID is unique
		if($uniqueID[$patientID] == 1)
		{
			$data = "patients (GET) - PatientID: $patientID $fname $lname - DUPLICATE PATIENT ID (Last, First: $lname, $fname)\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "PatientID: $patientID $fname $lname - DUPLICATE PATIENT ID (Last, First: $lname, $fname)<br>";
			$failedTests = true;
		}
		$uniqueID[$patientID] = 1;
		//Insure first name is valid
		if($fname == '')
		{
			$data = "patients (GET) - PatientID: $patientID - EMPTY FIRST NAME FIELD\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "PatientID: $patientID - EMPTY FIRST NAME FIELD <br>";
			$failedTests = true;
		}
		//Insure last name is valid
		if($lname == '')
		{
			$data = "patients (GET) - PatientID: $patientID - EMPTY LAST NAME FIELD\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "PatientID: $patientID - EMPTY LAST NAME FIELD <br>";
			$failedTests = true;
		}
		//Insure date of birth is valid
		$month = (int)substr($dob,0,2);
		$day = (int)substr($dob,2,2);
		$year = (int)substr($dob,4);
		if(strlen($dob) != 8 || $month > 12 || $day > 31 || $year < 1850)
		{
			$data = "patients (GET) - PatientID: $patientID - INCORRECTLY FORMATTED DOB (dob: $dob - $month / $day / $year)\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "PatientID: $patientID - INCORRECTLY FORMATTED DOB (dob: $dob - $month / $day / $year) <br>";
			$failedTests = true;
		}
		//Insure sex is valid
		if($sex == '')
		{
			$data = "patients (GET) - PatientID: $patientID - EMPTY SEX FIELD\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "PatientID: $patientID - EMPTY SEX FIELD<br>";
			$failedTests = true;
		}
		if(strlen($sex) > 1)
		{
			$data = "patients (GET) - PatientID: $patientID - INCORRECTLY FORMATTED SEX (sex: $sex)\n";
			file_put_contents($output, $data, FILE_APPEND);
			echo "PatientID: $patientID - INCORRECTLY FORMATTED SEX (sex: $sex) <br>";
			$failedTests = true;
		}
	}
	//Insure that PatientID's do not contain any gaps (are sequential)
	if((count($response['records']) - 1) != ($maxID - $minID))
	{
		$data = "patients (GET) - PatientID's are not sequential\n";
		file_put_contents($output, $data, FILE_APPEND);
		echo "PatientID's are not sequential<br>";
	}
	
	//Display Test Results
	echo "<h3>'aii-api/v1/patients' (GET) - TESTS COMPLETED</h3>";
	if($failedTests == false)
	{
		$data = "patients (GET) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h4>Tests Successful!</h4>";
		echo "<h5>No duplicate patient ID's</h5>";
		echo "<h5>No empty name fields</h5>";
		echo "<h5>Dates of birth formatted correctly</h5>";
		echo "<h5>No empty or incorrect sex fields</h5></ul>";
	}
	
	//===================================================================
	
	//Test the POST method for 'patients'
	echo "<h3>'aii-api/v1/patients' (POST) - CREATING NEW PATIENT</h3>";
	
	//Generate a random number to help distinguish this Test patient from other Test patients 
	$uniqueName = "TEST" . ($maxID + 1);
	
	//Insert the Test patient into the database
	$url = 'http://www.killzombieswith.us/aii-api/v1/patients/';
	$postData = array(
		"PatientID" => ($maxID + 1), 
		"First" => "TEST",
		"Last" => "TEST",
		"DOB" => "04021942",
		"Sex" => "Z",
		"Race" => "TEST",
		"BMI" => "55.00",
		"Height" => "55",
		"Weight" => "55");
		
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
	
	echo "<h5>POST REQUEST SUBMITTED - Test patient</h5>";
	
	//Check if the patient is now in the database
	$testPatientResponse = file_get_contents('http://www.killzombieswith.us/aii-api/v1/patients');
	$testPatientResponse = json_decode($testPatientResponse, true);
	
	$foundPatient = false;
	
	foreach($testPatientResponse['records'] as $patient)
	{
		//patient properties
		$patientID = $patient['PatientID'];
		$first = $patient['Name'];
		$last = $patient['Address1'];
		$sex = $patient['Sex'];
		
		if($patientID == ($maxID + 1) && $first == 'TEST' && $last == 'TEST' && $sex == 'Z')
		{
			$foundPatient = true;
		}
	}

	if($foundPatient)
	{
	$data = "patients (POST) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h5>POST SUCCESSFUL - Test patient inserted into the database</h5>";
	}
	else
	{
		$data = "patients (POST) - POSTED PATIENT NOT FOUND (Result: $result)\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h5>POST FAILED - Test patient not found</h5>\nResult: ";
		var_dump($result);
	}
	
	//=================================================================
	//Test 'patients/id' query
	
	//Determine if the first patient returned with the 'patients' query can be 
	//located with the 'patients/id' query
	
	echo "<h1>Testing 'aii-api/v1/patients/(id)' query...</h1>";
	
	$firstPatient = $testPatientResponse['records'][0];
	$firstID = $firstPatient['PatientID'];
	
	$url = 'http://www.killzombieswith.us/aii-api/v1/patients/' . $firstID;
	$specificPatientResponse = file_get_contents($url);
	$specificPatientResponse = json_decode($specificPatientResponse, true);
	
	if($specificPatientResponse['records'][0] == $testPatientResponse['records'][0])
	{
		$data = "patients/(id) (GET) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h4>Tests Successful!</h4>";
		echo "<ul><h5>Test patient $firstID matches their record in the patients query</h5></ul>";
	}
	else
	{
		$data = "patients/(id) (GET) - 'patients/(id)' RECORD DOES NOT MATCH THE 'patients' RECORD\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "patients/(id) record does not match the patients record<br>";
	}
	
	//=================================================================
	 //Test patients/id/careTeams
	 
	 echo "<h1>Testing 'aii-api/v1/patients/(id)/careTeams' query...</h1>";
	 
	 //Establish the patient to test against (the first patient)
	 $firstPatient = $response['records'][0]['PatientID'];
	 
	 $careTeamsResponse = file_get_contents('http://www.killzombieswith.us/aii-api/v1/patients/' . $firstPatient . '/careTeams');
	 $careTeamsResponse = json_decode($careTeamsResponse, true);
	 
	 //Determine how many care teams exist
	 $numCareTeams = count($careTeamsResponse['records']);
	 
	 //For each phase, get its questions and insure that questions exist
	 if($numCareTeams == 0)
	{
		$data = "patients/(id)/careTeams (GET) - NO CARE TEAMS FOUND FOR TEST PATIENT (PatientID: $firstPatient)\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "No care teams found for test patient (PatientID: $firstPatient)<br>";
	}
	else
	{
		$data = "patients/(id)/careTeams (GET) - Tests Successful\n";
		file_put_contents($output, $data, FILE_APPEND);
		
		echo "<h4>Tests Successful!</h4>";
		echo "<ul><h5>Test patient $firstPatient contains care teams</h5></ul>";
	}
	 
	//Add new line at end of the entry for formatting
	$data = "\n";
	file_put_contents($output, $data, FILE_APPEND);
	?>
</body>
</html>