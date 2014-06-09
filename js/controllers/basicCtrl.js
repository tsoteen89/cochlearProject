
var myApp = angular.module('basicCtrl', []);

var controllers = {};

controllers.regularController = function($scope) {
	$scope.name = "Anne";
}


controllers.TabController = function(){
	this.tab=-1;
	this.selectTab=function(tabNum){
		this.tab=tabNum;
	};
	this.isSelected=function(checkTab){
		return this.tab===checkTab;
	};
}   
    
    
controllers.formController = function($scope, $http) {
    
    $scope.bmis = [];
	$scope.heights = [];
	$scope.weights = [];
	$scope.i = 0;
    $scope.maxDate = new Date();
    
    $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened = true;
    };

	for($scope.i=0;$scope.i<36;$scope.i++){
		$scope.bmis[$scope.i] = $scope.i + 10;
	}

	for($scope.i=0;$scope.i<68;$scope.i++){
		$scope.heights[$scope.i] = $scope.i + 12;
	}

	for($scope.i=0;$scope.i<221;$scope.i++){
		$scope.weights[$scope.i] = $scope.i + 80;
	}

    // create a blank object to hold form information
    $scope.formData = {};

    // process the form
    $scope.processForm = function() {
        $http({
            method  : 'POST',
            url     : 'phpTest/testPost.php',
            data    : $.param($scope.formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
        })
        .success(function(data) {
            console.log(data);
        });

    };

}


controllers.practicePost = function($scope, $http){
    
    $scope.patObject = {};
    
    $scope.processPost = function() {
        $http({
            method  : 'POST',
            url     : 'localhost/Github/aii-api/v1/patient',
            data    : $.param($scope.patObject),  // pass in data as strings
            headers : { 'Content-Type': 'multipart/form-data' }  
        })
        .success(function(data) {
            console.log(data);
        });
    }
}

controllers.ProgressDemoCtrl = function($scope) {

  $scope.max = 100;
  $scope.dynamic = 0;

  $scope.fillBar = function() {
    var value = 7;
    var type;

    if ($scope.dynamic < 25) {
      type = 'danger';
    } else if ($scope.dynamic < 50) {
      type = 'warning';
    } else if ($scope.dynamic < 75) {
      type = 'info';
    } else {
      type = 'success';
    }

    $scope.showWarning = (type === 'danger' || type === 'warning');
    
    if($scope.dynamic < 100)  { 
        $scope.dynamic = $scope.dynamic + value;
        $scope.type = type;
    }
  };


}


controllers.newAPICtrl = function($scope, $http, $templateCache) {
    
    $scope.theVar = 4;
    
    $scope.method = 'GET';
    $scope.url = 'http://api.msu2u.net/v1/patient/';

    $scope.fetch = function() {
          $scope.code = null;
          $scope.response = null;

          $http({
              method: $scope.method, 
              url: $scope.url,
              cache: $templateCache
          }).
          success(function(data, status) {
              $scope.status = status;
              $scope.data = data;
          }).
          error(function(data, status) {
          $scope.data = data || "Request failed";
          $scope.status = status;
          });

    };  
}



myApp.controller(controllers);

