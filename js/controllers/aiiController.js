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

    return {
        setCareTeamID:function (data) {
            CareTeamID = data;
            console.log(data);
        },
        setPhaseID: function (data) {
            PhaseID = data;
            console.log(data);
        },
        getCareTeamID:function () {
            return CareTeamID;
        },
        getPhaseID: function (data) {
            return PhaseID;
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
    $scope.counter = 0;
    $scope.CDA = {};
    $scope.AZBio = {};
    $scope.CNC = {};
    $scope.BKBSIN = {};
    
    $scope.answer = {};
    $scope.answer.PhaseID = persistData.getPhaseID();
    $scope.answer.CareTeamID = persistData.getCareTeamID();
    $scope.questionsURL = "http://killzombieswith.us/aii-api/v1/phases/" + 9 + "/questions";
    $scope.answersURL = "http://killzombieswith.us/aii-api/v1/careTeams/" + $scope.answer.CareTeamID + "/phaseAnswers/" + $scope.answer.PhaseID;
    
    getData.get($scope.questionsURL).success(function(data) {
        $scope.audioQuestions = data.records;
    });

    
    $scope.addAnswerObject = function(){

        for($scope.counter = 0;$scope.counter < $scope.answer.tests.length;$scope.counter++){
            console.log($scope.answer.tests[$scope.counter]);
            if($scope.answer.tests[$scope.counter] == 'Comprehensive Diagnostic Audiogram'){
                $scope.CDA.leftCondition = $scope.answer.leftCondition;
                $scope.CDA.rightCondition = $scope.answer.rightCondition;
                $scope.CDA.CDAPTAScore = $scope.answer.CDAPTAScore;
                $scope.CDA.CDASRTScore = $scope.answer.CDASRTScore;
                $scope.CDA.CDASDSScore = $scope.answer.CDASDSScore;
                $scope.CDA.CDADecibels = $scope.answer.CDADecibels;
                $scope.CDA.CDASNR = $scope.answer.CDASNR;
            }
            if($scope.answer.tests[$scope.counter] == 'AZBio'){
                $scope.AZBio.leftCondition = $scope.answer.leftCondition;
                $scope.AZBio.rightCondition = $scope.answer.rightCondition;
                $scope.AZBio.AzBioScore = $scope.answer.AzBioScore;
                $scope.AZBio.AzBioDecibels = $scope.answer.AzBioDecibels;
                $scope.AZBio.AzBioSNR = $scope.answer.AzBioSNR;
            }
            if($scope.answer.tests[$scope.counter] == 'CNC'){
                $scope.CNC.leftCondition = $scope.answer.leftCondition;
                $scope.CNC.rightCondition = $scope.answer.rightCondition;
                $scope.CNC.CNCWords = $scope.answer.CNCWords;
                $scope.CNC.CNCPhonemes = $scope.answer.CNCPhonemes;
                $scope.CNC.CNCList = $scope.answer.CNCList
            }
            if($scope.answer.tests[$scope.counter] == 'BKB-SIN'){
                $scope.BKBSIN.leftCondition = $scope.answer.leftCondition;
                $scope.BKBSIN.rightCondition = $scope.answer.rightCondition;
                $scope.BKBSIN.BKBScore = $scope.answer.BKBScore;
                $scope.BKBSIN.BKBList = $scope.answer.BKBList;
            }
        }

    }
    
    $scope.submitQuestions = function(){
        console.log("Submit Questions Called");
    }
    
    
};
    

//************************************END QUESTION CONTROLLERS***************************************//

//**************************************PATIENT CONTROLLERS******************************************//

//Controller used on myHome to process API methods for Patients
controllers.apiPatientsController = function ($scope, $http, $templateCache, persistData, getData) {   
    
    $scope.patients = {};
    $scope.selected={};
    $scope.list=[];
    
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
    
    $scope.goToQuestions = function(careTeam, phase){
        
        persistData.setCareTeamID(careTeam.CareTeamID);
        persistData.setPhaseID(phase);
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
controllers.apiMessagingController = function ($scope, $http, $templateCache, persistData, getData) {   
    
    $scope.messages = {};
    $scope.currentContent = "";
    $scope.isPopupVisible = false;
    
    $scope.inboxURL = "http://killzombieswith.us/aii-api/v1/users/30/inbox";
	$scope.sentURL = "http://killzombieswith.us/aii-api/v1/users/30/sent";
	$scope.draftsURL = "http://killzombieswith.us/aii-api/v1/users/30/drafts";
	$scope.deletedURL = "http://killzombieswith.us/aii-api/v1/users/30/deleted";
    
    //Grab all inbox messages using patientURL 
    getData.get($scope.inboxURL).success(function(data) {
		//Alter the data to use full names instead of id numbers
		/* for(i = 0; i < (data.records).length; i++){
			senderName = getName((data.records[i]).SenderID);
			receiverName = getName((data.records[i]).ReceiverID);
			console.log("Received: " + senderName);
			console.log("Received: " + receiverName);
			
			data.records[i].SenderID = senderName;
			data.records[i].ReceiverID = receiverName;
		} */
		$scope.inboxMessages = data;
    });
	
	 //Grab all sent messages using patientURL 
    getData.get($scope.sentURL).success(function(data) {
        $scope.sentMessages = data;
    });
	
	 //Grab all draft messages using patientURL 
    getData.get($scope.draftsURL).success(function(data) {
        $scope.draftMessages = data;
    });
	
	 //Grab all deleted messages using patientURL 
    getData.get($scope.deletedURL).success(function(data) {
        $scope.deletedMessages = data;
    });
	
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
	
	function getName(userID){
		userURL = "http://killzombieswith.us/aii-api/v1/users/" + userID + "/";
		getData.get(userURL).success(function(data){
			userName = (data.records[0]).first_name + " " + (data.records[0]).last_name;
			console.log("Returning: " + userName);
			return userName;
		});
	};
};  

//************************************END MESSAGING CONTROLLERS***************************************//

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


// Delete this when finished with it.
controllers.homeController = function($scope){
    $scope.test = "howdy";

    $scope.alerts = 
        [{ content: 'John Smith: Care phase has changed to Preoperative Visit'}];
    
    $scope.notifications = [{content: 'Dr. Charlie Bravo has accepted your invitation to John Smith\'s care team'},
                         {content: 'Dr. Sierra Victor has invited you to join Jane Doe\'s care team'}];
    
    $scope.messages = [{
            from: 'Dr. Charlie Bravo',
            subject: 'Re: Surgical Consultation for John Smith',
            content: '...'
        },
        {
            from: 'Dr. Sierra Victor',
            subject: 'Could I send Jane Doe your way for candidacy testing?',
            content: '.......'
    }];
};


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
//********************************END MISCELLANEOUS CONTROLLERS***************************************//



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
            console.log(data.data.records);
            //console.log(data);
            if(data.data.records == true){
                // $scope.x = response.data.records;
                persistData.setLoggedIn(true);
                $scope.loggedIn = true;
                $window.location.href = "#/dashboard";
            }
            else {
                console.log("Mando");
               // $window.location = "./";
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

myApp.controller(controllers);

})();

