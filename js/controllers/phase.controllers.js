(function(){var myApp = angular.module('phase.controllers', []);

var controllers = {};

controllers.existingPatientsCtrl = function ($scope) {

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };


  $scope.street = "";
  $scope.city = "";
  $scope.state = "";
  $scope.zip = "";
   $scope.list = [];

  $scope.submit = function() {
		{
			$scope.list.push({'street':this.street,'city':this.city,'state':this.state,'zip':this.zip});
		}
	};
};

controllers.periopCtrl = function ($scope) {
  $scope.date="";
  $scope.ear="";
  $scope.procTreated="";
  $scope.procNonTreated="";
  $scope.treatment=[];
  $scope.submit = function() {
	if($scope.date && $scope.ear && $scope.procTreated && $scope.procNonTreated)	{
			$scope.treatment.push({'Date of Implantation': this.date,
			'ear':this.ear,
			'procedureForTreated':this.procTreated,
			'procedureForNontreated':this.procNonTreated});
		}
	};
};

controllers.candidacyCtrl = function ($scope) {
  $scope.pta="";
  $scope.srt="";
  $scope.sds="";
  $scope.testValues=[];
  $scope.submit = function() {
		{
			$scope.testValues.push({'pta':this.pta,'srt':this.srt,'sds':this.sds});
		}
	};
};

controllers.audioTestCtrl = function ($scope){
  $scope.pta="";
  $scope.srt="";
  $scope.sds="";
  $scope.testValues=[];
  $scope.submit = function() {
	if($scope.pta && $scope.srt && $scope.sds)	{
			$scope.testValues.push({'pta':this.pta,'srt':this.srt,'sds':this.sds});
		}
	};
}

myApp.controller(controllers);
})();
