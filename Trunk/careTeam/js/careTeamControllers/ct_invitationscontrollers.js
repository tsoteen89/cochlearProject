var careTeamApp = angular.module('ct_invitationscontrollers',[]);

var controllers = {};

controllers.getInvitationsDataCtrl = function($scope){

 /*   $http.get("backend/invitationsData.php")
    .then(function(res){
        $scope.invitations = res.data;
    });
   */
    
    $scope.invitations = [
        {careTeam: 'Alpha', careTeamID: 'H1000'},
        {careTeam: 'Beta', careTeamID: 'H2000'},
        {careTeam: 'Delta', careTeamID: 'H2010'},
        {careTeam: 'Omega', careTeamID: 'H1010'}
    ];
    
}

careTeamApp.controller(controllers);
