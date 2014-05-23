(function(){

	 var myApp = angular.module('messageController',[]);

	 var controllers = {};

	controllers.messageSendCtrl = function($scope){

		$scope.send = 1;

		$scope.setButtonVal = function(sent){

			$scope.send = sent;
		};

		$scope.isButtonVal = function(){

			if($scope.send == 1)
				return true;
			else
				return false;
		};
	};

	myApp.controller(controllers);
})();