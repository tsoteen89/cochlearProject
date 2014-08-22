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
    var dirAnchor;
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
        },
        setDirAnchor: function(data){
            dirAnchor=  data;
            console.log(dirAnchor);
        },
        getDirAnchor: function(data){
            return dirAnchor;
        }
    };
});

    
//*****************************************END FACTORIES*******************************************//

//**************************************Dashboard CONTROLLERS***************************************//

    
//Controller used to handle display of Questions for a Patient's CareTeam  
controllers.dashboardController = function($scope, persistData, getData, postData, putData, $http, $modal){
    
    $scope.facilityURL = "http://killzombieswith.us/aii-api/v1/facilities/100/";
    $scope.baseFacilityURL = "http://killzombieswith.us/aii-api/v1/facilities/";
    //Grab Facility info  using facilityURL
    getData.get($scope.facilityURL).success(function(data) {
        $scope.facData = data;
    });
    
    //Grab AII Facilities 
    getData.get($scope.baseFacilityURL).success(function(data) {
        $scope.allFacs = data;
    });
    
    //Grab Facilities Users
    getData.get($scope.facilityURL + 'users').success(function(data) {
        $scope.facUsers = data;
    });
    
    $scope.addUser= function(){
        var ModalInstanceCtrl = function ($scope, $modalInstance) {

			$scope.displayInfo = true;
			console.log($scope.displayInfo);
			$scope.setDisplayInfo = function (showInfo) {
				$scope.displayInfo = showInfo;
				$scope.apply();
			};
			
			$scope.getDisplayInfo = function(){
				console.log("Returning: " + $scope.displayInfo)
				return $scope.displayInfo;
			};
		
            $scope.ok = function () {
                $modalInstance.close();
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };
        
        var modalInstance = $modal.open({
          templateUrl: 'addUser.html',
          controller: ModalInstanceCtrl,
          size: 'md'
          
         
        });

    }
    
    $scope.getFacCard = function(fac){
            
        var ModalInstanceCtrl = function ($scope, $modalInstance, fac) {
            console.log(fac.FacilityID);
            getData.get("http://killzombieswith.us/aii-api/v1/facilities/" + fac.FacilityID).success(function(data){
                $scope.facCard = data;
            });
            getData.get("http://killzombieswith.us/aii-api/v1/facilities/"+ fac.FacilityID + '/users').success(function(data) {
                $scope.facCardUsers = data;
            });          


            $scope.ok = function () {
                $modalInstance.close();
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };
        
        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: ModalInstanceCtrl,
          size: 'md',
          resolve: {
            fac: function () {
              return fac;
            }
          }
         
        });
        
                                                         
    }
    
};
    

    
//*****************************************END Dashboard*******************************************//

