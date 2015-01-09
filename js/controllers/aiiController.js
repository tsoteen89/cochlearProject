(function() {

    var myApp = angular.module('aiiController', ['ui.bootstrap', 'ngCookies']);

    var controllers = {};

    //Added by Terry for testing purposes. Can be edited or moved. If you want
    //to delete it, tell me first. Look how I actually commented my function! 
    //Amazing isnt it.
    /**
     * @function cookie -
     *  Helper function to set, get, and delete cookies. Not sure why I copied Travis'
     *  factory pattern. Seems like I duplicated functionality, but I'm no angular person.
     *
     * @param: {object} $cookies - reference to ng-cookies
     * @returns {object} -
     *      @function set - set a cookie key value pair (or an array of key value pairs)
     *      @function get - returns a value based on a key
     *      @function remove - deletes a cookie given a cookie name
     */
    myApp.factory('cookie', function($cookies) {
        return {
            set: function(name, value) {
                if (typeof name === 'object') { //If it's an object, loop through and set em all
                    for (var key in name) {
                        console.log(key);
                        if (name.hasOwnProperty(key)) {
                            $cookies[key] = name[key];
                        }
                    }
                } else {
                    $cookies[name] = value; //Single key value, set the one.
                }
                return;
            },
            get: function(name) {
                if (!(name in $cookies)) //If it doesn't exist, return null
                    return null;
                else
                    return $cookies[name];
            },
            remove: function(name) { //If it doesn't exits, don't try
                if (!(name in $cookies)) //to delete it.
                    return null;
                else {
                    delete $cookies[name];
                    return true;
                }
            }
        }
    });

    //************************************FACTORIES***************************************//

    //Added by Anne. 
    /**
     * @factory userInfo -
     *  factory that allows userInfo to persist throughout different
     *  partials.
     *
     *      @ function userInfo.set
     *          @param: object: currently must contain SessionID, UserID, Username, FacilityID,
     *                              First (firstName), Last (lastName), Title, UserLevelID
     *          @returns: N/A
     *      @ function userInfo.get
     *          @returns: object with all the info set in userInfo.set
     */
    myApp.factory('userInfo', function($cookieStore, $window) {
        //User Info
        var SessionID = $cookieStore.get('SessionID');
        var UserLevelID = $cookieStore.get('UserLevel');
        var UserID;
        var Username;
        var FacilityID;
        var Name;
        var Title;

        return {
            set: function(info) {
                //Set the persistent user info
                SessionID = info.SessionID;
                UserID = info.UserID;
                $cookieStore.put("UserID", UserID);
                Username = info.Username;
                FacilityID = info.FacilityID;
                Name = info.First + " " + info.Last;
                Title = info.Title;
                UserLevelID = info.UserLevelID;

                //Set the SessionID and UserLevel to persist in the cookie
                $cookieStore.put('SessionID', SessionID);
                $cookieStore.put('UserLevel', UserLevelID);

                return;
            },
            get: function() {
                return {
                    SessionID: SessionID,
                    UserLevelID: UserLevelID,
                    UserID: UserID,
                    Username: Username,
                    FacilityID: FacilityID,
                    Name: Name,
                    Title: Title
                };
            }
        }
    });


    //Added by Travis. 
    /**
     * @function getData -
     *  Helper function that accepts a URL API call and GET's an appropriate
     *  JSON response for that URL.
     *
     * @param: string $http - reference to URL API call
     * @returns {object} -
     *      @function get - returns a value based on a key
     */
    myApp.factory('getData', function($http, $window, $location, $cookieStore) {

        return {
            get: function(url) {
                var data = $http.get(url).success(function(data) {
                    if (typeof data === "object") {
                        if (data.records['error'] == "Token Timeout" || data.records['error'] == "Invalid Token") {
                            $cookieStore.remove('SessionID');
                            $cookieStore.remove('UserLevel');
                           // console.log(data.records['error']);
                            
                            if (data.records['error'] == 'Token Timeout') {
                                console.log("timeout");
                                $cookieStore.put('BadToken', 'Token Timeout');
                            }
                            if (data.records['error'] == "Invalid Token") {
                                $cookieStore.put('BadToken', 'Invalid Token');
                            }
                            $window.location.href = "#";
                            location.reload();
                            
                        }
                    }
                });
                return data;
            },
        }

    });


    //Added by Travis. 
    /**
     * @function postData - 
     *  Helper function that accepts a URL API call and POST's appropriate data
     *  to a database corralating with the URL accepted.
     *
     * @param: string $http - reference to URL API call
     * @returns function - post 
     *      @function post - 
     *      @param: string - URL API Call 
     *      @param: {object} object - object to be POSTed to database
            @returns {object} object - object that was POSTed to the database
     */
    myApp.factory('postData', function($http) {

        return {
            post: function(path, object) {
                return $http({
                    method: 'POST',
                    url: path,
                    data: object,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).success(function(addedData) {
                    console.log(addedData);
                });
            },
        }
    });


    //Added by Travis. 
    /**
     * @function putData - 
     *  Helper function that accepts a URL API call and PUT's appropriate data
     *  to a database corralating with the URL accepted.
     *
     * @param: string $http - reference to URL API call
     * @returns function - put 
     *      @function put - 
     *      @param: string - URL API Call 
     *      @param: {object} object - object to be PUT to database
            @returns {object} object - object that was PUT to the database
     */
    myApp.factory('putData', function($http) {

        return {
            put: function(path, object) {
                return $http({
                    method: 'PUT',
                    url: path,
                    data: object,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).success(function(addedData) {
                    console.log(addedData);
                });
            },
        }
    });


    //Added by Travis. 
    /**
     * @function persistData -
     *  Factory that allows data to be Set and Retrieved for persistance throughout
     *  partials
     *
     * @param: NULL
     * @returns function -
     *      @function setCareTeamID - set the CareTeam ID passed in.
     *      @function setPhaseID - set the Phase ID passed in.
     *      @function setPhaseName - set the Phase Name passed in.
     *      @function setPatientName - set the Patiet Name passed in.
     *      @function setLoggedIn - set the current Login Status.
     *      @function setDirAnchor - set the Patient Directory Anchor.
     *      @function setUserLevel - set the current User Level.
     *      @function getPatientName - return the current Patient Name.
     *      @function getCareTeamID - return the current CareTeam ID.
     *      @function getPhaseID - return the current PhaseID.
     *      @function getPhaseName - return the current Phase Name.
     *      @function getLoggedIn - return the current Login Status.
     *      @function getDirAnchor - return the current Patient Directory Anchor.
     *      @function getUserLevel - return the current User Level.
     */
    myApp.factory('persistData', function($cookieStore) {
        //User info
        var CareTeamID;
        var PhaseID;
        var loggedIn;
        var PhaseName;
        var PatientName;
        var dirAnchor;
        var userLevel;
        var PatientID;

        //Messaging info
        var messageRecipient = -1;

        return {
            //most are being replaced by cookie function - not used
            setPatientID: function(data) {
                PatientID = data;
                $cookieStore.put('PatientID', PatientID);
            },
            setCareTeamID: function(data) {
                CareTeamID = data;
                $cookieStore.put('CareTeamID', CareTeamID);
                console.log(data);

            },
            setPhaseID: function(data) {
                PhaseID = data;
                $cookieStore.put('PhaseID', PhaseID);

                console.log(data);
            },
            setPhaseName: function(data) {
                PhaseName = data;
                $cookieStore.put('PhaseName', PhaseName);
                console.log(data);
            },
            setPatientName: function(data) {
                PatientName = data;
                $cookieStore.put('PatientName', PatientName);
                console.log(data);
            },
            getPatientName: function(data) {
                return PatientName;
            },
            getCareTeamID: function() {
                return CareTeamID;
            },
            getPhaseID: function(data) {
                return PhaseID;
            },
            getPhaseName: function() {
                return PhaseName;
            },
            setLoggedIn: function(data) {
                loggedIn = data;
                console.log(loggedIn);
            },
            getLoggedIn: function() {
                console.log(loggedIn);
                return loggedIn;
            },
            setDirAnchor: function(data) {
                dirAnchor = data;
                $cookieStore.put('dirAnchor', dirAnchor);
                console.log(dirAnchor);
            },
            getDirAnchor: function(data) {
                return dirAnchor;
            },
            setUserLevel: function(data) {
                userLevel = data;
            },
            getUserLevel: function(data) {
                return userLevel;
            },
            setMessageRecipient: function(data) {
                messageRecipient = data;
            },
            getMessageRecipient: function(data) {
                return messageRecipient;
            }
        };
    });
    //Factory to allow messaging controller to talk to badge controller and update unread count
    myApp.factory('messageCount', function($rootScope) {
        var count = {};

        count.prepForBroadcast = function(cnt) {
            count.number = cnt;
            this.broadcastCount();
        };

        count.broadcastCount = function() {
            $rootScope.$broadcast("handleBroadcast");
        };

        return count;
    });

    //*****************************************END FACTORIES*******************************************//

    //**************************************Dashboard CONTROLLERS***************************************//


    //Added by Anne/James 
    /**
     * @controller dashboardController -
     *      Controller used to handle display of Questions for a Patient's CareTeam
     *
     * @variables -
     *      userLevel - UserLevelID that is grabbed from userInfo which is set when user logs in
     *      userFacilityID - userFacilityID that is grabbed from userInfo which is set when user logs in
     *      facilityURL - URL to get the User's facility info
     *      baseFacilityURL - URL to get ALL FACILITY INFO
     *
     * @injections -
     *      $scope, persistData, getData, postData, putData, $http, $modal, userInfo
     *
     * @functions -
     *       * @function addUser -
     *  -creates a modalInstance, and opens it.
     *  -uses addUser.html script in dashboard
     *  -takes First name, Last Name and Email of a user to be invited by email (not implemented yet)
     *      data is saved in addUser object
     *
     *  -the modalInstance uses data in ModalInstanceCtrl
     *      @function ok - closes the modalInstance
     *
     * @function inviteNewFacility -
     *  -creates a modalInstance, and opens it.
     *  -uses inviteNewFacility.html script in dashboard
     *  -takes Facility name, Name and Email of a new contacted to be invited by email to AII (not implemented yet)
     *      data is saved in addFac object
     *
     *  -the modalInstance uses data in ModalInstanceCtrl
     *      @function ok - closes the modalInstance
     *      @function selectPatient - set selectedPatient variable to passed in patient
     *          @param object: a patient object
     * @function getFacCard -
     *  -creates a modalInstance, and opens it.
     *  -uses myModalContent.html script in dashboard
     *
     *  -the modalInstance uses data in ModalInstanceCtrl (@param object: fac- the facility object that was clicked
     *      @function ok - closes the modalInstance
     *      @function selectPatient - set selectedPatient variable to passed in patient
     *          @param object: a patient object
     * @function getContactCard -
     *  -creates a modalInstance, and opens it.
     *  -uses contactUs.html script in dashboard
     *
     *  -the modalInstance uses data in ModalInstanceCtrl (@param string: name of type of contact)
     *      @function ok - closes the modalInstance
     *      @function
     *
     */
    controllers.dashboardController = function($scope, persistData, getData, postData, putData, $http, $modal, $window, userInfo, $timeout, $cookieStore) {

        $scope.userLevel = userInfo.get().UserLevelID;
        $scope.userFacilityID = userInfo.get().FacilityID;
        $scope.sessionID = userInfo.get().SessionID;

        //**********API URL's***********************/
        $scope.facilityURL = "http://aii-hermes.org/aii-api/v1/facilities/" + $scope.sessionID; //returns user's facility info


        //Grab Facility info  using facilityURL
        getData.get($scope.facilityURL).success(function(data) {
            $scope.facData = data;
            $cookieStore.put('FacilityName', $scope.facData.records.Name); //put facility name and image in cookie so it's grabbable anywhere
            $cookieStore.put('FacilityImage', $scope.facData.records.FacilityImage);
        });

        //Grab All AII Facilities 
        $scope.baseFacilityURL = "http://aii-hermes.org/aii-api/v1/facilities/";
        getData.get($scope.baseFacilityURL + "getAll/" + $scope.sessionID).success(function(data) {
            $scope.allFacs = data;
        });

        //Grab Facilities Users
        getData.get("http://aii-hermes.org/aii-api/v1/facilities/users/" + $scope.sessionID).success(function(data) {
            $scope.facUsers = data;
            for (i = 0; i < data.records.length; i++) {
                if (data.records[i].Level == 'Coordinator') {
                    $scope.facilityAdmin = data.records[i];
                    i = data.records.length;
                }
            }
        });

        //Function that redirects the user to the messages page
        $scope.redirectToMessages = function() {
            $window.location.href = "#/messages";
        }

        //When a user is clicked on, redirect to the messages page to send
        //a new message to this user.
        $scope.sendMessageToUser = function(user) {
            persistData.setMessageRecipient(user);
        }



        //Added by Anne. 
        //***********************ADD USER MODAL IN MY FACILITY CARD****************//
        /**
         * @function addUser -
         *  -creates a modalInstance, and opens it.
         *  -uses addUser.html script in dashboard
         *  -takes First name, Last Name and Email of a user to be invited by email (not implemented yet)
         *      data is saved in addUser object
         *
         *  -the modalInstance uses data in ModalInstanceCtrl
         *      @function ok - closes the modalInstance
         */
        $scope.addUser = function() {
                var ModalInstanceCtrl = function($scope, $modalInstance, postData) {

                    $scope.sessionID = userInfo.get().SessionID;
                    $scope.addUser = {}; //object to hold form data for adding user

                    //Grab the user titles to populate the form with user title options
                    getData.get('http://aii-hermes.org/aii-api/v1/userTitles').success(function(data) {
                        $scope.userTitles = data.records;
                    });

                    //Send invitation to the potential user
                    $scope.sendInvitation = function() {
                        $scope.inviteUserURL = "http://aii-hermes.org/aii-api/v1/userInvites/" + $scope.sessionID;
                        postData.post($scope.inviteUserURL, $scope.addUser);
                        $modalInstance.close();
                    }

                    //close the modal
                    $scope.ok = function() {
                        $modalInstance.close();
                    };

                };

                //opens the model defined by the addUser.html script (inline in the code)
                var modalInstance = $modal.open({
                    templateUrl: 'addUser.html',
                    controller: ModalInstanceCtrl,
                    size: 'md'
                });

            }
            //***********************END ADD USER MODAL IN MY FACILITY CARD****************//

        //Added by Anne
        //***********************Invite New Facility MODAL IN Aii Directory CARD****************//
        /**
         * @function inviteNewFacility -
         *  -creates a modalInstance, and opens it.
         *  -uses inviteNewFacility.html script in dashboard
         *  -takes Facility name, Name and Email of a new contacted to be invited by email to AII (not implemented yet)
         *      data is saved in addFac object
         *
         *  -the modalInstance uses data in ModalInstanceCtrl
         *      @function ok - closes the modalInstance
         *      @function selectPatient - set selectedPatient variable to passed in patient
         *          @param object: a patient object
         */
        $scope.inviteNewFacility = function() {
                var ModalInstanceCtrl = function($scope, $modalInstance, postData) {
                    $scope.userFacilityID = userInfo.get().FacilityID;
                    $scope.sessionID = userInfo.get().SessionID;
                    $scope.addFacility = {}; //object to hold form data for adding facility
                    $scope.addFacility['PatientID'] = 0;


                    //Grab all Patients using patientURL 
                    $scope.patientURL = "http://aii-hermes.org/aii-api/v1/facilities/patients/" + $scope.sessionID;
                    getData.get($scope.patientURL).success(function(data) {
                        //set name to concatenate first and last name so we can filter search on entire name
                        for (var i = 0; i < data.records.length; i++) {
                            data.records[i].Name = data.records[i].First + " " + data.records[i].Last;
                        }
                        $scope.patientsData = data;
                    })

                    //Set selectedPatient to the selected patient
                    //Used to show name on card right now- ****Need to implement add facility to patients provider list if the accept email request.***
                    $scope.selectPatient = function(patient) {
                        $scope.addFacility['PatientID'] = patient['PatientID'];
                    };

                    $scope.sendInvitation = function() {
                        //Post a facility invitation
                        $scope.inviteFacilityURL = "http://aii-hermes.org/aii-api/v1/facilityInvites/" + $scope.sessionID;
                        postData.post($scope.inviteFacilityURL, $scope.addFacility);
                        $modalInstance.close();
                    };

                    $scope.ok = function() {
                        $modalInstance.close();
                    };

                };

                //opens the model defined by the inviteNewFacility.html script (inline in the code)
                var modalInstance = $modal.open({
                    templateUrl: 'inviteNewFacility.html',
                    controller: ModalInstanceCtrl,
                    size: 'md'


                });

            }
            //***********************END Invite New Facility MODAL IN Aii Directory CARD****************//

        //Added by James/Anne
        //***********************Get Facility Card MODAL IN Aii Directory CARD When a existing facility is clicked****************//
        /**
         * @function getFacCard -
         *  -creates a modalInstance, and opens it.
         *  -uses myModalContent.html script in dashboard
         *
         *  -the modalInstance uses data in ModalInstanceCtrl (@param object: fac- the facility object that was clicked
         *      @function ok - closes the modalInstance
         *      @function selectPatient - set selectedPatient variable to passed in patient
         *          @param object: a patient object
         */
        $scope.getFacCard = function(fac) {

                var ModalInstanceCtrl = function($scope, $modalInstance, fac) {
                    $scope.userFacilityID = userInfo.get().FacilityID;
                    $scope.sessionID = userInfo.get().SessionID;

                    //get the specific facility's (that was clicked) information
                    getData.get("http://aii-hermes.org/aii-api/v1/facilities/" + fac.FacilityID + '/' + $scope.sessionID).success(function(data) {
                        $scope.facCard = data;
                    });

                    //get the specific facility's users
                    getData.get("http://aii-hermes.org/aii-api/v1/facilities/" + fac.FacilityID + '/users/' + $scope.sessionID).success(function(data) {
                        $scope.facCardUsers = data;
                        for (i = 0; i < data.records.length; i++) {
                            if (data.records[i].Level == 'Coordinator') {
                                $scope.facilityAdmin = data.records[i];
                                i = data.records.length;
                            }
                        }
                    });

                    //get the all the patients for YOUR (user who's logged in) facility and exclude any patients the clicked facility already has
                    getData.get("http://aii-hermes.org/aii-api/v1/facilities/patients/excludingExisting/" + fac.FacilityID + '/' +
                        $scope.sessionID).success(function(data) {

                        for (var i = 0; i < data.records.length; i++) {
                            data.records[i].Name = data.records[i].First + " " + data.records[i].Last;
                        }
                        $scope.facCardNonPatients = data.records;
                    });

                    $scope.displayInfo = true;
                    $scope.selectedPatient = [];
                    $scope.hideSendInvitationButton = true;
                    $scope.sendButtonText = "Send Invitation";
                    if (fac.FacilityID == $scope.userFacilityID) {
                        $scope.hideInviteButton = true;
                    } else {
                        $scope.hideInviteButton = false;
                    }

                    //When a user is clicked on, redirect to the messages page to send
                    //a new message to this user.
                    $scope.sendMessageToUser = function(user) {
                        persistData.setMessageRecipient(user);
                    }

                    //Choose to show either facility card or invite facility to patient's care team
                    $scope.setDisplayInfo = function(showInfo) {
                        $scope.displayInfo = showInfo;
                    };

                    //Set selectedPatient to the selected patient, and allow send invitiation button to be enabled
                    $scope.selectPatient = function(patient) {
                        $scope.selectedPatient = patient;
                        $scope.hideSendInvitationButton = false;
                        $scope.sendButtonText = "Send Invitation";
                    };

                    $scope.sendInvite = function() {
                        $scope.hideSendInvitationButton = true;
                        //If a patient has been selected...
                        //if($scope.selectedPatient){				
                        //Post a Notification inviting the facility to the care team
                        $scope.postNotification = {};
                        $scope.postNotification.PatientID = $scope.selectedPatient.PatientID;
                        $scope.postNotification.SenderFacilityID = $scope.userFacilityID;
                        $scope.postNotification.ReceiverFacilityID = fac.FacilityID;

                        $scope.postNotificationURL = "http://aii-hermes.org/aii-api/v1/notifications/";
                        postData.post($scope.postNotificationURL, $scope.postNotification).success(function(data) {
                            $scope.sendButtonText = "Invitation Sent!";
                        });
                        $scope.sendButtonText = "Sending...";

                        //}
                    };

                    $scope.ok = function() {
                        $modalInstance.close();
                    };

                };

                //opens the model defined by the myModalContent.html script (inline in the code)
                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: ModalInstanceCtrl,
                    size: 'md',
                    resolve: {
                        fac: function() {
                            return fac;
                        }
                    }

                });
            }
            //***********************END Get Facility Card MODAL IN Aii Directory CARD When a existing facility is clicked****************//

        //Added by James
        //***********************Get Contact Card MODAL IN  Contact us CARD****************//
        /**
         * @function getContactCard -
         *  -creates a modalInstance, and opens it.
         *  -uses contactUs.html script in dashboard
         *
         *  -the modalInstance uses data in ModalInstanceCtrl (@param string: name of type of contact)
         *      @function ok - closes the modalInstance
         *      @function
         */
        $scope.getContactCard = function(contactType) {

            var ModalInstanceCtrl = function($scope, $modalInstance, contactType, postData) {

                $scope.sessionID = userInfo.get().SessionID;

                $scope.message = {};

                if (contactType == 'report') {
					$scope.title = "Report a Problem";
					$scope.content = "Notify the site administrator about any issues concerning the site's usability. " +
                                "This issue will be sent directly to the administrator and dealt with in a " +
                                "timely manner.";
					$scope.boxHeader = "Problem Description:";
                } else if (contactType == 'suggest') {
					$scope.title = "Make a Suggestion";
					$scope.content = "Is there a measure or data element that you feel would improve the value of the " +
								"site? Please list any suggestions here and they will be submitted for timely " + 
								"consideration to the appropriate measures committee. \n\nIf you would like to be involved " +
								"in joining a measures committee, let us know here and you will be contacted.";
					$scope.boxHeader = "Suggestion:";
                } else if (contactType == 'contactAdmin') {
					$scope.title = "Contact the Administrator";
					$scope.content = "Contact the administrator directly with any issues or inquiries " +
                                "you may have. Your message will be sent immediately to the Administrator " +
                                "for timely consideration.";
					$scope.boxHeader = "Message:";
                }

                $scope.sendMessage = function() {

                    //POST a ContactUs message to the API
					$scope.message.IsReport = 0;
                    if ($scope.isProblemReport) {
                        $scope.message.IsReport = 1;
                    }
					$scope.contactAdminURL = "http://aii-hermes.org/aii-api/v1/adminAlerts/" + $scope.sessionID;
                    postData.post($scope.contactAdminURL, $scope.message);

                    $modalInstance.close();
                }

                $scope.ok = function() {
                    $modalInstance.close();
                };
            };

            var modalInstance = $modal.open({
                templateUrl: 'contactUs.html',
                controller: ModalInstanceCtrl,
                size: 'md',
                resolve: {
                    contactType: function() {
                        return contactType;
                    }
                }

            });
        }

    };

    //***********************END Get Contact Card MODAL IN  Contact us CARD****************//



    //*****************************************END Dashboard*******************************************//

    //**************************************QUESTION CONTROLLERS***************************************//


    //Added by Travis. 
    /**
     * @controller dashboardController -
     *      Controller used to handle display of Questions for a Patient's CareTeam
     *
     * @variables -
     *      @int limit - limit of questions to be viewed for the current page
     *      @int offset - offset of the questions to be viewed for the current page
     *      @array limitArray - array that hold the previous limits, so that a user can visit previous question pages
     *      @int n - variable used to loop through various for loops, no significance
     *      @bool finished - bool to determine if all questions have been grabbed for offset of the current page
     *      @object surgery - object that holds surgery question
     *      @object answer - object that holds all answers for the current phase
     *      @string phaseName - Name of current phase
     *      @string patientName - Name of current patient
     *      @string questionsURL - URL to grab all questions for the current phase
     *      @string initialQuestionsURL - URL to grab only the numbe of questions needed for the first page
     *      @string patientSummaryAnswers - object used to hold the answers previously answered for a patient
     *      @string dirAnchor - hold the proper position of the patient in the patient directory page
     *      @int clickedPhase - holds the current phase that has been clicked
     *
     * @injections -
     *      $scope, persistData, getData, postData, putData, $http, $modal, userInfo
     *
     * @functions -
     *      @function postAnswers - POST answers given from user to the database
     *      @param questionID - ID of the question currently being answered
     *      @returns - NULL
     *
     *      @function postSurgery - POST answer to surgery question
     *      @param - NULL
     *      @returns - NULL
     *
     *      @function clearSurgeryHistory - Clears the surgery history object
     *      @param - NULL
     *      @returns - NULL
     *
     *      @function nextPage - Function used to grab the next set of questions to be displayed
     *      @param - NULL
     *      @returns - NULL
     *
     *      @function previousPage - Function used to grab previous questions displayed on previous page
     *      @param - NULL
     *      @returns - NULL
     *
     *      @function checkboxTrigger - Function used to trigger when a checkbox is selected
     *      @param - NULL
     *      @returns - NULL
     *
     *      @function showChild - Shows the children of a question when the trigger of that question is selected
     *      @param data - variable that holds the current question being answered
     *      @return - NULL
     *
     *      @function hideChild - Hides the children of a question if the trigger is no longer selected
     *      @param data - variable that holds the current question being answered
     *      @returns - NULL
     *
     *      @function completePhase - Progresses the CareTeam phase to the next phase
     *      @param - NULL
     *      @returns - NULL
     *
     *      @function saveUnanswered - Saves the unanswered questions to the database as unanswered
     *      @param - NULL
     *      @returns - NULL
     *
     *      @function patientSummary - GET's all answered questions for a patient and displays them to the screen
     *      @param phaseNumber - The current phase clicked for viewing of answers
     *      @returns - NULL
     * @function getDataSummary -
     *  -creates a modalInstance, and opens it.
     *  -uses dataSummary.html script in questions.html
     *  -shows all the answers entered for that phase
     *
     *  -the modalInstance uses data in ModalInstanceCtrl
     *      @function ok - closes the modalInstance
     *
     */
    controllers.questionsController = function($scope, persistData, getData, postData, putData, $http, $modal, $location, $cookieStore) {

        //get the SessionID stored
        var cookieSessionID = $cookieStore.get('SessionID');
        $scope.patientInactiveStatus = $cookieStore.get('PatientInactiveStatus'); //hmm, don't know why in questions controller

        //Travis's stuff limiting number of questions to a page
        $scope.limit = 5;
        $scope.offSet = 0;
        $scope.limitArray = new Array();
        $scope.finished = false;
        $scope.page = 1;
        $scope.finalPage = null;

     

        $scope.phaseName = $cookieStore.get('PhaseName'); //grab the name of the phase currently viewed 

        //Patient info display on top of question pages
        $scope.patientName = $cookieStore.get('PatientName');
        $scope.patientSex = $cookieStore.get('PatientSex');
        $scope.patientDOB = $cookieStore.get('PatientDOB');

        //Facility info (name and image) used in pdf report headers
        $scope.facilityName = $cookieStore.get('FacilityName');
        $scope.facilityImage = $cookieStore.get('FacilityImage');
        $scope.patientPhaseID = $cookieStore.get('CurrentPhaseID'); //currents phase patient is in. used in logic to decide next phase

        $scope.answer = {}; //object to hold all the info neccesary to submit question answers (i.e PhaseID, eventID (aka CareTeamID)
        $scope.answer.Answers = {};
        $scope.answer.PhaseID = $cookieStore.get('PhaseID');
        $scope.answer.CareTeamID = $cookieStore.get('CareTeamID');
        //api urls to grab questions for the active phase
        $scope.questionsURL = "http://aii-hermes.org/aii-api/v1/phases/" + $scope.answer.PhaseID + "/questions/event/" + $scope.answer.CareTeamID;
        $scope.initialQuestionsURL = $scope.questionsURL + "&offset=" + $scope.offSet + "&limit=" + $scope.limit;

        $scope.patientSummaryAnswers = {}; //object to hold previously answered questions for the phase if any.
        $scope.patientSummaryAnswersURL = "http://aii-hermes.org/aii-api/v1/careTeams/" + $scope.answer.CareTeamID + "/phaseAnswers/" +
            $scope.answer.PhaseID;
        $scope.dirAnchor = $cookieStore.get('dirAnchor'); //anchor on patient directory page for patient, so can return/scroll back to patient status
        $scope.clickedPhase = null;

        //Modal handler for different implant providers (Med El, Cochlear americas, )
        $scope.showDeviceOptions = function(provider, questionID) {
            var ModalInstanceCtrl = function($scope, $modalInstance) {

                $scope.device = {}; //object to hold device details and phase and event id's
                $scope.device.Answers = {}; //object to hold device answers specifically
                $scope.device.PhaseID = $cookieStore.get('PhaseID');
                $scope.device.CareTeamID = $cookieStore.get('CareTeamID');

                //url to grab previously entered device details
                $scope.patientSummaryAnswersURL = "http://aii-hermes.org/aii-api/v1/careTeams/" + $cookieStore.get('CareTeamID') + "/phaseAnswers/" + $cookieStore.get('PhaseID');
                //Grab ALL previously answered questions - somewhat wasteful- dont need to grab all - just device questions
                getData.get($scope.patientSummaryAnswersURL).success(function(data) {
                    $scope.patientSummaryAnswers = data.records;
                }).then(function() {
                    for (var answerID in $scope.patientSummaryAnswers.Answers) {
                        if (questionID == 202 && answerID > 202 && answerID < 207) { //left ear device details
                            $scope.device.Answers[answerID] = $scope.patientSummaryAnswers.Answers[answerID].Answers;
                        } else if (questionID == 212 && answerID > 212 && answerID < 217) { //right ear device details
                            $scope.device.Answers[answerID] = $scope.patientSummaryAnswers.Answers[answerID].Answers;
                        }
                    };
                });

                //set the question id's for the device details based on left or right ear data being entered
                if (questionID == 202) {
                    $scope.implantQuestion = 204;
                    $scope.electrodeQuestion = 205;
                    $scope.processorQuestion = 206;
                } else if (questionID == 212) {
                    $scope.implantQuestion = 214;
                    $scope.electrodeQuestion = 215;
                    $scope.processorQuestion = 216;
                }
                $scope.provider = provider; //provider name - displayed in header of modal (Cochlear Americas, Med El, whatever the other one is)

                getData.get("http://aii-hermes.org/aii-api/v1/deviceProviders/provider/" + $scope.provider).success(function(data) {
                    $scope.implants = data.records.Implants;
                    $scope.electrodes = data.records.Electrodes;
                    $scope.processors = data.records.Processors;
                });

                $scope.saveDevice = function(isValid) {
                    /*
                    $scope.deviceDetails = {'DeviceDetails': provider + ', ' + $scope.answer.Answers[$scope.implantQuestion]  + ', ' +
                                            $scope.answer.Answers[$scope.electrodeQuestion] + ', ' + $scope.answer.Answers[$scope.processorQuestion]}
                    putData.put('http://aii-hermes.org/aii-api/v1/careTeams/' + $scope.answer.CareTeamID,$scope.deviceDetails);
                
                    if(!$scope.answer.Answers[$scope.implantQuestion]){
                        $scope.answer.Answers[$scope.implantQuestion] = "N/A";
                    }
                    if(!$scope.answer.Answers[$scope.electrodeQuestion]){
                        $scope.answer.Answers[$scope.electrodeQuestion] = "N/A";
                    }
                    if(!$scope.answer.Answers[$scope.processorQuestion]){
                        $scope.answer.Answers[$scope.processorQuestion] = "N/A";
                    }
                    */
                    if (isValid) { //if all aspects of device details was saved- post them to database
                        postData.post('http://aii-hermes.org/aii-api/v1/answers/' + cookieSessionID, $scope.device);
                        $scope.ok();
                    } else {
                        alert("Please select an option for each category");
                    }


                }
                $scope.ok = function() {
                    $modalInstance.close();

                };

            };

            //opens the modal defined by device.html script (in line)
            var modalInstance = $modal.open({
                templateUrl: 'device.html',
                controller: ModalInstanceCtrl,
                size: 'lg'

            });

        };

        //Hard coded page limit numbers (im guessing-Anne) written by travis most likely 
        if ($scope.phaseName == 'Initial Surgical Consultation') {
            $scope.finalPage = 4;
        } else if ($scope.phaseName == 'Preoperative Visit') {
            $scope.finalPage = 3;
        } else if ($scope.phaseName == 'One week Postoperative Visit') {
            $scope.finalPage = 4;
        } else if ($scope.phaseName == 'Activation') {
            $scope.finalPage = 1;
        }

        if ($scope.phaseName == 'Activation') {
            $scope.finished = true;
        };

        //checking data types so ng-repeat can be used correctly to display
        $scope.isArray = function(check) {
            return angular.isArray(check);
        }

        $scope.isObject = function(check) {
            return angular.isObject(check);
        }

        //get audiology results for the phase
        getData.get("http://aii-hermes.org/aii-api/v1/careTeams/" + $cookieStore.get('CareTeamID') + "/phaseAnswers/" + $scope.answer.PhaseID).success(function(data) {
            $scope.audioSummaryAnswers = data.records.DetailedAnswers;
            //console.log("first" + $scope.audioSummaryAnswers);
        });

        //get maxiumum number of tests done for a particular audiology test (azbio, cnc) etc to display the table nicely
        $scope.getMaxNumOfTest = function(resultSet) {
            $scope.max = 2;
            for (var key in resultSet) {
                if (resultSet[key].length + 1 > $scope.max) {
                    $scope.max = resultSet[key].length + 1;
                }
            }
        }

        //Grab all previously answered questions (regular questions)
        getData.get($scope.patientSummaryAnswersURL).success(function(data) {
            $scope.patientSummaryAnswers = data.records;
        }).then(function() {
            for (var answerID in $scope.patientSummaryAnswers.Answers) {
                $scope.answer.Answers[answerID] = $scope.patientSummaryAnswers.Answers[answerID].Answers;
            };
        });

        //Get Number of Questions contained in a phase
        getData.get($scope.questionsURL).success(function(data) {
            $scope.numberOfQuestions = data.records.length;
        });


        //Get all questions for a particular Phase
        getData.get($scope.initialQuestionsURL).success(function(data) {
            $scope.childNumber = 0;
            $scope.parentNumber = 0;

            //Go through initial batch of Questions to find Children of Parents
            for ($scope.n = 0; $scope.n < data.records.length; $scope.n++) {
                $scope.childNumber += data.records[$scope.n].Children.length;
                if (data.records[$scope.n].IsChild == 0) {
                    $scope.parentNumber += 1;
                }
            }

            //Set the sorted data equal to a new HTTP request
        }).then(function() {
            $scope.limit = $scope.childNumber + $scope.parentNumber;
            $scope.displayedQuestionsURL = $scope.questionsURL + "&offset=" + $scope.offSet + "&limit=" + $scope.limit;
            getData.get($scope.displayedQuestionsURL).success(function(data) {
                $scope.displayedQuestions = data.records;
                $scope.childNumber = 0;
                $scope.parentNumber = 0;

                //Go through Second batch of Questions to find Children of Children
                for ($scope.n = 0; $scope.n < data.records.length; $scope.n++) {
                    $scope.childNumber += data.records[$scope.n].Children.length;
                    if (data.records[$scope.n].IsChild == 0) {
                        $scope.parentNumber += 1;
                    }
                }

                //Set the final sorted data equal to a final HTTP request
            }).then(function() {
                $scope.limit = $scope.childNumber + $scope.parentNumber;
                $scope.finalQuestionsURL = $scope.questionsURL + "&offset=" + $scope.offSet + "&limit=" + $scope.limit;
                getData.get($scope.finalQuestionsURL).success(function(data4) {
                    $scope.finalQuestions = data4.records;
                });
            });
        });


        //Post one answer and save it
        //@param: int: questionID
        $scope.postAnswers = function(questionID) {

            $scope.singleAnswer = {};
            $scope.singleAnswer.Answers = {};
            $scope.singleAnswer.PhaseID = $scope.answer.PhaseID;
            $scope.singleAnswer.CareTeamID = $cookieStore.get('CareTeamID');
            $scope.singleAnswer.Answers[questionID] = $scope.answer.Answers[questionID];
            //Remove Not Answered if answering a check box question that had been saved as not answered
            if (angular.isArray($scope.singleAnswer.Answers[questionID])) {
                for (var key in $scope.singleAnswer.Answers[questionID]) {
                    if ($scope.singleAnswer.Answers[questionID][key] == 'Not Answered') {
                        $scope.singleAnswer.Answers[questionID].splice(key, 1);
                    }
                }
            }
            postData.post('http://aii-hermes.org/aii-api/v1/answers/' + cookieSessionID, $scope.singleAnswer);

        };

        //post date type answers - cuts of time zones
        $scope.postDateAnswers = function(questionID) {

            $scope.singleAnswer = {};
            $scope.singleAnswer.Answers = {};
            $scope.singleAnswer.PhaseID = $scope.answer.PhaseID;
            $scope.singleAnswer.CareTeamID = $cookieStore.get('CareTeamID');
            $scope.singleAnswer.Answers[questionID] = $scope.answer.Answers[questionID].toISOString().slice(0, 10);
            postData.post('http://aii-hermes.org/aii-api/v1/answers/' + cookieSessionID, $scope.singleAnswer);

        };

        //object to hold surgery history data
        //initialize surgery object
        //user will fill in date, other(if necessary), side, and type via ng-model
        $scope.surgery = {
            "Date": null,
            "Other": null,
            "Side?": null,
            "Type of Surgery?": null,
            "CareTeamID": $cookieStore.get('CareTeamID')
        };

        //Post a surgery History. 
        $scope.postSurgery = function() {
            $scope.answer.Answers[85] = " "; // need to initialize this answer in answers object,
            //so upon "Next page", "Not answered" isn't saved and break the api

            //post the surgery and then clear the question fields so user may add another
            postData.post('http://aii-hermes.org/aii-api/v1/surgeryHistory', $scope.surgery).success(function() {
                $scope.surgery["Date"] = null; //Clear surgeryHistory object so user can add another history
                $scope.surgery["Other"] = null;
                $scope.surgery["Type of Surgery?"] = null;
                $scope.surgery["Side?"] = null;
            });
        };

        //clear "other type of surgery" text box in case user finds their type and doesn't wish to free text it
        $scope.clearOther = function() {
            if ($scope.surgery["Type of Surgery"] != "Other") {
                $scope.surgery["Other"] = null;
            }
        }

        //Display the next set of questions for a phase
        $scope.nextPage = function() {
            $scope.page = $scope.page + 1;
            //If questions on the previous page lack an answer, save an answer for that question with "Not Answered" as the text
            for (question in this.finalQuestions) {
                console.log(question);
                if (this.answer.Answers[this.finalQuestions[question].QuestionID] == null) {
                    this.answer.Answers[this.finalQuestions[question].QuestionID] = "Not Answered";
                    $scope.postAnswers(this.finalQuestions[question].QuestionID);
                }
            };


            $scope.limitArray.push($scope.limit);
            $scope.offSet += $scope.limit;
            $scope.initialQuestionsURL = $scope.questionsURL + "&offset=" + $scope.offSet + "&limit=5";

            //Set finished bool when all questions have been listed
            if (($scope.offSet + $scope.limit) >= $scope.numberOfQuestions) {
                $scope.finished = true;
            }

            //Grab Initial Batch of Questions
            getData.get($scope.initialQuestionsURL).success(function(data) {
                $scope.childNumber = 0;
                $scope.parentNumber = 0;

                //Go through initial batch of Questions to find Children of Parents
                for ($scope.n = 0; $scope.n < data.records.length; $scope.n++) {
                    $scope.childNumber += data.records[$scope.n].Children.length;
                    if (data.records[$scope.n].IsChild == 0) {
                        $scope.parentNumber += 1;
                    }
                }

                //Set the sorted data equal to a new HTTP request
            }).then(function() {
                $scope.limit = $scope.childNumber + $scope.parentNumber;
                $scope.displayedQuestionsURL = $scope.questionsURL + "&offset=" + $scope.offSet + "&limit=" + $scope.limit;
                getData.get($scope.displayedQuestionsURL).success(function(data) {
                    $scope.displayedQuestions = data.records;
                    $scope.childNumber = 0;
                    $scope.parentNumber = 0;

                    //Go through Second batch of Questions to find Children of Children
                    for ($scope.n = 0; $scope.n < data.records.length; $scope.n++) {
                        $scope.childNumber += data.records[$scope.n].Children.length;
                        if (data.records[$scope.n].IsChild == 0) {
                            $scope.parentNumber += 1;
                        }
                    }

                    //Set the final sorted data equal to a final HTTP request
                }).then(function() {
                    $scope.limit = $scope.childNumber + $scope.parentNumber;
                    $scope.finalQuestionsURL = $scope.questionsURL + "&offset=" + $scope.offSet + "&limit=" + $scope.limit;
                    getData.get($scope.finalQuestionsURL).success(function(data4) {
                        $scope.finalQuestions = data4.records;
                    });
                });
            });
        }


        //function used to display questions from previous pages
        $scope.previousPage = function() {
            $scope.page = $scope.page - 1;
            $scope.finished = false;
            $scope.limit = $scope.limitArray.pop();
            $scope.offSet = $scope.offSet - $scope.limit;

            $scope.finalQuestionsURL = $scope.questionsURL + "&offset=" + $scope.offSet + "&limit=" + $scope.limit;

            getData.get($scope.finalQuestionsURL).success(function(data4) {
                $scope.finalQuestions = data4.records;
            });
        }


        $scope.checkboxTrigger = function(data) {
            var other = false;

            for (var i = 0; i < data.length; i++) {
                if (data[i] == 'Other') {
                    other = true;
                }
            }
            return other;
        }


        //Show a child if Trigger has been set
        $scope.showChild = function(data) {
            var index;
            var indexB;

            for (index = 0; index < data.length; index++) {
                for (indexB = 0; indexB < $scope.finalQuestions.length; indexB++) {
                    if ($scope.finalQuestions[indexB].QuestionID == data[index]) {
                        $scope.finalQuestions[indexB].IsChild = 0;
                    }
                }
            }
        }

        //Hide a child if the Trigger has been reset
        $scope.hideChild = function(data) {
            var index;
            var indexB;

            for (index = 0; index < data.length; index++) {
                for (indexB = 0; indexB < $scope.finalQuestions.length; indexB++) {
                    if ($scope.finalQuestions[indexB].QuestionID == data[index]) {
                        $scope.finalQuestions[indexB].IsChild = 1;
                    }
                }
            }
        }

        //Progresses the CareTeam phase to the Next Phase
        $scope.completePhase = function() {

            //if on phase 1, skip phase number to 3(phase2 and 3 are active at same time, handled in the phase dots in patient directory)
            if ($scope.answer.PhaseID == "2" && $scope.patientPhaseID == "20") {
                $scope.nextPhase = 21;
            }
            //might not be used (nobody should have a current phase of 2 technically
            else if ($scope.answer.PhaseID == '3' && $scope.patientPhaseID == "20") {
                $scope.nextPhase = 22;
            } else if ($scope.patientPhaseID == "21" || $scope.patientPhaseID == "22") {
                $scope.nextPhase = 4;
            } else {
                $scope.nextPhase = (parseInt($scope.answer.PhaseID) + 1);
            }

            //Update Current phase number in database
            if ($scope.answer.PhaseID != '11') {
                $scope.newPhase = {
                    "CurrentPhaseID": $scope.nextPhase
                };
                // Post the changed currentPhaseID here
                putData.put('http://aii-hermes.org/aii-api/v1/careTeams/' + $scope.answer.CareTeamID, $scope.newPhase).then(function() {
                    $location.path('patientDirectory')
                });

            }

        }

        //Complete all phases of care and make patient inactive
        $scope.completeCare = function() {
            var patID = $cookieStore.get('PatientID');
            var updateToInactive = {
                'InactiveStatus': 60
            }
            putData.put('http://aii-hermes.org/aii-api/v1/patients/' + patID, updateToInactive);
            //Update Current phase number in database

            $scope.newPhase = {
                "CurrentPhaseID": 12
            };
            // Post the changed currentPhaseID here
            putData.put('http://aii-hermes.org/aii-api/v1/careTeams/' + $scope.answer.CareTeamID, $scope.newPhase).then(function() {
                $location.path('patientDirectory')
            });

        }

        /* not being used anymore - was the patient summary for any phase on the side of questions
        $scope.patientSummary = function(phaseNumber){
            this.clickedPhase = phaseNumber;
            
            if(phaseNumber == 2 || phaseNumber > 6){
            
                getData.get("http://aii-hermes.org/aii-api/v1/careTeams/" + $cookieStore.get('CareTeamID') + "/phaseAnswers/" +$cookieStore.get('CareTeamID')).success(function(data) {
                        $scope.patientSummaryAnswers = data.records.DetailedAnswers;
                        console.log("first" + $scope.audioSummaryAnswers);
                });
            }
            
            if(phaseNumber == 1 || phaseNumber > 2 && phaseNumber < 7){
                $scope.patientSummaryAnswersURL = "http://aii-hermes.org/aii-api/v1/careTeams/" + $cookieStore.get('CareTeamID') + "/phaseAnswers/" + phaseNumber; 

                getData.get($scope.patientSummaryAnswersURL).success(function(data) {
                    $scope.patientSummaryAnswers = data.records;          
                });
            }
            
            if(phaseNumber == 0)
            {
                $scope.patientSummaryAnswers = "";
            }
            
        }
        */


        //Added by ???
        //***********************Get Data Summary MODAL IN  Questions when you want to complete a phase****************//
        /**
         * @function getDataSummary -
         *  -creates a modalInstance, and opens it.
         *  -uses dataSummary.html script in questions.html
         *  -shows all the answers entered for that phase
         *
         *  -the modalInstance uses data in ModalInstanceCtrl
         *      @function ok - closes the modalInstance
         */
        $scope.getDataSummary = function() {

            var ModalInstanceCtrl = function($scope, $modalInstance) {

                getData.get("http://aii-hermes.org/aii-api/v1/careTeams/" + $cookieStore.get('CareTeamID') + "/phaseAnswers/" + $cookieStore.get('PhaseID')).success(function(data) {
                    $scope.patientSummaryAnswers = data.records;
                });
                $scope.ok = function() {
                    $modalInstance.close();
                };

            };

            var modalInstance = $modal.open({
                templateUrl: 'dataSummary.html',
                controller: ModalInstanceCtrl,
                size: 'lg'


            });
        }

        $scope.PrintContent = function() {

            var DocumentContainer = document.getElementById('divtoprint');
            var WindowObject = window.open("", "PrintWindow",
                "width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
            WindowObject.document.writeln(DocumentContainer.innerHTML);
            WindowObject.document.close();
            WindowObject.focus();
            WindowObject.print();
            WindowObject.close();

        }

        //Export phase answers to excel spreadsheet
        $scope.export = function() {
            var blob = new Blob([document.getElementById('divtoprint').innerHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "Report.xls");
        };


    };



    //Added by Anne. 
    /**
     * @controller audioQuestionsController -
     *      Controller used to handle display of AudioQuestions for a Patient's CareTeam
     *
     * @variables -
     *      @questionsURL - url to get the category, test, and fields for audiology phases
     *      @loggedIn - get logged in status
     *      @phaseName - get the name of the current phase being looked looked at
     *      @conditons - object to hold left and right ear conditions selected
     *      @answer - object to hold all the info inputted and necessary to save results(PhaseID and CareTeamID)
     *      @answersURL - url to get saved audiology results
     *      @wordsWith3 - the number of words with 3 phonemes correct (used to display/50 and then calculate %
     *      @phonemes - the number of phonemes correct (used to display/150 and then calculate %
     *      @
     * @injections -
     *      $scope, persistData, getData, postData, putData, $http, $modal, $location, $route,$timeout, $anchorScroll
     *
     * @functions -
     *      @function submitQuestions -saves a test result
     *      @param - category name of the test to be saved (aided audiogram, cnc, bkb-sin, etc)
     *      @returns - NULL
     *      @function getConditionsID -uses $scope.conditions object info to find ID of the two conditions set for the ears
     *      @param - null
     *      @returns -null
     *      @function setNewCondition - clears conditions set and any tests and results in the form so a new set up can be entereed
     *      @param - null
     *      @returns -null
     *      @function clearCurrentTest -clears ONE test (in case of aided audiogram, 3 tests), so more results can be entered under the same ear conditions
     *      @param - category name of the tests to be cleared (aided audiogram, cnc, bkb-sin, etc)
     *      @returns -null
     * @function getDataSummary -
     *  -creates a modalInstance, and opens it.
     *  -uses dataSummary.html script in audioQuestions.html
     *  -shows all the answers entered for that phase
     *
     *  -the modalInstance uses data in ModalInstanceCtrl
     *      @function ok - closes the modalInstance
     *
     */
    controllers.audioQuestionsController = function($scope, persistData, getData, postData, putData, $http, $modal, $location, $route, $timeout, $anchorScroll, $cookieStore) {

        //get the SessionID stored
        var cookieSessionID = $cookieStore.get('SessionID');

        
        //patient info to be displayed on top of audio pages
        $scope.patientName = $cookieStore.get('PatientName');
        $scope.patientSex = $cookieStore.get('PatientSex');
        $scope.patientDOB = $cookieStore.get('PatientDOB');

        //facility info to be displayed in report headers
        $scope.facilityName = $cookieStore.get('FacilityName');
        $scope.facilityImage = $cookieStore.get('FacilityImage');

        $scope.dirAnchor = $cookieStore.get('dirAnchor');
        $scope.phaseID = $cookieStore.get('PhaseID');
        $scope.phaseName = $cookieStore.get('PhaseName');

        //Get Audiology Phase fields and tests to populate the form 
        $scope.questionsURL = "http://aii-hermes.org/aii-api/v1/phases/" + $cookieStore.get('PhaseID') + "/questions/event/" + $cookieStore.get('CareTeamID');
        getData.get($scope.questionsURL).success(function(data) {
            $scope.audioQuestions = data.records;
            $scope.audioQs = data.records.Questions;
        });

        $scope.loggedIn = persistData.getLoggedIn();

        //Conditions object, will hold left and right ear conditions that are set
        $scope.conditions = {};

        $scope.answer = {}; //object to hold all necessary info to save audiology results
        $scope.answer.PhaseID = $cookieStore.get('PhaseID');
        $scope.answer.CareTeamID = $cookieStore.get('CareTeamID');
        $scope.answer.Answers = {};

        //Must initialize, so ng-model recognizes objects to store the fields of each test
        $scope.answer.Results = {
            //"Aided Audiogram" : {"Pure Tone Average": {}, "Speech Reception Threshold": {}, "Speech Discrimination Score" : {}},
            "AzBio": {},
            "CNC": {},
            "BKB-SIN": {}
        };

        $scope.answersURL = "http://aii-hermes.org/aii-api/v1/careTeams/" + $scope.answer.CareTeamID + "/phaseAnswers/" + $scope.answer.PhaseID;

        //**********************Copied from questionsControllerr****/

        //Grab all previously answered questions
        getData.get($scope.answersURL).success(function(data) {
            $scope.summaryAnswers = data.records;
        }).then(function() {
            for (var answerID in $scope.summaryAnswers.Answers) {
                $scope.answer.Answers[answerID] = $scope.summaryAnswers.Answers[answerID].Answers;
            };
        });

        $scope.isObject = function(check) {
            return angular.isObject(check);
        }
        $scope.isArray = function(check) {
            return angular.isArray(check);
        }

        $scope.checkboxTrigger = function(data) {
                var other = false;

                if (typeof data !== "undefined") {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i] == 'Other') {
                            other = true;
                        }
                    }
                }
                return other;
            }
            //Show a child if Trigger has been set
        $scope.showChild = function(data) {
            var index;
            var indexB;

            for (index = 0; index < data.length; index++) {
                for (indexB = 0; indexB < $scope.audioQs.length; indexB++) {
                    if ($scope.audioQs[indexB].QuestionID == data[index]) {
                        $scope.audioQs[indexB].IsChild = 0;
                    }
                }
            }
        }

        //Hide a child if the Trigger has been reset
        $scope.hideChild = function(data) {
            var index;
            var indexB;

            for (index = 0; index < data.length; index++) {
                for (indexB = 0; indexB < $scope.audioQs.length; indexB++) {
                    if ($scope.audioQs[indexB].QuestionID == data[index]) {
                        $scope.audioQs[indexB].IsChild = 1;
                    }
                }
            }
        }

        //Post one answer and save it
        //@param: int: questionID
        $scope.postAnswers = function(questionID) {

            $scope.singleAnswer = {};
            $scope.singleAnswer.Answers = {};
            $scope.singleAnswer.PhaseID = $scope.answer.PhaseID;
            $scope.singleAnswer.CareTeamID = $cookieStore.get('CareTeamID');
            $scope.singleAnswer.Answers[questionID] = $scope.answer.Answers[questionID];
            postData.post('http://aii-hermes.org/aii-api/v1/answers/' + cookieSessionID, $scope.singleAnswer);

        };
        //**********************Copied from questionsControllerr****/


        //Submit a complete audio test result.
        $scope.submitQuestions = function(test) {
            console.log("Submit audio Questions Called");
            $scope.singleAnswer = {};
            $scope.singleAnswer.PhaseID = $scope.answer.PhaseID;
            $scope.singleAnswer.CareTeamID = $scope.answer.CareTeamID
            $scope.singleAnswer.Results = {};

            $scope.singleAnswer.Results[test] = $scope.answer.Results[test];
            $scope.singleAnswer.ConditionsID = $scope.answer.ConditionsID;
            postData.post('http://aii-hermes.org/aii-api/v1/audioTestResults/' + cookieSessionID, $scope.singleAnswer).success(function(data) {
                if (data.records != 'Success') {
                    alert(data.records);
                } else {
                    clearCurrentTest(test);
                }
            }).then(function() {
                //Grab all previously answered questions
                getData.get($scope.answersURL).success(function(data) {
                    $scope.summaryAnswers = data.records;
                }).then(function() {
                    for (var answerID in $scope.summaryAnswers.Answers) {
                        $scope.answer.Answers[answerID] = $scope.summaryAnswers.Answers[answerID].Answers;
                    };
                })
            });
        }

        //uses $scope.conditions object info (left and right ear conditions) to find ID of the two conditions set for the ears
        $scope.getConditionsID = function() {
            console.log("getConditionsID Called");
            getData.get("http://aii-hermes.org/aii-api/v1/audioConditions/left/" + this.conditions.Left + "/right/" + this.conditions.Right).success(function(data) {
                $scope.answer.ConditionsID = data.records.ConditionsID;
            });
        }

        //clears conditions set and any tests and results in the form so a new set up can be entereed
        $scope.setNewCondition = function() {
            $scope.conditions = {};
            $scope.answer.Results["AzBio"] = {};
            $scope.answer.Results["CNC"] = {};
            $scope.wordswith3 = 0;
            $scope.phonemes = 0;
            $scope.answer.Results["BKB-SIN"] = {};
            $scope.answer.tests = null;
            $scope.answer.ConditionsID = "";
        }

        //clears ONE test (or in case of aided audiogram (3 tests), so more results can be entered under the same ear conditions
        var clearCurrentTest = function(data) {
            console.log("clearCurrentTest Called");
            console.log(data);
            if (data == "Aided Audiogram") {
                $scope.answer.Results["Aided Audiogram"]["Pure Tone Average"] = {};
                $scope.answer.Results["Aided Audiogram"]["Speech Reception Threshold"] = {};
                $scope.answer.Results["Aided Audiogram"]["Speech Discrimination Score"] = {};
            } else if (data == 'AzBio') {
                $scope.answer.Results["AzBio"] = {};
            } else if (data == 'CNC') {
                $scope.answer.Results["CNC"] = {};
                $scope.wordswith3 = 0;
                $scope.phonemes = 0;
            } else if (data == 'BKB-SIN') {
                $scope.answer.Results["BKB-SIN"] = {};
            }

        }

        $scope.notSorted = function(obj) {
            if (!obj) {
                return [];
            }

            var X = Object.keys(obj);

            X.pop();

            return X;
        }

        //Modal handler to display help for audiograms - incomplete - need Kimberly
        $scope.audiogramModal = function() {
            var ModalInstanceCtrl = function($scope, $modalInstance) {
                $scope.ok = function() {
                    $modalInstance.close();

                };

            };

            var modalInstance = $modal.open({
                templateUrl: 'audiogramModal.html',
                controller: ModalInstanceCtrl,
                size: 'lg'
            });
        }

        //Added by Travis/Anne
        //***********************Get Data Summary MODAL IN  Questions when you want to complete a phase****************//
        /**
         * @function getDataSummary -
         *  -creates a modalInstance, and opens it.
         *  -uses dataSummary.html script in audioQuestions.html
         *  -shows all the answers entered for that phase
         *
         *  -the modalInstance uses data in ModalInstanceCtrl
         *      @function ok - closes the modalInstance
         */
        $scope.getDataSummary = function(patientSummaryAnswers) {
            var ModalInstanceCtrl = function($scope, $modalInstance) {
                getData.get("http://aii-hermes.org/aii-api/v1/careTeams/" + $cookieStore.get('CareTeamID') + "/phaseAnswers/" + $cookieStore.get('PhaseID')).success(function(data) {
                    $scope.patientSummaryAnswers = data.records.DetailedAnswers;
                });
                $scope.ok = function() {
                    $modalInstance.close();

                };

            };

            var modalInstance = $modal.open({
                templateUrl: 'dataSummary.html',
                controller: ModalInstanceCtrl,
                size: 'lg',
                resolve: {
                    patientSummaryAnswers: function() {
                        return patientSummaryAnswers;
                    }
                }


            });
        }

        $scope.PrintContent = function() {

            var DocumentContainer = document.getElementById('divtoprint');
            var WindowObject = window.open("", "PrintWindow",
                "width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
            WindowObject.document.writeln(DocumentContainer.innerHTML);
            WindowObject.document.close();
            WindowObject.focus();
            WindowObject.print();
            WindowObject.close();

        }

        //Export audio phase report to excel spreadsheet
        $scope.export = function() {
            var blob = new Blob([document.getElementById('divtoprint').innerHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "Report.xls");
        };

        //initialize these fields
        $scope.wordswith3 = 0;
        $scope.phonemes = 0;
        $scope.answer.Results["CNC"]["Words with 3 Phonemes Correct"] = 0;
        $scope.answer.Results["CNC"]["Phonemes Correct"] = 0;

        //update percentage numbers to be displayed as user enters the data
        $scope.updateWordsWith3 = function() {
            $scope.wordswith3 = parseInt(($scope.answer.Results["CNC"]["Words with 3 Phonemes Correct"] / 50) * 100);
        }
        $scope.updatePhonemes = function() {
            $scope.phonemes = parseInt(($scope.answer.Results["CNC"]["Phonemes Correct"] / 150) * 100);
        }


    };


    //************************************END QUESTION CONTROLLERS***************************************//


    //**************************************PATIENT CONTROLLERS******************************************//


    //Added by Anne. 
    /**
     * @controller apiPatientsController -
     *      Controller used on myHome to process API methods for Patients
     *
     * @variables -
     *      @userFacilityID - userFacilityID grabbed from userInfo which was set at login
     *      @sessionID - sessionID grabbed from userInfo which was set at login
     *      @
     *
     * @injections -
     *      $scope, $http, $templateCache, persistData, getData, $location, $anchorScroll, $timeout, $modal, postData, $route, userInfo,
     *      putData
     *
     * @functions -
     *      @function submitPatientInfo - edit patients address, contact info
     *      @param - patient object thats being editited
     *      @returns - null
     *      @function calAge - calculate age form a date of birth
     *      @param - dateString
     *      @returns - age number
     *      @function goToPatDir - reroute to patientDirectory partial and scroll to the patient that was selected (used in dashboard search)
     *      @param - string of patients last name
     *      @returns - null
     *      @function scrollTo - scroll to patient in patientDirectory partial
     *      @param - string of patients last name
     *      @returns - null
     * @function getFacCard -
     *  -creates a modalInstance, and opens it.
     *  -uses myModalContent.html script in patient directory
     *  -shows fac card for the clicked provider
     *
     *  -the modalInstance uses data in ModalInstanceCtrl
     *      @function ok - closes the modalInstance
     * @function addNewEvent -
     *  -creates a modalInstance, and opens it.
     *  -uses addNewEvent.html script in patient directory
     *  -takes description info, patient info, and date to create a new event
     *
     *  -the modalInstance uses data in ModalInstanceCtrl
     *      @function ok - closes the modalInstance and reroutes/scrolls back to patient in patient directory
     *      @submitEvent - uses newEvent object to create a new event("aka a careTeam in the db")
     * @function inviteToCareTeam -
     *  -creates a modalInstance, and opens it.
     *  -uses inviteToCareTeam.html script in patient directory
     *  -shows all the facilities not involved with specifc patient and then allows an invite to be sent to selected facility.
     *  -***** will need to implement email non aii member****
     *
     *  -the modalInstance uses data in ModalInstanceCtrl
     *      @function ok - closes the modalInstance and reroutes/scrolls back to patient in patient directory
     *      @sendCareTeamRequest - send an invite to selected facility to join patients careteam
     *
     */
    controllers.apiPatientsController = function($scope, $http, $templateCache, persistData, getData, $location, $anchorScroll, $timeout, $modal, postData, $route, userInfo, putData, $cookieStore) {
        //hmm 
        var modalCounter = 1;
        $scope.patientInactiveStatus = $cookieStore.get('PatientInactiveStatus'); //?? dont know the usage here either
        $scope.userFacilityID = userInfo.get().FacilityID;
        $scope.userLevelID = userInfo.get().UserLevelID;
        $scope.sessionID = userInfo.get().SessionID;
        $scope.dirAnchor = $cookieStore.get('dirAnchor');

        //Function to change patient to inactive or update patient info - like address
        $scope.submitPatientInfo = function(patient) {
            $timeout(function() {
                if (patient.reason) {
                    patient.InactiveStatus = patient.reason;
                    patient.reason = null;
                }
                $timeout(function() {
                    putData.put('http://aii-hermes.org/aii-api/v1/patients/' + patient.PatientID, patient);
                }, 0);
            }, 0);


        };

        $scope.markPatientActive = function(patient) {
            var updateToActive = {
                'InactiveStatus': 10
            };
            putData.put('http://aii-hermes.org/aii-api/v1/patients/' + patient.PatientID, updateToActive);
            patient.InactiveStatus = 10;
        }

        //active in active tab stuff - not perfect - tab active style is broken upon search if tabs were clicked
        $scope.showActiveTab = true;
        $scope.showInactiveTab = false;
        $scope.showActivePatients = "10";

        $scope.showInactive = function() {
            console.log("inshowInactive()");
            $scope.showActivePatients = "!10";
            $scope.showInactiveTab = true;
            $scope.showActiveTab = false;
            //$scope.$apply();
            console.log('showActivePatients:', $scope.showActivePatients);
        };
        $scope.showActive = function() {
            $scope.showActivePatients = "10";
            $scope.showInactiveTab = false;
            $scope.showActiveTab = true;
        };

        $scope.editDescrip = false; // used to show description as text - changed to true if user needs to edit - in which case, text becomes textbox

        $scope.submitDescriptionInfo = function(careTeam) {
            putData.put('http://aii-hermes.org/aii-api/v1/careTeams/' + careTeam.CareTeamID, careTeam);
        };

        //Get all the possible reasons to become inactive
        getData.get("http://aii-hermes.org/aii-api/v1/inactiveReasons").success(function(data) {
            $scope.inactiveReasons = data.records;
        });

        //Calulate patients age based on a birthdate
        $scope.calcAge = function(dateString) {
            var year = Number(dateString.substr(0, 4));
            var month = Number(dateString.substr(4, 2)) - 1;
            var day = Number(dateString.substr(6, 2));
            var today = new Date();
            var age = today.getFullYear() - year;
            if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day)) {
                age--;
            }
            return age;
        }

        //changes path to patient directory if not in it, and scrolls to patient's status box
        $scope.goToPatDir = function(last, inactiveStatus) {
            //console.log($location.$$path);
            if ($location.$$path != "/patientDirectory") {
                $location.path('/patientDirectory/');
                //$scope.scrollTo(last); // patient here is actually just the last name.. for now

                $timeout(function() {
                    if (inactiveStatus != 10) { //if patient is inactive- go to inactive tab then scroll to patient
                        $scope.scrollTo(last, true); //NOT working for pages outside of patient directory
                    } else { //if patient is inactive, stay on active tab and then scroll to patient
                        $scope.scrollTo(last, false);
                    }
                }, 0);

            } else {
                if (inactiveStatus != 10) {
                    $scope.scrollTo(last, true);
                } else {
                    $scope.scrollTo(last, false);
                }

            }

        };

        $scope.scrollTo = function(id, showInactive) {

            if (showInactive) {
                $scope.showInactive();
            } else {
                $scope.showActive();
            }
            $location.hash(id);
            $timeout(function() {

                $anchorScroll();
                console.log("scrolling");
                $timeout(function() {
                    scrollBy(0, -60); //scrollin to account for space taken by top nav bar
                }, 0);
            }, 1000);

        };

        //Grab all Patients for users facility using patientURL 
        $scope.patientURL = "http://aii-hermes.org/aii-api/v1/facilities/patients/" + $scope.sessionID;
        getData.get($scope.patientURL).success(function(data) {
            $scope.patientsData = data;
        })


        //Get all the phases info!!
        getData.get("http://aii-hermes.org/aii-api/v1/phases/" + $scope.sessionID).success(function(data) {
            $scope.phases = data.records;
        });
        
        //Get all the current phase cases info!! - used to make the dots
        getData.get("http://aii-hermes.org/aii-api/v1/phases/phaseStatuses").success(function(data) {
            $scope.phaseCases = data.records;
        });

        //Set persistData so CareTeamID, PhaseID, phasename, patient name and anchor location in patient Directory are known in different partials.
        $scope.goToQuestions = function(careTeam, phase, patient) {

            $cookieStore.put('PatientID', patient.PatientID);
            $cookieStore.put('CareTeamID', careTeam.CareTeamID);
            $cookieStore.put('PhaseID', phase.PhaseID);
            $cookieStore.put('PhaseName', phase.PhaseName);
            $cookieStore.put('PatientName', patient.First + " " + patient.Last);
            $cookieStore.put('dirAnchor', patient.Last);
            //persistData.setCareTeamID(careTeam.CareTeamID);
            //persistData.setPhaseID(phase.PhaseID);
            //persistData.setPhaseName(phase.Name);
            //persistData.setPatientName(patient.First + " " + patient.Last);
            //persistData.setPatientID(patient.PatientID);
            //persistData.setDirAnchor(patient.Last);
            $cookieStore.put('PatientDOB', patient.DOB);
            $cookieStore.put('PatientSex', patient.Sex);
            $cookieStore.put('CurrentPhaseID', careTeam.CurrentPhaseID);
            $cookieStore.put('PatientInactiveStatus', patient.InactiveStatus);

        };

        //toggle switch functionality to make a patient inactive or active
        $scope.activity = function(patient) {
            var ModalInstanceCtrl = function($scope, $modalInstance) {
                modalCounter++;
                $scope.modalPatient = patient;

                getData.get("http://aii-hermes.org/aii-api/v1/inactiveReasons").success(function(data) {
                    $scope.inactiveReasons = data.records;
                });

                $scope.ok = function() {
                    $modalInstance.close();
                    $scope.undoSwitch();

                };

                $scope.undoSwitch = function() {
                    if (modalCounter % 2 == 0) {
                        document.getElementById(patient.First).className = "switchoff";
                    } else {
                        document.getElementById(patient.First).className = "switch";
                    }
                };

                $scope.setReasonID = function(reasonID) {
                    $scope.modalPatient.reason = reasonID;
                };

                $scope.setReason = function(reason) {
                    $scope.modalPatient['Inactive Reason'] = reason;
                };

                $scope.submitPatientInfo = function(modalPatient) {
                    $timeout(function() {
                        if (modalPatient.reason) {
                            modalPatient.InactiveStatus = modalPatient.reason;
                            modalPatient.reason = null;
                        }
                        $timeout(function() {
                            putData.put('http://aii-hermes.org/aii-api/v1/patients/' + modalPatient.PatientID, modalPatient);
                        }, 0).then(function() {
                            $scope.ok();
                        });
                    }, 0);
                };

            };

            var modalInstance = $modal.open({
                templateUrl: 'active.html',
                controller: ModalInstanceCtrl,
                size: 'lg',
                backdrop: 'static'
            });

        }

        $scope.inactivity = function(patient) {
            var ModalInstanceCtrl = function($scope, $modalInstance) {
                modalCounter++;
                $scope.modalPatient = patient;

                $scope.ok = function() {
                    $modalInstance.close();
                    $scope.undoSwitch();

                };

                $scope.undoSwitch = function() {
                    if (modalCounter % 2 == 0) {
                        document.getElementById(patient.First).className = "switch";
                    } else {
                        document.getElementById(patient.First).className = "switchoff";
                    }
                };

                $scope.modalPatient.reason = 10;

                $scope.modalPatient['Inactive Reason'] = null;

                $scope.submitPatientInfo = function(modalPatient) {
                    $timeout(function() {
                        if (modalPatient.reason) {
                            modalPatient.InactiveStatus = modalPatient.reason;
                            modalPatient.reason = null;
                        }
                        $timeout(function() {
                            putData.put('http://aii-hermes.org/aii-api/v1/patients/' + modalPatient.PatientID, modalPatient);
                        }, 0).then(function() {
                            $scope.ok();
                        });
                    }, 0);


                };

            };

            var modalInstance = $modal.open({
                templateUrl: 'inactive.html',
                controller: ModalInstanceCtrl,
                size: 'lg',
                backdrop: 'static'

            });
        }


        //Added by Anne
        //***********************Get Fac card MODAL IN  Patient directory in see care team details when you click on a patients provider****************//
        /**
         * @function getFacCard -
         *  -creates a modalInstance, and opens it.
         *  -uses myModalContent.html script in patient directory
         *  -shows fac card for the clicked provider
         *
         *  -the modalInstance uses data in ModalInstanceCtrl
         *      @function ok - closes the modalInstance
         */
        $scope.getFacCard = function(fac) {

            var ModalInstanceCtrl = function($scope, $modalInstance, fac) {
                $scope.sessionID = userInfo.get().SessionID;
                //console.log(fac.FacilityID);
                //Get clicked facilities info
                getData.get("http://aii-hermes.org/aii-api/v1/facilities/" + fac.FacilityID + "/" + $scope.sessionID).success(function(data) {
                    $scope.facCard = data;
                });
                //Get clicked facilities users
                getData.get("http://aii-hermes.org/aii-api/v1/facilities/" + fac.FacilityID + '/users/' + $scope.sessionID).success(function(data) {
                    $scope.facCardUsers = data;
                    for (i = 0; i < data.records.length; i++) {
                            if (data.records[i].Level == 'Coordinator') {
                                $scope.facilityAdmin = data.records[i];
                                i = data.records.length;
                            }
                        }
                });
                
                 $scope.sendMessageToUser = function(user) {
                    persistData.setMessageRecipient(user);
                }

                $scope.ok = function() {
                    $modalInstance.close();
                };

            };

            //open modal defined by myModalContent.html (inline in patientDirectory partial)
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalInstanceCtrl,
                size: 'md',
                resolve: {
                    fac: function() {
                        return fac;
                    }
                }

            });


        }

        //Added by Anne
        //***********************Add new event MODAL IN  Patient directory when you click on a add new event****************//
        /**
         * @function addNewEvent -
         *  -creates a modalInstance, and opens it.
         *  -uses addNewEvent.html script in patient directory
         *  -takes description info, patient info, and date to create a new event
         *
         *  -the modalInstance uses data in ModalInstanceCtrl
         *      @function ok - closes the modalInstance and reroutes/scrolls back to patient in patient directory
         *      @submitEvent - uses newEvent object to create a new event("aka a careTeam in the db")
         */
        $scope.addNewEvent = function(patient) {

            var ModalInstanceCtrl = function($scope, $modalInstance, patient) {
                var cookieSessionID = $cookieStore.get('SessionID');

                $scope.currentDate = new Date();
                //object to hold information for patients new event
                $scope.newEvent = {
                    "Description": null,
                    "CurrentPhaseID": 20,
                    "PatientID": patient.PatientID
                };
                $scope.patient = patient;

                //Auto scroll back to patient after refreshing page to show new event
                $scope.ok = function() {
                    $modalInstance.close();
                    $timeout(function() {
                        $route.reload();
                    }, 1000);
                    $location.hash(patient.Last);
                    console.log($location.hash());
                    $timeout(function() {
                        $anchorScroll();
                    }, 3000);
                };

                //function to save new event
                $scope.submitEvent = function() {
                    if ($scope.newEvent.Description == null) {
                        $scope.newEvent.Description = "N/A";
                    }
                    $scope.answer = {};
                    $scope.answer.Answers = {};
                    $scope.answer.PhaseID = 1;
                    //record all the demo answers to this event
                    $scope.answer.Answers[10] = patient.DOB;
                    $scope.answer.Answers[20] = patient.Sex;
                    $scope.answer.Answers[30] = patient.Race;
                    $scope.answer.Answers[40] = patient.BMI;
                    $scope.answer.Answers[45] = patient.Height;
                    $scope.answer.Answers[46] = patient.Weight;

                    //create new event for that patient...
                    postData.post('http://aii-hermes.org/aii-api/v1/careTeams/'+cookieSessionID, $scope.newEvent).success(function(data) {
                        $scope.answer.CareTeamID = data.records;
                    }).then(function() {
                        //post known demo answers to that event 
                        postData.post('http://aii-hermes.org/aii-api/v1/answers/' + cookieSessionID, $scope.answer).success(function() {
                            //if patient was inactive, new event re-activates them.
                            var updateToActive = {
                                'InactiveStatus': 10
                            };
                            putData.put('http://aii-hermes.org/aii-api/v1/patients/' + patient.PatientID, updateToActive);
                            patient.InactiveStatus = 10;
                        });

                        $scope.ok();

                    });
                }
                $scope.cancel = function() {
                    $modalInstance.close();
                };

            };

            //opens modal defined by addNewEvent.html (inline in patientDirectory.html)
            var modalInstance = $modal.open({
                templateUrl: 'addNewEvent.html',
                controller: ModalInstanceCtrl,
                size: 'lg',
                resolve: {
                    patient: function() {
                        return patient;
                    }
                }

            });
        }

        //**** invite hasn't been tested*****
        //Added by Anne
        //***********************Invite new facility to care team MODAL IN  Patient directory when you click on see care team details****************//
        /**
         * @function inviteToCareTeam -
         *  -creates a modalInstance, and opens it.
         *  -uses inviteToCareTeam.html script in patient directory
         *  -shows all the facilities not involved with specifc patient and then allows an invite to be sent to selected facility.
         *  -***** will need to implement email non aii member****
         *
         *  -the modalInstance uses data in ModalInstanceCtrl
         *      @function ok - closes the modalInstance and reroutes/scrolls back to patient in patient directory
         *      @sendCareTeamRequest - send an invite to selected facility to join patients careteam
         */
        $scope.inviteToCareTeam = function(patient) {

            var ModalInstanceCtrl = function($modalInstance, $scope) {
                $scope.userFacilityID = userInfo.get().FacilityID;
                $scope.patient = patient;
                $scope.selectedFac = "(No facility selected)";
                //Grab AII Facilities that are NOT already associated with the patient
                getData.get("http://aii-hermes.org/aii-api/v1/facilities/new/" + patient.PatientID).success(function(data) {
                    $scope.allFacs = data;
                });

                $scope.selectFac = function(fac) {
                    $scope.selectedFac = fac;
                    $scope.patientProvider = {
                        "PatientID": patient.PatientID,
                        "FacilityID": fac.FacilityID
                    };
                }


                $scope.sendCareTeamRequest = function() {
                    //Copied james sendInvite function
                    $scope.postNotification = {};
                    $scope.postNotification.PatientID = patient.PatientID;
                    $scope.postNotification.SenderFacilityID = $scope.userFacilityID;
                    $scope.postNotification.ReceiverFacilityID = $scope.selectedFac.FacilityID;

                    $scope.postNotificationURL = "http://aii-hermes.org/aii-api/v1/notifications/";
                    postData.post($scope.postNotificationURL, $scope.postNotification).success(function(data) {
                        if (data.records == "Success")
                            $modalInstance.close();

                    });
                    /*postData.post('http://aii-hermes.org/aii-api/v1/patientProviders',$scope.patientProvider).success(function(data) {
                        $modalInstance.close();
                        $timeout(function(){
                            $route.reload();
                        }, 1000);
                        $location.hash(patient.Last);
                        console.log($location.hash());
                        $timeout(function(){
                            $anchorScroll();
                        }, 2000);
                    });  
                    */
                }
                $scope.ok = function() {
                    $modalInstance.close();
                };

            };

            var modalInstance = $modal.open({
                templateUrl: 'inviteToCareTeam.html',
                controller: ModalInstanceCtrl,
                size: 'md'

            });
        }




    };


    //Probably hella old.... needs work
    //Added by ???. 
    /**
     * @controller patientFormController -
     *      Controller used to handle addition of new Patients to the system
     *
     * @variables -
     *      @*****
     *
     * @injections -
     *      $scope, $http, postData,dateFilter
     *
     * @functions -
     *      @function **** -
     *      @param - NULL
     *      @returns - NULL
     *
     */
    controllers.patientFormController = function($scope, $http, postData, dateFilter, userInfo, $cookieStore, $location) {
        // create a blank object to hold form information
        $scope.formData = {};

        var sessionID = $cookieStore.get('SessionID');

        $scope.formatDate = function() {
            $scope.formData.DOB = $scope.formData.dob.toISOString().slice(0, 10);
        };

        // Post function to add a new Patient to the system
        $scope.addPatient = function() {
            postData.post('http://aii-hermes.org/aii-api/v1/patients/' + sessionID, $scope.formData).success(function(data) {
                alert(data.records);

                if (data.records == "Successfully added a patient") {
                    $location.path('/patientDirectory/');
                };
            });
        };
        
        $scope.usStates = [
			{ name: 'ALABAMA', abbreviation: 'AL'},
			{ name: 'ALASKA', abbreviation: 'AK'},
			{ name: 'ARIZONA', abbreviation: 'AZ'},
			{ name: 'ARKANSAS', abbreviation: 'AR'},
			{ name: 'CALIFORNIA', abbreviation: 'CA'},
			{ name: 'COLORADO', abbreviation: 'CO'},
			{ name: 'CONNECTICUT', abbreviation: 'CT'},
			{ name: 'DELAWARE', abbreviation: 'DE'},
			{ name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
			{ name: 'FLORIDA', abbreviation: 'FL'},
			{ name: 'GEORGIA', abbreviation: 'GA'},
			{ name: 'GUAM', abbreviation: 'GU'},
			{ name: 'HAWAII', abbreviation: 'HI'},
			{ name: 'IDAHO', abbreviation: 'ID'},
			{ name: 'ILLINOIS', abbreviation: 'IL'},
			{ name: 'INDIANA', abbreviation: 'IN'},
			{ name: 'IOWA', abbreviation: 'IA'},
			{ name: 'KANSAS', abbreviation: 'KS'},
			{ name: 'KENTUCKY', abbreviation: 'KY'},
			{ name: 'LOUISIANA', abbreviation: 'LA'},
			{ name: 'MAINE', abbreviation: 'ME'},
			{ name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
			{ name: 'MARYLAND', abbreviation: 'MD'},
			{ name: 'MASSACHUSETTS', abbreviation: 'MA'},
			{ name: 'MICHIGAN', abbreviation: 'MI'},
			{ name: 'MINNESOTA', abbreviation: 'MN'},
			{ name: 'MISSISSIPPI', abbreviation: 'MS'},
			{ name: 'MISSOURI', abbreviation: 'MO'},
			{ name: 'MONTANA', abbreviation: 'MT'},
			{ name: 'NEBRASKA', abbreviation: 'NE'},
			{ name: 'NEVADA', abbreviation: 'NV'},
			{ name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
			{ name: 'NEW JERSEY', abbreviation: 'NJ'},
			{ name: 'NEW MEXICO', abbreviation: 'NM'},
			{ name: 'NEW YORK', abbreviation: 'NY'},
			{ name: 'NORTH CAROLINA', abbreviation: 'NC'},
			{ name: 'NORTH DAKOTA', abbreviation: 'ND'},
			{ name: 'OHIO', abbreviation: 'OH'},
			{ name: 'OKLAHOMA', abbreviation: 'OK'},
			{ name: 'OREGON', abbreviation: 'OR'},
			{ name: 'PALAU', abbreviation: 'PW'},
			{ name: 'PENNSYLVANIA', abbreviation: 'PA'},
			{ name: 'PUERTO RICO', abbreviation: 'PR'},
			{ name: 'RHODE ISLAND', abbreviation: 'RI'},
			{ name: 'SOUTH CAROLINA', abbreviation: 'SC'},
			{ name: 'SOUTH DAKOTA', abbreviation: 'SD'},
			{ name: 'TENNESSEE', abbreviation: 'TN'},
			{ name: 'TEXAS', abbreviation: 'TX'},
			{ name: 'UTAH', abbreviation: 'UT'},
			{ name: 'VERMONT', abbreviation: 'VT'},
			{ name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
			{ name: 'VIRGINIA', abbreviation: 'VA'},
			{ name: 'WASHINGTON', abbreviation: 'WA'},
			{ name: 'WEST VIRGINIA', abbreviation: 'WV'},
			{ name: 'WISCONSIN', abbreviation: 'WI'},
			{ name: 'WYOMING', abbreviation: 'WY' }
		];

    }



    //Added by Anne 
    //I think needed to be in own controller cuz wouldnt work any other way for some reason. not sure now...
    /**
     * @controller collapseCtrl -
     *      Controls open and closing of see care team details well in patient directory
     *
     * @variables -
     *      @*****
     *
     * @injections -
     *      $scope
     *
     * @functions -
     *      @function **** -
     *      @param - NULL
     *      @returns - NULL
     *
     */
    controllers.collapseCtrl = function($scope) {
        $scope.isDataCollapsed = true;
        $scope.toggleDataCollapse = function() {
            $scope.isDataCollapsed = !$scope.isDataCollapsed;
        }
    }


    //**************************************END PATIENT CONTROLLERS******************************************//



    //*****************************************USER CONTROLLERS**********************************************//


    //Added by Travis. 
    /**
     * @controller addUserController -
     *  Controller used to handle addition of NEW Users to the system
     *
     * @variables -
     *      @object formData - blank object to hold form information
     *      @string UserLevelsURL - URL to get user levels from the API
     *      @string UserTitlesURL - URL to get user titles from the API
     *
     * @injections -
     *      $scope, $http, postData, getData
     *
     * @functions -
     *      @function processForm - POSTs data contained inside form to database
     *      @param - NULL
     *      @returns - NULL
     *
     */
    controllers.addUserController = function($scope, $http, postData, getData) {

        // create a blank object to hold form information
        $scope.formData = {};
        //getting the userlevels from the api and posting it to the form
        $scope.UserLevelsURL = 'http://aii-hermes.org/aii-api/v1/userLevels';
        $scope.UserTitlesURL = 'http://aii-hermes.org/aii-api/v1/userTitles';
        getData.get($scope.UserLevelsURL).success(function(data) {
            $scope.formData.UserLevels = data;
            //console.log($scope.formData.UserLevels);
        });
        getData.get($scope.UserTitlesURL).success(function(data) {
            $scope.formData.UserTitles = data;
            //console.log($scope.formData.UserTitles);
        });

        // Post function to add a new User to the system
        $scope.processForm = function() {
            postData.post('http://aii-hermes.org/aii-api/v1/users', $scope.formData);
        };

    }


    //Added by Travis. 
    /**
     * @controller editUserController - 
     *      Controller used to handle any EDITS made to a User in user settings
     *
     * @variables -
     *      @object editUser - empty object to hold any edits made to User
     *      @object editFacility - empty object to hold any edits made to Facility
     *      @string userURL - URL to get JSON object with a specific users information
     *      @string faciltyURL - URL to get JSON object with a specific facilities information
     *      @int userLevel - data member that holds Users level.
     *
     * @injections - 
     *      $scope, $http, getData, putData, persistData
     *
     * @functions - 
     *      @function editUserPut - PUT's data containing edits to a Users information to database
                using the putData Factory
     *      @param - NULL
     *      @returns - NULL
     *
     *      @function editFacilityPut - PUT's data containing edits to a Facilities information to database
                using the putData Factory
     *      @param - NULL
     *      @returns - NULL
     *
     */
    controllers.editUserController = function($scope, $http, getData, putData, persistData, userInfo) {
        
        $scope.editUser = {};

        var sessionID = userInfo.get().SessionID;

        //url to get signed in users info
        $scope.userURL = "http://aii-hermes.org/aii-api/v1/users/one/" + sessionID;
        //Grab single User by ID and then bind email and phone details to the editUser scope variable
        getData.get($scope.userURL).success(function(data) {
            $scope.user= data.records;
        });

        
        //Scope variables
        $scope.message ="";
	    $scope.messageIsError = false; //Determines the style of the message
	    $scope.disableRegister = true; //Disables the save button
	    $scope.button = "Save"; //save button content
	   
	    //Validates the form data and sends a user registration request to the API
        $scope.editUser = function() {
	   
			//TODO - form validation
			//	insure valid username (no spaces, adequate length)
			//	insure valid password (adequate length, valid characters)
		
			//Insure password fields match before sending request
			if($scope.user.Password === $scope.user.confirmPassword){
				putData.put('http://aii-hermes.org/aii-api/v1/users/' + sessionID, $scope.editUser).success(function(data) {
                    if (data.records["User Edit Response"]) {
                        alert(data.records['User Edit Respone']);
                    }
                })
			}
			//If the password and confirmation do not match, inform the user
			else{
				$scope.message = "Password fields do not match.";
				$scope.messageIsError = true;
			}
        }
        
        

        

    }


    //**************************************END USER CONTROLLERS******************************************//

	//*************************************MESSAGING CONTROLLER*******************************************//

    //Added by James. 
    /**
     * @controller collapseCtrl -
     *      Controller used on messages to process API methods for Users' Messages
     *
     * @variables -
     *      @*****
     *
     * @injections -
     *      $scope, $http, $templateCache, $filter, persistData, getData, postData, putData, userInfo
     *
     * @functions -
     *      @function **** -
     *      @param - NULL
     *      @returns - NULL
     *
     */
	
	controllers.messagingController = function($scope, $http, $templateCache, $filter, persistData, getData, postData, putData, userInfo, messageCount, $cookieStore) {

		//Controller variables
		var sessionID = userInfo.get().SessionID;
		var userLevel = userInfo.get().UserLevelID;
		var baseURL = "http://aii-hermes.org/aii-api/v1/";
		var urlSet = {		//(Keys are defined as : messageType + messageProperty)
			'MessagesReceived' 		: 'users/inbox/',
			'MessagesDeleted' 		: 'users/deleted/',
			'MessagesSent'			: 'users/sent/',
			'MessagesDrafts'		: 'users/drafts/',
			'AlertsReceived' 		: 'facilities/alerts/',
			'AlertsDeleted' 		: 'facilities/deletedAlerts/',
			'NotificationsReceived' : 'facilities/notifications/',
			'NotificationsDeleted' 	: 'facilities/deletedNotifications/',
		};

		//----- Data-bound variables -----
		
		//Message Variables
		$scope.messages = {}; 			//object consisting of all of the user's messages (Keys are defined as : messageType + messageProperty)
		$scope.currentMessages = [];	//object consisting of the messages currently being viewed
		$scope.markedMessages = [];		//object consisting of all currently marked messages
		$scope.messageType = null; 		//marks if message consists of 'Messages', 'Alerts', or 'Notifications'
		$scope.messageProperty = null;	//marks if messages are 'Received', 'Deleted', 'Sent', or 'Drafts'
		
		//Message Count Variables
		$scope.unreadMessageCount = 0;
		$scope.unreadAlertCount = 0;
		$scope.unreadNotificationCount = 0;
		$scope.unreadCount = 0;
		
		//Composed Message Variables
		$scope.composedMessage = []; 	//object to hold the composed message
		
		//Display Variables
		$scope.reverse = true;				//OrderBy property : true means display contents in reverse order
		$scope.orderFilter = 'Timestamp';	//Initialize orderBy property to Timestamp
		
		//--------------------------------- 
		
		//Clear any content currently in the composed message
		$scope.clearComposedMessage = function(){
			$scope.composedMessage = [];
		}
		
		//Either delete or restore the given message.
		//	toDelete: true - Delete the message
		//			  false - Restore the message
		$scope.deleteMessage = function(message, toDelete){
			//Use lower case message type in the PUT URL
			var lowerMessageType = $scope.messageType.toLowerCase();
			var idType = $scope.messageType.substr(0, $scope.messageType.length - 1);
			
			//Determine Deleted field name
			var deletedName = 'IsArchived';
			if($scope.messageType == 'Messages'){
				if(message['ReceiverName'] == 'Me'){
					deletedName = 'ReceiverDeleted';
				} else if(message['SenderName'] == 'Me'){
					deletedName = 'SenderDeleted';
				}
			}
			//Modify the value of the deleted field
			if(toDelete){
				message[deletedName]++;
			} else {
				message[deletedName]--;
			}
			
			//Save the modified message
			putData.put(baseURL + lowerMessageType + '/' + message[idType + 'ID'], message).success(function(data){
				//Get message counts
				$scope.getMessageCounts();
			});
			
		}
		
		//Marks the selected messages as deleted 
		$scope.deleteSelectedMessages = function(){
			//Use lower case message type in the PUT URL
			var lowerMessageType = $scope.messageType.toLowerCase();
			var idType = $scope.messageType.substr(0, $scope.messageType.length - 1);
			
			//Loop through each selected message 
			for(var i in $scope.markedMessages){
				//Determine Deleted field name
				var deletedName = 'IsArchived';
				if($scope.messageType == 'Messages'){
					if($scope.markedMessages[i]['ReceiverName'] == 'Me'){
						deletedName = 'ReceiverDeleted';
					} else if($scope.markedMessages[i]['SenderName'] == 'Me'){
						deletedName = 'SenderDeleted';
					}
				}
				//Modify the value of their fields
				$scope.markedMessages[i][deletedName]++;
				
				//Save the modified message
				putData.put(baseURL + lowerMessageType + '/' + $scope.markedMessages[i][idType + 'ID'], $scope.markedMessages[i]).success(function(data){
					//Get message counts
					$scope.getMessageCounts();
				});
			}
		}
		
		//Edit a given draft as the composed message
		$scope.editDraft = function(message){
			$scope.composedMessage = message;
			$scope.composedMessage['isDraft'] = true;
		}
		
		//Modify the current message (by PUT request)
		$scope.editMessage = function(message, field, value){
			//Modify field value of message
			message[field] = value;
			
			//Save message edit
			//Use lower case message type in the PUT URL
			var lowerMessageType = $scope.messageType.toLowerCase();
			var idType = $scope.messageType.substr(0, $scope.messageType.length - 1);
			putData.put(baseURL + lowerMessageType + '/' + message[idType + 'ID'], message).success(function(data){
				//Get message counts
				$scope.getMessageCounts();
			});
		}
		
		//Modify the marked messages
		$scope.editSelectedMessages = function(field, value){
			//Use lower case message type in the PUT URL
			var lowerMessageType = $scope.messageType.toLowerCase();
			var idType = $scope.messageType.substr(0, $scope.messageType.length - 1);
		
			//Loop through each selected message 
			for(var i in $scope.markedMessages){
				//Modify the value of their fields
				$scope.markedMessages[i][field] = value;
				
				//Save the modified message
				putData.put(baseURL + lowerMessageType + '/' + $scope.markedMessages[i][idType + 'ID'], $scope.markedMessages[i]).success(function(data){
					//Get message counts
					$scope.getMessageCounts();
				});
			}
		}
		
		//Get all of the messages the user has access to.
		//(Should only be called on controller load)
		$scope.getAllMessages = function(){
			//Loop through the URL Set and retrieve the user's messages
			for(var key in urlSet){
				var currentURL = baseURL + urlSet[key] + sessionID;
				getData.get(currentURL).success(function(data) {
					//If the data is not an error code, add it to the known messages
					if(typeof data == "object"){
						$scope.messages[key] = data.records;
					}
				});
			}
			//Parse the retrieved messages
			$scope.parseAllMessages();
			//Get all message counts
			$scope.getMessageCounts();
			//Set the current message type 
			$scope.currentMessages = $scope.messages[$scope.messageType + $scope.messageProperty];
			setTimeout(function(){
				$scope.resetCurrentMessages();
			},0);
		}
		
		//Get counts for all three message types
		$scope.getMessageCounts = function(){
			var unreadMessageURL = baseURL + "users/unreadMessagesCount/" + sessionID;
			
			//Get all counts
			getData.get(unreadMessageURL).success(function(data) {
				if(typeof data == "object"){
					$scope.unreadMessageCount = data['records']['messageCount'];
					$scope.unreadAlertCount = data['records']['alertCount'];
					$scope.unreadNotificationCount = data['records']['notificationCount'];
					
					//Set the current count
					var types = {
						'Messages' : $scope.unreadMessageCount,
						'Alerts' : $scope.unreadAlertCount,
						'Notifications' : $scope.unreadNotificationCount,
					};
					$scope.unreadCount = types[$scope.messageType];
				}
			});
		}
		
		//Get current messages (depending on the message type and property) 
		$scope.getMessages = function(){
			//Get current messages depending on current message Type and Property
			var messageURL = baseURL + urlSet[$scope.messageType + $scope.messageProperty] + sessionID;
			getData.get(messageURL).success(function(data) {
				//Parse the messages after they are retrieved
				if(typeof data == "object"){
					$scope.messages[$scope.messageType + $scope.messageProperty] = data.records;
					//Parse the retrieved messages
					if($scope.messageType == "Messages"){
						$scope.parseMessages();
					} else if($scope.messageType == "Alerts"){
						$scope.parseAlerts();
					} else if($scope.messageType == "Notifications"){
						$scope.parseNotifications();
					}
					//TODO - Insure that currentMessages is being assigned AFTER message parsing
					$scope.currentMessages = $scope.messages[$scope.messageType + $scope.messageProperty];
				}
			});
		}
		
		//Returns whether or not a given property is selected
		$scope.isCurrentProperty = function(input){
			return $scope.messageProperty == input;
		}
		
		//Returns whether or not a given type is selected
		$scope.isCurrentType = function(input){
			return $scope.messageType == input;
		}
		
		//Define necessary fields for all available messages
		$scope.parseAllMessages = function(){
			$scope.parseMessages();
			$scope.parseAlerts();
			$scope.parseNotifications();
		}
		
		
		//Defines SenderName, ReceiverName, ShortSubject, ShortSenderName, and ShortReceiverName 
		//for all messages
		$scope.parseMessages = function(){		
			//Loop through each message and parse accordingly
			for(var key in $scope.messages){
				if(key.charAt(0) == 'M'){	//Only parse Messages
				
					//Define SenderName and ReceiverName for each message
					for(var i in $scope.messages[key]){
						$scope.messages[key][i]['ReceiverName'] = $scope.messages[key][i]['Receiver_First'] + " " + $scope.messages[key][i]['Receiver_Last'];
						$scope.messages[key][i]['SenderName'] = $scope.messages[key][i]['Sender_First'] + " " + $scope.messages[key][i]['Sender_Last'];
						if($scope.messages[key][i]['Receiver_First'] == null && $scope.messages[key][i]['Receiver_Last'] == null) 
							$scope.messages[key][i]['ReceiverName'] = "Me";
						if($scope.messages[key][i]['Sender_First'] == null && $scope.messages[key][i]['Sender_Last'] == null) 
							$scope.messages[key][i]['SenderName'] = "Me";
					}
					
					//Define ShortSubject, ShortContent, ShortSenderName, and ShortReceiverName
					$scope.shortenField(key, 'Subject');
					$scope.shortenField(key, 'Content');
					setTimeout(function(){
						$scope.shortenField(key, 'SenderName');
					},0);
					setTimeout(function(){
						$scope.shortenField(key, 'ReceiverName');
					},0);
				}
			}
		}
		
		//Define ShortSubject and ShortPatient for all Alerts
		$scope.parseAlerts = function(){
			$scope.shortenField('AlertsReceived', 'Subject');
			$scope.shortenField('AlertsReceived', 'Patient');
			$scope.shortenField('AlertsDeleted', 'Subject');
			$scope.shortenField('AlertsDeleted', 'Patient');
		}
		
		//Define Subject, ShortSubject, and ShortSenderFacilityName for all Notifications
		$scope.parseNotifications = function(){
			//Loop through each notifications and parse accordingly
			for(var key in $scope.messages){
				if(key.charAt(0) == 'N'){	
					//Define Subject of each notification
					for(var i in $scope.messages[key]){
						if ($scope.messages[key][i]['IsRequest'] == '1') {
							$scope.messages[key][i]['Subject'] = 'Invitation - ' + $scope.messages[key][i]['Patient'];
						} else {
							if ($scope.messages[key]['Response'] == '1') {
								$scope.messages[key]['Subject'] = 'Accepted - ' + $scope.messages[key][i]['Patient'];
							} else if ($scope.messages[key]['Response'] == '2') {
								$scope.messages[key]['Subject'] = 'Declined - ' + $scope.messages[key][i]['Patient'];
							}
						}
					}
					//Define ShortSubject and ShortSenderFacilityName for all Notifications
					setTimeout(function(){
						$scope.shortenField(key, 'Subject');
					},0);
					$scope.shortenField(key, 'SenderFacilityName');
				}
			}
		}
		
		//Prefill the composed message's content as either a reply or forward of the given message
		$scope.prefillComposedMessage = function(message, isReply){
			$scope.composedMessage = [];
			
			//Handle Subject and Content differences in Forwarding or Replying to the message
			if(isReply){
				$scope.composedMessage['ReceiverUsername'] = message['SenderUsername'];
				$scope.composedMessage['Subject'] = "RE: " + message['Subject'];
				$scope.composedMessage['Content'] = "\n\n------------------------------\n" + "From: " + message['SenderName'];
			} else {
				$scope.composedMessage['Subject'] = "FWD: " + message['Subject'];
				$scope.composedMessage['Content'] = "\n\n------------------------------\n" + "From: " + message['SenderName'] + "\n" + "To: " + message['ReceiverName'];
			}
			
			//Determine Time and Date of the message
			var messageTime = $filter('date')(($scope.selectedMessage.Timestamp * 1000), 'h:mm a');
			var messageDate = $filter('date')(($scope.selectedMessage.Timestamp * 1000), 'M/d/yy');
			
			//Fill in remaining content
			$scope.composedMessage['Content'] = $scope.composedMessage['Content'] + "\n" + "Subject: " + message['Subject'] + "\n" + "Time: " + messageTime + "\n" + "Date: " + messageDate + "\n\n" + message['Content']; 
		}
		
		//Defines "Short{field}" value for every message in the given key
		$scope.shortenField = function(key, field){
			//Length of the shortened fields
			var shortLength = 24;
		
			//Loop through every message in the key and define 'Short{field}'
			for(var i in $scope.messages[key]){
				console.log($scope.messages[key][i]);
				console.log("Key: " + key);
				console.log("Field: " + field);
		
				$scope.messages[key][i]['Short' + field] = $scope.messages[key][i][field];
				if($scope.messages[key][i][field].length > shortLength){
					$scope.messages[key][i]['Short' + field] = $scope.messages[key][i][field].substr(0, shortLength - 3) + "...";
				}
				
				console.log("Result: " + $scope.messages[key][i]['Short' + field]);
			}
		}
		
		//Reset the messages being displayed to the correct messages
		$scope.resetCurrentMessages = function(){
			console.log("!! : " + $scope.messages);
			$scope.currentMessages = $scope.messages[$scope.messageType + $scope.messageProperty];
			console.log($scope.currentMessages);
		}
		
		//Selects a message which will be displayed in the modal
		$scope.selectMessage = function(message){
			$scope.selectedMessage = message;
			//Mark the message as read if it is unread
			if(message['IsRead'] == 0){
				$scope.editMessage(message, 'IsRead', 1);
			}
		}
		
		//Send composed message. 
		//Expects:
			//ReceiverUsername
			//SenderID
			//Subject
			//Content
			//Sent
		$scope.sendMessage = function(isSent){
			//Use lower case message type in the PUT URL
			var lowerMessageType = $scope.messageType.toLowerCase();
		
			//Mark whether or not the message is being sent
			$scope.composedMessage['Sent'] = isSent;
		
			//Either POST the message if being sent for the first time or PUT it if 
			//it is an edited draft being sent.
			if($scope.composedMessage['isDraft'] === true){
				putData.put(baseURL + 'messages/' + $scope.composedMessage['MessageID'], $scope.composedMessage);
			} else {
				postData.post(baseURL + 'messages/', $scope.composedMessage);
			}
		}
		
		//Set current message property ('Received', 'Deleted', 'Sent', or 'Drafts')
		$scope.setMessageProperty = function(input){
			$scope.messageProperty = input;
			$scope.updateDisplay();
			$scope.resetCurrentMessages();
		}
		
		//Set current message type ('Messages', 'Alerts', or 'Notifications')
		$scope.setMessageType = function(input){
			$scope.messageType = input;
			$scope.messageProperty = 'Received';
			$scope.updateDisplay();
			$scope.resetCurrentMessages();
		}
		
		//Display the Compose Message view in a modal
		$scope.showMessageComposition = function(){
			$scope.showComposeMessageBox = true;
		}
		
		//Control the display of elements on the page based on the current message type and message property
		$scope.updateDisplay = function(){
			//Default settings
			$scope.showAlertsTab = true;
			$scope.showNotificationsTab = true;
			$scope.showSentTab = false;
			$scope.showDraftsTab = false;
			$scope.showMarkAsRead = false;
			$scope.showMarkAsUnread = false;
			
			$scope.showFrom = true;
			$scope.showTo = false;
			$scope.showPatientInfo = true;

			$scope.showReply = false;
			$scope.showForward = false;
			$scope.showEdit = false;
			$scope.showRestore = false;
		
			//Adjust display based on Message Type
			switch($scope.messageType){
				case 'Messages':
					$scope.showSentTab = true;
					$scope.showDraftsTab = true;
					$scope.showPatientInfo = false;
					if($scope.messageProperty == "Received"){
						$scope.showReply = true;
					}
					if($scope.messageProperty == "Received" || $scope.messageProperty == "Sent"){
						$scope.showForward = true;
					}
					if($scope.messageProperty == "Deleted" || $scope.messageProperty == "Sent"){
						$scope.showTo = true;
					}
					break;
			}
			
			//Adjust display based on Message Property
			switch($scope.messageProperty){
				case 'Received':
					$scope.showMarkAsRead = true;
					$scope.showMarkAsUnread = true;
					break;
				case 'Deleted':
					$scope.showRestore = true;
					break;
				case 'Sent':
					$scope.showFrom = false;
					break;
				case 'Drafts':
					$scope.showFrom = false;
					$scope.showEdit = true;
					break;
			}
			
			//Adjust display based on user level
			if(userLevel > 10){
				$scope.showAlertsTab = false;
				$scope.showNotificationsTab = false;
			}
		}
		
		
		//Define onControllerLoad behavior
		//====================================================
		//If user is messaging someone, display the Compose Message screen
		var recipient = persistData.getMessageRecipient();
		if(recipient != -1){
			//Fill in the composed message's recipient
			$scope.composedMessage['ReceiverUsername'] =
				recipient['username'] + " <" + recipient['full_name'] + ">";
			
		} else { 		//Otherwise, display the Message Inbox
			$scope.messageType = 'Messages';		
			$scope.messageProperty = 'Received';
		}

		//Get all message data
		$scope.getAllMessages();
		
		//Load display control
		$scope.updateDisplay();
		
		//====================================================
	}
	
	//***********************************END MESSAGING CONTROLLER*****************************************// 
	
    //************************************LOGIN/LOGOUT CONTROLLERS****************************************//


    //Added by James/Mando/Anne 
    /**
     * @controller loginControl -
     *      DESCRIPTION OF CONTROLLER GOES HERE
     *
     * @variables -
     *      @*****
     *
     * @injections -
     *      $scope,$http,$window,persistData,getData, $location, userInfo,cookie
     *
     * @functions -
     *      @function **** -
     *      @param - NULL
     *      @returns - NULL
     *
     */
    controllers.loginControl = function($scope, $http, $window, persistData, getData, $location, userInfo, cookie, $cookieStore, $timeout) {

        $scope.userlogin = {};
        $scope.dataObj = {};
        $scope.loggedIn = false;
        $scope.invalidLogin = false;
        $scope.tokenTimeout = false;
        $scope.invalidToken = false;

        //Check if the user has a SessionID stored on their machine
        var cookieSessionID = $cookieStore.get('SessionID');
        //If SessionID is stored...
        if (cookieSessionID) {
            console.log("got cookie");
            //Check if this token is valid
            var userTokenURL = "http://aii-hermes.org/aii-api/v1/users/one/" + cookieSessionID;
            getData.get(userTokenURL).success(function(data) {
                //If SessionID is valid:
                //		-store user information
                //		-redirect to dashboard
                if (data.records['error'] != 'Token Timeout' && data.records['error'] != "Invalid Token") {
                    $scope.loggedIn = true;
                    
                    //Store the user information
                    var info = {};
                    info.SessionID = cookieSessionID;
                    info.UserID = data.records.UserID;
                    info.Username = data.records.username;
                    info.FacilityID = data.records.FacilityID;
                    info.First = data.records.first_name;
                    info.Last = data.records.last_name;
                    info.Title = data.records.Title;
                    $scope.name = data.records.first_name + " " + data.records.last_name;
                    $scope.title = $cookieStore.get('Title');
                    info.UserLevelID = data.records.UserLevelID;
                    $scope.userLevel = data.records.UserLevelID;
                    userInfo.set(info);

                    //Store the user level in the persistData factory
                    persistData.setUserLevel(info.UserLevelID);

                    //Redirect the user to the dashboard if they were going to the login page
                    if ($window.location.pathname == "#" || $window.location.pathname == "") {
                        $window.location.href = "#/dashboard";
                    }
                }
                //If SessionID is invalid, redirect to login page
                else {
                    console.log("Bad cookie! sending to login page")
                    $scope.loggedIn = false;
                    $cookieStore.remove('SessionID');
                    $cookieStore.remove('UserLevel');
                    if (data.records['error'] == 'Token Timeout') {
                        $cookieStore.put('BadToken', 'Token Timeout');
                    }
                    if (data.records['error'] == "Invalid Token") {
                        $cookieStore.put('BadToken', 'Invalid Token');
                    }
                    $window.location.href = "#";
                    location.reload();
                }
            });
        }
        //If no stored SessionID, redirect to login page
        else {
            $scope.loggedIn = false;
            if ($cookieStore.get('BadToken') == "Token Timeout") {
                $scope.tokenTimeout = true;
            }
            if ($cookieStore.get('BadToken') == "Invalid Token") {
                $scope.invalidToken = true;
            }
        }

        //Login form submit function ( in login.html)
        $scope.submit = function() {

            $cookieStore.remove('BadToken');
            $scope.tokenTimeout = false;
            $scope.invalidToken = false;

            $http({
                    method: 'POST',
                    url: 'http://aii-hermes.org/aii-api/v1/sessionLogs',
                    data: $scope.userlogin,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(data) {
                    if (data.data.records.SessionID) {
                        $scope.sessionID = data.data.records.SessionID;
                        persistData.setLoggedIn(true);
                        userInfo.set(data.data.records);
                        $scope.name = data.data.records.First + " " + data.data.records.Last;
                        $scope.title = data.data.records.Title;
                        $cookieStore.put('Title', $scope.title);
                        $scope.userLevel = data.data.records.UserLevelID;
                        $scope.loggedIn = true;
                        $window.location.href = "#/dashboard";

                    } else {
                        $window.location = "#/";
                        $scope.invalidLogin = true;
                        $scope.userlogin.username = "";
                        $scope.userlogin.password = "";
                        $timeout(function() {
                            $scope.invalidLogin = false;
                        }, 2000);


                    }
                });
        }

        $scope.logout = function() {
			
			//Delete the token in the database
			var sessionID = userInfo.get().SessionID;
            $http({
                    method: "DELETE",
                    url: "http://aii-hermes.org/aii-api/v1/sessionLogs/" + sessionID,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(response) {
                    $scope.loggedIn = false;
                    $scope.userlogin.username = "";
                    $scope.userlogin.password = "";
                });

            //Remove all information from the cookie
            $cookieStore.remove('SessionID');
            $cookieStore.remove('UserLevel');
            $cookieStore.remove('CareTeamID');
            $cookieStore.remove('FacilityName');
            $cookieStore.remove('PhaseID');
            $cookieStore.remove('PhaseName');
            $cookieStore.remove('PatientName');
            $cookieStore.remove('PatientID');
            $cookieStore.remove('dirAnchor');
            $cookieStore.remove('PatientID');
            $cookieStore.remove('PatientSex');
            $cookieStore.remove('Title');
			
			//Remove all information from userInfo
			var info = {};
			info.SessionID = 0;
			info.UserID = 0;
			info.Username = "";
			info.FacilityID = 0;
			info.First = "";
			info.Last = "";
			info.Title = "";
			$scope.name = "";
			$scope.title = "";
			info.UserLevelID = 0;
			$scope.userLevel = 0;
			userInfo.set(info);
        }
    }


    //**********************************END LOGIN/LOGOUT CONTROLLERS**************************************//



    //************************************MISCELLANEOUS CONTROLLERS***************************************//


    //Added by Anne
    
    controllers.facilitySettingsController = function($scope, persistData, getData, postData, putData, $http, $modal, $location, $cookieStore) {
        $scope.usStates = [
            { name: 'ALABAMA', abbreviation: 'AL'},
            { name: 'ALASKA', abbreviation: 'AK'},
            { name: 'ARIZONA', abbreviation: 'AZ'},
            { name: 'ARKANSAS', abbreviation: 'AR'},
            { name: 'CALIFORNIA', abbreviation: 'CA'},
            { name: 'COLORADO', abbreviation: 'CO'},
            { name: 'CONNECTICUT', abbreviation: 'CT'},
            { name: 'DELAWARE', abbreviation: 'DE'},
            { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
            { name: 'FLORIDA', abbreviation: 'FL'},
            { name: 'GEORGIA', abbreviation: 'GA'},
            { name: 'GUAM', abbreviation: 'GU'},
            { name: 'HAWAII', abbreviation: 'HI'},
            { name: 'IDAHO', abbreviation: 'ID'},
            { name: 'ILLINOIS', abbreviation: 'IL'},
            { name: 'INDIANA', abbreviation: 'IN'},
            { name: 'IOWA', abbreviation: 'IA'},
            { name: 'KANSAS', abbreviation: 'KS'},
            { name: 'KENTUCKY', abbreviation: 'KY'},
            { name: 'LOUISIANA', abbreviation: 'LA'},
            { name: 'MAINE', abbreviation: 'ME'},
            { name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
            { name: 'MARYLAND', abbreviation: 'MD'},
            { name: 'MASSACHUSETTS', abbreviation: 'MA'},
            { name: 'MICHIGAN', abbreviation: 'MI'},
            { name: 'MINNESOTA', abbreviation: 'MN'},
            { name: 'MISSISSIPPI', abbreviation: 'MS'},
            { name: 'MISSOURI', abbreviation: 'MO'},
            { name: 'MONTANA', abbreviation: 'MT'},
            { name: 'NEBRASKA', abbreviation: 'NE'},
            { name: 'NEVADA', abbreviation: 'NV'},
            { name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
            { name: 'NEW JERSEY', abbreviation: 'NJ'},
            { name: 'NEW MEXICO', abbreviation: 'NM'},
            { name: 'NEW YORK', abbreviation: 'NY'},
            { name: 'NORTH CAROLINA', abbreviation: 'NC'},
            { name: 'NORTH DAKOTA', abbreviation: 'ND'},
            { name: 'OHIO', abbreviation: 'OH'},
            { name: 'OKLAHOMA', abbreviation: 'OK'},
            { name: 'OREGON', abbreviation: 'OR'},
            { name: 'PALAU', abbreviation: 'PW'},
            { name: 'PENNSYLVANIA', abbreviation: 'PA'},
            { name: 'PUERTO RICO', abbreviation: 'PR'},
            { name: 'RHODE ISLAND', abbreviation: 'RI'},
            { name: 'SOUTH CAROLINA', abbreviation: 'SC'},
            { name: 'SOUTH DAKOTA', abbreviation: 'SD'},
            { name: 'TENNESSEE', abbreviation: 'TN'},
            { name: 'TEXAS', abbreviation: 'TX'},
            { name: 'UTAH', abbreviation: 'UT'},
            { name: 'VERMONT', abbreviation: 'VT'},
            { name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
            { name: 'VIRGINIA', abbreviation: 'VA'},
            { name: 'WASHINGTON', abbreviation: 'WA'},
            { name: 'WEST VIRGINIA', abbreviation: 'WV'},
            { name: 'WISCONSIN', abbreviation: 'WI'},
            { name: 'WYOMING', abbreviation: 'WY' }
        ];
        var SessionID = $cookieStore.get('SessionID');

        //**********API URL's***********************/
        $scope.facilityURL = "http://aii-hermes.org/aii-api/v1/facilities/" + SessionID; //returns user's facility info


        //Grab Facility info  using facilityURL
        getData.get($scope.facilityURL).success(function(data) {
            $scope.facilityData = data.records;
        });
        
        $scope.saveFacility = function(){
             putData.put($scope.facilityURL,$scope.facilityData).success(function(data) {
                if(data.records['Image Save Response']){
                    alert(data.records['Facility Edit Response'] + '\n' + data.records['Image Save Response'] );
                }else{
                    alert(data.records['Facility Edit Response']);
                }
            });
        }
    }
    //Added by James 
    /**
     * @controller composeMessage -
     *      Controller used to handle creation of new Messages
     *
     * @variables -
     *      @*****
     *
     * @injections -
     *      $scope, $http
     *
     * @functions -
     *      @function **** -
     *      @param - NULL
     *      @returns - NULL
     *
     */
    controllers.composeMessage = function($scope, $http) {

        $scope.composeObject = {};

        $scope.messageForm = function() {
            $http({
                    method: 'POST',
                    url: 'http://aii-hermes.org/aii-api/v1/messages',
                    data: $scope.composeObject, // do not put param
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .success(function(data) {
                    console.log(data);
                })
                .error(function() {
                    "Request failed";
                    $scope.status = status;
                });;
        }
    }

    /**
     * @controller ngBindHtmlCtrl -
     *      EXAMPLE FOR BINDING HTML CONTROLLER
     *
     * @variables -
     *      @*****
     *
     * @injections -
     *      $scope, $sce
     *
     * @functions -
     *      @function **** -
     *      @param - NULL
     *      @returns - NULL
     *
     */
    controllers.ngBindHtmlCtrl = function($scope, $sce) {
        $scope.myHTML =
            'I am an <code>HTML</code>string with <a href="#">links!</a> and other <em>stuff</em>';
        $scope.trustedHtml = $sce.trustAsHtml($scope.myHTML);
        $scope.textBox = $sce.trustAsHtml('<input  type="text" > </input>');
    };


    //Added by Sanan
    /**
     * @controller PatientPhaseCollapseCtrl -
     *      i think this controls the phase name collapses - anne
     *
     * @variables -
     *      @*****
     *
     * @injections -
     *      $scope
     *
     * @functions -
     *      @function **** -
     *      @param - NULL
     *      @returns - NULL
     *
     */
    controllers.PatientPhaseCollapseCtrl = function($scope) {
        $scope.isCollapsed = false;
        $scope.editPatient = false;
    }


    //Added by Anne 
    /**
     * @controller BadgeCtrl -
     *      Allows the unread message number to be shown in nav bar
     *
     * @variables -
     *      @*****
     *
     * @injections -
     *      $scope, persistData, getData, userInfo
     *
     * @functions -
     *      @function **** -
     *      @param - NULL
     *      @returns - NULL
     *
     */
    controllers.BadgeCtrl = function($scope, persistData, getData, userInfo, messageCount) {

        $scope.sessionID = userInfo.get().SessionID;
        $scope.unreadMessageURL = "http://aii-hermes.org/aii-api/v1/users/unreadMessagesCount/" + $scope.sessionID;
        
        
        
        getData.get($scope.unreadMessageURL).success(function(data) {
            $scope.messageCount = data.records.totalUnreadCount;
            $scope.icon = {
                "count": $scope.messageCount
            };
        });
        
        $scope.$on('handleBroadcast', function() {
            $scope.icon.count = messageCount.number;
        });

        $scope.clear = function() {
            console.log("clearing badge");
            $scope.icon.count = 0;
        }
    };


    //App used to hold all controller contained within aiiController
    myApp.controller(controllers);

})();