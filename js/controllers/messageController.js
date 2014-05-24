(function(){

	var myApp = angular.module('messageSystem',[]);

	myApp.controller('messageController', function(){

		this.tab = 0;

		this.tabSelected = function(tabVal){

			this.tab = tabVal;
		};

		 this.isSelected = function(tabVal){

		 	return this.tab === tabVal;
		};
	});

})();