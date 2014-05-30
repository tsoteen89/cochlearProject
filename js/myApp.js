//Travis Osteen
(function(){
var myApp = angular.module('myApp', ['ngRoute','ui.bootstrap','basicCtrl','phase.controllers','myApp.directives','messageSystem','myHomeController']);


myApp.config(function ($routeProvider) {

  $routeProvider.when('/', {
      controller: '',
      templateUrl: 'partials/myHome.html'
  })
  .when('/newPatient',
  {
      controller: '',
      templateUrl: 'partials/newPatient.html'
  })
  .when('/accntSettings',
  {
      controller: '',
      templateUrl: 'partials/accntSettings.html'
  })
  .when('/logout',
  {
      controller: '',
      templateUrl: 'partials/logout.html'
  })
  .when('/login',
  {
      controller: '',
      templateUrl: 'login.php'
  })
  .when('/myHome',
  {
      controller: '',
      templateUrl: 'partials/myHome.html'
  })
  .when('/messages',
  {
      controller: '',
      templateUrl: 'partials/messages.html'
  })
  .when('/invites',
  {
      controller: '',
      templateUrl: 'partials/invites.html'
  })
  .when('/careTeam',
  {
      controller: '',
      templateUrl: 'partials/careTeam.html'
  })
  .when('/editPatient',
  {
      controller: '',
      templateUrl: 'partials/editPatient.html'
  })
  .when('/register',
  {
      controller: '',
      templateUrl: 'partials/register.html'
  })
  .otherwise({redirectTo: 'partials/myHome.html'});

});


})();
