
var careTeamApp = angular.module('ct_patientcontrollers',[]);

var controllers = {};


controllers.getPatientDataCtrl = function($scope, $http, $templateCache) {
    
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
    $scope.fetch();
}


careTeamApp.controller(controllers);
