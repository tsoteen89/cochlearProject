var careTeamApp = angular.module('ct_insertpatientcontrollers',[]);

var controllers={};

controllers.FrmController = function($scope, $http){
    
    $scope.treatments = [];
    $scope.i = 0;
    
    
    //Populating the treatment duration array
    for($scope.i = 0; $scope.i < 24; $scope.i++){
        
        $scope.treatments[$scope.i] = $scope.i+1;
        
    }
    
    
    
    
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