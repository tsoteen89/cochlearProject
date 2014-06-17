(function(){
    
var app = angular.module('ct_newCareTeamCtrl', []);

var controllers = {};  
    
    
controllers.TabController = function(){
	this.tab=0;
	this.selectTab=function(tabNum){
		this.tab=tabNum;
	};
	this.isSelected=function(checkTab){
		return this.tab===checkTab;
	};
} 
    
controllers.formController = function($scope) {
    
	$scope.i = 5;



    // create a blank object to hold form information
    $scope.formData = {};

    // process the form
    /*
    $scope.processForm = function() {
        $http({
            method  : 'POST',
            url     : 'phpTest/testPost.php',
            data    : $.param($scope.formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
        })
            .success(function(data) {
                console.log(data);
            });

    };
*/
}


app.controller(controllers);

})();