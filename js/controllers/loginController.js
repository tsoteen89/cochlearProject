(function(){

var login = angular.module('login', []);


var controllers = {};

controllers.loginControl = function ($scope){
	$scope.open = function($event){
		$event.preventDefault();
		$event.stopPropagation();
		
		$scope.opened = true;
	};
	
	$scope.login = {};
	
	$scope.submit = function(){
		$scope.list.push({'username':this.username, 'password':this.password});
	};
}

login.controller(controllers);
})();