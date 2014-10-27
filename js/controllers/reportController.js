
(function(){

var myApp = angular.module('reports', ['ui.bootstrap','ngCookies']);

var controllers = {};
    
controllers.reportCtrl = function($scope, getData, $cookieStore) {
    
    //get the SessionID stored
	var cookieSessionID = $cookieStore.get('SessionID');
    console.log(cookieSessionID);
    
     $scope.isArray = function(check){
        return angular.isArray(check);
    }
     
    $scope.facilityName = $cookieStore.get('FacilityName');
    var fullFacilityURL = '../aii-api/v1/reports/fullFacility/'+ cookieSessionID; 
    getData.get(fullFacilityURL).success(function(data) {
        $scope.facilityReport = data.records;
    }).then(function(){
        $scope.patientNum = Object.keys($scope.facilityReport).length;
    });
    
    var questionsURL = '../aii-api/v1/reports/allQuestions'; 
    getData.get(questionsURL).success(function(data) {
        $scope.questions = data.records;
    });
    
    $scope.export = function(){
        var blob = new Blob([document.getElementById('report').innerHTML], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "Report.xls");
    };
    
    
    
};
    
//App used to hold all controller contained within aiiController
myApp.controller(controllers);

})();