

var app = angular.module('app.directives', []);

app.directive('newCareTeamForm', function() {
	return {
		restrict: 'E',
		templateUrl: 'directives/new-care-team-form.html'
	}
});	