//**************************************QUESTION CONTROLLERS***************************************//

    
//Controller used to handle display of Questions for a Patient's CareTeam  
controllers.questionsController = function($scope, persistData, getData, postData, putData, $http, $modal, $location){
    
    $scope.limit = 5;
    $scope.offSet = 0;
    $scope.limitArray = new Array();
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
    $scope.patientSummaryAnswersURL = "http://killzombieswith.us/aii-api/v1/careTeams/" + $scope.answer.CareTeamID + "/phaseAnswers/" + $scope.answer.PhaseID;
    
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
    
    $scope.dirAnchor = persistData.getDirAnchor();
    
    $scope.clearSurgeryHistory = function(){
        this.surgery["Date"] = null;
        this.surgery["Other"] = null;
        this.surgery["Type of Surgery?"] = null;
        this.surgery["Side?"] = null;
    }
    //Display the next set of questions for a phase
    $scope.nextPage = function() {
        $scope.limitArray.push($scope.limit);
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
                /*
                if($scope.finished == false){
                    $scope.limitArray.push($scope.limit);
                }
                */
            });
        });
    }
    
    
    //function used to display questions from previous pages
    $scope.previousPage = function() {
        $scope.finished = false;
        $scope.limit = $scope.limitArray.pop();
        $scope.offSet = $scope.offSet - $scope.limit;
        
        $scope.finalQuestionsURL = $scope.questionsURL + "&offset=" + $scope.offSet + "&limit="+ $scope.limit;
        
        getData.get($scope.finalQuestionsURL).success(function(data4) {
            $scope.finalQuestions = data4.records;
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
    
    
    $scope.completePhase = function(){
        if($scope.answer.PhaseID=="1"){
            $scope.nextPhase = (parseInt($scope.answer.PhaseID) + 2);
        }else{
            $scope.nextPhase = (parseInt($scope.answer.PhaseID) + 1);
        }
        
        $scope.newPhase = {"CurrentPhaseID":$scope.nextPhase};
        // Post the changed currentPhaseID here
        putData.put('http://killzombieswith.us/aii-api/v1/careTeams/' + $scope.answer.CareTeamID,$scope.newPhase).then(function(){
            $location.path('/patientDirectory')
        });
        
    }
    
    $scope.clickedPhase = null;
    

    
    $scope.patientSummary = function(phaseNumber){
        this.clickedPhase = phaseNumber;
        $scope.patientSummaryAnswersURL = "http://killzombieswith.us/aii-api/v1/careTeams/" + $scope.answer.CareTeamID + "/phaseAnswers/" + phaseNumber; 

        getData.get($scope.patientSummaryAnswersURL).success(function(data) {
            $scope.patientSummaryAnswers = data.records.DetailedAnswers;            
        });
        
        if(phaseNumber == 0)
        {
            $scope.patientSummaryAnswers = "";
        }
    }
    
    
    
    $scope.getDataSummary = function(){
    
        var ModalInstanceCtrl = function ($scope, $modalInstance) {
            //jesus, realized the patient summary answers passed before was only instantiated if they checked form on right for any phase.
            getData.get("http://killzombieswith.us/aii-api/v1/careTeams/" + persistData.getCareTeamID() + "/phaseAnswers/" +persistData.getPhaseID()).success(function(data) {
                $scope.patientSummaryAnswers = data.records.DetailedAnswers;
            });
            $scope.ok = function () {
                $modalInstance.close();
            };
            
        };

        var modalInstance = $modal.open({
          templateUrl: 'dataSummary.html',
          controller: ModalInstanceCtrl,
          size: 'lg'


        });
    }
};
    
    
    
//Controller used to handle display of Questions for a Patient's CareTeam  
controllers.audioQuestionsController = function($scope, persistData, getData, postData, putData, $http, $modal, $location, $route,$timeout, $anchorScroll){
    
    $scope.conditions = {};
    $scope.loggedIn = persistData.getLoggedIn();
    $scope.phaseName= persistData.getPhaseName();
    $scope.answerArrayIndex = 1;
    $scope.answer = {};
    $scope.answer.PhaseID = persistData.getPhaseID();
    $scope.answer.CareTeamID = persistData.getCareTeamID();
    $scope.answer.Results = { "Aided Audiogram" : {"Pure Tone Average": {}, "Speech Reception Threshold": {}, "Speech Discrimination Score" : {}}, "AzBio" :{ "AzBio Test": {}}, "CNC": {"CNC Test": {}}, "BKB-SIN": {"BKB-SIN Test": {}}};

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
        if(data == "Aided Audiogram"){
            $scope.answer.Results["Aided Audiogram"]["Pure Tone Average"] = {};
            $scope.answer.Results["Aided Audiogram"]["Speech Reception Threshold"] = {};
            $scope.answer.Results["Aided Audiogram"]["Speech Discrimination Score"] = {};
        }
        else if(data == 'AzBio'){
            $scope.answer.Results["AzBio"]["AzBio Test"] = {};
        }
        else if(data == 'CNC'){
            $scope.answer.Results["CNC"]["CNC Test"] = {};
            $scope.wordswith3=0;
            $scope.phonemes=0;
        }
        else if(data == 'BKB-SIN'){
            $scope.answer.Results["BKB-SIN"]["BKB-SIN Test"] = {};
        }
        $scope.updateResults();
    }
    
    
    $scope.completePhase = function(){
        $scope.nextPhase = (parseInt($scope.answer.PhaseID) + 1);
        $scope.newPhase = {"CurrentPhaseID":$scope.nextPhase};
        // Post the changed currentPhaseID here
        putData.put('http://killzombieswith.us/aii-api/v1/careTeams/' + $scope.answer.CareTeamID,$scope.newPhase);
        
    }
    
    
    $scope.getDataSummary = function(patientSummaryAnswers){
        var ModalInstanceCtrl = function ($scope, $modalInstance) {
            getData.get("http://killzombieswith.us/aii-api/v1/careTeams/" + persistData.getCareTeamID() + "/phaseAnswers/" +persistData.getPhaseID()).success(function(data) {
                $scope.patientSummaryAnswers = data.records.DetailedAnswers;
            });
            $scope.ok = function () {
                $modalInstance.close();
                
            };
            
        };

        var modalInstance = $modal.open({
          templateUrl: 'dataSummary.html',
          controller: ModalInstanceCtrl,
          size: 'lg',
          resolve: {
            patientSummaryAnswers: function () {
              return patientSummaryAnswers;
            }
          }


        });
    }
    
    
    $scope.wordswith3=0;
    $scope.phonemes=0;
    $scope.answer.Results["CNC"]["CNC Test"]["Words with 3 Phonemes Correct"] =0;
    $scope.answer.Results["CNC"]["CNC Test"]["Phonemes Correct"] =0;
    $scope.updateWordsWith3 = function(){
        $scope.wordswith3= parseInt(($scope.answer.Results["CNC"]["CNC Test"]["Words with 3 Phonemes Correct"]/50)*100);
    }
    $scope.updatePhonemes = function(){
        $scope.phonemes= parseInt(($scope.answer.Results["CNC"]["CNC Test"]["Phonemes Correct"]/150)*100) ;
    }
    
    
};
    

//************************************END QUESTION CONTROLLERS***************************************//
    


//**************************************PATIENT CONTROLLERS******************************************//


//Controller used on myHome to process API methods for Patients
controllers.apiPatientsController = function ($scope, $http, $templateCache, persistData, getData, $location, $anchorScroll, $timeout, $modal, postData, $route) {   
    $scope.selectedPatient = undefined;
    
    $scope.goToPatDir = function(last){
        $location.path('/patientDirectory/');
        $scope.scrollTo(last);
                
    };
    
    $scope.scrollTo = function(id) {
        $location.hash(id);
        console.log($location.hash());
        $timeout(function(){
            $anchorScroll();
        }, 1000);
        
    };
    
    
    $scope.patients = {};
    $scope.selected={};
    $scope.list=[];
    
    $scope.patientURL = "http://killzombieswith.us/aii-api/v1/facilities/100/patients";
    //Grab all Patients using patientURL 
    getData.get($scope.patientURL).success(function(data) {
        $scope.patientsData = data;
    });
    
    $scope.careTeamURL = "http://killzombieswith.us/aii-api/v1/facilities/100/careTeams";
    //Grab all CareTeams using careTeamURL
    getData.get($scope.careTeamURL).success(function(data) {
        $scope.careData = data;
    });
    
    //Get all phase info!!
    getData.get("http://killzombieswith.us/aii-api/v1/phases").success(function(data) {
        $scope.phases = data.records;
    });
    
    $scope.goToQuestions = function(careTeam, phase, patient){
        
        persistData.setCareTeamID(careTeam.CareTeamID);
        persistData.setPhaseID(phase.PhaseID);
        persistData.setPhaseName(phase.Name);
        persistData.setPatientName(patient.First + " " + patient.Last);
        persistData.setDirAnchor(patient.Last);
    };
    
    $scope.getFacCard = function(fac){
            
        var ModalInstanceCtrl = function ($scope, $modalInstance, fac) {
            console.log(fac.FacilityID);
            getData.get("http://killzombieswith.us/aii-api/v1/facilities/" + fac.FacilityID).success(function(data){
                $scope.facCard = data;
            });
            getData.get("http://killzombieswith.us/aii-api/v1/facilities/"+ fac.FacilityID + '/users').success(function(data) {
                $scope.facCardUsers = data;
            });          


            $scope.ok = function () {
                $modalInstance.close();
            };

        };
        
        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: ModalInstanceCtrl,
          size: 'md',
          resolve: {
            fac: function () {
              return fac;
            }
          }
         
        });                                              
    }
    
    $scope.addNewEvent = function(patient){
            
        var ModalInstanceCtrl = function ($scope, $modalInstance, patient) {
            
            $scope.newEvent={"Description":null, "OriginalFacilityID": 100, "CurrentPhaseID":3, "CreatedOn": new Date(), "PatientID": patient.PatientID};
            $scope.patient = patient;
            $scope.as= {};
            $scope.ok = function () {
                $modalInstance.close();
                $timeout(function(){
                    $route.reload();
                }, 1000);
            };
            $scope.demoInfo=null;
            $scope.submitEvent = function(){
                postData.post('http://killzombieswith.us/aii-api/v1/careTeams',$scope.newEvent);
                getData.get("http://killzombieswith.us/aii-api/v1/careTeams/"+ this.patient.CareTeams[0].CareTeamID + '/phaseAnswers/1').success(function(data) {
                    $scope.demoInfo = data.records;
                    console.log(data.records);
                });//.then(postData.post('http://killzombieswith.us/aii-api/v1/answers',$scope.demoInfo));
                this.ok();
            }

        };
        
        var modalInstance = $modal.open({
          templateUrl: 'addNewEvent.html',
          controller: ModalInstanceCtrl,
          size: 'lg',
          resolve: {
            patient: function () {
              return patient;
            }
          }
         
        });                                              
    }
    

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

