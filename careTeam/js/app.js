var app = angular.module('careTeamApp',['ngRoute','ui.bootstrap','ct_careteamcontrollers', 'ct_patientcontrollers', 'ct_invitationscontrollers', 'ct_insertpatientcontrollers']);

			app.config(function ($routeProvider) {

			$routeProvider
			.when('/', {
			controller:'',
			templateUrl: 'partials/home.html'
			})
			.when('/home', {
			controller:'',
			templateUrl: 'partials/home.html'
			})
			.when('/careteams',{
			controller:'getCareTeamDataCtrl',
			templateUrl: 'partials/careteams.html'
			})
			.when('/invitations',{
			controller:'getInvitationsDataCtrl',
			templateUrl: 'partials/invitations.html'
			})
			.when('/providers',{
			controller:'',
			templateUrl: 'partials/providers.html'
			})
            .when('/patientpage',{
            controllers:'getPatientDataCtrl',
            templateUrl: 'partials/patientpage.html'
            })
            .when('/insert',{
            controllers:'FrmController',
            templateUrl: 'partials/insertpatient.html'
            })
			.otherwise({redirectTo: 'partials/home.html'});

		});
//Checking if anne gets pull request or travis