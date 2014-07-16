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

var INTEGER_REGEXP = /^\-?\d+$/;
myApp.directive('integer', function() {
    
    return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (INTEGER_REGEXP.test(viewValue)) {
          // it is valid
          ctrl.$setValidity('integer', true);
          return viewValue;
        } else {
          // it is invalid, return undefined (no model update)
          ctrl.$setValidity('integer', false);
          return undefined;
        }
      });
    }
  };
    
});


var ALPHA_REGEXP = /^\-?\d+$/;
myApp.directive('alphabet', function() {
    
    return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {

                scope.nameHasLetter = (viewValue && /[A-z]/.test(viewValue)) ? 'valid' : undefined;
                scope.nameHasNumber = (viewValue && /\d/.test(viewValue)) ? 'valid' : undefined;

                if(scope.nameHasLetter && !scope.nameHasNumber) {
                    ctrl.$setValidity('alphabet', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('alphabet', false);                    
                    return undefined;
                }

            });
    }
  };

});


var PHONE_REGEXP = /^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;

myApp.directive('phone', function(){
    
    return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (PHONE_REGEXP.test(viewValue)) {
          // it is valid
          ctrl.$setValidity('phone', true);
          return viewValue;
        } else {
          // it is invalid, return undefined (no model update)
          ctrl.$setValidity('phone', false);
          return undefined;
        }
      });
    }
  };
    

});



/*
myApp.directive('phone', function() {
    return {
        restrice: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            angular.element(element).bind('blur', function() {
                var value = this.value;
                if(PHONE_REGEXP.test(value)) {
                    // Valid input
                    console.log("valid phone number");
                    angular.element(this).next().next().css('display','none');  
                } else {
                    // Invalid input  
                    console.log("invalid phone number");
                    angular.element(this).next().next().css('display','block');
                    /* 
                        Looks like at this point ctrl is not available,
                        so I can't user the following method to display the error node:
                        ctrl.$setValidity('currencyField', false); 
                    */                    
   //             }
     //       });              
       // }            
//    }        
//});