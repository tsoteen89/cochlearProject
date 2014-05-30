

var myApp = angular.module('myHomeController', []);


var controllers = {};

controllers.homeController = function ($scope){
	$scope.open = function($event){
		$event.preventDefault();
		$event.stopPropagation();
		
		$scope.opened = true;
	};
	
    var test = 'howdy';
    
    $scope.alerts = [
        { content: 'John Smith: Care phase has changed to Preoperative Visit'}
    ];
    
    $scope.notifications = [{content: 'Dr. Charlie Bravo has accepted your invitation to John Smith\'s care team'},
                         {content: 'Dr. Sierra Victor has invited you to join Jane Doe\'s care team'}];
    
    $scope.messages = [{
            from: 'Dr. Charlie Bravo',
            subject: 'Re: Surgical Consultation for John Smith',
            content: '...'
        },
        {
            from: 'Dr. Sierra Victor',
            subject: 'Could I send Jane Doe your way for candidacy testing?',
            content: '.......'
        }];
    
	$scope.submit = function(){
		$scope.list.push({'username':this.username, 'password':this.password});
	};
}

myApp.controller(controllers);
