(function() {
	 var myApp = angular.module('basicCtrl', []);

var controllers = {};

controllers.regularController = function($scope) {
	$scope.name = "Anne";
}

controllers.TabController = function(){
	this.tab=0;
	this.selectTab=function(tabNum){
		this.tab=tabNum;
	};
	this.isSelected=function(checkTab){
		return this.tab===checkTab;
	};
}


controllers.newPatientsController = function ($scope) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.maxDate = new Date();

	$scope.anne = "Anne";

	$scope.patID = "";
	$scope.fname = "";
	$scope.lname = "";
	$scope.mi = "";
	$scope.dt = "";
	$scope.streetAddress = "";
	$scope.city = "";
	$scope.zip = "";
	$scope.Sex = "";
	$scope.Race = "";
	$scope.BMI = "20";
	$scope.Height = "60";
	$scope.Weight = "120";

	$scope.bmis = [];
	$scope.heights = [];
	$scope.weights = [];
	$scope.i = 0;

	for($scope.i=0;$scope.i<36;$scope.i++){
		$scope.bmis[$scope.i] = $scope.i + 10;
	}

	for($scope.i=0;$scope.i<68;$scope.i++){
		$scope.heights[$scope.i] = $scope.i + 12;
	}

	for($scope.i=0;$scope.i<221;$scope.i++){
		$scope.weights[$scope.i] = $scope.i + 80;
	}

  $scope.clear = function () {
    $scope.dt = null;
  };

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.initDate = new Date('2016-15-20');
  $scope.format = 'yyyy/MM/dd';

  $scope.list = [];
  $scope.text = 'hello';
  $scope.submit = function() {
      $scope.list.push({'PatientID':this.patID, 'fname':this.fname, 'lname':this.lname, 'mi':this.lname,
			'DOB':this.dt, 'streetAddress':this.streetAddress, 'city':this.city, 'state':this.state,
			'zip':this.zip, 'Sex':this.Sex, 'Race':this.Race, 'BMI':this.BMI,
			'Height':this.Height, 'Weight':this.Weight});

			console.log($scope.list);
/*
			$scope.newOb = JSON.stringify($scope.list);

			$http.post("testPHP/testPost.php", $scope.newOb)
				.success(function(data) {
					console.log(data);
				});*/
	};
};


myApp.controller(controllers);
})();
