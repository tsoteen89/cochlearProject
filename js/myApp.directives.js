//Travis Osteen

var myApp = angular.module('myApp.directives', []);

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

myApp.directive('dateInput', function(dateFilter) {
            return {
                require: 'ngModel',
                template: '<input type="date"></input>',
                replace: true,
                link: function(scope, elm, attrs, ngModelCtrl) {
                    ngModelCtrl.$formatters.unshift(function (modelValue) {
                        return dateFilter(modelValue, 'yyyy-MM-dd');
                    });
                    
                    ngModelCtrl.$parsers.unshift(function(viewValue) {
                        return new Date(viewValue);
                    });
                },
            };
    });
myApp.directive('completedAudiology', function() {
	return {
		restrict: 'E',
		templateUrl: 'directives/completed-audiology.html'
	}
});

myApp.directive('completedQuestions', function() {
	return {
		restrict: 'E',
		templateUrl: 'directives/completed-questions.html'
	}
});

myApp.directive('patientInfo', function() {
	return {
		restrict: 'E',
		templateUrl: 'directives/patient-info.html'
	}
});