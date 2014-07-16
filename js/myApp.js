//Travis Osteen
(function(){
var myApp = angular.module('myApp', ['ngRoute','checklist-model','ui.bootstrap',
                                     'aiiController','myApp.directives']);


myApp.config(function ($routeProvider) {

  $routeProvider.when('/', {
      templateUrl: 'partials/login.html'
  })
  .when('/newPatient',
  {
      templateUrl: 'partials/newPatient.html'
  })
  .when('/accntSettings',
  {
      templateUrl: 'partials/accntSettings.html'
  })
  .when('/audioQuestions',
  {
      templateUrl: 'partials/audioQuestions.html'
  })  
  .when('/logout',
  {
      templateUrl: 'partials/logout.html'
  })
  .when('/mySettings',
  {
      templateUrl: 'partials/mySettings.html'
  })
  .when('/dashboard',
  {
      templateUrl: 'partials/dashboard.html'
  })
  .when('/messages',
  {
      templateUrl: 'partials/messages.html'
  })
  .when('/invites',
  {
      templateUrl: 'partials/invites.html'
  })
  .when('/careTeam',
  {
      templateUrl: 'partials/careTeam.html'
  })
  .when('/editPatient',
  {
      templateUrl: 'partials/editPatient.html'
  })
  .when('/questions',
  {
      templateUrl: 'partials/questions.html'
  })
  .when('/addUser',
  {
      templateUrl: 'partials/addUser.html'
  })
  .when('/patientDirectory',
  {
      templateUrl: 'partials/patientDirectory.html'
  })
  .otherwise({redirectTo: 'partials/dashboard.html'});

});


})();
