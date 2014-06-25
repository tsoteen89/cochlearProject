
var myApp = angular.module('basicCtrl', []);

var controllers = {};

//Factory to get all Patients associated with Facility 100
myApp.factory('getPatients', function($http){
    
    return $http.get('http://killzombieswith.us/aii-api/v1/facilities/100/patients');
 
});

//Factory to get all CareTeams associated with facility 100
myApp.factory('getCareTeams', function($http){
   
    return $http.get('http://killzombieswith.us/aii-api/v1/facilities/100/careTeams');
    
});


myApp.factory('getPatientCareTeams', function($http) {
    var url = 'null';
    return {
        getCares: function(callback) {
          $http.get(url).success(callback);
        },
        setCares: function(data) {
            url = data;
        }
    };
});


myApp.factory('getCareFacilities', function($http) {
    var url = 'null';
    return {
        getFacilities: function(callback) {
          $http.get(url).success(callback);
        },
        setFacilities: function(data) {
            url = data;
        }
    };
});


//Factory that uses getter and setter to keep data persistant throughout partials
myApp.factory('persistData', function () {
    var persistantData;

    return {
        setData:function (data) {
            persistantData = data;
            console.log(data);
        },
        getData:function () {
            return persistantData;
        }
    };
});


//Controller used on myHome to process API methods for Patients
controllers.apiPatientsController = function ($scope, $http, $templateCache, getPatients, getCareTeams, persistData, getPatientCareTeams, getCareFacilities) {   
    
    $scope.patients = {};
    $scope.selected={};
    $scope.list=[];

    //Grab all patients using getPatients Factory
    getPatients.success(function(data) {
        $scope.patientsData = data;
    });
    
    //Grab all careTeams using getCareTeams Factory
    getCareTeams.success(function(data) {
        $scope.careData = data;
    });

    $scope.processPut = function() {
        $http({
            method  : 'PUT',
            url     : $scope.url + $scope.patObject.patient_id,
            data    : $scope.patObject,
            headers : { 'Content-Type': 'application/json' }
        })
        console.log("im in processPut");
        console.log("../aii-api/v1/patients/" + $scope.patObject.patient_id);
    }
    
    
    $scope.processDelete = function() {
        $http({
            method  : 'DELETE',
            url     : $scope.url + $scope.patObject.patient_id,
            data    : $scope.patObject, 
            headers : { 'Content-Type': 'application/json' }
        })
        console.log("im in processDelete");
        console.log("../aii-api/v1/patients/" + $scope.patObject.patient_id);
    }        
    
    $scope.processSoftDelete = function() {
        $http({
            method  : 'PUT',
            url     : $scope.url + $scope.patObject.patient_id,
            data    : $scope.patObject,
            headers : { 'Content-Type': 'application/json' }
        })
        console.log("im in processSoftDelete");
        console.log("../aii-api/v1/patients/" + $scope.patObject.patient_id);
    }
    
    
    $scope.getPatientCareTeam = function(patients){
        
        getPatientCareTeams.setCares('../aii-api/v1/patients/' + patients.PatientID + '/careTeams');
        
        getPatientCareTeams.getCares(function(results) {
            console.log('GetCares async returned value');
            $scope.patientCareTeams = results;
        });
    }
    
    
    $scope.getCareFacility = function(careTeams) {
    
        getCareFacilities.setFacilities('../aii-api/v1/careTeams/' + careTeams.careTeamID + '/facilities');
        
        getCareFacilities.getFacilities(function(results) {
            console.log('GetCares async returned value');
            $scope.facilityData = results;
        });
        
        persistData.setData(careTeams.careTeamID);
    }

};


