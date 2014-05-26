//Travis Osteen

var myApp = angular.module('myApp.directives', []);

myApp.directive('newPatientForm', function() {
	return {
		restrict: 'E',
		templateUrl: 'directives/new-patient-form.html'
	}
});	

myApp.directive('editPatientDem', function() {
	return {
		restrict: 'E',
		templateUrl: 'directives/edit-patient-dem.html'
	}
});	

myApp.directive('periopTab', function() {
	return {
		restrict: 'E',
		templateUrl: 'directives/periop-tab.html'
	}
});	

myApp.directive('candidacyTab', function() {
	return {
		restrict: 'E',
		templateUrl: 'directives/candidacy-tab.html'
	}
});	

myApp.directive('audiometricTesting', function() {
	return {
		restrict: 'E',
		templateUrl: 'directives/audiometric-testing.html'
	}
});


