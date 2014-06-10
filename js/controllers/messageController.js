(function(){

	var myApp = angular.module('messageSystem',[]);

	var controllers = {};
	

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

	myApp.controller(controllers);

})();