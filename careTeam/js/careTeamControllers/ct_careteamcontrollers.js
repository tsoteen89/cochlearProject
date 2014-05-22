//care team bitch
var careTeamApp = angular.module('ct_careteamcontrollers',[]);

var controllers = {};

controllers.getCareTeamDataCtrl = function($scope){
    
    $scope.careteams = [
        
        {provider: 'Alpha Practice', p_id: 'H1000'},
        {provider: 'Beta Practice', p_id: 'H1001'},
        {provider: 'Delta Practice', p_id: 'H1002'},
        {provider: 'Omega Practice', p_id: 'H1003'}
        
    ];
       
}

careTeamApp.controller(controllers);