controllers.questionsController = function($scope, persistData, getPatientCareTeams, $http){
    
    getPatientCareTeams.getCares(function(results) {
        console.log('GetCares async returned value');
        $scope.patientCareTeams = results;
    });
    
    $scope.theMonster = persistData.getData();
    

    $scope.questionJson = [
       {
          "QuestionID":"1",
          "QuestionText":"Age",
          "QuestionHelp":"Predefined field choices will only allow integers to be inserted",
          "PhaseID":"0",
          "Input":{
             "Type":"Select",
             "Values":"1:100"
          },
          "Comment":""
       },
       {
          "QuestionID":"2",
          "QuestionText":"Gender",
          "QuestionHelp":"If Patient is a male or female",
          "PhaseID":"0",
          "Input":{
             "Type":"Radio",
             "Values":[
                "M",
                "F"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"3",
          "QuestionText":"Ethnicity",
          "QuestionHelp":"Patient's race",
          "PhaseID":"0",
          "Input":{
             "Type":"Select",
             "Values":[
                "Arctic (Siberian or Eskimo)",
                "Caucasian (European)",
                "Caucasian (Indian)",
                "Caucasian (Middle East)",
                "Caucasian (North African or Other)",
                "Indigenous Australian",
                "Native American",
                "North East Asian (Mongol - Tibetan - Korean Japanese - etc)",
                "Pacific (Polynesian - Micronesian - etc)",
                "South East Asian (Chinese -  Thai - Malay - Filipino - etc)",
                "West African",
                "Bushmen",
                "Ethiopian",
                "Other Race"
             ]
          }
       },
       {
          "QuestionID":"4",
          "QuestionText":"What type of implant?",
          "QuestionHelp":"Indicates what type of implant the patient wants",
          "PhaseID":"0",
          "Input":{
             "Type":"Select",
             "Values":[

             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"5",
          "QuestionText":"Body Mass Index (BMI)",
          "QuestionHelp":"Predefined field choices will only allow numbers rounded to 1 decimal point  to be inserted.",
          "PhaseID":"0",
          "Input":{
             "Type":"Select",
             "Values":"10:70"
          },
          "Comment":""
       },
       {
          "QuestionID":"6",
          "QuestionText":"Cause of Deafness",
          "QuestionHelp":"One of the described causes of deafness must be chosen. If the patient's cause of deafness is not listed, the choice \"Other\" may be selected. If \"Other\" is selected, the cause of deafness should be free texted into the space provided.",
          "PhaseID":"0",
          "Trigger":"Other",
          "Child":[
             "Other"
          ],
          "Input":{
             "Type":"Select",
             "Values":[
                "Congenital",
                "Progressive",
                "Trauma",
                "Infection",
                "Ototoxicity",
                "Meningitis",
                "Menier's Disease",
                "Other"
             ]
          },
          "Comment":"A trigger of other causes a specific 'other' type question that will be the same for many questions. It's simply a text box with 'Other:' in front of it."
       },
       {
          "QuestionID":"7",
          "QuestionText":"Duration of Deafness",
          "QuestionHelp":"If the duration of deafness is less than one year, \"<1\" should be selected. Otherwise, predefined field choices will only allow integers to be inserted. Example: When did patient stop talking on telephone, or when did patient stop benefitting from hearing aids.",
          "PhaseID":"0",
          "Input":{
             "Type":"Select",
             "Values":"<1,1:100"
          },
          "Comment":"colons (:) = ranges and ',' (commas) equals list of values, so this question has one additional item + a range."
       },
       {
          "QuestionID":"8",
          "QuestionText":"History of Chronic Mastoiditis",
          "QuestionHelp":"If the patient has been treated in the past for  chronic mastoiditis \"Yes\" should be selected. Otherwise, \"No\" is the correct choice.",
          "PhaseID":"0",
          "Trigger":"Y",
          "Child":[
             9
          ],
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"9",
          "QuestionText":"Which ear?",
          "QuestionHelp":"Predefined field choices will only allow \"Left\", \"Right\" or \"Both\" to be inserted.",
          "PhaseID":"0",
          "Input":[
             {
                "Type":"Select",
                "Label":"Side",
                "Values":[
                   "Left",
                   "Right",
                   "Both"
                ]
             },
             {
                "Type":"Select",
                "Label":"Month",
                "Values":"1:12"
             },
             {
                "Type":"Select",
                "Label":"Year",
                "Year":"(Now-50):Now"
             },
             {
                "Type":"Select",
                "Label":"Treatment",
                "Values":[
                   "Oral Antibiotics",
                   "IV AntiBiotics",
                   "Ear drops",
                   "Regular Cleanings",
                   "Surgery",
                   "Other"
                ]
             }
          ],
          "Additional":"+",
          "Comment":"Clicking the + sign will bring another instance of the complex data type: 'Surgery' to fill out."
       },
       {
          "QuestionID":"10",
          "QuestionText":"History of Previous Ear Surgery",
          "QuestionHelp":"Simply choose YES or NO.",
          "PhaseID":"0",
          "Trigger":"Y",
          "Child":[
             11
          ],
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"11",
          "QuestionText":"For each previous ear surgery, please list: Side, Date, Type",
          "QuestionHelp":"If there is a history of ear surgery, please enter <b>(1)</b> Which Side: (Right, Left, Both), <b>(2)</b> The Date (MM\/YYYY) And <b>(3)</b> The type of surgery performed.",
          "PhaseID":"0",
          "Input":[
             {
                "Type":"Select",
                "Label":"Side",
                "Values":[
                   "Left",
                   "Right",
                   "Both"
                ]
             },
             {
                "Type":"Select",
                "Label":"Month",
                "Values":"1:12"
             },
             {
                "Type":"Select",
                "Label":"Year",
                "Year":"(Now-50):Now"
             },
             {
                "Type":"Select",
                "Label":"Surgery",
                "Values":[
                   "Normal",
                   "Fluid",
                   "Mass",
                   "Cholesteatoma",
                   "Retracted",
                   "Perforation",
                   "Other"
                ]
             }
          ],
          "Additional":"+",
          "Comment":"Clicking the + sign will bring another instance of the complex data type: 'Surgery' to fill out."
       },
       {
          "QuestionID":"12",
          "QuestionText":"Is there is history of vertigo within the last 6 months?",
          "QuestionHelp":"Predefined field choices will only allow \"Yes\" or \"No\"",
          "PhaseID":"0",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"13",
          "QuestionText":"Which ear is the better hearing ear?",
          "QuestionHelp":"Choices include left, right if one performs better and neither if both ears are equal.",
          "PhaseID":"0",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Left",
                "Right",
                "Neither"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"14",
          "QuestionText":"Please list exam findings for each ear.",
          "QuestionHelp":"Choose Left, Right, or Both, then all that apply for a particular treatment. If the finding does not exist in the predefined choices, \"Other\" should be used. ",
          "PhaseID":"0",
          "Trigger":"Other",
          "Child":[
             "Other"
          ],
          "Input":[
             {
                "Type":"Select",
                "Label":"Side",
                "Values":[
                   "Left",
                   "Right",
                   "Both"
                ]
             },
             {
                "Type":"Select",
                "Label":"Month",
                "Values":"1:12"
             },
             {
                "Type":"Select",
                "Label":"Year",
                "Year":"(Now-50):Now"
             },
             {
                "Type":"Select",
                "Label":"Surgery",
                "Values":[
                   "Normal",
                   "Fluid",
                   "Mass",
                   "Cholesteatoma",
                   "Retracted",
                   "Perforation",
                   "Other"
                ]
             }
          ],
          "Additional":"+",
          "Comment":"Maybe a checkbox on a question like this? Also, the '+' sign means if clicked, give another entry."
       },
       {
          "QuestionID":"15",
          "QuestionText":"Was a PneumoVax \\copy Given?",
          "QuestionHelp":"If the inoculation was given, enter a date, or leave blank if not administered. CDC recommends PneumoVax and Prevnar vaccination before cochlear implantation. Ask about hyper link.",
          "PhaseID":"0",
          "Trigger":"Y",
          "Child":[

          ],
          "Input":[
             {
                "Type":"Select",
                "Label":"Month",
                "Values":"1:12"
             },
             {
                "Type":"Select",
                "Label":"Year",
                "Year":"(Now-50):Now"
             }
          ],
          "Comment":"Need web link for the CDC site. And, leave date field blank if it wasn't given."
       },
       {
          "QuestionID":"16",
          "QuestionText":"Is the patient a current tobacco user?",
          "QuestionHelp":"Predefined field choices only allow \"Yes\" or \"No\".",
          "PhaseID":"0",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          }
       },
       {
          "QuestionID":"17",
          "QuestionText":"Is there a history of Diabetes Mellitus (type I or type II)?",
          "QuestionHelp":"Predefined field choices only allow \"Yes\" or \"No\".",
          "PhaseID":"0",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"18",
          "QuestionText":"Was a CT scan of the temporal bones performed?",
          "QuestionHelp":"Predefined field choices only allow \"Yes\" or \"No\".  If a CT scan is performed, it should be a thin slice CT of the temporal bones, without IV contrast.",
          "PhaseID":"1",
          "Trigger":"Y",
          "Child":[
             19,
             20,
             21,
             22,
             23
          ],
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"19",
          "QuestionText":"On the CT scan, was the course of the facial nerve normal in the ear to be implanted?",
          "QuestionHelp":"Predefined answer choices should be \"Yes\" or \"No\". If no CT scan was obtained, select \"N\/A\".",
          "PhaseID":"1",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"20",
          "QuestionText":"On the CT scan, was the mastoid\/middle ear aerated on the ear to be implanted?",
          "QuestionHelp":"Predefined answer choices should be \"Yes\" or \"No\". If no CT scan was obtained, select \"N\/A\". If the mastoid or middle ear is partially or totally opacified, select \"No\".",
          "PhaseID":"1",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"21",
          "QuestionText":"On the CT scan, was there any bony dehischence  (tegmen tympani or tegmen mastoideum) in the ear to be implanted?",
          "QuestionHelp":"Predefined answer choices should be \"Yes\" or \"No\". If no CT scan was obtained, select \"N\/A\".",
          "PhaseID":"1",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"22",
          "QuestionText":"On the CT scan, was the cochlea patent in the ear to be implanted?",
          "QuestionHelp":"Predefined answer choices should be \"Yes\" or \"No\". If no CT scan was obtained, select \"N\/A\".",
          "PhaseID":"1",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"23",
          "QuestionText":"On the CT scan, was the cochlea well partitioned in the ear to be implanted?",
          "QuestionHelp":"Predefined answer choices should be \"Yes\" or \"No\". If no CT scan was obtained, select \"N\/A\".",
          "PhaseID":"1",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"24",
          "QuestionText":"Was an MRI performed?",
          "QuestionHelp":"Predefined field choices only allow \"Yes\" or \"No\".  If an MRI scan is obtained, it should be an MRI of the brain\/brainstem with and without gadolinium.",
          "PhaseID":"1",
          "Trigger":"Y",
          "Child":[
             25,
             26,
             27
          ],
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"25",
          "QuestionText":"On the MRI, was the course of the facial nerve normal in the ear to be implanted?",
          "QuestionHelp":"Predefined answer choices should be \"Yes\" or \"No\". If no MRI scan was obtained, select \"N\/A\".",
          "PhaseID":"1",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"26",
          "QuestionText":"On the MRI scan, is there an adequate cochlear fluid signal in the ear to be implanted?",
          "QuestionHelp":"Predefined answer choices should be \"Yes\" or \"No\".If no MRI scan was obtained, select \"N\/A\".",
          "PhaseID":"1",
          "Trigger":"",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"26",
          "QuestionText":"On the MRI scan, is the 7th\/8th nerve complex normal in the ear to be implanted?",
          "QuestionHelp":"Predefined answer choices should be \"Yes\" or \"No\". If no MRI scan was obtained, select \"N\/A\".",
          "PhaseID":"1",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"27",
          "QuestionText":"Was an ENG\/VNG performed?",
          "QuestionHelp":"Predefined field choices only allow \"Yes\" or \"No\".",
          "PhaseID":"1",
          "Trigger":"Y",
          "Child":[
             28,
             29,
             30,
             31
          ],
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"28",
          "QuestionText":"On the ENG\/VNG, was there a caloric weakness (>20%)?",
          "QuestionHelp":"Predefined answer choices should be \"Yes\" or \"No\". If no ENG\/VNG was obtained, select \"N\/A\".",
          "PhaseID":"1",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"29",
          "QuestionText":"If a caloric weakness was found on the ENG\/VNG, which side was the weaker ear?",
          "QuestionHelp":"Predefined answer choices should be \"Left\" or \"Right\". If no ENG\/VNG was obtained, select \"N\/A\".",
          "PhaseID":"1",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"30",
          "QuestionText":"Does the ENG\/VNG suggest central causes of vertigo?",
          "QuestionHelp":"Predefined answer choices should be \"Yes\" or \"No\". If no ENG\/VNG was obtained, select \"N\/A\".",
          "PhaseID":"1",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"31",
          "QuestionText":"Was the Dix-Hallpike normal?",
          "QuestionHelp":"Predefined answer choices should be \"Yes\" or \"No\". If no ENG\/VNG was obtained, select \"N\/A\".",
          "PhaseID":"1",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N",
                "N\/A"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"32",
          "QuestionText":"Please enter when, and what side the implant was placed in the patient. ",
          "QuestionHelp":"Please enter <b>(1)</b> Which Side: (Right, Left), <b>(2)</b> The Date (MM\/YYYY) And <b>(3)</b> The type of device implanted.",
          "PhaseID":"2",
          "Input":[
             {
                "Type":"Select",
                "Label":"Side",
                "Values":[
                   "Left",
                   "Right",
                   "Both"
                ]
             },
             {
                "Type":"Select",
                "Label":"Month",
                "Values":"1:12"
             },
             {
                "Type":"Select",
                "Label":"Year",
                "Year":"(Now-50):Now"
             },
             {
                "Type":"Select",
                "Label":"Implant Type",
                "Values":[
                   "Cochlear",
                   "Electro",
                   "Acoustic",
                   "Electro Acoustic"
                ]
             }
          ],
          "Comment":""
       },
       {
          "QuestionID":"33",
          "QuestionText":"This is the surgeon's (X)th implant",
          "QuestionHelp":"Please list how many CI surgeries for the surgeon this implantation represents. Please do not count surgeries during residency ,  fellowship, or when assisting the primary. Were you primary or not?",
          "PhaseID":"2",
          "Input":{
             "Type":"Text"
          },
          "Comment":"Should be predefined with the actual number of surgeries, and validated to be an integer."
       },
       {
          "QuestionID":"34",
          "QuestionText":"Were preoperative antibiotics given?",
          "QuestionHelp":"Only \"Yes\" or \"No\" may be selected. In general, cefazolin (or other cephalosporin) should be given (clindamycin for penallergic patients).",
          "PhaseID":"2",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"35",
          "QuestionText":"Was intraoperative NRT performed?",
          "QuestionHelp":"Only \"Yes\" or \"No\" may be selected. It is recommended that NRT be performed on all patients at the end of the procedure in the operating room.",
          "PhaseID":"2",
          "Trigger":"Y",
          "Child":[
             36
          ],
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"36",
          "QuestionText":"Did all electrodes respond?",
          "QuestionHelp":"If \"Yes\" is selected, then all electrodes responded. If no is selected a box will appear allowing you to enter the un-responsive electrodes.",
          "PhaseID":"2",
          "Trigger":"N",
          "Child":[
             37
          ],
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"37",
          "QuestionText":"Which electrodes didn't respond?",
          "QuestionHelp":"Please enter the electrode values separated by spaces.",
          "PhaseID":"2",
          "Input":{
             "Type":"Text"
          },
          "Comment":"Add an example in the text box that goes away when a user starts typing."
       },
       {
          "QuestionID":"38",
          "QuestionText":"Was a Stenver's view X-ray performed?",
          "QuestionHelp":"Only \"Yes\" or \"No\" may be selected. It is recommended that a Stenver's view Xray be performed on all patients at the end of the procedure in the operating room.",
          "PhaseID":"2",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"39",
          "QuestionText":"During surgery, was there a facial nerve injury?",
          "QuestionHelp":"Only \"Yes\" or \"No\" may be selected. Uncovering the fallopian canal (to expose nerve sheath) should not be counted as a nerve injury. Any other observed injury should be listed as a \"Yes\". Additionally, if no observed injury is noted intraoperativey, but the patient has a facial nerve weakness (after allowing time for local anesthesia to wear off), \"Yes\" should also be selected.",
          "PhaseID":"2",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"40",
          "QuestionText":"During surgery, was there a CSF Leak",
          "QuestionHelp":"Only \"Yes\" or \"No\" may be selected. If the tegmen is removed to expose dura, a \"No\" should be selected. If the dura is violated in any way to expose CSF, a \"Yes\" should be selected.",
          "PhaseID":"2",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"41",
          "QuestionText":"During surgery, were there any other intra operative complications?",
          "QuestionHelp":"If \"Yes\" is selected, please list any other complications.",
          "PhaseID":"2",
          "Trigger":"Y",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"42",
          "QuestionText":"Date of activation",
          "QuestionHelp":"Answer should be listed in date format (MM\/DD\/YYYY).",
          "PhaseID":"2",
          "TypeID":"7",
          "Comment":""
       },
       {
          "QuestionID":"43",
          "QuestionText":"During the postoperative period, was there any wound infection?",
          "QuestionHelp":"Only \"Yes\" or \"No\" may be selected. List \"Yes\" if an infection requiring antibioitics occurs.",
          "PhaseID":"2",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          },
          "Comment":""
       },
       {
          "QuestionID":"44",
          "QuestionText":"During the postoperative period, was there any wound dehiscence?",
          "QuestionHelp":"Only \"Yes\" or \"No\" may be selected. The surgeon should use judgment determining what defines dehiscence. In general, any additional treatment (steristrips, wet-to-dry dressing, additional suture) would consistitue a dehiscence.",
          "PhaseID":"2",
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          }
       },
       {
          "QuestionID":"45",
          "QuestionText":"During the postoperative period, was there any vertigo or dizziness?",
          "QuestionHelp":"Only \"Yes\" or \"No\" may be selected.  Any complaints by the patient of feeling disequilibrium, sense of motion or fall should be listed as a \"Yes\".",
          "PhaseID":"2",
          "Trigger":"Y",
          "Child":[
             46
          ],
          "Input":{
             "Type":"Radio",
             "Values":[
                "Y",
                "N"
             ]
          }
       },
       {
          "QuestionID":"46",
          "QuestionText":"If there was postoperative vertigo or dizziness, how many days until resolution?",
          "QuestionHelp":"Please list the number of days until the dizziness (if present) resolved.",
          "PhaseID":"2",
          "Input":{
             "Type":"Text"
          },
          "TypeID":"4"
       },
       {
          "QuestionID":"47",
          "QuestionText":"Please list the type of device that was implanted?",
          "QuestionHelp":"The model number of the implant device should be inserted.",
          "ParentID":"0",
          "PhaseID":"2",
          "Trigger":"",
          "TypeID":"4"
       }
    ]
    
    $scope.InputArray = function(data){
        return Array.isArray(data);
    }

};




controllers.TabController = function(){
	this.tab=-1;

	this.selectTab=function(tabNum){
		this.tab=tabNum;
	};
	this.isSelected=function(checkTab){
		return this.tab===checkTab;
	};
}   
    
    
controllers.formController = function($scope, $http) {
    
    $scope.bmis = [];
	$scope.heights = [];
	$scope.weights = [];
	$scope.i = 0;
    $scope.maxDate = new Date();
    
    $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened = true;
    };

	for($scope.i=0;$scope.i<36;$scope.i++){
		$scope.bmis[$scope.i] = $scope.i + 10;
	}

	for($scope.i=0;$scope.i<68;$scope.i++){
		$scope.heights[$scope.i] = $scope.i + 12;
	}

	for($scope.i=0;$scope.i<221;$scope.i++){
		$scope.weights[$scope.i] = $scope.i + 80;
	}

    // create a blank object to hold form information
    $scope.formData = {};

    // process the form
    $scope.processForm = function() {
        $http({
            method  : 'POST',
            url     : '../aii-api/v1/patients',
            data    : $scope.formData,  // pass in data as strings
            headers : { 'Content-Type': 'application/json' } 
        })
        .success(function(data) {
            console.log(data);
        });

    };

}


