
var myApp = angular.module('basicCtrl', []);

var controllers = {};

//Factory to get all Patients associated with Facility 100
myApp.factory('getPatients', function($http){
    
    return $http.get('http://killzombieswith.us/aii-api/v1/facilities/100/patients');
 
});

//Factory to get single User by ID
myApp.factory('getUser', function($http){
    
    return $http.get('http://killzombieswith.us/aii-api/v1/users/1');
    
});

//Factory to get all CareTeams associated with facility 100
myApp.factory('getCareTeams', function($http){
   
    return $http.get('http://killzombieswith.us/aii-api/v1/facilities/100/careTeams');
    
});


myApp.factory('getPatientCareTeams', function($http) {
    var url = 'null';
    return {
        getCares: function(callback) {
          $http.get(url).success(callback);
        },
        setCares: function(data) {
            url = data;
        }
    };
});


myApp.factory('getCareFacilities', function($http) {
    var url = 'null';
    return {
        getFacilities: function(callback) {
          $http.get(url).success(callback);
        },
        setFacilities: function(data) {
            url = data;
        }
    };
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


//Controller used on myHome to process API methods for Patients
controllers.apiPatientsController = function ($scope, $http, $templateCache, getPatients, getCareTeams, persistData, getPatientCareTeams, getCareFacilities) {   
    
    $scope.patients = {};
    $scope.selected={};
    $scope.list=[];

    //Grab all patients using getPatients Factory
    getPatients.success(function(data) {
        $scope.patientsData = data;
    });
    
    //Grab all careTeams using getCareTeams Factory
    getCareTeams.success(function(data) {
        $scope.careData = data;
    });

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
    
    
    $scope.getPatientCareTeam = function(patients){
        
        getPatientCareTeams.setCares('http://killzombieswith.us/aii-api/v1/patients/' + patients.PatientID + '/careTeams');
        
        getPatientCareTeams.getCares(function(results) {
            console.log('GetCares async returned value');
            $scope.patientCareTeams = results;
        });
    }
    
    
    $scope.getCareFacility = function(careTeams) {
    
        getCareFacilities.setFacilities('http://killzombieswith.us/aii-api/v1/careTeams/' + careTeams.CareTeamID + '/facilities');
        
        getCareFacilities.getFacilities(function(results) {
            console.log('GetCares async returned value');
            $scope.facilityData = results;
        });
        
        persistData.setData(careTeams.CareTeamID);
    }

};


//Controller used to handle display of Questions for a Patient's CareTeam  
controllers.questionsController = function($scope, persistData, getPatientCareTeams, $http){
    
    $scope.InputArray = function(data){
        return Array.isArray(data);
    }
    
    getPatientCareTeams.getCares(function(results) {
        console.log('GetCares async returned value');
        $scope.patientCareTeams = results;
    });
    
    $scope.careTeamID = persistData.getData();
    $scope.answer = {};
    
    $http.get("http://killzombieswith.us/aii-api/v1/phases/2/questions").success(function(data) {
        $scope.questionJson = data.records;
    });

};


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


//Controller used to handle addition of new Users to the system
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


//Controller used to handle any edits made to a User
controllers.editUserController = function($scope, $http, getUser){
    $scope.editUser = {};
    
    //Grab single User by ID
    getUser.success(function(data) {
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




myApp.controller(controllers);

