//Travis Osteen

var myApp = angular.module('myApp.directives', []);

myApp.directive('newPatientForm', function() {
	return {
		restrict: 'E',
		templateUrl: 'directives/new-patient-form.html'
	}
});	

myApp.directive('editPatientContact', function() {
	return {
		restrict: 'E',
		templateUrl: 'directives/edit-patient-contact.html'
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

myApp.directive('demographicsTab', function() {
	return {
		restrict: 'E',
		templateUrl: 'directives/demographics-tab.html'
	}
});

myApp.directive('surgicalConsultTab', function() {
	return {
		restrict: 'E',
		templateUrl: 'directives/surgical-consult-tab.html'
	}
});

myApp.directive('oneWeekTab', function() {
	return {
		restrict: 'E',
		templateUrl: 'directives/one-week-tab.html'
	}
});




