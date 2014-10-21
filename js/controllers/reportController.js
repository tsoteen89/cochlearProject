
(function(){

var myApp = angular.module('reports', ['ui.bootstrap','ngCookies']);

var controllers = {};
    
controllers.reportCtrl = function($scope, getData, $cookieStore) {
    /*
    //get the SessionID stored
	var cookieSessionID = $cookieStore.get('SessionID');
    */
    $scope.facilityName = $cookieStore.get('FacilityName');
    var fullFacilityURL = '../aii-api/v1/reports/fullFacility/123'; 
    getData.get(fullFacilityURL).success(function(data) {
        $scope.facilityReport = data.records;
    });
    
    var questionsURL = '../aii-api/v1/reports/allQuestions'; 
    getData.get(questionsURL).success(function(data) {
        $scope.questions = data.records;
    });
};
    
//App used to hold all controller contained within aiiController
myApp.controller(controllers);

})();