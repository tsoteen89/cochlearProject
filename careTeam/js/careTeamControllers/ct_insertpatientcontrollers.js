var careTeamApp = angular.module('ct_insertpatientcontrollers',[]);

var controllers={};

controllers.FrmController = function($scope, $http){
    
    $scope.formData = {};
    
    $scope.processForm = function() {
        $http({
            method  : 'POST',
            url     : 'backend/insertPatientData.php',
            data    : $.param($scope.formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
        })
            .success(function(data) {
                console.log(data);
            });

    };
    
    
}

careTeamApp.controller(controllers);