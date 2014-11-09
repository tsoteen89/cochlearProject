
(function(){

var myApp = angular.module('reports', ['ui.bootstrap','ngCookies']);

var controllers = {};
    
controllers.reportCtrl = function($scope, getData, $cookieStore) {
    
    $scope.careTeams=[];
    //get the SessionID stored
	var cookieSessionID = $cookieStore.get('SessionID');
    console.log(cookieSessionID);
    $scope.facilityName = $cookieStore.get('FacilityName');
    
    $scope.questionsURL = "http://killzombieswith.us/aii-api/v1/phases/" + 2 + "/questions";
    getData.get($scope.questionsURL).success(function(data) {
        $scope.audioQuestions = data.records;
    });
    $scope.patientTypes = [
        {
            "name" : "Active",
            "checked" : false
        }, 
        {
            "name" : "Inactive",
            "checked" : false
        }
    ];
    
    $scope.reportTypes = [
        {
            "name" : "Perioperative",
            "checked" : false
        }, 
        {
            "name" : "Audiometric",
            "checked" : false
        }
    ];
    
    $scope.updateSelection = function(position, entities) {
        angular.forEach(entities, function(type, index) {
        if (position != index) 
          type.checked = false;
        });

    }
    $scope.patientType = null;
    $scope.setPatientType = function(type) {
        $scope.showReport = false;
        $scope.patientType =type;
        
    }

    $scope.setReportType = function(type) {
        $scope.showReport = false;
        $scope.reportType =type;
    }

    
    
    //Functions to test whether answers are in arrays or objects, so formating can be done
    //for ng repeat
    $scope.isArray = function(check){
        return angular.isArray(check);
    }
     
    $scope.isObject = function(check){
        return angular.isObject(check);
    }
    
    //get the full facilities answer report
    //

    //get the list of questions
    var questionsURL = 'http://killzombieswith.us/aii-api/v1/reports/allQuestions'; 
    getData.get(questionsURL).success(function(data) {
        $scope.questions = data.records;
    });
    
    //get the number of events for a patient
    $scope.getCareTeamLength = function (object){
        return Object.keys(object).length;
    }
    
        
    $scope.generateReport = function() {
        $scope.showReport = true;
         $scope.loadMessage = "Please wait for report to load...";
         var fullFacilityURL = 'http://killzombieswith.us/aii-api/v1/reports/fullFacility/' + $scope.patientType + '/' +  $scope.reportType + '/' + cookieSessionID;
        
        getData.get(fullFacilityURL).success(function(data) {
            $scope.facilityReport = data.records;
        }).then(function(){
            //push just all the patients' events into an array - needed to make ng-repeat easier, since careTeams are nested
            //so deep in the facilityReport
            for(var patient in $scope.facilityReport.Patients){
                if($scope.isArray($scope.facilityReport.Patients[patient].CareTeams)){
                        for(var careTeam in $scope.facilityReport.Patients[patient].CareTeams){
                            $scope.careTeams.push($scope.facilityReport.Patients[patient].CareTeams[careTeam]);
                        }
                   }
                else{
                    $scope.careTeams.push($scope.facilityReport[patient].CareTeams);
                }
            }       
        }).then(function(){
            //get the number of events
            $scope.eventNum = Object.keys($scope.careTeams).length;
        });
    }
    
    //Export to spreadsheet function
    $scope.export = function(){
        //this format for Mac Numbers isn't openable....
        if (navigator.userAgent.indexOf('Mac OS X') != -1) {
            var blob = new Blob([document.getElementById('facReport').innerHTML], {
                type: "application/x-iwork-numbers-sffnumbers"
            });
            saveAs(blob, "Facility_Report.numbers");
        } else {
            var blob = new Blob([document.getElementById('facReport').innerHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });
            saveAs(blob, "Facility_Report.xls");
        }
        
    };
    
    
    //Bad loading message code 

    $scope.clearMessage = function(){ //called on last interation of ng-repeat of the answers...
        
        $scope.loadMessage =" ";
        
    };
    
    
    
    
};
    
//App used to hold all controller contained within aiiController
myApp.controller(controllers);

})();