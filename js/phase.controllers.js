var myApp = angular.module('phase.controllers', []);

var pcontrollers = {};

pcontrollers.existingPatientsCtrl = function ($scope) {
 
  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };
  
 
  $scope.street = "";
  $scope.city = "";
  $scope.street = "";
  $scope.zip = "";
   $scope.list = [];
   
  $scope.submit = function() {
		{
			$scope.list.push(this.street);
			$scope.list.push(this.city);
			$scope.list.push(this.state);
			$scope.list.push(this.zip);
		}
	};
};

pcontrollers.periopCtrl = function ($scope) {
  $scope.ear="";
  $scope.procTreated="";
  $scope.procNonTreated="";
  $scope.treatment=[];
  $scope.submit = function() {
	if($scope.ear && $scope.procTreated && $scope.procNonTreated)	{
			$scope.treatment.push(this.ear);
			$scope.treatment.push(this.procTreated);
			$scope.treatment.push(this.procNonTreated);
		}
	};
};

pcontrollers.candidacyCtrl = function ($scope) {
  $scope.pta="";
  $scope.srt="";
  $scope.sds="";
  $scope.testValues=[];
  $scope.submit = function() {
		{
			$scope.testValues.push(this.pta);
			$scope.testValues.push(this.srt);
			$scope.testValues.push(this.sds);
		}
	};
};

myApp.controller(pcontrollers);