(function(){

var myApp = angular.module('phase.controllers', []);

var controllers = {};

    
controllers.ngBindHtmlCtrl = function ($scope, $sce) {
  $scope.myHTML =
     'I am an <code>HTML</code>string with <a href="#">links!</a> and other <em>stuff</em>';
    $scope.trustedHtml = $sce.trustAsHtml($scope.myHTML);
    $scope.textBox= $sce.trustAsHtml('<input  type="text" > </input>'); 
};

controllers.existingPatientsCtrl = function ($scope, $http, $templateCache) {

    $scope.patients = {};
    $scope.selected={};
    
    $scope.method = 'GET';
    $scope.url = 'http://api.msu2u.net/v1/patient/?limit=5&output=json';

        $scope.code = null;
        $scope.response = null;

        $http(
          {method: $scope.method, 
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

    
   /* $http.get('phpTest/getData.php')
            .then(function(res){
              $scope.patients = res.data;
              });

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
  $scope.testValues={};
  $scope.scores={};
  $scope.submit = function() {
	if($scope.pta && $scope.srt && $scope.sds)	{
			$scope.testValues.push({'pta':this.pta,'srt':this.srt,'sds':this.sds});
		}
	};
}

myApp.controller(controllers);
})();