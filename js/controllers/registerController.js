(function(){

var register = angular.module('register', []);

var controllers = {};

controllers.regControl = function ($scope){
		$scope.open = function($event){
		$event.preventDefault();
		$event.stopPropagation();
			
		$scope.opened = true;
	};
	
	$scope.register = {};
	
	$scope.submit = function(){
		//$scope.list.push({'username':this.username, 'password':this.password});
	};
}

register.controller(controllers);
})();