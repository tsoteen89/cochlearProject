(function(){

var myApp = angular.module('aiiController', []);

var controllers = {};
    


//************************************FACTORIES***************************************//


//Factory to dynamically GET from api
myApp.factory('getData', function($http){
    
    return {
        get: function(url) { return $http.get(url); },
    }
 
});
    
    
//Factory to dynamically POST to api  
myApp.factory('postData', function($http){
    
    return {
        post: function(path, object) {
            return $http({
                method  : 'POST',
                url     : path,
                data    : object,
                headers : { 'Content-Type': 'application/json' } 
            }).success(function(addedData) {
                console.log(addedData);
            });
        },
    }
});
    

//Factory to dynamically PUT to api  
myApp.factory('putData', function($http){
    
    return {
        put: function(path, object) {
            return $http({
                method  : 'PUT',
                url     : path,
                data    : object,
                headers : { 'Content-Type': 'application/json' } 
            }).success(function(addedData) {
                console.log(addedData);
            });
        },
    }
});


//Factory that uses getter and setter to keep data persistant throughout partials
myApp.factory('persistData', function () {
    var CareTeamID;
    var PhaseID;
    var loggedIn;
    var PhaseName;
    return {
        setCareTeamID:function (data) {
            CareTeamID = data;
            console.log(data);
        },
        setPhaseID: function (data) {
            PhaseID = data;
            console.log(data);
        },
        setPhaseName: function (data) {
            PhaseName = data;
            console.log(data);
        },
        getCareTeamID:function () {
            return CareTeamID;
        },
        getPhaseID: function (data) {
            return PhaseID;
        },
        getPhaseName:function () {
            return PhaseName;
        },
        setLoggedIn: function (data) {
            loggedIn = data;
            console.log(loggedIn);
        },
        getLoggedIn: function() {
            console.log(loggedIn);
            return loggedIn;
        }
    };
});

    
//*****************************************END FACTORIES*******************************************//



//**************************************QUESTION CONTROLLERS***************************************//

    
//Controller used to handle display of Questions for a Patient's CareTeam  
controllers.questionsController = function($scope, persistData, getData, postData, putData, $http){
    
    $scope.limit = 5;
    $scope.offSet = 0;
    $scope.n = 0;
    $scope.finished = false;
    $scope.answer = {};
    $scope.answer.Answers = {};
    $scope.answer.PhaseID = persistData.getPhaseID();
    $scope.answer.CareTeamID = persistData.getCareTeamID();
    $scope.phaseName=persistData.getPhaseName();
    $scope.questionsURL = "http://killzombieswith.us/aii-api/v1/phases/" + $scope.answer.PhaseID + "/questions";
    $scope.initialQuestionsURL = $scope.questionsURL + "&offset=" + $scope.offSet + "&limit="+ $scope.limit;
    $scope.answersURL = "http://killzombieswith.us/aii-api/v1/careTeams/" + $scope.answer.CareTeamID + "/phaseAnswers/" + $scope.answer.PhaseID; 
    
    //Get Number of Questions contained in a phase
    getData.get($scope.questionsURL).success(function(data) {
        $scope.numberOfQuestions = data.records.length;
    });
    
    //Get all questions for a particular Phase
    getData.get($scope.initialQuestionsURL).success(function(data) {
        $scope.childNumber = 0;
        $scope.parentNumber = 0;
        
        //Go through initial batch of Questions to find Children of Parents
        for($scope.n = 0;$scope.n < data.records.length;$scope.n++){
            $scope.childNumber += data.records[$scope.n].Children.length;
            if(data.records[$scope.n].IsChild == 0){
                $scope.parentNumber += 1;
            }
        }

    //Set the sorted data equal to a new HTTP request
    }).then(function() {
        $scope.limit = $scope.childNumber + $scope.parentNumber;
        $scope.displayedQuestionsURL = $scope.questionsURL + "&offset=" + $scope.offSet + "&limit=" + $scope.limit;
        getData.get($scope.displayedQuestionsURL).success(function(data) {
            $scope.displayedQuestions = data.records;  
            $scope.childNumber = 0;
            $scope.parentNumber = 0;

            //Go through Second batch of Questions to find Children of Children
            for($scope.n = 0;$scope.n < data.records.length;$scope.n++){
                $scope.childNumber += data.records[$scope.n].Children.length;
                if(data.records[$scope.n].IsChild == 0){
                    $scope.parentNumber += 1;
                }
            }
            
        //Set the final sorted data equal to a final HTTP request
        }).then(function() {
            $scope.limit = $scope.childNumber + $scope.parentNumber;
            $scope.finalQuestionsURL = $scope.questionsURL + "&offset=" + $scope.offSet + "&limit="+ $scope.limit;
            getData.get($scope.finalQuestionsURL).success(function(data4) {
                $scope.finalQuestions = data4.records;
            });
        });
    });

    //Get any previously answered questions
    getData.get($scope.answersURL).success(function(data) {
        $scope.answer.Answers = data.records.Answers;            
    });
    
    //Post all answers saved 
    $scope.postAnswers = function() {
        postData.post('http://killzombieswith.us/aii-api/v1/answers',$scope.answer);
    };
    
    //Display the next set of questions for a phase
    $scope.nextPage = function() {
        
        $scope.offSet += $scope.limit;
        $scope.initialQuestionsURL = $scope.questionsURL + "&offset=" + $scope.offSet + "&limit=5";
        
        //Set finished bool when all questions have been listed
        if(($scope.offSet + $scope.limit) >= $scope.numberOfQuestions){
            $scope.finished = true;
        }
        
        //Grab Initial Batch of Questions
        getData.get($scope.initialQuestionsURL).success(function(data) {
            $scope.childNumber = 0;
            $scope.parentNumber = 0;
            
            //Go through initial batch of Questions to find Children of Parents
            for($scope.n = 0;$scope.n < data.records.length;$scope.n++){
                $scope.childNumber += data.records[$scope.n].Children.length;
                if(data.records[$scope.n].IsChild == 0){
                    $scope.parentNumber += 1;
                }
            }
            
        //Set the sorted data equal to a new HTTP request
        }).then(function() {
            $scope.limit = $scope.childNumber + $scope.parentNumber;
            $scope.displayedQuestionsURL = $scope.questionsURL + "&offset=" + $scope.offSet + "&limit=" + $scope.limit;
            getData.get($scope.displayedQuestionsURL).success(function(data) {
                $scope.displayedQuestions = data.records;  
                $scope.childNumber = 0;
                $scope.parentNumber = 0;
                
                //Go through Second batch of Questions to find Children of Children
                for($scope.n = 0;$scope.n < data.records.length;$scope.n++){
                    $scope.childNumber += data.records[$scope.n].Children.length;
                    if(data.records[$scope.n].IsChild == 0){
                        $scope.parentNumber += 1;
                    }
                }
                
            //Set the final sorted data equal to a final HTTP request
            }).then(function() {
                $scope.limit = $scope.childNumber + $scope.parentNumber;
                $scope.finalQuestionsURL = $scope.questionsURL + "&offset=" + $scope.offSet + "&limit="+ $scope.limit;
                getData.get($scope.finalQuestionsURL).success(function(data4) {
                    $scope.finalQuestions = data4.records;
                });
            });
        });
    }
    
    
    //Show a child if Trigger has been set
    $scope.showChild = function(data){
        var index;
        var indexB;
        
        for(index=0; index < data.length; index++) {
            for(indexB=0; indexB < $scope.finalQuestions.length; indexB++) {
                if($scope.finalQuestions[indexB].QuestionID == data[index]) {
                    $scope.finalQuestions[indexB].IsChild = 0;
                }
            }
        }
    }
    
    
    //Hide a child if the Trigger has been reset
    $scope.hideChild = function(data){
        var index;
        var indexB;
        
        for(index=0; index < data.length; index++) {
            for(indexB=0; indexB < $scope.finalQuestions.length; indexB++) {
                if($scope.finalQuestions[indexB].QuestionID == data[index]) {
                    $scope.finalQuestions[indexB].IsChild = 1;
                }
            }
        }
    }

};
    
    
//Controller used to handle display of Questions for a Patient's CareTeam  
controllers.audioQuestionsController = function($scope, persistData, getData, postData, putData, $http){
    
    $scope.loggedIn = persistData.getLoggedIn();
    $scope.phaseName= persistData.getPhaseName();
    $scope.answer = [];
    $scope.answer[0] = {};
    $scope.answerArrayIndex = 1;
    $scope.answer[1] = {};
    $scope.answer[0]["PhaseID"] = persistData.getPhaseID();
    $scope.answer[0]["CareTeamID"] = persistData.getCareTeamID();
    $scope.results = {};
    $scope.questionsURL = "http://killzombieswith.us/aii-api/v1/phases/" + 9 + "/questions";
    $scope.answersURL = "http://killzombieswith.us/aii-api/v1/careTeams/" + $scope.answer.CareTeamID + "/phaseAnswers/" + $scope.answer.PhaseID;
    //$scope.resultsURL = "http://killzombieswith.us/aii-api/v1/careTeams/1025/phaseAnswers/7/left/hearing%20aid/right/hearing%20aid";
    
    
    /*
    getData.get($scope.resultsURL).success(function(data) {
        $scope.results = data.records;
    });
    */
    
    $scope.buildResultsURL = function(){
        console.log("buildResults Called");
        $scope.resultsURL = "http://killzombieswith.us/aii-api/v1/careTeams/1025/phaseAnswers/7/left/" + $scope.answer[0].LeftAidCondition + "/right/" + $scope.answer[0].RightAidCondition;
    }
    
    getData.get($scope.questionsURL).success(function(data) {
        $scope.audioQuestions = data.records;
    });
    
    $scope.submitQuestions = function(){
        console.log("Submit Questions Called");
        postData.post('http://killzombieswith.us/aii-api/v1/audioTestResults',$scope.answer);
    }
    
    $scope.incAnswerArray = function(){
        $scope.answerArrayIndex += 1;
        $scope.answer[$scope.answerArrayIndex] = {};
    }
    
    $scope.updateResults = function(){
        console.log("updateResults Called");
        $scope.buildResultsURL();
        getData.get($scope.resultsURL).success(function(data) {
            $scope.results = data.records;
        });
    }
    
    $scope.clearCurrentTest = function(data){
        console.log("clearCurrentTest Called");
        console.log(data);
        if(data == "Comprehensive Diagnostic Audiogram"){
            $scope.answer[1]['30'] = null;
            $scope.answer[1]['40'] = null;
            $scope.answer[1]['50'] = null;
        }
        else if(data == 'AzBio'){
            $scope.answer[1]['60'] = null;
            $scope.answer[1]['70'] = null;
            $scope.answer[1]['80'] = null;
            $scope.answer[1]['90'] = null;
        }
        else if(data == 'CNC'){
            $scope.answer[1]['100'] = null;
            $scope.answer[1]['110'] = null;
            $scope.answer[1]['120'] = null;
        }
        else if(data == 'BKB-SIN'){
            $scope.answer[1]['130'] = null;
            $scope.answer[1]['140'] = null;
        }
        $scope.updateResults();
    }
    
    
};
    

//************************************END QUESTION CONTROLLERS***************************************//
    


//**************************************PATIENT CONTROLLERS******************************************//


//Controller used on myHome to process API methods for Patients
controllers.apiPatientsController = function ($scope, $http, $templateCache, persistData, getData) {   
    
    $scope.patients = {};
    $scope.selected={};
    $scope.list=[];
    
    $scope.patientURL = "../../aii-api/v1/facilities/100/patients";
    $scope.careTeamURL = "http://killzombieswith.us/aii-api/v1/facilities/100/careTeams";
    
    //Grab all Patients using patientURL 
    getData.get($scope.patientURL).success(function(data) {
        $scope.patientsData = data;
    });
    
    //Grab all CareTeams using careTeamURL
    getData.get($scope.careTeamURL).success(function(data) {
        $scope.careData = data;
    });
    
    //Put method for patient.
    $scope.processPut = function() {
        $http({
            method  : 'PUT',
            url     : $scope.url + $scope.patObject.patient_id,
            data    : $scope.patObject,
            headers : { 'Content-Type': 'application/json' }
        })
        console.log("im in processPut");
        console.log("../aii-api/v1/patients/" + $scope.patObject.patient_id);
    }
    
    //Delete method for patient
    $scope.processDelete = function() {
        $http({
            method  : 'DELETE',
            url     : $scope.url + $scope.patObject.patient_id,
            data    : $scope.patObject, 
            headers : { 'Content-Type': 'application/json' }
        })
        console.log("im in processDelete");
        console.log("../aii-api/v1/patients/" + $scope.patObject.patient_id);
    }        
    
    //Soft Delete method for patient
    $scope.processSoftDelete = function() {
        $http({
            method  : 'PUT',
            url     : $scope.url + $scope.patObject.patient_id,
            data    : $scope.patObject,
            headers : { 'Content-Type': 'application/json' }
        })
        console.log("im in processSoftDelete");
        console.log("../aii-api/v1/patients/" + $scope.patObject.patient_id);
    }
    
    //Return a CareTeam for a specific Patient ID    
    $scope.getPatientCareTeam = function(patients){
        $scope.PatientCareTeamsURL = 'http://killzombieswith.us/aii-api/v1/patients/' + patients.PatientID + '/careTeams';
        
        getData.get($scope.PatientCareTeamsURL).success(function(data) {
            $scope.patientCareTeams = data;
        });
    }
    
    //Return a Facility for a specific CareTeam ID
    $scope.getCareTeamFacilities = function(careTeams){
        $scope.CareTeamFacilitiesURL = 'http://killzombieswith.us/aii-api/v1/careTeams/' + careTeams.CareTeamID + '/facilities';
        
        getData.get($scope.CareTeamFacilitiesURL).success(function(data) {
            $scope.facilityData = data;
        });
        
        
    }    
    
    $scope.goToQuestions = function(careTeam, phase){
        
        persistData.setCareTeamID(careTeam.CareTeamID);
        persistData.setPhaseID(phase.PhaseID);
        persistData.setPhaseName(phase.Name);
    };

};  
    

//Controller used to handle addition of new Patients to the system
controllers.formController = function($scope, $http, postData,dateFilter) {
    // create a blank object to hold form information
    $scope.formData = {};
    
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
    
    $scope.bmis = [];
    $scope.heights = [];
    $scope.weights = [];
    $scope.i = 0;
    
    for($scope.i=0;$scope.i<36;$scope.i++){
 		$scope.bmis[$scope.i] = $scope.i + 10;
 	}
 
 	for($scope.i=0;$scope.i<68;$scope.i++){
 		$scope.heights[$scope.i] = $scope.i + 12;
 	}
 
 	for($scope.i=0;$scope.i<221;$scope.i++){
 		$scope.weights[$scope.i] = $scope.i + 80;
 	}

    // Post function to add a new Patient to the system
    $scope.processForm = function() {
        postData.post('http://killzombieswith.us/aii-api/v1/patients',$scope.formData);
    };
    
    $scope.date = new Date();

}


//**************************************END PATIENT CONTROLLERS******************************************//



//*****************************************USER CONTROLLERS**********************************************//


//Controller used to handle addition of NEW Users to the system
controllers.addUserController = function($scope, $http, postData, getData){
    
    // create a blank object to hold form information
    $scope.formData = {};

    // Post function to add a new User to the system
    $scope.processForm = function() {
        //postData.post('http://killzombieswith.us/aii-api/v1/users',$scope.formData);
        postData.post('../../aii-api/v1/users',$scope.formData);
    };
        
    //getting the userlevels from the api and posting it to the form
    $scope.UserLevelsURL = 'http://killzombieswith.us/aii-api/v1/userLevels';
        
    getData.get($scope.UserLevelsURL).success(function(data) {
        $scope.formData.UserLevels = data;
        //console.log($scope.formData.UserLevels);
    });
    
    $scope.UserTitlesURL = 'http://killzombieswith.us/aii-api/v1/userTitles';
    
    getData.get($scope.UserTitlesURL).success(function(data) {
        $scope.formData.UserTitles = data;
        //console.log(data);
        console.log($scope.formData.UserTitles);
    });
}


//Controller used to handle any EDITS made to a User
controllers.editUserController = function($scope, $http, getData, putData){
    $scope.editUser = {};
    $scope.userURL = "http://killzombieswith.us/aii-api/v1/users/1";
    
    //Grab single User by ID
    getData.get($scope.userURL).success(function(data) {
        $scope.userData = data;
    });
    
    //Put changed information into database
    $scope.editUserPut = function() {
        putData.put('http://killzombieswith.us/aii-api/v1/users/' + this.userData.records[0].UserID,$scope.editUser);
    };
    
}


//**************************************END USER CONTROLLERS******************************************//



//*************************************MESSAGING CONTROLLERS******************************************//


//Controller used on messages to process API methods for Users' Messages
controllers.apiMessagingController = function ($scope, $http, $templateCache, $filter, persistData, getData, postData, putData) {   
    
	//User's ID (will be retrieved using session data)
	$scope.userID = 30;
	//Controls the message display popup
    $scope.isPopupVisible = false;
	//OrderBy property : true means display contents in reverse order  
	$scope.reverse = true;
    //Messages that have been marked (for deleting, marking as read, or marking as unread)
	$scope.markedMessages = [];
	
    $scope.inboxURL = "http://killzombieswith.us/aii-api/v1/users/30/inbox";
	$scope.sentURL = "http://killzombieswith.us/aii-api/v1/users/30/sent";
	$scope.draftsURL = "http://killzombieswith.us/aii-api/v1/users/30/drafts";
	$scope.deletedURL = "http://killzombieswith.us/aii-api/v1/users/30/deleted";
    
    //Grab all inbox messages using patientURL 
    getData.get($scope.inboxURL).success(function(data) {
		//Combine First and Last into Name for each message
		for(i = 0; i < data.records.length; i++)
		{
			data.records[i].SenderName = data.records[i].Sender_First + " " + data.records[i].Sender_Last;
			data.records[i].ReceiverName = "Me";
		}
		$scope.inboxMessages = data;
    });
	
	 //Grab all sent messages using patientURL 
    getData.get($scope.sentURL).success(function(data) {
		//Combine First and Last into Name for each message
		for(i = 0; i < data.records.length; i++)
		{
			data.records[i].ReceiverName = data.records[i].Receiver_First + " " + data.records[i].Receiver_Last;
			data.records[i].SenderName = "Me";
		}
        $scope.sentMessages = data;
    });
	
	 //Grab all draft messages using patientURL 
    getData.get($scope.draftsURL).success(function(data) {
		//Combine First and Last into Name for each message
		for(i = 0; i < data.records.length; i++)
		{
			data.records[i].ReceiverName = data.records[i].Receiver_First + " " + data.records[i].Receiver_Last;
			data.records[i].SenderName = "Me";
		}
        $scope.draftMessages = data;
    });
	
	 //Grab all deleted messages using patientURL 
    getData.get($scope.deletedURL).success(function(data) {
		//Combine First and Last into Name for each message and mark the user as either the sender or receiver
		for(i = 0; i < data.records.length; i++)
		{
			if(data.records[i].Sender_First == null && data.records[i].Sender_Last == null){
				data.records[i].SenderName = 'Me';
				data.records[i].ReceiverName = data.records[i].Receiver_First + " " + data.records[i].Receiver_Last;
			}
			if(data.records[i].Receiver_First == null && data.records[i].Receiver_Last == null){
				data.records[i].ReceiverName = 'Me';
				data.records[i].SenderName = data.records[i].Sender_First + " " + data.records[i].Sender_Last;
			}
		}
        $scope.deletedMessages = data;
    });
	
	//Toggles visibility of the message content display
	$scope.togglePopup = function(message){
		if($scope.selectedMessage == message || message == null){
			$scope.isPopupVisible = false;
			$scope.selectedMessage = null;
		}
		else{
			$scope.isPopupVisible = true;
			$scope.selectedMessage = message;
		}
	};
	
	//Handles creation of replies to the selectedMessage
	$scope.reply = function(){
		$scope.composeMessage = {};
		
		messageTime = $filter('date')(($scope.selectedMessage.Timestamp * 1000), 'h:mm a');
		messageDate = $filter('date')(($scope.selectedMessage.Timestamp * 1000), 'M/d/yy');
		
		//Format the new reply message with info from the original message
		$scope.composeMessage.ReceiverID = $scope.selectedMessage.SenderID;
		$scope.composeMessage.Subject = "RE: " + $scope.selectedMessage.Subject;
		$scope.composeMessage.Content = "\n\n------------------------------\n"
									+	"From: " + $scope.selectedMessage.Sender_First + " " + $scope.selectedMessage.Sender_Last + "\n"
									+	"Subject: " + $scope.selectedMessage.Subject + "\n"
									+	"Time: " + messageTime + "\n"
									+	"Date: " + messageDate + "\n\n"
									+ 	$scope.selectedMessage.Content;
	}	
	
	//Handles creation of 'forwards' of the selectedMessage
	$scope.forward = function(){
		$scope.composeMessage = {};
		
		messageTime = $filter('date')(($scope.selectedMessage.Timestamp * 1000), 'h:mm a');
		messageDate = $filter('date')(($scope.selectedMessage.Timestamp * 1000), 'M/d/yy');
		
		//Format the new reply message with info from the original message
		$scope.composeMessage.Subject = "FWD: " + $scope.selectedMessage.Subject;
		$scope.composeMessage.Content = "\n\n------------------------------\n"
									+	"From: " + $scope.selectedMessage.SenderName + "\n"
									+	"To: " + $scope.selectedMessage.ReceiverName + "\n"
									+	"Subject: " + $scope.selectedMessage.Subject + "\n"
									+	"Time: " + messageTime + "\n"
									+	"Date: " + messageDate + "\n\n"
									+ 	$scope.selectedMessage.Content;
	}	
	
	//Moves the contents of a draft message into the composing message
	$scope.edit = function(){
		$scope.composeMessage = {};
		
		$scope.composeMessage.ReceiverID = $scope.selectedMessage.ReceiverID;
		$scope.composeMessage.Subject = $scope.selectedMessage.Subject;
		$scope.composeMessage.Content = $scope.selectedMessage.Content;
	}	
	
	//Posts the input message after properly filling out the appropriate fields of the message
	$scope.sendMessage = function(message){
		//Post the user defined message to the database
		//input 'message' should only contain the recipient username (currently UserID instead),
		//the subject, and the message content.
		
		//Define the SenderID as the current user
		message.SenderID = $scope.userID;
		//Generate Timestamp
		message.Timestamp = Math.round((new Date().getTime()) / 1000);
		message.Sent = 1;
		message.SenderDeleted = 0;
		message.ReceiverDeleted = 0;
		
		//Insure that all elements contain data before posting
		if(message.ReceiverID && message.Subject && message.Content){
			postData.post('http://killzombieswith.us/aii-api/v1/messages',message);
		}
		else{
			console.log("ERROR: COULD NOT POST MESSAGE. MISSING FIELDS.");
		}
	}
	
	//Posts the input message similarly to the 'sendMessage' function, but marks the Sent property as
	//false. This message will populate the user's 'draft' section instead of their 'sent' section
	$scope.saveDraft = function(message){
		//POST a message where Sent is false. Only the content is required to be filled.
		message.SenderID = $scope.userID;
		//Generate Timestamp
		message.Timestamp = Math.round((new Date().getTime()) / 1000);
		message.Sent = 0;
		message.SenderDeleted = 0;
		message.ReceiverDeleted = 0;
		
		//Insure that all elements contain data before posting
		if(message.Content){
			postData.post('http://killzombieswith.us/aii-api/v1/messages',message);
		}
		else{
			console.log("ERROR: COULD NOT POST MESSAGE. MISSING FIELDS.");
		}
	}
	
	//Erases the content in the composed message fields
	$scope.clearComposedMessage = function(){
		$scope.composeMessage = {};
	}
	
	//Controls the ordering of messages. Filter is the field AngularJS will order messages by.
	$scope.order = function(filter){
		$scope.reverse = !($scope.reverse);
		$scope.orderFilter = filter;
	}
	
	//Controls the marking of messages for different PUT functions (marking as deleted, read, or unread)
	$scope.markMessage = function(message, checkbox){
		//If checkbox was just selected, add the message as marked
		if(checkbox.checked){
			$scope.markedMessages.push(message);
		}
		//On unselecting a checkbox, find the message and remove it from the marked messages
		else{
			for(i = 0; i < $scope.markedMessages.length; i++){
				if($scope.markedMessages[i] == message){
					foundMessage = true;
					//Remove the input message from the marked array
					$scope.markedMessages.splice(i,1);
				}
			}
		}
	}
	
	//Add all the messages in the input to the marked messages
	$scope.markAllMessages = function(sourceCheckbox){
		//Find all the checkboxes that will be affected by this function
		checkboxes = document.getElementsByName('messageCheckbox');
		console.log(checkboxes);
		for(i = 0; i < checkboxes.length; i++){
			checkboxes[i].checked = sourceCheckbox.checked;
		}
		//If the checkbox is checked, add all messages as marked
		/*if(sourceCheckbox.checked){
			for(i = 0; i < messages.length; i++){
				$scope.markedMessages.push(messages[i]);
			}
		}
		//When unchecked, remove all messages from marked
		else{
			$scope.markedMessages = {};
		}*/
	}
	
	//Remove all messages from the marked messages array
	$scope.clearMarkedMessages = function(){
		$scope.markedMessages = {};
	}
	
	//Changes the marked messages to have Read = true with a PUT request 
	$scope.markAsRead = function(){
		for(i = 0; i < $scope.markedMessages.length; i++){
			messageURL = "http://killzombieswith.us/aii-api/v1/messages/" + $scope.markedMessages[i].MessageID;
			//Change the message's Deleted attribute to true
			$scope.markedMessages[i].Read = 1;
			//PUT the message using the message URL
			putData.put(messageURL,$scope.markedMessages[i]);
		}
	}
	
	//Changes the marked messages to have Read = false with a PUT request 
	$scope.markAsUnread = function(){
		for(i = 0; i < $scope.markedMessages.length; i++){
			messageURL = "http://killzombieswith.us/aii-api/v1/messages/" + $scope.markedMessages[i].MessageID;
			//Change the message's Deleted attribute to true
			$scope.markedMessages[i].Read = 0;
			//PUT the message using the message URL
			putData.put(messageURL,$scope.markedMessages[i]);
		}
	}
	
	//Changes the marked messages to have Read = true with a PUT request 
	$scope.markAsDeleted = function(){
		for(i = 0; i < $scope.markedMessages.length; i++){
			messageURL = "http://killzombieswith.us/aii-api/v1/messages/" + $scope.markedMessages[i].MessageID;
			//Change the message's Deleted attribute to true
			$scope.markedMessages[i].Deleted = 1;
			//PUT the message using the message URL
			putData.put(messageURL,$scope.markedMessages[i]);
		}
	}
	
	$scope.refreshInbox = function(){
		getData.get($scope.inboxURL).success(function(data) {
			//Combine First and Last into Name for each message
			for(i = 0; i < data.records.length; i++)
			{
				data.records[i].SenderName = data.records[i].Sender_First + " " + data.records[i].Sender_Last;
				data.records[i].ReceiverName = "Me";
			}
			$scope.inboxMessages = data;
		});
	}
	
	$scope.deleteSelectedMessage = function(){
		messageURL = "http://killzombieswith.us/aii-api/v1/messages/" + $scope.selectedMessage.MessageID;
		//Change the message's Deleted attribute to true
		$scope.selectedMessage.Deleted = 1;
		//PUT the message using the message URL
		putData.put(messageURL,$scope.selectedMessage);
	}
	
	$scope.markSelectedAsRead = function(isRead){
		messageURL = "http://killzombieswith.us/aii-api/v1/messages/" + $scope.selectedMessage.MessageID;
		//Change the message's Deleted attribute to true
		$scope.selectedMessage.Read = isRead;
		//PUT the message using the message URL
		putData.put(messageURL,$scope.selectedMessage);
	}
};  


//************************************END MESSAGING CONTROLLERS***************************************//
 
    

//************************************LOGIN/LOGOUT CONTROLLERS****************************************//
    

controllers.loginControl = function ($scope,$http,$window,persistData){
    
    $scope.userlogin = {};
    $scope.dataObj = {};
    $scope.loggedIn;
    
    $scope.loginStatus = function(){
        $scope.loggedIn = persistData.getLogged();
        console.log("Logged In Status Called");
        console.log($scope.loggedIn);
    };
    
    $scope.devLogin = function(){
        $scope.loggedIn = true;
    };

    $scope.submit = function(){

        $http({
            method  : 'POST',
            url     : 'http://killzombieswith.us/aii-api/v1/sessionLogs',
            data    : $scope.userlogin,
            headers : { 'Content-Type': 'application/json' }
        })
        .then(function(data){
         
            if(data.data.records == true){
           
                persistData.setLoggedIn(true);
                $scope.loggedIn = true;
                $window.location.href = "#/dashboard";
            }
            else {
              
               $window.location = "./";
            
            }
        });
    }
}

controllers.logoutControl = function($scope,$http,$window){

    $scope.x = 0;

    $scope.logout = function() {

        $http({
            method  : "DELETE",
            url     : "http://killzombieswith.us/aii-api/v1/sessionLogs",
            headers : { 'Content-Type': 'application/json' }
        })
        .then(function(response){
            console.log(response)
            $scope.x+=1;
        });
    }
}

    
//**********************************END LOGIN/LOGOUT CONTROLLERS**************************************//



//************************************MISCELLANEOUS CONTROLLERS***************************************//


//Controller used to display a dynamically filled Progress Bar
controllers.ProgressDemoCtrl = function($scope) {
    $scope.max = 100;
    $scope.dynamic = 0;

    $scope.fillBar = function() {
        var value = 7;
        var type;

        if ($scope.dynamic < 25) {
            type = 'danger';
        } 
        else if ($scope.dynamic < 50) {
            type = 'warning';
        }
        else if ($scope.dynamic < 75) {
            type = 'info';
        }
        else {
            type = 'success';
        }
        
        $scope.showWarning = (type === 'danger' || type === 'warning');
        
        if($scope.dynamic < 100) { 
            $scope.dynamic = $scope.dynamic + value;
            $scope.type = type;
        }
    };
}


//Controller used to handle creation of new Messages
controllers.composeMessage = function($scope, $http){

    $scope.composeObject = {};

    $scope.messageForm = function() {
        $http({
            method  : 'POST',
            url     : '../aii-api/v1/messages',
            data    : $scope.composeObject,  // do not put param
            headers : { 'Content-Type': 'application/json' }
        })
        .success(function(data) {
            console.log(data);
        })
        .error(function() {
           "Request failed";
          $scope.status = status;
        });;
    }
}


//Controller used to handle "Tabs"
controllers.TabController = function(){
	this.tab=-1;

	this.selectTab=function(tabNum){
		this.tab=tabNum;
	};
	this.isSelected=function(checkTab){
		return this.tab===checkTab;
	};
} 

//EXAMPLE FOR BINDING HTML CONTROLLER
controllers.ngBindHtmlCtrl = function ($scope, $sce) {
  $scope.myHTML =
     'I am an <code>HTML</code>string with <a href="#">links!</a> and other <em>stuff</em>';
    $scope.trustedHtml = $sce.trustAsHtml($scope.myHTML);
    $scope.textBox= $sce.trustAsHtml('<input  type="text" > </input>'); 
};

controllers.collapseCtrl = function($scope) {
    $scope.isPatientCollapsed = true;
    $scope.isDataCollapsed = true;
    $scope.toggleDataCollapse = function(){
        $scope.isDataCollapsed = !$scope.isDataCollapsed;  
    }
}

controllers.dotProgressCtrl = function($scope, getData){
    $scope.phases = "";
    getData.get("http://killzombieswith.us/aii-api/v1/phases").success(function(data) {
        $scope.phases = data.records;
    });
}
controllers.phaseProgressCtrl = function ($scope){
    $scope.setProgress = function(careTeam){
        $scope.progress = parseInt(careTeam.CurrentPhaseID/11 * 100);
    }
    
}

myApp.controller(controllers);

})();

