var careTeamApp = angular.module('ct_insertpatientcontrollers',[]);

var controllers={};

controllers.FrmController = function($scope, $http){
    
    $scope.signUp = function(){
        $http.post('backend/insertPatientData.php', {'uname': $scope.username, 'pswd': $scope.userpassword, 'email': $scope.useremail
        })
        .success(function(data, status, headers, config) {
            
            console.log("In success area");
            
        })
        .error(function(data,status){
            console.log("In error");
        });
        
        
    }
    
    
    
}