(function(){var myApp = angular.module('users.controller', []);

var controllers = {};

//Comment!!!
controllers.loginControl = function ($scope){
	$scope.open = function($event){
		$event.preventDefault();
		$event.stopPropagation();
	}
}

})();