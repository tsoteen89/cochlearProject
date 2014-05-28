(function(){

	var myApp = angular.module('messageSystem',[]);

	var controllers = {};

	controllers.messageController = function($scope,$http){

		$scope.messageInputs = {};
		
		$scope.messageForm = function(){

			$http({

		 		method : "POST",
				url    : "phpTest/messageSubmitTest.php",
		 		data   : $.param($scope.messageInputs),
		 		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		 	})
		 	.success(function(data){
                 console.log(data);
        	});
        	$scope.messageInputs = {};
		};
	};

	myApp.controller(controllers);

})();