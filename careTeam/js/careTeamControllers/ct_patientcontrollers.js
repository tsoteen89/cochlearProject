
var careTeamApp = angular.module('ct_patientcontrollers',[]);

var controllers = {};

controllers.getPatientDataCtrl = function($scope, $http){

    $http.get("backend/patientData.php")
    .then(function(res){
        $scope.patients = res.data;
    });
    
}


careTeamApp.controller(controllers);
