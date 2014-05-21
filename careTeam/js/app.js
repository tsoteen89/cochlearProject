var app = angular.module('careTeamApp',['ngRoute','ui.bootstrap']);

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
			controller:'',
<<<<<<< HEAD
			templateUrl: 'partials/baa.html'
=======
			templateUrl: 'partials/careteams.html'
>>>>>>> SananBranch
			})
			.when('/invitations',{
			controller:'',
			templateUrl: 'partials/invitations.html'
			})
			.when('/providers',{
			controller:'',
			templateUrl: 'partials/providers.html'
			})
            .when('/patientpage',{
                controllers:'',
                templateUrl: 'partials/patientpage.html'
            })
			.otherwise({redirectTo: 'partials/home.html'});
		
		});