controllers.collapseCtrl = function($scope) {
    $scope.isPatientCollapsed = true;
    $scope.isDataCollapsed = true;
    $scope.toggleDataCollapse = function(){
        $scope.isDataCollapsed = !$scope.isDataCollapsed;  
    }
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
    $scope.faciltyURL = "http://killzombieswith.us/aii-api/v1/facilities/100";
    
    //Grab single User by ID
    getData.get($scope.userURL).success(function(data) {
        $scope.userData = data;
    });
    
    //Grab information about users Facility
    getData.get($scope.faciltyURL).success(function(data) {
        $scope.facilityData = data;
    });
    
    
    //Put changed User information into database
    $scope.editUserPut = function() {
        putData.put('http://killzombieswith.us/aii-api/v1/users/' + this.userData.records[0].UserID,$scope.editUser);
    };
    
    //Put changed Facility information into database
    $scope.editFacilityPut = function() {
        putData.put('http://killzombieswith.us/aii-api/v1/facilities/' + this.userData.records[0].FacilityID,$scope.editFacility);
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
	$scope.reverse = false;
	$scope.orderFilter = 'Timestamp';
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
			data.records[i].ShortSubject = data.records[i].Subject;
			if(data.records[i].Subject.length > 24){
				data.records[i].ShortSubject = data.records[i].Subject.substr(0,21) + "...";
			}
			data.records[i].ShortSenderName = data.records[i].SenderName;
			if(data.records[i].SenderName.length > 25){
				data.records[i].ShortSenderName = data.records[i].SenderName.substr(0,22) + "...";
			}
			data.records[i].ShortReceiverName = data.records[i].ReceiverName;
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
			data.records[i].ShortSubject = data.records[i].Subject;
			if(data.records[i].Subject.length > 24){
				data.records[i].ShortSubject = data.records[i].Subject.substr(0,21) + "...";
			}
			data.records[i].ShortSenderName = data.records[i].SenderName;
			data.records[i].ShortReceiverName = data.records[i].ReceiverName;
			if(data.records[i].ReceiverName.length > 25){
				data.records[i].ShortReceiverName = data.records[i].ReceiverName.substr(0,22) + "...";
			}
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
			data.records[i].ShortSubject = data.records[i].Subject;
			if(data.records[i].Subject.length > 24){
				data.records[i].ShortSubject = data.records[i].Subject.substr(0,21) + "...";
			}
			data.records[i].ShortSenderName = data.records[i].SenderName;
			data.records[i].ShortReceiverName = data.records[i].ReceiverName;
			if(data.records[i].ReceiverName.length > 25){
				data.records[i].ShortReceiverName = data.records[i].ReceiverName.substr(0,22) + "...";
			}
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
			data.records[i].ShortSubject = data.records[i].Subject;
			if(data.records[i].Subject.length > 24){
				data.records[i].ShortSubject = data.records[i].Subject.substr(0,21) + "...";
			}
			data.records[i].ShortSenderName = data.records[i].SenderName;
			if(data.records[i].SenderName.length > 25){
				data.records[i].ShortSenderName = data.records[i].SenderName.substr(0,22) + "...";
			}
			data.records[i].ShortReceiverName = data.records[i].ReceiverName;
			if(data.records[i].ReceiverName.length > 25){
				data.records[i].ShortReceiverName = data.records[i].ReceiverName.substr(0,22) + "...";
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
				putData.put($scope.messageURL,message).success(function(data){
					$scope.refreshMessages();
				});
			}
		}
	};
	
	//Handles creation of replies to the selectedMessage
	$scope.reply = function(){
		$scope.composeMessage = {};
		
		messageTime = $filter('date')(($scope.selectedMessage.Timestamp * 1000), 'h:mm a');
		messageDate = $filter('date')(($scope.selectedMessage.Timestamp * 1000), 'M/d/yy');
		
		//Format the new reply message with info from the original message
		$scope.composeMessage.ReceiverUsername = $scope.selectedMessage.SenderUsername;
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
		
		$scope.composeMessage.ReceiverUsername = $scope.selectedMessage.ReceiverUsername;
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
		if(message.ReceiverUsername && message.Subject && message.Content){
			postData.post($scope.messageURL,message).success(function(data){
				$scope.refreshMessages();
			});
		}
		else{
			var errorMessage = "The message could not be sent due to:"
			if(!message.ReceiverUsername){
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
				postData.post($scope.messageURL,message).success(function(data){
					$scope.refreshMessages();
				});
				
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
			postData.post($scope.messageURL,message).success(function(data){
				$scope.refreshMessages();
			});
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
				putData.put(putMessageURL,$scope.markedMessages[i]).success(function(data){
					$scope.refreshMessages();
				});
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
				console.log("About to PUT data");
				putData.put(putMessageURL,$scope.markedMessages[i]).success(function(data) {
					console.log("PUT complete - About to get messages");
					$scope.refreshMessages();
					console.log("Got messages");
				});
			}
		}
		//$scope.refreshCurrentMessages();
	}
	
	//Refreshes all of the user's messages
	$scope.refreshMessages = function(){
		$scope.refreshInbox();
		$scope.refreshSent();
		$scope.refreshDrafts();
		$scope.refreshDeleted();
	}
	
	$scope.refreshInbox = function(){
		getData.get($scope.inboxURL).success(function(data) {
			for(i = 0; i < data.records.length; i++)
			{
				data.records[i].SenderName = data.records[i].Sender_First + " " + data.records[i].Sender_Last;
				data.records[i].ReceiverName = "Me";
				data.records[i].ShortSubject = data.records[i].Subject;
				if(data.records[i].Subject.length > 30){
					data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
				}
				data.records[i].ShortSenderName = data.records[i].SenderName;
				if(data.records[i].SenderName.length > 25){
					data.records[i].ShortSenderName = data.records[i].SenderName.substr(0,22) + "...";
				}
				data.records[i].ShortReceiverName = data.records[i].ReceiverName;
			}
			$scope.inboxMessages = data;
			if($scope.currentMessageType == 'inbox'){
				$scope.currentMessages = $scope.inboxMessages;
			}
		});
	}
	
	$scope.refreshSent = function(){
		getData.get($scope.sentURL).success(function(data) {
			for(i = 0; i < data.records.length; i++)
			{
				data.records[i].SenderName = "Me";
				data.records[i].ReceiverName = data.records[i].Receiver_First + " " + data.records[i].Receiver_Last;
				data.records[i].ShortSubject = data.records[i].Subject;
				if(data.records[i].Subject.length > 30){
					data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
				}
				data.records[i].ShortSenderName = data.records[i].SenderName;
				data.records[i].ShortReceiverName = data.records[i].ReceiverName;
				if(data.records[i].ReceiverName.length > 25){
					data.records[i].ShortReceiverName = data.records[i].ReceiverName.substr(0,22) + "...";
				}
			}
			$scope.sentMessages = data;
			if($scope.currentMessageType == 'sent'){
				$scope.currentMessages = $scope.sentMessages;
			}
		});
	}
	
	$scope.refreshDrafts = function(){
		getData.get($scope.draftsURL).success(function(data) {
			for(i = 0; i < data.records.length; i++)
			{
				data.records[i].ReceiverName = data.records[i].Receiver_First + " " + data.records[i].Receiver_Last;
				data.records[i].SenderName = "Me";
				data.records[i].ShortSubject = data.records[i].Subject;
				if(data.records[i].Subject.length > 30){
					data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
				}
				data.records[i].ShortSenderName = data.records[i].SenderName;
				data.records[i].ShortReceiverName = data.records[i].ReceiverName;
				if(data.records[i].ReceiverName.length > 25){
					data.records[i].ShortReceiverName = data.records[i].ReceiverName.substr(0,22) + "...";
				}
			}
			$scope.draftMessages = data;
			if($scope.currentMessageType == 'drafts'){
				$scope.currentMessages = $scope.draftMessages;
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
				data.records[i].ShortSubject = data.records[i].Subject;
				if(data.records[i].Subject.length > 30){
					data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
				}
				data.records[i].ShortSenderName = data.records[i].SenderName;
				if(data.records[i].SenderName.length > 25){
					data.records[i].ShortSenderName = data.records[i].SenderName.substr(0,22) + "...";
				}
				data.records[i].ShortReceiverName = data.records[i].ReceiverName;
				if(data.records[i].ReceiverName.length > 25){
					data.records[i].ShortReceiverName = data.records[i].ReceiverName.substr(0,22) + "...";
				}
			}
			$scope.deletedMessages = data;
			if($scope.currentMessageType == 'deleted'){
				$scope.currentMessages = $scope.deletedMessages;
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
		putData.put(messageURL,$scope.selectedMessage).success(function(data){
			$scope.refreshMessages();
		});
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
		putData.put(messageURL,$scope.selectedMessage).success(function(data){
			$scope.refreshMessages();
		});
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
		putData.put(messageURL,$scope.selectedMessage).success(function(data){
			$scope.refreshMessages();
		});
		//$scope.$apply();
	}
};  


//************************************END MESSAGING CONTROLLERS***************************************//
 

 
//***************************************ALERT CONTROLLERS********************************************// 
 
 
controllers.alertsController = function ($scope, $http, $templateCache, $filter, persistData, getData, postData, putData){

	$scope.facilityID = 105;
	$scope.userLevelID = 1;

	$scope.receivedURL = "http://killzombieswith.us/aii-api/v1/facilities/" + $scope.facilityID + "/alerts";
	$scope.deletedURL = "http://killzombieswith.us/aii-api/v1/facilities/" + $scope.facilityID + "/deletedAlerts";

	$scope.alertURL = "http://killzombieswith.us/aii-api/v1/alerts/";	
		
	$scope.currentAlerts;
	
	/* Miscellaneous Variables */
	//OrderBy property : true means display contents in reverse order  
	$scope.reverse = false;
	$scope.orderFilter = 'Timestamp';
    //Alerts that have been marked (for deleting, marking as read, or marking as unread)
	$scope.markedAlerts = [];
	
	getData.get($scope.receivedURL).success(function(data) {
		$scope.receivedAlerts = data;
		for(i = 0; i < data.records.length; i++){
			data.records[i].ShortSubject = data.records[i].Subject;
			if(data.records[i].Subject.length > 30){
				data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
			}
			data.records[i].ShortPatient = data.records[i].Patient;
			if(data.records[i].Patient.length > 24){
				data.records[i].ShortPatient = data.records[i].Patient.substr(0,21) + "...";
			}
			data.records[i].PatientDOBMonth = data.records[i].PatientDOB.substr(4,2);
			data.records[i].PatientDOBDay = data.records[i].PatientDOB.substr(6, 2);
			data.records[i].PatientDOBYear = data.records[i].PatientDOB.substr(0,4);
		}
		$scope.currentAlerts = $scope.receivedAlerts;
    });
	
	getData.get($scope.deletedURL).success(function(data) {
		$scope.deletedAlerts = data;
		for(i = 0; i < data.records.length; i++){
			data.records[i].ShortSubject = data.records[i].Subject;
			if(data.records[i].Subject.length > 30){
				data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
			}
			data.records[i].ShortPatient = data.records[i].Patient;
			if(data.records[i].Patient.length > 24){
				data.records[i].ShortPatient = data.records[i].Patient.substr(0,21) + "...";
			}
			data.records[i].PatientDOBMonth = data.records[i].PatientDOB.substr(4,2);
			data.records[i].PatientDOBDay = data.records[i].PatientDOB.substr(6, 2);
			data.records[i].PatientDOBYear = data.records[i].PatientDOB.substr(0,4);
		}
    }); 
	
	$scope.setAlertType = function(alertType){
		$scope.currentAlertType = alertType;
		
		switch($scope.currentAlertType){
			case 'received':
				$scope.currentAlerts = $scope.receivedAlerts;
				$scope.showFrom = true;
				$scope.showSubject = true;
				$scope.showTimestamp = true;
				$scope.showRestore = false;
				$scope.showDelete = true;
				$scope.showFullDelete = false;
				break;
			case 'deleted':
				$scope.currentAlerts = $scope.deletedAlerts;
				$scope.showFrom = true;
				$scope.showSubject = true;
				$scope.showTimestamp = true;
				$scope.showRestore = true;
				$scope.showDelete = false;
				$scope.showFullDelete = true;
				break;
		}
	}
	
	$scope.isTypeSelected = function(alertType){
		if(alertType == $scope.currentAlertType){
			return true;
		}
		return false;
	}
	
	$scope.togglePopup = function(alert){
		if($scope.showPopup){
			$scope.selectedAlert = [];
		}
		else{
			$scope.selectedAlert = alert;
			//Mark the selected alert as read
			if($scope.selectedAlert.IsRead == 0){
				putAlertURL = $scope.alertURL + $scope.selectedAlert.AlertID;
				$scope.selectedAlert.IsRead = 1;
				putData.put(putAlertURL, $scope.selectedAlert).success(function(data){
					$scope.refreshAlerts();
				});
			}
		}
		$scope.showPopup = !$scope.showPopup;
	}
	
	$scope.hidePopup = function(){
		$scope.showPopup = false;
		$scope.selectedAlert = [];
	}
	
	$scope.deleteSelectedAlert = function(deletedState){
		putAlertURL = "http://killzombieswith.us/aii-api/v1/alerts/" + $scope.selectedAlert.AlertID;
		//Change the alert's Deleted attribute to true
		$scope.selectedAlert.IsArchived = deletedState;
		//PUT the alert using the URL and then refresh the alerts
		putData.put(putAlertURL, $scope.selectedAlert).success(function(data){
			$scope.refreshAlerts();
		});
		$scope.refreshAlerts();
	}
	
	$scope.refreshAlerts = function(){
		$scope.refreshReceived();
		$scope.refreshDeleted();
	}
	
	$scope.refreshReceived = function(){
		getData.get($scope.receivedURL).success(function(data) {
			$scope.receivedAlerts = data;
			for(i = 0; i < data.records.length; i++){
				data.records[i].ShortSubject = data.records[i].Subject;
				if(data.records[i].Subject.length > 30){
					data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
				}
				data.records[i].ShortPatient = data.records[i].Patient;
				if(data.records[i].Patient.length > 24){
					data.records[i].ShortPatient = data.records[i].Patient.substr(0,21) + "...";
				}
				data.records[i].PatientDOBMonth = data.records[i].PatientDOB.substr(4,2);
				data.records[i].PatientDOBDay = data.records[i].PatientDOB.substr(6, 2);
				data.records[i].PatientDOBYear = data.records[i].PatientDOB.substr(0,4);
			}
			if($scope.currentAlertType == 'received'){
				$scope.currentAlerts = $scope.receivedAlerts;
			}
		});
	}
	
	$scope.refreshDeleted = function(){
		getData.get($scope.deletedURL).success(function(data) {
			$scope.deletedAlerts = data;
			for(i = 0; i < data.records.length; i++){
				data.records[i].ShortSubject = data.records[i].Subject;
				if(data.records[i].Subject.length > 30){
					data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
				}
				data.records[i].ShortPatient = data.records[i].Patient;
				if(data.records[i].Patient.length > 24){
					data.records[i].ShortPatient = data.records[i].Patient.substr(0,21) + "...";
				}
				data.records[i].PatientDOBMonth = data.records[i].PatientDOB.substr(4,2);
				data.records[i].PatientDOBDay = data.records[i].PatientDOB.substr(6, 2);
				data.records[i].PatientDOBYear = data.records[i].PatientDOB.substr(0,4);
			}
			if($scope.currentAlertType == 'deleted'){
				$scope.currentAlerts = $scope.deletedAlerts;
			}
		}); 
	}
	
	$scope.order = function(filter){
		$scope.reverse = !($scope.reverse);
		$scope.orderFilter = filter;
	}
	
	$scope.markAlert = function(alert, checkbox){
		//If checkbox was just selected, add the message as marked
		if(checkbox.checked){
			$scope.markedAlerts.push(alert);
		}
		//On unselecting a checkbox, find the message and remove it from the marked messages
		else{
			for(i = 0; i < $scope.markedAlerts.length; i++){
				if($scope.markedAlerts[i] == alert){
					//Remove the input message from the marked array
					$scope.markedAlerts.splice(i,1);
				}
			}
		}
	}
	
	//Add all the alerts in the input to the marked alerts
	markAllAlerts = function(sourceCheckbox){
	
		switch($scope.currentAlertType){
			case 'received':
				alerts = $scope.receivedAlerts.records;
				break;
			case 'deleted':
				alerts = $scope.deletedAlerts.records;
				break;
			default:
				alerts = [];
				break;
		}
		
		checkboxName = 'alertCheckbox';
		
		//Find all the checkboxes that will be affected by this function
		checkboxes = document.getElementsByName(checkboxName);
		for(i = 0; i < checkboxes.length; i++){
			checkboxes[i].checked = sourceCheckbox.checked;
		}
		//If the checkbox is checked, add all alerts as marked
		if(sourceCheckbox.checked){
			for(i = 0; i < alerts.length; i++){
				$scope.markedAlerts.push(alerts[i]);
			}
		}
		//When unchecked, remove all alerts from marked
		else{
			$scope.clearMarkedAlerts();
		}
	}
	
	//Remove all messages from the marked messages array
	$scope.clearMarkedAlerts = function(){
		$scope.markedAlerts = [];
		
		//Mark all the checkboxes as unchecked
		checkboxNames = ['alertCheckbox', 'controlCheckbox'];
		
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
	$scope.putMarkedAlerts = function(property, value){
		//Parse value (string) as an int (in base 10)
		value = parseInt(value, 10);
		if(property == 'read'){
			for(i = 0; i < $scope.markedAlerts.length; i++){
				putAlertURL = $scope.alertURL + $scope.markedAlerts[i].AlertID;
				//Change the alert's Deleted attribute to true
				$scope.markedAlerts[i].IsRead = value;
				//PUT the alert using the alert URL
				putData.put(putAlertURL, $scope.markedAlerts[i]).success(function(data){
					$scope.refreshAlerts();
				});
			}
		}
		else if(property == 'deleted'){
			for(i = 0; i < $scope.markedAlerts.length; i++){
				putAlertURL = $scope.alertURL + $scope.markedAlerts[i].AlertID;
				//Change the alert's Deleted attribute to true
				$scope.markedAlerts[i].IsArchived = value;
				//PUT the alert using the alert URL
				putData.put(putAlertURL, $scope.markedAlerts[i]).success(function(data){
					$scope.refreshAlerts();
				});
			}
		}
	}
};
 
 
//*************************************END ALERT CONTROLLERS******************************************//
 

 
//***********************************NOTIFICATION CONTROLLERS*****************************************// 
 
 
controllers.notificationsController = function ($scope, $http, $templateCache, $filter, persistData, getData, postData, putData){

	/* User Data */
	$scope.facilityID = 105
	$scope.careTeamID = 1010;
	$scope.userLevelID = 1;

	$scope.receivedURL = "http://killzombieswith.us/aii-api/v1/facilities/" + $scope.facilityID + "/notifications";
	$scope.deletedURL = "http://killzombieswith.us/aii-api/v1/facilities/" + $scope.facilityID + "/deletedNotifications";

	$scope.notificationURL = "http://killzombieswith.us/aii-api/v1/notifications/";
	
	$scope.currentNotificationType = 'received';
	
	/* Miscellaneous Variables */
	//OrderBy property : true means display contents in reverse order  
	$scope.reverse = false;
	$scope.orderFilter = 'Timestamp';
    //Alerts that have been marked (for deleting, marking as read, or marking as unread)
	$scope.markedNotifications = [];
	
	/* Initially executed functions */
	getData.get($scope.receivedURL).success(function(data) {
		//Generate the subject for every notification
		for(i = 0; i < data.records.length; i++){
			//If the notification was a request to join a care team...
			if(data.records[i].IsRequest == '1'){
				data.records[i].Subject = 'Invitation - ' + data.records[i]['Patient'];
			}
			//Otherwise the notification is a response to a sent care team invitation
			else{
				if(data.records[i].Response == '1'){
					data.records[i].Subject = 'Accepted - ' + data.records[i].Patient;
				}
				else if(data.records[i]['Response'] == '2'){
					data.records[i].Subject = 'Declined - ' + data.records[i].Patient;
				}
			}
			data.records[i].ShortSubject = data.records[i].Subject;
			if(data.records[i].Subject.length > 30){
				data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
			}
			data.records[i].ShortSenderFacilityName = data.records[i].SenderFacilityName;
			if(data.records[i].SenderFacilityName.length > 17){
				data.records[i].ShortSenderFacilityName = data.records[i].SenderFacilityName.substr(0,14) + "...";
			}
			data.records[i].PatientDOBMonth = data.records[i].PatientDOB.substr(4,2);
			data.records[i].PatientDOBDay = data.records[i].PatientDOB.substr(6, 2);
			data.records[i].PatientDOBYear = data.records[i].PatientDOB.substr(0,4);
		}
		$scope.receivedNotifications = data;
		$scope.currentNotifications = $scope.receivedNotifications;
    });
	
	getData.get($scope.deletedURL).success(function(data) {
		//Generate the subject for every notification
		for(i = 0; i < data.records.length; i++){
			//If the notification was a request to join a care team...
			if(data.records[i].IsRequest == '1'){
				data.records[i].Subject = 'Invitation - ' + data.records[i]['Patient'];
			}
			//Otherwise the notification is a response to a sent care team invitation
			else{
				if(data.records[i].Response == '1'){
					data.records[i].Subject = 'Accepted - ' + data.records[i].Patient;
				}
				else if(data.records[i]['Response'] == '2'){
					data.records[i].Subject = 'Declined - ' + data.records[i].Patient;
				}
			}
			data.records[i].ShortSubject = data.records[i].Subject;
			if(data.records[i].Subject.length > 30){
				data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
			}
			data.records[i].ShortSenderFacilityName = data.records[i].SenderFacilityName;
			if(data.records[i].SenderFacilityName.length > 17){
				data.records[i].ShortSenderFacilityName = data.records[i].SenderFacilityName.substr(0,14) + "...";
			}
			data.records[i].PatientDOBMonth = data.records[i].PatientDOB.substr(4,2);
			data.records[i].PatientDOBDay = data.records[i].PatientDOB.substr(6, 2);
			data.records[i].PatientDOBYear = data.records[i].PatientDOB.substr(0,4);
		}
		$scope.deletedNotifications = data;
    });
	
	$scope.setNotificationType = function(notificationType){
		$scope.currentNotificationType = notificationType;
		
		switch($scope.currentNotificationType){
			case 'received':
				$scope.currentNotifications = $scope.receivedNotifications;
				$scope.showFrom = true;
				$scope.showSubject = true;
				$scope.showTimestamp = true;
				$scope.showRestore = false;
				$scope.showDelete = true;
				$scope.showFullDelete = false;
				break;
			case 'deleted':
				$scope.currentNotifications = $scope.deletedNotifications;
				$scope.showFrom = true;
				$scope.showSubject = true;
				$scope.showTimestamp = true;
				$scope.showRestore = true;
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
			//Mark the selected notification as read
			if($scope.selectedNotification.IsRead == 0){
				putNotificationURL = $scope.notificationURL + $scope.selectedNotification.NotificationID;
				$scope.selectedNotification.IsRead = 1;
				putData.put(putNotificationURL, $scope.selectedNotification).success(function(data){
					$scope.refreshNotifications();
				});
			}
		}
		$scope.showPopup = !$scope.showPopup;
	}
	
	$scope.hidePopup = function(){
		$scope.showPopup = false;
		$scope.selectedNotification = [];
	}
	
	$scope.deleteSelectedNotification = function(deletedState){
		notificationURL = "http://killzombieswith.us/aii-api/v1/notifications/" + $scope.selectedNotification.NotificationID;
		//Change the notification's Deleted attribute to true
		$scope.selectedNotification.IsArchived = deletedState;
		//PUT the notification using the URL and then refresh the notifications
		putData.put(notificationURL, $scope.selectedNotification).success(function(data){
			$scope.refreshNotifications();
		});
		$scope.refreshNotifications();
	}
	
	$scope.refreshNotifications = function(){
		$scope.refreshReceived();
		$scope.refreshDeleted();
	}
	
	$scope.refreshReceived = function(){
		getData.get($scope.receivedURL).success(function(data) {
			//Generate the subject for every notification
			for(i = 0; i < data.records.length; i++){
				//If the notification was a request to join a care team...
				if(data.records[i].IsRequest == '1'){
					data.records[i].Subject = 'Invitation - ' + data.records[i]['Patient'];
				}
				//Otherwise the notification is a response to a sent care team invitation
				else{
					if(data.records[i].Response == '1'){
						data.records[i].Subject = 'Accepted - ' + data.records[i].Patient;
					}
					else if(data.records[i]['Response'] == '2'){
						data.records[i].Subject = 'Declined - ' + data.records[i].Patient;
					}
				}
				data.records[i].ShortSubject = data.records[i].Subject;
				if(data.records[i].Subject.length > 30){
					data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
				}
				data.records[i].ShortSenderFacilityName = data.records[i].SenderFacilityName;
				if(data.records[i].SenderFacilityName.length > 17){
					data.records[i].ShortSenderFacilityName = data.records[i].SenderFacilityName.substr(0,14) + "...";
				}
				data.records[i].PatientDOBMonth = data.records[i].PatientDOB.substr(4,2);
				data.records[i].PatientDOBDay = data.records[i].PatientDOB.substr(6, 2);
				data.records[i].PatientDOBYear = data.records[i].PatientDOB.substr(0,4);
			}
			$scope.receivedNotifications = data;
			if($scope.currentNotificationType == 'received'){
				$scope.currentNotifications = $scope.receivedNotifications;
			}
		});
	}
	
	$scope.refreshDeleted = function(){
		getData.get($scope.deletedURL).success(function(data) {
			//Generate the subject for every notification
			for(i = 0; i < data.records.length; i++){
				//If the notification was a request to join a care team...
				if(data.records[i].IsRequest == '1'){
					data.records[i].Subject = 'Invitation - ' + data.records[i]['Patient'];
				}
				//Otherwise the notification is a response to a sent care team invitation
				else{
					if(data.records[i].Response == '1'){
						data.records[i].Subject = 'Accepted - ' + data.records[i].Patient;
					}
					else if(data.records[i]['Response'] == '2'){
						data.records[i].Subject = 'Declined - ' + data.records[i].Patient;
					}
				}
				data.records[i].ShortSubject = data.records[i].Subject;
				if(data.records[i].Subject.length > 30){
					data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
				}
				data.records[i].ShortSenderFacilityName = data.records[i].SenderFacilityName;
				if(data.records[i].SenderFacilityName.length > 17){
					data.records[i].ShortSenderFacilityName = data.records[i].SenderFacilityName.substr(0,14) + "...";
				}
				data.records[i].PatientDOBMonth = data.records[i].PatientDOB.substr(4,2);
				data.records[i].PatientDOBDay = data.records[i].PatientDOB.substr(6, 2);
				data.records[i].PatientDOBYear = data.records[i].PatientDOB.substr(0,4);
			}
			$scope.deletedNotifications = data;
			if($scope.currentNotificationType == 'deleted'){
				$scope.currentNotifications = $scope.deletedNotifications;
			}
		}); 
	}
	
	$scope.order = function(filter){
		$scope.reverse = !($scope.reverse);
		$scope.orderFilter = filter;
	}
	
	$scope.markNotification = function(notification, checkbox){
		//If checkbox was just selected, add the message as marked
		if(checkbox.checked){
			$scope.markedNotifications.push(notification);
		}
		//On unselecting a checkbox, find the message and remove it from the marked messages
		else{
			for(i = 0; i < $scope.markedNotifications.length; i++){
				if($scope.markedNotifications[i] == notification){
					//Remove the input message from the marked array
					$scope.markedNotifications.splice(i,1);
				}
			}
		}
	}
	
	//Add all the notifications in the input to the marked notifications
	markAllNotifications = function(sourceCheckbox){
	
		switch($scope.currentNotificationType){
			case 'received':
				notifications = $scope.receivedNotifications.records;
				break;
			case 'deleted':
				notifications = $scope.deletedNotifications.records;
				break;
			default:
				notifications = [];
				break;
		}
		
		checkboxName = 'notificationCheckbox';
		
		//Find all the checkboxes that will be affected by this function
		checkboxes = document.getElementsByName(checkboxName);
		for(i = 0; i < checkboxes.length; i++){
			checkboxes[i].checked = sourceCheckbox.checked;
		}
		//If the checkbox is checked, add all notifications as marked
		if(sourceCheckbox.checked){
			for(i = 0; i < notifications.length; i++){
				$scope.markedNotifications.push(notifications[i]);
			}
		}
		//When unchecked, remove all notifications from marked
		else{
			$scope.clearMarkedNotifications();
		}
	}
	
	//Remove all messages from the marked messages array
	$scope.clearMarkedNotifications = function(){
		$scope.markedNotifications = [];
		
		//Mark all the checkboxes as unchecked
		checkboxNames = ['notificationCheckbox', 'controlCheckbox'];
		
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
	$scope.putMarkedNotifications = function(property, value){
		//Parse value (string) as an int (in base 10)
		value = parseInt(value, 10);
		if(property == 'read'){
			for(i = 0; i < $scope.markedNotifications.length; i++){
				putNotificationURL = $scope.notificationURL + $scope.markedNotifications[i].NotificationID;
				//Change the message's Deleted attribute to true
				$scope.markedNotifications[i].IsRead = value;
				//PUT the message using the message URL
				putData.put(putNotificationURL,$scope.markedNotifications[i]).success(function(data){
					$scope.refreshNotifications();
				});
				
			}
		}
		else if(property == 'deleted'){
			for(i = 0; i < $scope.markedNotifications.length; i++){
				putNotificationURL = $scope.notificationURL + $scope.markedNotifications[i].NotificationID;
				//Change the message's Deleted attribute to true
				$scope.markedNotifications[i].IsArchived = value;
				//PUT the message using the message URL
				putData.put(putNotificationURL,$scope.markedNotifications[i]).success(function(data){
					$scope.refreshNotifications();
				});
			}
		}
	}
	
	$scope.respondToRequest = function(status){
		putNotificationURL = $scope.notificationURL + $scope.selectedNotification.NotificationID;
		$scope.selectedNotification.Response = status;
		$scope.selectedNotification.IsArchived = 2;
		putData.put(putNotificationURL, $scope.selectedNotification).success(function(data){
			$scope.refreshNotifications();
		});
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
            url     : 'http://killzombieswith.us/aii-api/v1/messages',
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




myApp.controller(controllers);

})();