controllers.addUserController = function($scope){
    
    // create a blank object to hold form information
    $scope.formData = {};

    // process the form
    $scope.processForm = function() {
        $http({
            method  : 'POST',
            url     : '../aii-api/v1/users',
            data    : $scope.formData,  // pass in data as strings
            headers : { 'Content-Type': 'application/json' } 
        })
        .success(function(data) {
            console.log(data);
        });

    };
}

controllers.styleCtrl = function($scope){
    
    $scope.active = 1;
}


controllers.ProgressDemoCtrl = function($scope) {

  $scope.max = 100;
  $scope.dynamic = 0;

  $scope.fillBar = function() {
    var value = 7;
    var type;

    if ($scope.dynamic < 25) {
      type = 'danger';
    } else if ($scope.dynamic < 50) {
      type = 'warning';
    } else if ($scope.dynamic < 75) {
      type = 'info';
    } else {
      type = 'success';
    }

    $scope.showWarning = (type === 'danger' || type === 'warning');
    
    if($scope.dynamic < 100)  { 
        $scope.dynamic = $scope.dynamic + value;
        $scope.type = type;
    }
  };


}






controllers.homeController = function($scope){
    $scope.test = "howdy";

    $scope.alerts = 
        [{ content: 'John Smith: Care phase has changed to Preoperative Visit'}];
    
    $scope.notifications = [{content: 'Dr. Charlie Bravo has accepted your invitation to John Smith\'s care team'},
                         {content: 'Dr. Sierra Victor has invited you to join Jane Doe\'s care team'}];
    
    $scope.messages = [{
            from: 'Dr. Charlie Bravo',
            subject: 'Re: Surgical Consultation for John Smith',
            content: '...'
        },
        {
            from: 'Dr. Sierra Victor',
            subject: 'Could I send Jane Doe your way for candidacy testing?',
            content: '.......'
    }];
};




myApp.controller(controllers);

