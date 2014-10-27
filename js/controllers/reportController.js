
(function(){

var myApp = angular.module('reports', ['ui.bootstrap','ngCookies']);

var controllers = {};
    
controllers.reportCtrl = function($scope, getData, $cookieStore) {
    
    $scope.careTeams=[];
    //get the SessionID stored
	var cookieSessionID = $cookieStore.get('SessionID');
    console.log(cookieSessionID);
    
     $scope.isArray = function(check){
        return angular.isArray(check);
    }
     
    $scope.isObject = function(check){
        return angular.isObject(check);
    }
    
    $scope.facilityName = $cookieStore.get('FacilityName');
    var fullFacilityURL = 'http://killzombieswith.us/aii-api/v1/reports/fullFacility/'+ cookieSessionID; 
    getData.get(fullFacilityURL).success(function(data) {
        $scope.facilityReport = data.records;
    }).then(function(){

        for(var patient in $scope.facilityReport){
            if($scope.isArray($scope.facilityReport[patient].CareTeams)){
                    for(var careTeam in $scope.facilityReport[patient].CareTeams){
                        $scope.careTeams.push($scope.facilityReport[patient].CareTeams[careTeam]);
                    }
               }
            else{
                $scope.careTeams.push($scope.facilityReport[patient].CareTeams);
            }
        }       
    }).then(function(){
        $scope.eventNum = Object.keys($scope.careTeams).length;
    });
    
    var questionsURL = 'http://killzombieswith.us/aii-api/v1/reports/allQuestions'; 
    getData.get(questionsURL).success(function(data) {
        $scope.questions = data.records;
    });
    
    
    
    $scope.getCareTeamLength = function (object){
        return Object.keys(object).length;
    }
    $scope.export = function(){
        var blob = new Blob([document.getElementById('facReport').innerHTML], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            
            });
            saveAs(blob, "Facility_Report.xls");
    };
    
    
    
};
    
//App used to hold all controller contained within aiiController
myApp.controller(controllers);

})();