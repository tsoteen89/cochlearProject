(function(){
var myApp = angular.module('phase.controllers', []);

var controllers = {};

controllers.existingPatientsCtrl = function ($scope, $http) {

    $scope.patients = {};
    $scope.selected={};
    $http.get('phpTest/getData.php')
            .then(function(res){
              $scope.patients = res.data;
              });


  $scope.street = "";
  $scope.city = "";
  $scope.state = "";
  $scope.zip = "";
   $scope.list = [];
 
    /*travis stuff
    $scope.formData = {};

    // edit the form
    $scope.editAddress = function() {
        $http({
            method  : 'PUT',
            url     : 'phpTest/testPost.php',
            data    : $.param($scope.formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
        })
            .success(function(data) {
                console.log(data);
            });

    };    
    */
  /*$scope.submit = function() {
		{
			 $scope.list.push({'street':this.street,'city':this.city,'state':this.state,'zip':this.zip});
		}
	};*/
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