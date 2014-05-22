(function(){

	var myApp = angular.module('messageSystem',[]);


	myApp.controller('messageController', function(){

		this.tab = 0;

		this.setTab = function(tabVal){

			this.tab = tabVal;
		};

		// this.isButtonVal = function(){

		// 	if(this.send == 1)
		// 		return true;
		// 	else
		// 		return false;
		// };
	});

})();