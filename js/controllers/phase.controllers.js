(function(){

var myApp = angular.module('phase.controllers', []);

var controllers = {};

controllers.AccordionDemoCtrl= function($scope) {
  $scope.oneAtATime = true;

  $scope.groups = [
    {
      title: 'Demographics',
      content: "I'm in Demographics. Data is collected by CI Coordinator"
    },
    {
      title: 'Candidacy Testing',
      content: "I'm in Candidacy. Data is collected by Audiologist"
    },
    {
      title: 'Initial Surgical Consultation',
      content: "I'm in Initial Surgical Consultation. Data is collected by Data entry clerk"
    },
    {
      title: 'Pre(peri)operative Visit',
      content: "I'm in Pre(peri)operative Visit. Data is collected by MA/Surgeon"
    },
    {
      title: '1 week postoperative check',
      content: "I'm in 1 week postoperative check. time zero milestone"
    },
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.status = {
    isFirstOpen: true,
    isFirstDisabled: false
  };
};
    
controllers.progressCtrl= function($scope){
    $scope.count = 0;
    $scope.max = 100;

    $scope.value;
    $scope.message = "";
    
    if ($scope.count == 0) {
            $scope.message = "Let's fill this form!";
            value=0;    
        } 
    $scope.changeCount = function() {
        $scope.count = $scope.count + 1;
        if ($scope.count == 1) {
            $scope.message = 'Great start!';
            $scope.value=20;    
        } else if ($scope.count == 2) {
            $scope.message = 'Nothing can stop you now.';
            $scope.value=40;    
        } else if ($scope.count == 3) {
            $scope.message = 'Alright! Youre basically a hero!';
            $scope.value=60;    
        } else if ($scope.count == 4) {
            $scope.message = 'SO CLOSE. PRESS THE THING.';
            $scope.value=95; 
        }  else {
            $scope.message = 'SO CLOSE. PRESS THE THING.';
            $scope.value=95; 
        }

    };

};
    
controllers.ngBindHtmlCtrl = function ($scope, $sce) {
  $scope.myHTML =
     'I am an <code>HTML</code>string with <a href="#">links!</a> and other <em>stuff</em>';
    $scope.trustedHtml = $sce.trustAsHtml($scope.myHTML);
    $scope.textBox= $sce.trustAsHtml('<input  type="text" > </input>'); 
};

controllers.existingPatientsCtrl = function ($scope, $http, $templateCache) {

    $scope.patients = {};
    $scope.selected={};
    $scope.list=[];
    $scope.method = 'GET';
    $scope.url = 'http://api.msu2u.net/v1/patient/';

        $scope.code = null;
        $scope.response = null;

        $http(
          {method: $scope.method, 
           url: $scope.url, 
           cache: $templateCache
          }).
        success(function(data, status) {
          $scope.status = status;
          $scope.data = data;
        }).
        error(function(data, status) {
          $scope.data = data || "Request failed";
          $scope.status = status;
        });


    $scope.submit = function() {
        {
             $scope.list.push({'street':this.street,'city':this.city,'state':this.state,'zip':this.zip});
        }
    };
};

controllers.periopCtrl = function ($scope) {
  $scope.date="";
  $scope.ear="";
  $scope.procTreated="";
  $scope.procNonTreated="";
  $scope.treatment= [];
    
  $scope.submit = function() {
        $scope.treatment.push({'Date of Implantation': this.date,
        'ear':this.ear,
        'procedureForTreated':this.procTreated,
        'procedureForNontreated':this.procNonTreated});
		
	};
};

controllers.candidacyCtrl = function ($scope) {
    $scope.pta="";
    $scope.srt="";
    $scope.sds="";
    $scope.testValues=[];
    $scope.submit = function() {
        {
            $scope.testValues.push({'pta':this.pta,'srt':this.srt,'sds':this.sds});
        }
    };
};

controllers.audioTestCtrl = function ($scope){
    $scope.values={}
    $scope.scores={};
    $scope.submit = function() {
    if($scope.pta && $scope.srt && $scope.sds)	{
            $scope.testValues.push({'pta':this.pta,'srt':this.srt,'sds':this.sds});
        }
    };
}

myApp.controller(controllers);
})();