/*Added by Anne
-Seperate controller container for report related aspects


*/ 
(function() {

    var myApp = angular.module('reports', ['ui.bootstrap', 'ngCookies']);

    var controllers = {};

    controllers.reportCtrl = function($scope, getData, $cookieStore) {

        $scope.careTeams = []; //array to hold all the events at the facility
        
        //get the SessionID stored
        var cookieSessionID = $cookieStore.get('SessionID');
        //console.log(cookieSessionID);
        
        //get the name of the user's facility
        $scope.facilityName = $cookieStore.get('FacilityName');

        //get the questions for audiology so we can use the test information to populate the table - ie test name,
        //units, fields(presentation level, snr, etc)
        
        //arbitrary change in url 
        $scope.questionsURL = "../aii-api/v1/phases/" + 2 + "/questions/event/1/" + cookieSessionID;
        getData.get($scope.questionsURL).success(function(data) {
            $scope.audioQuestions = data.records;
            $scope.fields = []; //array to hold all the fields for all the tests.
            for (var test in $scope.audioQuestions.Tests) {
                for (var field in $scope.audioQuestions.Tests[test]["AudioTestInput"]) {
                    $scope.fields.push($scope.audioQuestions.Tests[test]["AudioTestInput"][field]);
                }
            }
        });
        
        //Patient Options for report creation (inactive or active)
        $scope.patientTypes = [{
            "name": "Active",
            "checked": false
        }, {
            "name": "Inactive",
            "checked": false
        }];

        //Report options for report creation (perioperative or audiometric)
        $scope.reportTypes = [{
            "name": "Perioperative",
            "checked": false
        }, {
            "name": "Audiometric",
            "checked": false
        }];

        //While selecting the two options for the report- only allow one box to be selected for each
        //should a report have already be made, if the user decides to change the options, clear 
        //the relevant objects(the careTeams) and hide the report that was made so a new report can be made to over write it
        $scope.updateSelection = function(position, entities) {
            angular.forEach(entities, function(type, index) {
                if (position != index)
                    type.checked = false;
            });
            $scope.showReport = false;
            $scope.facilityReport = null;
            $scope.careTeams = [];
            $scope.clearMessage();

        }
        
        //Variable binding to selected options (inactive or active and perioperative or operative
        $scope.patientType = null;
        $scope.setPatientType = function(type) {
            $scope.patientType = type;
        }
        $scope.reportType = null;
        $scope.setReportType = function(type) {
            $scope.reportType = type;
        }


        //Functions to test whether answers are in arrays or objects, so formating can be done
        //for ng repeat
        $scope.isArray = function(check) {
            return angular.isArray(check);
        }

        $scope.isObject = function(check) {
            return angular.isObject(check);
        }
        
        //get the list of questions to populate the first column of the perioperative report
        var questionsURL = '../aii-api/v1/reports/allQuestions';
        getData.get(questionsURL).success(function(data) {
            $scope.questions = data.records;
        });

        //get the number of events for a patient - so we can set the width of the patients column appropriately
        $scope.getCareTeamLength = function(object) {
            return Object.keys(object).length;
        }

        //get the maximum number of tests done for any of the Azbio's CNC BKB-SINs for that patient so we can set the width appropriately
        $scope.getMaxNumOfTest = function(resultSet) {
            $scope.max = 2;
            for (var key in resultSet) {
                if (resultSet[key].length > $scope.max) {
                    $scope.max = resultSet[key].length;
                }
            }
        }

        //get the maximum number of conditions tested for a particular phase for any patient so we can set the width on the phase appropriately
        //probably not the best for loop usage....
        $scope.getMaxNumOfConditionSets = function(phaseNum) {
            var max = 1;
            for (var patient in $scope.facilityReport.Patients) {
                for (var event in $scope.facilityReport.Patients[patient]['CareTeams']) {
                    if ($scope.getCareTeamLength($scope.facilityReport.Patients[patient]['CareTeams'][event]['Data'][phaseNum].DetailedAnswers) > max)
                    {
                        max =
                            $scope.getCareTeamLength($scope.facilityReport.Patients[patient]['CareTeams'][event]['Data'][phaseNum].DetailedAnswers);
                        //console.log('max = ' + max);   
                    }
                }
            }
            return max;

        }
        
        //create the appropriate table for the facility report
        $scope.generateReport = function() {

            $scope.showReport = true;
            $scope.loadMessage = "Please wait for report to load...";
            var fullFacilityURL = 
                '../aii-api/v1/reports/fullFacility/' + $scope.patientType + '/' + $scope.reportType + '/' + cookieSessionID;
            getData.get(fullFacilityURL).success(function(data) {
                $scope.facilityReport = data.records;
            }).then(function() {
                //push just all the patients' events into an array - needed to make ng-repeat easier, since careTeams are nested
                //so deep in the facilityReport
                for (var patient in $scope.facilityReport.Patients) {
                    if ($scope.isArray($scope.facilityReport.Patients[patient].CareTeams)) {
                        for (var careTeam in $scope.facilityReport.Patients[patient].CareTeams) {
                            $scope.careTeams.push($scope.facilityReport.Patients[patient].CareTeams[careTeam]);
                        }
                    } else {
                        $scope.careTeams.push($scope.facilityReport[patient].CareTeams);
                    }
                }
            }).then(function() {
                //get the number of events
                $scope.eventNum = Object.keys($scope.careTeams).length;
            });

        }

        //Export to spreadsheet function
        $scope.export = function() {
            //this format for Mac Numbers isn't openable....
            /*
            if (navigator.userAgent.indexOf('Mac OS X') != -1) {
                var blob = new Blob([document.getElementById('facReport').innerHTML], {
                    type: "application/x-iwork-numbers-sffnumbers"
                });
                saveAs(blob, "Facility_Report.numbers");
            } else {
                */
            var blob = new Blob([document.getElementById('facReport').innerHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });
            var date = new Date();
            var fileName = "Facility_Report(" + $scope.patientType + "_patients_" + $scope.reportType + "_data)" + 
                date.toISOString().slice(0, 10) + ".xls"
            saveAs(blob, fileName);
            //}

        };
        
        //Bad loading message code 
        $scope.clearMessage = function() { //called on last interation of ng-repeat of the answers...

            $scope.loadMessage = " ";

        };

    };

    //App used to hold all controller contained within aiiController
    myApp.controller(controllers);

})();