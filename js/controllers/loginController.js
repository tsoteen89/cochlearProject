(function(){

var login = angular.module('login', []);


var controllers = {};

controllers.LoginController = function($scope){
	$scope.username = "";
	$scope.password = "";
	$scope.test = "blah";
}

controllers.loginControl = function ($scope){
	$scope.open = function($event){
		$event.preventDefault();
		$event.stopPropagation();
		
		$scope.opened = true;
	};
	
	$scope.username = "";
	$scope.password = "";
	$scope.list = [];
	
	$scope.submit = function(){
		$scope.list.push({'username':this.username, 'password':this.password});
	};
}

myApp.controller(controllers);
})();