var careTeamApp = angular.module('ct_invitationscontrollers',[]);

var controllers = {};

controllers.getInvitationsDataCtrl = function($scope, $http){

    $http.get("backend/invitationsData.php")
    .then(function(res){
        $scope.invitations = res.data;
    });
    


}

careTeamApp.controller(controllers);
