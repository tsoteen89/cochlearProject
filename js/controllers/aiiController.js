var myApp = angular.module('aiiController', []);

var controllers = {};

//************************************FACTORIES***************************************//

//Factory to dynamically GET from api
myApp.factory('getData', function($http){
    
    return {
        Patient: function(url) { return $http.get(url); },
        User: function(url) { return $http.get(url);},
        CareTeam: function(url) { return $http.get(url);},
        PatientCareTeams: function(url) { return $http.get(url);},
        CareTeamFacilities: function(url) { return $http.get(url);},
    }
 
});


//Factory that uses getter and setter to keep data persistant throughout partials
myApp.factory('persistData', function () {
    var persistantData;

    return {
        setData:function (data) {
            persistantData = data;
            console.log(data);
        },
        getData:function () {
            return persistantData;
        }
    };
});


//*****************************************END FACTORIES*******************************************//

//**************************************QUESTION CONTROLLERS***************************************//

//Controller used to handle display of Questions for a Patient's CareTeam  
controllers.questionsController = function($scope, persistData, getData, $http){
    $scope.answer = {};
    $scope.careTeamID = persistData.getData();
    
    $http.get("http://killzombieswith.us/aii-api/v1/phases/2/questions").success(function(data) {
        $scope.questionJson = data.records;
    });
    
    $scope.InputArray = function(data){
        return Array.isArray(data);
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
    getData.Patient($scope.patientURL).success(function(data) {
        $scope.patientsData = data;
    });
    
    //Grab all CareTeams using careTeamURL
    getData.CareTeam($scope.careTeamURL).success(function(data) {
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
        
        getData.PatientCareTeams($scope.PatientCareTeamsURL).success(function(data) {
            $scope.patientCareTeams = data;
        });
    }
    
    //Return a Facility for a specific CareTeam ID
    $scope.getCareTeamFacilities = function(careTeams){
        $scope.CareTeamFacilitiesURL = 'http://killzombieswith.us/aii-api/v1/careTeams/' + careTeams.CareTeamID + '/facilities';
        
        getData.CareTeamFacilities($scope.CareTeamFacilitiesURL).success(function(data) {
            $scope.facilityData = data;
        });
        
        persistData.setData(careTeams.CareTeamID);
    }    

};  
    

//Controller used to handle addition of new Patients to the system
controllers.formController = function($scope, $http) {
    // create a blank object to hold form information
    $scope.formData = {};
    
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    // Post function to add a new Patient to the system
    $scope.processForm = function() {
        $http({
            method  : 'POST',
            url     : 'http://killzombieswith.us/aii-api/v1/patients',
            data    : $scope.formData,  // pass in data as strings
            headers : { 'Content-Type': 'application/json' } 
        })
        .success(function(data) {
            console.log(data);
        });

    };

}

//**************************************END PATIENT CONTROLLERS******************************************//

//*****************************************USER CONTROLLERS**********************************************//

//Controller used to handle addition of NEW Users to the system
controllers.addUserController = function($scope, $http){
    
    // create a blank object to hold form information
    $scope.formData = {};

    // process the form
    $scope.processForm = function() {
        $http({
            method  : 'POST',
            url     : '../aii-api/v1/users',
            data    : $scope.formData,  // pass in data as strings
            headers : { 'Content-Type': 'application/json' } 
        })
        .success(function(data) {
            console.log(data);
        });

    };
}


//Controller used to handle any EDITS made to a User
controllers.editUserController = function($scope, $http, getData){
    $scope.editUser = {};
    $scope.userURL = "http://killzombieswith.us/aii-api/v1/users/1";
    
    //Grab single User by ID
    getData.User($scope.userURL).success(function(data) {
        $scope.userData = data;
    });
    
    $scope.editUserPut = function() {
        $http({
            method  : 'PUT',
            url     : '../aii-api/v1/users/' + this.userData.records[0].userID,
            data    : $scope.editUser,
            headers : { 'Content-Type': 'application/json' }
        })
        console.log("editUserPut has been Called");
    }
    
}

//**************************************END USER CONTROLLERS******************************************//

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


//********************************END MISCELLANEOUS CONTROLLERS***************************************//

myApp.controller(controllers);

