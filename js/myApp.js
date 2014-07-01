//Travis Osteen
(function(){
var myApp = angular.module('myApp', ['ngRoute','checklist-model','ui.bootstrap','basicCtrl','phaseControllers','myApp.directives','messageSystem']);


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
  .when('/mySettings',
  {
      controller: '',
      templateUrl: 'partials/mySettings.html'
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
  .when('/questions',
  {
      controller: '',
      templateUrl: 'partials/questions.html'
  })
  .when('/addUser',
  {
      controller: '',
      templateUrl: 'partials/addUser.html'
  })
  .otherwise({redirectTo: 'partials/myHome.html'});

});


})();
