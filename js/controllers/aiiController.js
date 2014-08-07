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
    var PatientName;
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
        setPatientName:function(data){
            PatientName = data;
            console.log(data);
        },
        getPatientName:function(data){
            return PatientName;
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

//**************************************Dashboard CONTROLLERS***************************************//

    
//Controller used to handle display of Questions for a Patient's CareTeam  
controllers.dashboardController = function($scope, persistData, getData, postData, putData, $http){
    
    $scope.facilityURL = "http://killzombieswith.us/aii-api/v1/facilities/100/";

    //Grab Facility info  using facilityURL
    getData.get($scope.facilityURL).success(function(data) {
        $scope.facData = data;
    });
    
};
    
//*****************************************END Dashboard*******************************************//

//**************************************QUESTION CONTROLLERS***************************************//

    
//Controller used to handle display of Questions for a Patient's CareTeam  
controllers.questionsController = function($scope, persistData, getData, postData, putData, $http){
    
    $scope.limit = 5;
    $scope.offSet = 0;
    $scope.n = 0;
    $scope.finished = false;
    $scope.surgery = {"Date": null, "Other": null,"Side?":null, "Type of Surgery?": null, "CareTeamID" : persistData.getCareTeamID()}
    $scope.answer = {};
    $scope.answer.Answers = {};
    $scope.answer.PhaseID = persistData.getPhaseID();
    $scope.answer.CareTeamID = persistData.getCareTeamID();
    $scope.phaseName=persistData.getPhaseName();
    $scope.patientName= persistData.getPatientName();
    $scope.questionsURL = "http://killzombieswith.us/aii-api/v1/phases/" + $scope.answer.PhaseID + "/questions";
    $scope.initialQuestionsURL = $scope.questionsURL + "&offset=" + $scope.offSet + "&limit="+ $scope.limit;
    $scope.answersURL = "http://killzombieswith.us/aii-api/v1/careTeams/" + $scope.answer.CareTeamID + "/phaseAnswers/" + $scope.answer.PhaseID; 
    
    $scope.patientSummaryAnswers = {};
    $scope.patientSummaryAnswersURL = "http://killzombieswith.us/aii-api/v1/careTeams/" + $scope.answer.CareTeamID + 1;
    
    getData.get($scope.patientSummaryAnswersURL).success(function(data) {
        $scope.patientSummaryAnswers = data.records.DetailedAnswers;            
    });
    
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
    
    $scope.postSurgery = function() {
        postData.post('http://killzombieswith.us/aii-api/v1/surgeryHistory',$scope.surgery);
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
    
    
    $scope.checkboxTrigger = function(data){

        var other = false;
        for(var i=0;i<data.length;i++){
            if(data[i] == 'Other'){
                other = true;
            }
        }
        return other;
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
    
    $scope.patientSummary = function(phaseNumber){
        console.log(phaseNumber);
        $scope.patientSummaryAnswersURL = "http://killzombieswith.us/aii-api/v1/careTeams/" + $scope.answer.CareTeamID + "/phaseAnswers/" + phaseNumber; 

        getData.get($scope.patientSummaryAnswersURL).success(function(data) {
            $scope.patientSummaryAnswers = data.records.DetailedAnswers;            
        });
    }
};
    
    
    
//Controller used to handle display of Questions for a Patient's CareTeam  
controllers.audioQuestionsController = function($scope, persistData, getData, postData, putData, $http){
    
    $scope.conditions = {};
    $scope.loggedIn = persistData.getLoggedIn();
    $scope.phaseName= persistData.getPhaseName();
    $scope.answerArrayIndex = 1;
    $scope.answer = {};
    $scope.answer.PhaseID = persistData.getPhaseID();
    $scope.answer.CareTeamID = persistData.getCareTeamID();
    $scope.answer.Results = { "Comprehensive Diagnostic Audiogram" : {"Pure Tone Average": {}, "Speech Reception Threshold": {}, "Speech Discrimination Score" : {}}, "AzBio" :{ "AzBio Test": {}}, "CNC": {"CNC Test": {}}, "BKB-SIN": {"BKB-SIN Test": {}}};

    //$scope.results = {};
    $scope.questionsURL = "http://killzombieswith.us/aii-api/v1/phases/" + 9 + "/questions";
    $scope.answersURL = "http://killzombieswith.us/aii-api/v1/careTeams/" + $scope.answer.CareTeamID + "/phaseAnswers/" + $scope.answer.PhaseID;
    
    /*
    $scope.buildResultsURL = function(){
        console.log("buildResults Called");
        $scope.resultsURL = "http://killzombieswith.us/aii-api/v1/careTeams/1025/phaseAnswers/7/left/" + $scope.conditions.Left + "/right/" + $scope.conditions.Right;
    }
    */
    
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
        //$scope.buildResultsURL();
        $scope.getConditionsID();
        getData.get($scope.resultsURL).success(function(data) {
            $scope.results = data.records;
        });
    }
    
    $scope.getConditionsID = function(){
        console.log("getConditionsID Called");
        getData.get("http://killzombieswith.us/aii-api/v1/audioConditions/left/"+ this.conditions.Left +"/right/" + this.conditions.Right).success(function(data) {
            $scope.answer.ConditionsID = data.records.ConditionsID;
        });
    }
    
    $scope.clearCurrentTest = function(data){
        console.log("clearCurrentTest Called");
        console.log(data);
        if(data == "Comprehensive Diagnostic Audiogram"){
            $scope.answer.Results["Comprehensive Diagnostic Audiogram"]["Pure Tone Average"] = {};
            $scope.answer.Results["Comprehensive Diagnostic Audiogram"]["Speech Reception Threshold"] = {};
            $scope.answer.Results["Comprehensive Diagnostic Audiogram"]["Speech Discrimination Score"] = {};
        }
        else if(data == 'AzBio'){
            $scope.answer.Results["AzBio"]["AzBio Test"] = {};
        }
        else if(data == 'CNC'){
            $scope.answer.Results["CNC"]["CNC Test"] = {};
        }
        else if(data == 'BKB-SIN'){
            $scope.answer.Results["BKB-SIN"]["BKB-SIN Test"] = {};
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
    
    $scope.facilityURL = "http://killzombieswith.us/aii-api/v1/facilities/100/";
    $scope.patientURL = "http://killzombieswith.us/aii-api/v1/facilities/100/patients";
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
    
    $scope.goToQuestions = function(careTeam, phase, patient){
        
        persistData.setCareTeamID(careTeam.CareTeamID);
        persistData.setPhaseID(phase.PhaseID);
        persistData.setPhaseName(phase.Name);
        persistData.setPatientName(patient.First + " " + patient.Last);
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
        postData.post('http://killzombieswith.us/aii-api/v1/users',$scope.formData);
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
controllers.messagingController = function ($scope, $http, $templateCache, $filter, persistData, getData, postData, putData) {   
    
	//User's ID (will be retrieved using session data)
	$scope.userID = 30;
	//Controls the message display popup
    $scope.isPopupVisible = false;
	//OrderBy property : true means display contents in reverse order  
	$scope.reverse = true;
    //Messages that have been marked (for deleting, marking as read, or marking as unread)
	$scope.markedMessages = [];
	
	//The type of message currently being displayed - inbox, sent, drafts, deleted
	$scope.currentMessageType;
	$scope.currentMessages;
	
    $scope.inboxURL = "http://killzombieswith.us/aii-api/v1/users/" + $scope.userID + "/inbox";
	$scope.sentURL = "http://killzombieswith.us/aii-api/v1/users/" + $scope.userID + "/sent";
	$scope.draftsURL = "http://killzombieswith.us/aii-api/v1/users/" + $scope.userID + "/drafts";
	$scope.deletedURL = "http://killzombieswith.us/aii-api/v1/users/" + $scope.userID + "/deleted";
	$scope.messageURL = "http://killzombieswith.us/aii-api/v1/messages/";
    
    //Grab all inbox messages using patientURL 
    getData.get($scope.inboxURL).success(function(data) {
		//Combine First and Last into Name for each message
		for(i = 0; i < data.records.length; i++)
		{
			data.records[i].SenderName = data.records[i].Sender_First + " " + data.records[i].Sender_Last;
			data.records[i].ReceiverName = "Me";
		}
		$scope.inboxMessages = data;
		$scope.currentMessages = $scope.inboxMessages;
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
	
	//Sets the current message type. This updates the current messages and
	//alters the components of the message display.
	$scope.setMessageType = function(messageType){
		$scope.currentMessageType = messageType;
		
		switch($scope.currentMessageType){
			case 'inbox':
				$scope.currentMessages = $scope.inboxMessages;
				$scope.displayMessages = true;
				//Message table columns
				$scope.showFrom = true;
				$scope.showTo = false;
				$scope.showSubject = true;
				$scope.showTimestamp = true;
				//Selected Message buttons
				$scope.showReply = true;
				$scope.showForward = true;
				$scope.showEdit = false;
				$scope.showRestore = false;
				$scope.showDelete = true;
				$scope.showFullDelete = false;
				break;
			case 'sent':
				$scope.currentMessages = $scope.sentMessages;
				$scope.displayMessages = true;
				$scope.showFrom = false;
				$scope.showTo = true;
				$scope.showSubject = true;
				$scope.showTimestamp = true;
				//Selected Message buttons
				$scope.showReply = false;
				$scope.showForward = true;
				$scope.showEdit = false;
				$scope.showRestore = false;
				$scope.showDelete = true;
				$scope.showFullDelete = false;
				break;
			case 'drafts':
				$scope.currentMessages = $scope.draftMessages;
				$scope.displayMessages = true;
				$scope.showFrom = false;
				$scope.showTo = false;
				$scope.showSubject = true;
				$scope.showTimestamp = true;
				//Selected Message buttons
				$scope.showReply = false;
				$scope.showForward = false;
				$scope.showEdit = true;
				$scope.showRestore = false;
				$scope.showDelete = true;
				$scope.showFullDelete = false;
				break;
			case 'deleted':
				$scope.currentMessages = $scope.deletedMessages;
				$scope.displayMessages = true;
				$scope.showFrom = true;
				$scope.showTo = true;
				$scope.showSubject = true;
				$scope.showTimestamp = true;
				//Selected Message buttons
				$scope.showReply = false;
				$scope.showForward = false;
				$scope.showEdit = false;
				$scope.showRestore = true;
				$scope.showDelete = false;
				$scope.showFullDelete = true;
				break;
			case 'composeMessage':
				$scope.displayMessages = false;
				break;
			default:
				break;
		}
		//$scope.$apply();
	}
	
	$scope.isTypeSelected = function(messageType){
		if($scope.currentMessageType == messageType)
			return true;
		return false;
	}
	
	//Toggles visibility of the message content display
	$scope.togglePopup = function(message){
		if($scope.selectedMessage == message || message == null){
			$scope.isPopupVisible = false;
			$scope.selectedMessage = null;
		}
		else{
			$scope.isPopupVisible = true;
			$scope.selectedMessage = message;
			//If the message is a user received message and has not already been marked as read, mark it
			if($scope.selectedMessage.ReceiverName == 'Me' && $scope.selectedMessage.IsRead == 0)
			{
				messageURL = "http://killzombieswith.us/aii-api/v1/messages/" + $scope.selectedMessage.MessageID;
				//Change the message's Read attribute to true
				$scope.selectedMessage.IsRead = 1;
				//PUT the message using the message URL
				putData.put(messageURL,$scope.selectedMessage);
			}
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
			var errorMessage = "The message could not be sent due to:"
			if(!message.ReceiverID){
				errorMessage += "\n     -No receiver defined."
			}
			if(!message.Subject){
				errorMessage += "\n     -No subject defined."
			}
			if(!message.Content){
				errorMessage += "\n     -No message content\nThe message has not been saved."
			}
			else if(message.Content){
				//If the message had content, save it as a draft.
				message.sent = 0;
				postData.post('http://killzombieswith.us/aii-api/v1/messages',message);
				
				errorMessage += "\nThe message has been saved as a draft."
			}
			alert(errorMessage);
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
			alert("The message could not be saved as it contained no content.");
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
	markAllMessages = function(messageType, sourceCheckbox){
	
		switch(messageType){
			case 'inbox':
				messages = $scope.inboxMessages.records;
				checkboxName = 'inboxCheckbox';
				break;
			case 'sent':
				messages = $scope.sentMessages.records;
				checkboxName = 'sentCheckbox';
				break;
			case 'drafts':
				messages = $scope.draftMessages.records;
				checkboxName = 'draftCheckbox';
				break;
			case 'deleted':
				messages = $scope.deletedMessages.records;
				checkboxName = 'deletedCheckbox';
				break;
			default:
				messages = [];
				break;
		}
		
		//Find all the checkboxes that will be affected by this function
		checkboxes = document.getElementsByName(checkboxName);
		for(i = 0; i < checkboxes.length; i++){
			checkboxes[i].checked = sourceCheckbox.checked;
		}
		//If the checkbox is checked, add all messages as marked
		if(sourceCheckbox.checked){
			for(i = 0; i < messages.length; i++){
				$scope.markedMessages.push(messages[i]);
			}
		}
		//When unchecked, remove all messages from marked
		else{
			$scope.markedMessages = [];
		}
	}
	
	//Remove all messages from the marked messages array
	$scope.clearMarkedMessages = function(){
		$scope.markedMessages = [];
		
		//Mark all the checkboxes as unchecked
		checkboxNames = ['inboxCheckbox', 'sentCheckbox','draftCheckbox' ,'deletedCheckbox'];
		
		for(i = 0; i < checkboxNames.length; i++)
		{
			checkboxes = document.getElementsByName(checkboxNames[i]);
			for(j = 0; j < checkboxes.length; j++)
			{
				checkboxes[j].checked = false;
			}
		}
	}
	
	//Send a PUT request with the user-defined property and value
	$scope.putMarkedMessages = function(property, value){
		//Parse value (string) as an int (in base 10)
		value = parseInt(value, 10);
		if(property == 'read'){
			for(i = 0; i < $scope.markedMessages.length; i++){
				putMessageURL = $scope.messageURL + $scope.markedMessages[i].MessageID;
				//Change the message's Deleted attribute to true
				$scope.markedMessages[i].IsRead = value;
				//PUT the message using the message URL
				$.when(putData.put(putMessageURL,$scope.markedMessages[i])).then($scope.refreshMessages());
			}
		}
		else if(property == 'deleted'){
			for(i = 0; i < $scope.markedMessages.length; i++){
				putMessageURL = $scope.messageURL + $scope.markedMessages[i].MessageID;
				//Change the message's Deleted attribute to true
				if($scope.markedMessages[i].ReceiverName == "Me"){
					$scope.markedMessages[i].ReceiverDeleted = value;
				}
				else if($scope.markedMessages[i].SenderName == "Me"){
					$scope.markedMessages[i].SenderDeleted = value;
				}
				//PUT the message using the message URL
				$.when(putData.put(putMessageURL,$scope.markedMessages[i])).then($scope.refreshMessages());
			}
		}
		//$scope.refreshCurrentMessages();
	}
	
	//Refreshes all of the user's messages
	$scope.refreshMessages = function(){
		$scope.refreshInbox();
		$scope.refreshSent();
		$scope.refreshDrafts();
		$.when($scope.refreshDeleted()).then($scope.$apply());
	}
	
	$scope.refreshInbox = function(){
		getData.get($scope.inboxURL).success(function(data) {
			for(i = 0; i < data.records.length; i++)
			{
				data.records[i].SenderName = data.records[i].Sender_First + " " + data.records[i].Sender_Last;
				data.records[i].ReceiverName = "Me";
			}
			$scope.inboxMessages = data;
			if($scope.currentMessageType == 'inbox'){
				$scope.currentMessages = $scope.inboxMessages;
				$scope.$apply();
			}
		});
	}
	
	$scope.refreshSent = function(){
		getData.get($scope.sentURL).success(function(data) {
			for(i = 0; i < data.records.length; i++)
			{
				data.records[i].SenderName = "Me";
				data.records[i].ReceiverName = data.records[i].Receiver_First + " " + data.records[i].Receiver_Last;
			}
			$scope.sentMessages = data;
			if($scope.currentMessageType == 'sent'){
				$scope.currentMessages = $scope.sentMessages;
				$scope.$apply();
			}
		});
	}
	
	$scope.refreshDrafts = function(){
		getData.get($scope.draftsURL).success(function(data) {
			for(i = 0; i < data.records.length; i++)
			{
				data.records[i].ReceiverName = data.records[i].Receiver_First + " " + data.records[i].Receiver_Last;
				data.records[i].SenderName = "Me";
			}
			$scope.draftMessages = data;
			if($scope.currentMessageType == 'drafts'){
				$scope.currentMessages = $scope.draftMessages;
				$scope.$apply();
			}
		});
	}
	
	$scope.refreshDeleted = function(){
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
			if($scope.currentMessageType == 'deleted'){
				$scope.currentMessages = $scope.deletedMessages;
				$scope.$apply();
			}
		});
	}
	
	$scope.refreshCurrentMessages = function(){
		switch($scope.currentMessageType){
			case 'inbox':
				$scope.refreshInbox();
				break;
			case 'sent':
				$scope.refreshSent();
				break;
			case 'drafts':
				$scope.refreshDrafts();
				break;
			case 'deleted':
				$scope.refreshDeleted();
				break;
		}
	}
	
	$scope.deleteSelectedMessage = function(){
		messageURL = "http://killzombieswith.us/aii-api/v1/messages/" + $scope.selectedMessage.MessageID;
		//Change the message's Deleted attribute to true
		if($scope.selectedMessage.ReceiverName == "Me"){
			$scope.selectedMessage.ReceiverDeleted = 1;
		}
		else if($scope.selectedMessage.SenderName == "Me"){
			$scope.selectedMessage.SenderDeleted = 1;
		}
		//PUT the message using the message URL and then refresh the messages
		$.when(putData.put(messageURL,$scope.selectedMessage)).then($scope.refreshMessages());
		//$scope.$apply();
	}
	
	//Marks the message as deleted, however the message will no longer appear in the Deleted messages.
	$scope.fullyDeleteSelectedMessage = function(){
		messageURL = "http://killzombieswith.us/aii-api/v1/messages/" + $scope.selectedMessage.MessageID;
		//Change the message's Deleted attribute to true
		if($scope.selectedMessage.ReceiverName == "Me"){
			$scope.selectedMessage.ReceiverDeleted = 2;
		}
		else{
			$scope.selectedMessage.SenderDeleted = 2;
		}
		//PUT the message using the message URL and then refresh the messages
		$.when(putData.put(messageURL,$scope.selectedMessage)).then($scope.refreshMessages());
		//$scope.$apply();
	}
	
	$scope.restoreSelectedMessage = function(){
		messageURL = "http://killzombieswith.us/aii-api/v1/messages/" + $scope.selectedMessage.MessageID;
		//Change the message's Deleted attribute to true
		if($scope.selectedMessage.ReceiverName == "Me"){
			$scope.selectedMessage.ReceiverDeleted = 0;
		}
		else{
			$scope.selectedMessage.SenderDeleted = 0;
		}
		//PUT the message using the message URL and then refresh the messages
		$.when(putData.put(messageURL,$scope.selectedMessage)).then($scope.refreshMessages());
		//$scope.$apply();
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
 

 
//***************************************ALERT CONTROLLERS********************************************// 
 
 
controllers.alertsController = function ($scope, $http, $templateCache, $filter, persistData, getData, postData, putData){

	$scope.careTeamID = 10;
	$scope.userLevelID = 1;

	$scope.receivedURL = "http://killzombieswith.us/aii-api/v1/careTeams/" + $scope.careTeamID + "/alerts";
	$scope.deletedURL = "http://killzombieswith.us/aii-api/v1/careTeams/" + $scope.careTeamID + "/deletedAlerts";

	$scope.currentAlerts;
	
	getData.get($scope.receivedURL).success(function(data) {
		$scope.receivedAlerts = data;
		$scope.currentAlerts = $scope.receivedAlerts;
    });
	
	getData.get($scope.deletedURL).success(function(data) {
		$scope.deletedAlerts = data;
    }); 
	
};
 
 
//*************************************END ALERT CONTROLLERS******************************************//
 

 
//***********************************NOTIFICATION CONTROLLERS*****************************************// 
 
 
controllers.notificationsController = function ($scope, $http, $templateCache, $filter, persistData, getData, postData, putData){

	$scope.careTeamID = 1010;
	$scope.userLevelID = 1;

	$scope.receivedURL = "http://killzombieswith.us/aii-api/v1/careTeams/" + $scope.careTeamID + "/notifications";
	$scope.deletedURL = "http://killzombieswith.us/aii-api/v1/careTeams/" + $scope.careTeamID + "/deletedNotifications";

	$scope.currentNotificationType = 'received';
	
	/* Miscellaneous Variables */
	$scope.selectedNotification;
	$scope.showPopup = false;
	
	$scope.DUMMY_RECEIVED = {'records': [{
		'NotificationID': 1,
		'SenderFacilityID': 110,
		'ReceiverFacilityID': 105,
		'CareTeamID': 1003,
		'Timestamp': 1407398574,
		'IsRequest': 1,
		'Response': 0,
		'IsRead': 0,
		'IsArchived': 0,
		'SenderFacility': 'OHSU Cochlear Implant program',
		'ReceiverFacility': 'Midlands Cochlear Implant Center',
		'Subject': 'Care team invitation',
		'Content': 'OHSU Cochlear Implant program has invited your facility to join care team 1003.'
	}]};
	
	$scope.DUMMY_DELETED = {'records': [{
		'NotificationID': 1,
		'SenderFacilityID': 105,
		'ReceiverFacilityID': 110,
		'CareTeamID': 1085,
		'Timestamp': 1407380000,
		'IsRequest': 0,
		'Response': 2,
		'IsRead': 1,
		'IsArchived': 1,
		'SenderFacility': 'Midlands Cochlear Implant Center',
		'ReceiverFacility': 'OHSU Cochlear Implant program',
		'Subject': 'Declined care team invitation',
		'Content': 'OHSU Cochlear Implant program has declined your invitation to join care team 1085.'
	}]};
	
	$scope.receivedNotifications = $scope.DUMMY_RECEIVED;
	$scope.deletedNotifications = $scope.DUMMY_DELETED;
	
	/*getData.get($scope.receivedURL).success(function(data) {
		$scope.receivedNotifications = data;
    });
	
	getData.get($scope.deletedURL).success(function(data) {
		$scope.deletedNotifications = data;
    }); */
	
	$scope.setNotificationType = function(notificationType){
		$scope.currentNotificationType = notificationType;
		
		switch($scope.currentNotificationType){
			case 'received':
				$scope.currentNotifications = $scope.receivedNotifications;
				$scope.showFrom = true;
				$scope.showTo = false;
				$scope.showSubject = true;
				$scope.showTimestamp = true;
				$scope.showDelete = true;
				$scope.showFullDelete = false;
				break;
			case 'deleted':
				$scope.currentNotifications = $scope.deletedNotifications;
				$scope.showFrom = true;
				$scope.showTo = false;
				$scope.showSubject = true;
				$scope.showTimestamp = true;
				$scope.showDelete = false;
				$scope.showFullDelete = true;
				break;
		}
	}
	
	$scope.isTypeSelected = function(notificationType){
		if(notificationType == $scope.currentNotificationType){
			return true;
		}
		return false;
	}
	
	$scope.togglePopup = function(notification){
		if($scope.showPopup){
			$scope.selectedNotification = [];
		}
		else{
			$scope.selectedNotification = notification;
		}
		$scope.showPopup = !$scope.showPopup;
	}
	
	$scope.hidePopup = function(){
		$scope.showPopup = false;
		$scope.selectedNotification = [];
	}
	
};


//*********************************END NOTIFICATION CONTROLLERS***************************************// 
 
 
 
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
              
               $window.location = "#/";
            
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

