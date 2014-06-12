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
      title: 'Perioperative Visit',
      content: "I'm in Perioperative Visit. Data is collected by MA/Surgeon" 
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

    $scope.value=0;
    
    $scope.messages = ["Let's fill this form!",'Great start!','High Five!', 'Nothing can stop you now.',
                "Alright! You're basically a hero!",'I think I love you.','Almost Done'];
    $scope.message=$scope.messages[0];
    $scope.changeCount = function() {
        if($scope.count < 6){
            $scope.count = $scope.count + 1;
        }
       $scope.message=$scope.messages[$scope.count];
        if($scope.value<86){
            $scope.value=$scope.value+14;
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
    $scope.races =[
        "Arctic (Siberian or Eskimo)", "Caucasian (European)","Caucasian","Caucasian (Middle East)","Caucasian (North African or Other)",
        "Indigenous Australian","Native American","North East Asian (Mongol - Tibetan - Korean Japanese - etc)",
        "Pacific (Polynesian - Micronesian - etc)","South East Asian (Chinese -  Thai - Malay - Filipino - etc)",
        "West African","Bushmen","Ethiopian","Other Race"];
    $scope.bmis = [];
    $scope.ages=[];
    for($scope.j=1;$scope.j<100;$scope.j++){
		$scope.ages[$scope.j] = $scope.j;
	};
    
    for($scope.i=0;$scope.i<61;$scope.i++){
		$scope.bmis[$scope.i] = $scope.i + 10;
	};
     
    $scope.patients = {};
    $scope.selected={};
    $scope.list=[];
    
        $scope.method = 'GET';
        $scope.url='../aii-api/v1/patient/';
        //$scope.url = 'http://api.msu2u.net/v1/patient/';

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
    
    //newwwwwwwwww
    $scope.processPut = function() {
        $http({
            method  : 'PUT',
            url     : "../aii-api/v1/patient/" + $scope.patObject.patient_id,
            data    : $scope.patObject,  // do not put param
            headers : { 'Content-Type': 'application/json' }
        })
        console.log("im in processPut");
       console.log("../aii-api/v1/patient/" + $scope.patObject.patient_id);
    }
    
    
    $scope.processDelete = function() {
        $http({
            method  : 'DELETE',
            url     : "../aii-api/v1/patient/" + $scope.patObject.patient_id,
            data    : $scope.patObject,  // do not put param
            headers : { 'Content-Type': 'application/json' }
        })
        console.log("im in processDelete");
       console.log("../aii-api/v1/patient/" + $scope.patObject.patient_id);
    }        

    $scope.questions = [
        {
            "text":"Cause of Deafness",            
            "answers":['Congenital','Progressive', 'Trauma', 'Infection','Ototoxicity', 'Meningitis', "Menier's Disease", 'other'],
            "help": "One of the described causes of deafness must be chosen."+ 
            "If the patient's cause of deafness is not listed, the choice 'Other' may be selected."+
            "If 'Other' is selected, the cause of deafness should be free texted into the space provided.",
            "type":""
        },
        {
        
        }
    ];
    $scope.submit = function() {
        {
            //{{selected | json}}
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
    
    $scope.formAnswers = {};
    $scope.count=0;
    $scope.questions = [
        {
            "text":"Ear being treated for this event",
            "answers":['Right', 'Left', 'Bilateral'],
            "help": "This should be the ear on which the current procedure is being performed. The predefined answer choices only allow 'Right', 'Left' or 'Bilateral'. The choice 'Bilateral' should be used if a simultaneous CI is being performed. ",
            "type":"radio",
            "name":"ear"
        },
        {
            "text":"Procedure done for the treated ear",
            "answers":['Cochlear Implant, Electric Only','Cochlear Implant, Electro Achoustic'],
            "help": "-- No help",
            "type":"radio",
            "name":"procTreated"
        },
        {
            "text":"Procedure done on the non-treated ear",
            "answers":['Cochlear Implant, Electric Only','Cochlear Implant, Electro Achoustic','Hearing Aid', 'None'],
            "help": "--No help",
            "type":"radio",
            "name":"procNonTreated"
        },
        {
            "text":"This is the surgeon's  (X) th implant",
            "answers":[''],
            "help": "Please do not count surgeries which occurred during residency, fellowship, or when assisting the primary surgeon. Only list ones where you were the primary surgeon. ",
            "type":"text",
            "name":"x"
        },
        {
            "text":"Were preoperative antibiotics given?",            
            "answers":['Yes','No'],
            "help": "Only 'Yes' or 'No' may be selected. In general, cefazolin (or other cephalosporin) should be given (clindamycin for penallergic patients). ",
            "type":"radio",
            "name":"antibiotics"
        },
        {
            "text":"Was intraoperative NRT performed?",            
            "answers":['Yes','No'],
            "help": "Only 'Yes' or 'No' may be selected. It is recommended that NRT be performed on all patients at the end of the procedure in the operating room. ",
            "type":"radio",
            "name":"nrt"
        }
    ];
};

controllers.candidacyCtrl = function ($scope) {
    $scope.values={};
    $scope.values.pta =60;
    $scope.values.srt=60;
    $scope.values.sds=50;
    $scope.submit = function() {
        {
            $scope.testValues.push({'pta':this.pta,'srt':this.srt,'sds':this.sds});
        }
    };
};

controllers.audioTestCtrl = function ($scope){
    $scope.values={};
    $scope.scores={};
    $scope.values.pta =60;
    $scope.values.srt=60;
    $scope.values.sds=50;
    $scope.scores.Az_Quiet = 50;
    $scope.scores.Az_Noise = 50;
    $scope.scores.BKB = 50;
    $scope.scores.CNC_Quiet = 50
    $scope.scores.CNC_Noise = 50;
    $scope.submit = function() {
    if($scope.pta && $scope.srt && $scope.sds)	{
            $scope.testValues.push({'pta':this.pta,'srt':this.srt,'sds':this.sds});
        }
    };
}

controllers.surgicalCtrl=function($scope){
    $scope.questions = [
        {
            "text":"Was a CT scan of the temporal bones performed?",            
            "answers":['Yes','No'],
            "help": "Predefined field choices only allow 'Yes' or 'No'.  If a CT scan is performed, it should be a thin slice CT of the temporal bones, without IV contrast"
        },
        {
            "text":"On the CT scan, was the course of the facial nerve normal in the ear to be implanted?",            
            "answers":['Yes','No','N/A'],
            "help": "Predefined answer choices should be 'Yes' or 'No'. If no CT scan was obtained, select 'N/A'. "
        },
        {
            "text":"On the CT scan, was the mastoid/middle ear aerated on the ear to be implanted ?",            
            "answers":['Yes','No','N/A'],
            "help": "Predefined answer choices should be 'Yes' or 'No'. If no CT scan was obtained, select 'N/A'. If the mastoid or middle ear is partially or totally opacified, select 'No'."
        },
        {
            "text":"On the CT scan, was there any bony dehischence  (tegmen tympani or tegmen mastoideum) in the ear to be implanted?",
             "answers":['Yes','No','N/A'],
            "help": "Predefined answer choices should be 'Yes' or 'No'. If no CT scan was obtained, select 'N/A'."
        },
        {
            "text":"On the CT scan, was the cochlea patent in the ear to be implanted?",
             "answers":['Yes','No','N/A'],
            "help": "Predefined answer choices should be 'Yes' or 'No'. If no CT scan was obtained, select 'N/A'."
        },
        {
            "text":"On the CT scan, was the cochlea well partitioned in the ear to be implanted?",
             "answers":['Yes','No','N/A'],
            "help": "Predefined answer choices should be 'Yes' or 'No'. If no CT scan was obtained, select 'N/A'."
        },
        {
            "text":"Was an MRI performed?",
            "answers":['Yes','No'],
            "help": "Predefined field choices only allow 'Yes' or 'No'.  If an MRI scan is obtained, it should be an MRI of the brain/brainstem with and without gadolinium."
        }
        
    ];
}

controllers.oneWeekCtrl=function($scope){
    $scope.questions = [
        {
            "text":"During the postoperative period, was there any wound infection?",
            "answers":['Yes','No'],
            "type":"radio",
            "help":"Only 'Yes' or 'No' may be selected. List 'Yes' if an infection requiring antibioitics occurs. " 
        },
        {
            "text":"During the postoperative period, was there any wound dehiscence?",
            "answers":['Yes','No'],
            "type":"radio",
            "help":"Only 'Yes' or 'No' may be selected. The surgeon should use judgment determining what defines dehiscence. In general, any additional treatment (steristrips, wet-to-dry dressing, additional suture) would consistitue a dehiscence. " 
        },
        {
            "text":"During the postoperative period, was there any vertigo or dizziness?",
            "answers":['Yes','No'],
            "type":"radio",
            "help":"Only 'Yes' or 'No' may be selected.  Any complaints by the patient of feeling disequilibrium, sense of motion or fall should be listed as a 'Yes'. " 
        },
        {
            "text":"If there was postoperative vertigo or dizziness, how many days until resolution?",
            "answers":[' '],
            "type":"text",
            "help":"Please list the number of days until the dizziness (if present) resolved." 
        },
        {
            "text":"Please list the type of device that was implanted?",
            "answers":[' '],
            "type":"text",
            "help":"The model number of the implant device should be inserted." 
        }
        
    ];
}

myApp.controller(controllers);
})();