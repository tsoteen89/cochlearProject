(function(){

var myApp = angular.module('aiiController', ['ui.bootstrap','ngCookies']);

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
myApp.factory('cookie', function($cookies){
        return{
            set:function(name,value){
                if (typeof name === 'object'){  //If it's an object, loop through and set em all
                    for (var key in name) {
                        console.log(key);
                        if (name.hasOwnProperty(key)) {
                            $cookies[key] = name[key];
                        }
                    }
                }else{
                    $cookies[name] = value;     //Single key value, set the one.
                }
                return;
            },
            get: function(name){
                if(!(name in $cookies))         //If it doesn't exist, return null
                    return null;                
                else
                    return $cookies[name];
            },
            remove: function(name){             //If it doesn't exits, don't try
                if(!(name in $cookies))         //to delete it.
                    return null;
                else{
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
myApp.factory('userInfo', function($cookieStore, $window){
    //User Info
	var SessionID = $cookieStore.get('SessionID');
	var UserLevelID = $cookieStore.get('UserLevel');
    var UserID;
    var Username;
    var FacilityID;
    var Name;
    var Title;
	
    return{
        set:function (info) {
			//Set the persistent user info
			SessionID = info.SessionID;
            UserID= info.UserID;
            Username= info.Username;
            FacilityID= info.FacilityID;
            Name = info.First + " " + info.Last;
            Title = info.Title;
            UserLevelID = info.UserLevelID;
			
			//Set the SessionID and UserLevel to persist in the cookie
			$cookieStore.put('SessionID', SessionID);
			$cookieStore.put('UserLevel', UserLevelID);
			
            return;
        },
        get: function(){
			return {SessionID: SessionID, UserLevelID: UserLevelID, UserID: UserID, Username: Username, FacilityID: FacilityID, Name: Name, Title: Title};
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
myApp.factory('getData', function($http, $window, $location, $cookieStore){
    
    return {
        get: function(url) { 
			var data = $http.get(url).success(function(data) {
				if(typeof data.records['error'] != 'undefined'){
					if(data.records['error'] == "Token Timeout" || data.records['error'] == "Invalid Token"){
						$cookieStore.remove('SessionID');
						$cookieStore.remove('UserLevel');
                        if(data.records['error'] == 'Token Timeout'){
                            $cookieStore.put('BadToken','Token Timeout');
                        }
                        if(data.records['error'] == "Invalid Token"){
                            $cookieStore.put('BadToken','Invalid Token');
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
myApp.factory('postData', function($http){
    
    return {
        post: function(path, object) {
            return $http({
                method  : 'POST',
                url     : path,
                data    : object,
                headers : { 'Content-Type': 'application/json' } 
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
myApp.factory('putData', function($http){
    
    return {
        put: function(path, object) {
            return $http({
                method  : 'PUT',
                url     : path,
                data    : object,
                headers : { 'Content-Type': 'application/json' } 
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
myApp.factory('persistData', function ($cookieStore) {
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
        setPatientID:function(data){
            PatientID = data;
            $cookieStore.put('PatientID', PatientID);
        },
        setCareTeamID:function (data) {
            CareTeamID = data;
            $cookieStore.put('CareTeamID', CareTeamID);
            console.log(data);
            
        },
        setPhaseID: function (data) {
            PhaseID = data;
            $cookieStore.put('PhaseID', PhaseID);

            console.log(data);
        },
        setPhaseName: function (data) {
            PhaseName = data;
            $cookieStore.put('PhaseName', PhaseName);
            console.log(data);
        },
        setPatientName:function(data){
            PatientName = data;
            $cookieStore.put('PatientName', PatientName);
            console.log(data);
        },
        getPatientName:function(data){
            return PatientName;
        },
        getCareTeamID:function () {
            return CareTeamID;
        },
        getPhaseID: function (data) {
            return PhaseID;
        },
        getPhaseName:function () {
            return PhaseName;
        },
        setLoggedIn: function (data) {
            loggedIn = data;
            console.log(loggedIn);
        },
        getLoggedIn: function() {
            console.log(loggedIn);
            return loggedIn;
        },
        setDirAnchor: function(data){
            dirAnchor=  data;
            $cookieStore.put('dirAnchor', dirAnchor);
            console.log(dirAnchor);
        },
        getDirAnchor: function(data){
            return dirAnchor;
        },
        setUserLevel: function(data){
            userLevel = data;
        },
        getUserLevel: function(data){
            return userLevel;
        },
		setMessageRecipient: function(data){
            messageRecipient = data;
        },
        getMessageRecipient: function(data){
            return messageRecipient;
        }
    };
});
//Factory to allow messaging controller to talk to badge controller and update unread count
myApp.factory('messageCount', function($rootScope){
    var count = {};
    
    count.prepForBroadcast = function(cnt){
        count.number = cnt;
        this.broadcastCount();
    };
    
    count.broadcastCount = function(){
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
controllers.dashboardController = function($scope, persistData, getData, postData, putData, $http, $modal, $window, userInfo, $timeout, $cookieStore){
    
	$scope.userLevel = userInfo.get().UserLevelID;
    $scope.userFacilityID = userInfo.get().FacilityID;
    $scope.sessionID = userInfo.get().SessionID;
    
    //**********API URL's***********************/
    $scope.facilityURL = "http://killzombieswith.us/aii-api/v1/facilities/" + $scope.sessionID;
    $scope.baseFacilityURL = "http://killzombieswith.us/aii-api/v1/facilities/";
    
    //Grab Facility info  using facilityURL
    getData.get($scope.facilityURL).success(function(data) {
        $scope.facData = data;
        $cookieStore.put('FacilityName', $scope.facData.records.Name);
        $cookieStore.put('FacilityImage', $scope.facData.records.FacilityImage);
    });
    
    
    //Grab All AII Facilities 
    getData.get($scope.baseFacilityURL + "getAll/" + $scope.sessionID).success(function(data) {
        $scope.allFacs = data;
    });
    
    //Grab Facilities Users
    getData.get("http://killzombieswith.us/aii-api/v1/facilities/users/" + $scope.sessionID).success(function(data) {
        $scope.facUsers = data;
		for(i = 0; i < data.records.length; i++){
			if(data.records[i].Level == 'Coordinator'){
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
	$scope.sendMessageToUser = function(user){
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
    $scope.addUser= function(){
        var ModalInstanceCtrl = function ($scope, $modalInstance, postData) {
            
			$scope.sessionID = userInfo.get().SessionID;
            $scope.addUser = {};
			
			//Grab the user titles
			getData.get('http://killzombieswith.us/aii-api/v1/userTitles').success(function(data){
			   $scope.userTitles = data.records;
		   }); 
			
            //Send invitation to the potential user
			$scope.sendInvitation = function() {
				$scope.inviteUserURL = "http://killzombieswith.us/aii-api/v1/userInvites/" + $scope.sessionID;
				postData.post($scope.inviteUserURL, $scope.addUser);
				$modalInstance.close();
			}
			
            $scope.ok = function () {
                $modalInstance.close();
            };

        };
        
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
    $scope.inviteNewFacility= function(){
        var ModalInstanceCtrl = function ($scope, $modalInstance) {
            $scope.userFacilityID = userInfo.get().FacilityID;
			$scope.sessionID = userInfo.get().SessionID;
            
            $scope.patientURL = "http://killzombieswith.us/aii-api/v1/facilities/patients/" + $scope.sessionID;
            //Grab all Patients using patientURL 
            getData.get($scope.patientURL).success(function(data) {
                //set name to concatenate first and last name so we can filter search on entire name
                for(var i = 0; i < data.records.length; i++){
					data.records[i].Name = data.records[i].First + " " + data.records[i].Last;
				}
                $scope.patientsData = data;
            })
            
            //Set selectedPatient to the selected patient
            //Used to show name on card right now- ****Need to implement add facility to patients provider list if the accept email request.***
            $scope.selectPatient = function (patient) {
				$scope.selectedPatient = patient;
			};
            
            $scope.ok = function () {
                $modalInstance.close();
            };

        };
        
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
    $scope.getFacCard = function(fac){
            
        var ModalInstanceCtrl = function ($scope, $modalInstance, fac) {
			$scope.userFacilityID = userInfo.get().FacilityID;
			$scope.sessionID = userInfo.get().SessionID;
            
            //get the specific facility's information
            getData.get("http://killzombieswith.us/aii-api/v1/facilities/" + fac.FacilityID + '/' + $scope.sessionID).success(function(data){
                $scope.facCard = data;
            });
            
            //get the specific facility's users
            getData.get("http://killzombieswith.us/aii-api/v1/facilities/"+ fac.FacilityID + '/users/' + $scope.sessionID).success(function(data) {
                $scope.facCardUsers = data;
				for(i = 0; i < data.records.length; i++){
					if(data.records[i].Level == 'Coordinator'){
						$scope.facilityAdmin = data.records[i];
						i = data.records.length;
					}
				}
            });     
            
            //get the all the patients for YOUR (user who's logged in) facility and exclude any patients the clicked facility already has
            getData.get("http://killzombieswith.us/aii-api/v1/facilities/patients/excludingExisting/"+ fac.FacilityID + '/' + $scope.sessionID).success(function(data) {
                
                for(var i = 0; i < data.records.length; i++){
					data.records[i].Name = data.records[i].First + " " + data.records[i].Last;
				}
                $scope.facCardNonPatients = data.records;
            });   
            
			$scope.displayInfo = true;
			$scope.selectedPatient = [];
			$scope.hideSendInvitationButton = true;
			$scope.sendButtonText = "Send Invitation";
			if(fac.FacilityID == $scope.userFacilityID){
				$scope.hideInviteButton = true;
			}
			else{
				$scope.hideInviteButton = false;
			}
			
			//When a user is clicked on, redirect to the messages page to send
			//a new message to this user.
			$scope.sendMessageToUser = function(user){
				persistData.setMessageRecipient(user);
			}
			
            //Choose to show either facility card or invite facility to patient's care team
			$scope.setDisplayInfo = function (showInfo) {
				$scope.displayInfo = showInfo;
			};
			
            //Set selectedPatient to the selected patient, and allow send invitiation button to be enabled
			$scope.selectPatient = function (patient) {
				$scope.selectedPatient = patient;
				$scope.hideSendInvitationButton = false;
				$scope.sendButtonText = "Send Invitation";
			};

			$scope.sendInvite = function () {
				$scope.hideSendInvitationButton = true;
				//If a patient has been selected...
				//if($scope.selectedPatient){				
					//Post a Notification inviting the facility to the care team
					$scope.postNotification = {};
					$scope.postNotification.PatientID = $scope.selectedPatient.PatientID;
					$scope.postNotification.SenderFacilityID = $scope.userFacilityID;
					$scope.postNotification.ReceiverFacilityID = fac.FacilityID;
					
					$scope.postNotificationURL = "http://killzombieswith.us/aii-api/v1/notifications/";
					postData.post($scope.postNotificationURL, $scope.postNotification).success(function(data) {
						$scope.sendButtonText = "Invitation Sent!";
					});
					$scope.sendButtonText = "Sending...";
					
				//}
			};
			
            $scope.ok = function () {
                $modalInstance.close();
            };

        };
        
        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: ModalInstanceCtrl,
          size: 'md',
          resolve: {
            fac: function () {
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
	$scope.getContactCard = function (contactType) {
		
		var ModalInstanceCtrl = function ($scope, $modalInstance, contactType, postData) {
			
			$scope.userID = userInfo.get().userID;
			
			$scope.message = [];
			$scope.message['userID'] = $scope.userID;
		
			if(contactType == 'report'){
				$scope.isProblemReport = true;
				$scope.isSuggestion = false;
				$scope.isContactAdmin = false;
			}
			else if(contactType == 'suggest'){
				$scope.isProblemReport = false;
				$scope.isSuggestion = true;
				$scope.isContactAdmin = false;
			}
			else if(contactType == 'contactAdmin'){
				$scope.isProblemReport = false;
				$scope.isSuggestion = false;
				$scope.isContactAdmin = true;
			}

			$scope.sendMessage = function () {
				
				//POST a ContactUs message to the API
				if($scope.isProblemReport){
					$scope.message.IsReport = true;
				}
				else{
					$scope.message.IsReport = false;
				}
				postData.post("http://killzombieswith.us/aii-api/v1/adminAlerts/", $scope.message);
				
				$modalInstance.close();
			}
			
            $scope.ok = function () {
                $modalInstance.close();
            };
        };
        
        var modalInstance = $modal.open({
          templateUrl: 'contactUs.html',
          controller: ModalInstanceCtrl,
          size: 'md',
          resolve: {
            contactType: function () {
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
controllers.questionsController = function($scope, persistData, getData, postData, putData, $http, $modal, $location, $cookieStore){
    
    //get the SessionID stored
	var cookieSessionID = $cookieStore.get('SessionID');
    $scope.patientInactiveStatus = $cookieStore.get('PatientInactiveStatus');
    $scope.limit = 5;
    $scope.offSet = 0;
    $scope.limitArray = new Array();
    $scope.n = 0;
    $scope.finished = false;
    
    $scope.answer = {};
    $scope.answer.Answers = {};
    $scope.answer.PhaseID = $cookieStore.get('PhaseID');
    $scope.answer.CareTeamID = $cookieStore.get('CareTeamID');
    $scope.phaseName=$cookieStore.get('PhaseName');
    $scope.patientName= $cookieStore.get('PatientName');
    $scope.patientSex = $cookieStore.get('PatientSex');
    $scope.patientDOB = $cookieStore.get('PatientDOB');
    $scope.facilityName = $cookieStore.get('FacilityName');
    $scope.facilityImage = $cookieStore.get('FacilityImage');
    $scope.questionsURL = "http://killzombieswith.us/aii-api/v1/phases/" + $scope.answer.PhaseID + "/questions";
    $scope.initialQuestionsURL = $scope.questionsURL + "&offset=" + $scope.offSet + "&limit="+ $scope.limit;
    $scope.patientSummaryAnswers = {};
    $scope.patientSummaryAnswersURL = "http://killzombieswith.us/aii-api/v1/careTeams/" + $scope.answer.CareTeamID + "/phaseAnswers/" + $scope.answer.PhaseID;
    $scope.dirAnchor = $cookieStore.get('dirAnchor');
    $scope.clickedPhase = null;
    
    $scope.isArray = function(check){
        return angular.isArray(check);
    }
    
    $scope.isObject = function(check){
        return angular.isObject(check);
    }

    getData.get("http://killzombieswith.us/aii-api/v1/careTeams/" + $cookieStore.get('CareTeamID') + "/phaseAnswers/" +$cookieStore.get('PhaseID')).success(function(data) {
            $scope.audioSummaryAnswers = data.records.DetailedAnswers;
            //console.log("first" + $scope.audioSummaryAnswers);
    });
    
    $scope.getMaxNumOfTest = function(resultSet){
        $scope.max =2;
        for(var key in resultSet){
            if(resultSet[key].length+1 > $scope.max){
                $scope.max = resultSet[key].length +1;
            }
        
      }
        
    }
    //Grab all previously answered questions
    getData.get($scope.patientSummaryAnswersURL).success(function(data) {
        $scope.patientSummaryAnswers = data.records;            
    }).then(function(){
        for(var answerID in $scope.patientSummaryAnswers.Answers) {
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
        for($scope.n = 0;$scope.n < data.records.length;$scope.n++){
            $scope.childNumber += data.records[$scope.n].Children.length;
            if(data.records[$scope.n].IsChild == 0){
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
            for($scope.n = 0;$scope.n < data.records.length;$scope.n++){
                $scope.childNumber += data.records[$scope.n].Children.length;
                if(data.records[$scope.n].IsChild == 0){
                    $scope.parentNumber += 1;
                }
            }
            
        //Set the final sorted data equal to a final HTTP request
        }).then(function() {
            $scope.limit = $scope.childNumber + $scope.parentNumber;
            $scope.finalQuestionsURL = $scope.questionsURL + "&offset=" + $scope.offSet + "&limit="+ $scope.limit;
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
        if(angular.isArray($scope.singleAnswer.Answers[questionID])){
            for (var key in $scope.singleAnswer.Answers[questionID]) {
                if ($scope.singleAnswer.Answers[questionID][key] == 'Not Answered') {
                    $scope.singleAnswer.Answers[questionID].splice(key, 1);
                }
            }
        }
        postData.post('http://killzombieswith.us/aii-api/v1/answers/' + cookieSessionID ,$scope.singleAnswer);

    };
    
    $scope.postDateAnswers = function(questionID) {
        
        $scope.singleAnswer = {};
        $scope.singleAnswer.Answers = {};
        $scope.singleAnswer.PhaseID = $scope.answer.PhaseID;
        $scope.singleAnswer.CareTeamID = $cookieStore.get('CareTeamID');
        $scope.singleAnswer.Answers[questionID] = $scope.answer.Answers[questionID].toISOString().slice(0,10);
        postData.post('http://killzombieswith.us/aii-api/v1/answers/' + cookieSessionID,$scope.singleAnswer);

    };
    
    $scope.surgery = {"Date": null, "Other": null,"Side?":null, "Type of Surgery?": null, "CareTeamID" : $cookieStore.get('CareTeamID')};
    //Post a surgery History. 
    $scope.postSurgery = function() {
        $scope.answer.Answers[85] = " "; // need to initialize this answer in answers object,
                                        //so upon "Next page", "Not answered" isn't saved and break the api
        //initialize surgery object
        //user will fill in date, other(if necessary), side, and type via ng-model
        
        postData.post('http://killzombieswith.us/aii-api/v1/surgeryHistory',$scope.surgery);
    };

    //Clear surgeryHistory object so user can add another history
    $scope.clearSurgeryHistory = function(){
        this.surgery["Date"] = null;
        this.surgery["Other"] = null;
        this.surgery["Type of Surgery?"] = null;
        this.surgery["Side?"] = null;
    }
    
    //Display the next set of questions for a phase
    $scope.nextPage = function(){
        
        //If questions on the previous page lack an answer, save an answer for that question with "Not Answered" as the text
        for (question in this.finalQuestions) {
            console.log(question);
            if(this.answer.Answers[this.finalQuestions[question].QuestionID] == null){
                this.answer.Answers[this.finalQuestions[question].QuestionID] = "Not Answered";
                $scope.postAnswers(this.finalQuestions[question].QuestionID);
            }
        };
        
        
        $scope.limitArray.push($scope.limit);
        $scope.offSet += $scope.limit;
        $scope.initialQuestionsURL = $scope.questionsURL + "&offset=" + $scope.offSet + "&limit=5";
        
        //Set finished bool when all questions have been listed
        if(($scope.offSet + $scope.limit) >= $scope.numberOfQuestions){
            $scope.finished = true;
        }
        
        //Grab Initial Batch of Questions
        getData.get($scope.initialQuestionsURL).success(function(data) {
            $scope.childNumber = 0;
            $scope.parentNumber = 0;
            
            //Go through initial batch of Questions to find Children of Parents
            for($scope.n = 0;$scope.n < data.records.length;$scope.n++){
                $scope.childNumber += data.records[$scope.n].Children.length;
                if(data.records[$scope.n].IsChild == 0){
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
                for($scope.n = 0;$scope.n < data.records.length;$scope.n++){
                    $scope.childNumber += data.records[$scope.n].Children.length;
                    if(data.records[$scope.n].IsChild == 0){
                        $scope.parentNumber += 1;
                    }
                }
                
            //Set the final sorted data equal to a final HTTP request
            }).then(function() {
                $scope.limit = $scope.childNumber + $scope.parentNumber;
                $scope.finalQuestionsURL = $scope.questionsURL + "&offset=" + $scope.offSet + "&limit="+ $scope.limit;
                getData.get($scope.finalQuestionsURL).success(function(data4) {
                    $scope.finalQuestions = data4.records;
                });
            });
        });
    }
    
    
    //function used to display questions from previous pages
    $scope.previousPage = function() {
        $scope.finished = false;
        $scope.limit = $scope.limitArray.pop();
        $scope.offSet = $scope.offSet - $scope.limit;
        
        $scope.finalQuestionsURL = $scope.questionsURL + "&offset=" + $scope.offSet + "&limit="+ $scope.limit;
        
        getData.get($scope.finalQuestionsURL).success(function(data4) {
            $scope.finalQuestions = data4.records;
        });
    }
    
    
    $scope.checkboxTrigger = function(data){
        var other = false;
        
        for(var i=0;i<data.length;i++){
            if(data[i] == 'Other'){
                other = true;
            }
        }
        return other;
    }
    
    
    //Show a child if Trigger has been set
    $scope.showChild = function(data){
        var index;
        var indexB;
        
        for(index=0; index < data.length; index++) {
            for(indexB=0; indexB < $scope.finalQuestions.length; indexB++) {
                if($scope.finalQuestions[indexB].QuestionID == data[index]) {
                    $scope.finalQuestions[indexB].IsChild = 0;
                }
            }
        }
    }

    //Hide a child if the Trigger has been reset
    $scope.hideChild = function(data){
        var index;
        var indexB;
        
        for(index=0; index < data.length; index++) {
            for(indexB=0; indexB < $scope.finalQuestions.length; indexB++) {
                if($scope.finalQuestions[indexB].QuestionID == data[index]) {
                    $scope.finalQuestions[indexB].IsChild = 1;
                }
            }
        }
    }
    
    //Progresses the CareTeam phase to the Next Phase
    $scope.completePhase = function(){
        
        //if on phase 1, skip phase number to 3(phase2 and 3 are active at same time, handled in the phase dots in patient directory)
        if($scope.answer.PhaseID=="1"){
            $scope.nextPhase = (parseInt($scope.answer.PhaseID) + 2);
        }
        //might not be used (nobody should have a current phase of 2 technically
        else if($scope.answer.PhaseID=='2'){
            $location.path('patientDirectory');
            return;
        }
        else{
            $scope.nextPhase = (parseInt($scope.answer.PhaseID) + 1);
        }
        
        //Update Current phase number in database
        if($scope.answer.PhaseID != '2' && $scope.answer.PhaseID != '11'){
            $scope.newPhase = {"CurrentPhaseID":$scope.nextPhase};
            // Post the changed currentPhaseID here
            putData.put('http://killzombieswith.us/aii-api/v1/careTeams/' + $scope.answer.CareTeamID,$scope.newPhase).then(function(){
                $location.path('patientDirectory')
            });

        }

    }
    
    $scope.completeCare = function(){
        var patID = $cookieStore.get('PatientID');
        var updateToInactive = {'InactiveStatus': 60}
        putData.put('http://killzombieswith.us/aii-api/v1/patients/' + patID, updateToInactive);
        //Update Current phase number in database
       
        $scope.newPhase = {"CurrentPhaseID":12};
        // Post the changed currentPhaseID here
        putData.put('http://killzombieswith.us/aii-api/v1/careTeams/' + $scope.answer.CareTeamID,$scope.newPhase).then(function(){
            $location.path('patientDirectory')
        });

    }
    
    $scope.patientSummary = function(phaseNumber){
        this.clickedPhase = phaseNumber;
        
        if(phaseNumber == 2 || phaseNumber > 6){
        
            getData.get("http://killzombieswith.us/aii-api/v1/careTeams/" + $cookieStore.get('CareTeamID') + "/phaseAnswers/" +$cookieStore.get('CareTeamID')).success(function(data) {
                    $scope.patientSummaryAnswers = data.records.DetailedAnswers;
                    console.log("first" + $scope.audioSummaryAnswers);
            });
        }
        
        if(phaseNumber == 1 || phaseNumber > 2 && phaseNumber < 7){
            $scope.patientSummaryAnswersURL = "http://killzombieswith.us/aii-api/v1/careTeams/" + $cookieStore.get('CareTeamID') + "/phaseAnswers/" + phaseNumber; 

            getData.get($scope.patientSummaryAnswersURL).success(function(data) {
                $scope.patientSummaryAnswers = data.records;          
            });
        }
        
        if(phaseNumber == 0)
        {
            $scope.patientSummaryAnswers = "";
        }
        
    }
    
    
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
    $scope.getDataSummary = function(){
    
        var ModalInstanceCtrl = function ($scope, $modalInstance) {
            
            getData.get("http://killzombieswith.us/aii-api/v1/careTeams/" + $cookieStore.get('CareTeamID') + "/phaseAnswers/" +$cookieStore.get('PhaseID')).success(function(data) {
                $scope.patientSummaryAnswers = data.records;
            });
            $scope.ok = function () {
                $modalInstance.close();
            };
            
        };

        var modalInstance = $modal.open({
          templateUrl: 'dataSummary.html',
          controller: ModalInstanceCtrl,
          size: 'lg'


        });
    }
    
    $scope.PrintContent = function(){
        
        var DocumentContainer = document.getElementById('divtoprint');
        var WindowObject = window.open("", "PrintWindow",
        "width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
        WindowObject.document.writeln(DocumentContainer.innerHTML);
        WindowObject.document.close();
        WindowObject.focus();
        WindowObject.print();
        WindowObject.close();
        
    }
    
    $scope.export = function(){
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
controllers.audioQuestionsController = function($scope, persistData, getData, postData, putData, $http, $modal, $location, $route,$timeout, $anchorScroll, $cookieStore){
    
    //get the SessionID stored
	var cookieSessionID = $cookieStore.get('SessionID');
    
    $scope.patientName= $cookieStore.get('PatientName');
    $scope.patientSex = $cookieStore.get('PatientSex');
    $scope.patientDOB = $cookieStore.get('PatientDOB');
    $scope.facilityName = $cookieStore.get('FacilityName');
    $scope.facilityImage = $cookieStore.get('FacilityImage');
    $scope.dirAnchor = $cookieStore.get('dirAnchor');
    $scope.phaseID = $cookieStore.get('PhaseID');
    //Get Audiology Phase fields and test 
    $scope.questionsURL = "http://killzombieswith.us/aii-api/v1/phases/" + $cookieStore.get('PhaseID') + "/questions";
    getData.get($scope.questionsURL).success(function(data) {
        $scope.audioQuestions = data.records;
        $scope.audioQs = data.records.Questions;
    });
    
    $scope.three = "3";
    $scope.isObject = function(check){
        return angular.isObject(check);
    }
    $scope.loggedIn = persistData.getLoggedIn();
    $scope.phaseName= $cookieStore.get('PhaseName');
    
    //Conditions object, will hold left and right ear conditions that are set
    $scope.conditions = {};
    
    $scope.answer = {};
    $scope.answer.PhaseID = $cookieStore.get('PhaseID');
    $scope.answer.CareTeamID = $cookieStore.get('CareTeamID');
    $scope.answer.Answers = {};
    
    //Must initialize, so ng-model recognizes objects to store the fields of each test
    $scope.answer.Results = { 
        //"Aided Audiogram" : {"Pure Tone Average": {}, "Speech Reception Threshold": {}, "Speech Discrimination Score" : {}},
        "AzBio": {}, 
        "CNC": {}, 
        "BKB-SIN": {}};

    
    $scope.answersURL = "http://killzombieswith.us/aii-api/v1/careTeams/" + $scope.answer.CareTeamID + "/phaseAnswers/" + $scope.answer.    PhaseID;
    
    //**********************Copied from questionsControllerr****/

    //Grab all previously answered questions
    getData.get($scope.answersURL).success(function(data) {
        $scope.summaryAnswers = data.records;            
    }).then(function(){
        for(var answerID in $scope.summaryAnswers.Answers) {
            $scope.answer.Answers[answerID] = $scope.summaryAnswers.Answers[answerID].Answers;
        };
    });
    
    $scope.isArray = function(check){
        return angular.isArray(check);
    }
    
    $scope.checkboxTrigger = function(data){
        var other = false;
        
        for(var i=0;i<data.length;i++){
            if(data[i] == 'Other'){
                other = true;
            }
        }
        return other;
    }
    //Show a child if Trigger has been set
    $scope.showChild = function(data){
        var index;
        var indexB;

        for(index=0; index < data.length; index++) {
            for(indexB=0; indexB < $scope.audioQs.length; indexB++) {
                if($scope.audioQs[indexB].QuestionID == data[index]) {
                    $scope.audioQs[indexB].IsChild = 0;
                }
            }
        }
    }

    //Hide a child if the Trigger has been reset
    $scope.hideChild = function(data){
        var index;
        var indexB;

        for(index=0; index < data.length; index++) {
            for(indexB=0; indexB < $scope.audioQs.length; indexB++) {
                if($scope.audioQs[indexB].QuestionID == data[index]) {
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
        postData.post('http://killzombieswith.us/aii-api/v1/answers/' + cookieSessionID,$scope.singleAnswer);

    };
    //**********************Copied from questionsControllerr****/
    
    
    //Submit a complete audio test result.
    $scope.submitQuestions = function(test){
        console.log("Submit Questions Called");
        $scope.singleAnswer = {};
        $scope.singleAnswer.PhaseID = $scope.answer.PhaseID;
        $scope.singleAnswer.CareTeamID = $scope.answer.CareTeamID
        $scope.singleAnswer.Results = {};
        $scope.singleAnswer.Results[test]= $scope.answer.Results[test];
        $scope.singleAnswer.ConditionsID =$scope.answer.ConditionsID;
        
        postData.post('http://killzombieswith.us/aii-api/v1/audioTestResults/'+ cookieSessionID ,$scope.singleAnswer).then(function(){
            //Grab all previously answered questions
            getData.get($scope.answersURL).success(function(data) {
                $scope.summaryAnswers = data.records;            
            }).then(function(){
                for(var answerID in $scope.summaryAnswers.Answers) {
                    $scope.answer.Answers[answerID] = $scope.summaryAnswers.Answers[answerID].Answers;
                };
            })
        });
    }
    
    //was used to get previous answers at one point....
    $scope.updateResults = function(){
        console.log("updateResults Called");
        //$scope.buildResultsURL();
        $scope.getConditionsID();
        /*
        getData.get($scope.resultsURL).success(function(data) {
            $scope.results = data.records;
        });
        */
    }
    
    //uses $scope.conditions object info to find ID of the two conditions set for the ears
    $scope.getConditionsID = function(){
        console.log("getConditionsID Called");
        getData.get("http://killzombieswith.us/aii-api/v1/audioConditions/left/"+ this.conditions.Left +"/right/" + this.conditions.Right).success(function(data) {
            $scope.answer.ConditionsID = data.records.ConditionsID;
        });
    }
    
    //clears conditions set and any tests and results in the form so a new set up can be entereed
    $scope.setNewCondition = function(){
        $scope.conditions = {};
        /*$scope.answer.Results["Aided Audiogram"]["Pure Tone Average"] = {};
        $scope.answer.Results["Aided Audiogram"]["Speech Reception Threshold"] = {};
        $scope.answer.Results["Aided Audiogram"]["Speech Discrimination Score"] = {};
        */
        $scope.answer.Results["AzBio"] = {};
        $scope.answer.Results["CNC"] = {};
        $scope.wordswith3=0;
        $scope.phonemes=0;
        $scope.answer.Results["BKB-SIN"] = {};
        $scope.answer.tests =null;
        $scope.answer.ConditionsID = "";
    }
    
    //clears ONE test (or in case of aided audiogram (3 tests), so more results can be entered under the same ear conditions
    $scope.clearCurrentTest = function(data){
        console.log("clearCurrentTest Called");
        console.log(data);
        if(data == "Aided Audiogram"){
            $scope.answer.Results["Aided Audiogram"]["Pure Tone Average"] = {};
            $scope.answer.Results["Aided Audiogram"]["Speech Reception Threshold"] = {};
            $scope.answer.Results["Aided Audiogram"]["Speech Discrimination Score"] = {};
        }
        else if(data == 'AzBio'){
            $scope.answer.Results["AzBio"] = {};
        }
        else if(data == 'CNC'){
            $scope.answer.Results["CNC"] = {};
            $scope.wordswith3=0;
            $scope.phonemes=0;
        }
        else if(data == 'BKB-SIN'){
            $scope.answer.Results["BKB-SIN"] = {};
        }
        
        
    }
    
    $scope.notSorted = function(obj){
        if (!obj) {
            return [];
        }
        
        var X = Object.keys(obj);
        
        X.pop();
        
        return X;
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
    $scope.getDataSummary = function(patientSummaryAnswers){
        var ModalInstanceCtrl = function ($scope, $modalInstance) {
            getData.get("http://killzombieswith.us/aii-api/v1/careTeams/" + $cookieStore.get('CareTeamID')+ "/phaseAnswers/" +$cookieStore.get('PhaseID')).success(function(data) {
                $scope.patientSummaryAnswers = data.records.DetailedAnswers;
            });
            $scope.ok = function () {
                $modalInstance.close();
                
            };
            
        };

        var modalInstance = $modal.open({
          templateUrl: 'dataSummary.html',
          controller: ModalInstanceCtrl,
          size: 'lg',
          resolve: {
            patientSummaryAnswers: function () {
              return patientSummaryAnswers;
            }
          }


        });
    }
    
    $scope.PrintContent = function(){

        var DocumentContainer = document.getElementById('divtoprint');
        var WindowObject = window.open("", "PrintWindow",
        "width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
        WindowObject.document.writeln(DocumentContainer.innerHTML);
        WindowObject.document.close();
        WindowObject.focus();
        WindowObject.print();
        WindowObject.close();
        
    }
    
    $scope.export = function(){
        var blob = new Blob([document.getElementById('divtoprint').innerHTML], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "Report.xls");
    };
    
    //initialize these fields
    $scope.wordswith3=0;
    $scope.phonemes=0;
    $scope.answer.Results["CNC"]["Words with 3 Phonemes Correct"] =0;
    $scope.answer.Results["CNC"]["Phonemes Correct"] =0;
    
    //update percentage numbers
    $scope.updateWordsWith3 = function(){
        $scope.wordswith3= parseInt(($scope.answer.Results["CNC"]["Words with 3 Phonemes Correct"]/50)*100);
    }
    $scope.updatePhonemes = function(){
        $scope.phonemes= parseInt(($scope.answer.Results["CNC"]["Phonemes Correct"]/150)*100) ;
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
controllers.apiPatientsController = function ($scope, $http, $templateCache, persistData, getData, $location, $anchorScroll, $timeout, $modal, postData, $route, userInfo, putData, $cookieStore) {   
    //hmm 
    $scope.patientInactiveStatus = $cookieStore.get('PatientInactiveStatus');
    $scope.userFacilityID = userInfo.get().FacilityID;
    $scope.userLevelID = userInfo.get().UserLevelID;
	$scope.sessionID = userInfo.get().SessionID;
    $scope.dirAnchor = $cookieStore.get('dirAnchor');
    $scope.submitPatientInfo = function(patient){
        $timeout(function(){
            if(patient.reason){
                patient.InactiveStatus = patient.reason;
                patient.reason = null;
            }
            $timeout(function(){
                putData.put('http://killzombieswith.us/aii-api/v1/patients/' + patient.PatientID,patient);
            },0);
        },0);
        
        
    };
    
    $scope.markPatientActive = function(patient){
        var updateToActive = {'InactiveStatus': 10};
        putData.put('http://killzombieswith.us/aii-api/v1/patients/' + patient.PatientID, updateToActive);
        patient.InactiveStatus = 10;
    }
    $scope.showActiveTab = true;
    $scope.showInactiveTab = false;
    $scope.showActivePatients = "10";
    $scope.showInactive = function(){
        console.log("inshowInactive()");
        $scope.showActivePatients = "!10";
        $scope.showInactiveTab = true;
        $scope.showActiveTab = false;
        //$scope.$apply();
        console.log('showActivePatients:', $scope.showActivePatients);
    };
    $scope.showActive = function(){
        $scope.showActivePatients = "10";
        $scope.showInactiveTab = false;
        $scope.showActiveTab = true;
    };
    
    $scope.editDescrip =false;
    $scope.setInactive = false;
    
    getData.get("http://killzombieswith.us/aii-api/v1/inactiveReasons").success(function(data){
        $scope.inactiveReasons = data.records;
    });
    $scope.submitDescriptionInfo = function(careTeam){
        putData.put('http://killzombieswith.us/aii-api/v1/careTeams/' + careTeam.CareTeamID,careTeam);
    };
    $scope.calcAge = function(dateString) {
        var year=Number(dateString.substr(0,4));
        var month=Number(dateString.substr(4,2))-1;
        var day=Number(dateString.substr(6,2));
        var today=new Date();
        var age=today.getFullYear()-year;
        if(today.getMonth()<month || (today.getMonth()==month && today.getDate()<day)){age--;}
        return age;
    }
    
    $scope.goToPatDir = function(last, inactiveStatus){
        //console.log($location.$$path);
        if($location.$$path != "/patientDirectory"){
            $location.path('/patientDirectory/');
            //$scope.scrollTo(last); // patient here is actually just the last name.. for now
            
            $timeout(function(){
                if(inactiveStatus != 10){
                   // $scope.$apply();
                    $scope.scrollTo(last, true); //NOT working for pages outside of patient directory
                    //$scope.$apply();
                }else{
                    $scope.scrollTo(last, false);
                }
            }, 0);    
            
        }else{
                
            if(inactiveStatus != 10){
                $scope.scrollTo(last, true);
            }else{
                $scope.scrollTo(last, false);
            }
                 
        } 
                
    };
    /*
        
        */
    $scope.scrollTo = function(id, showInactive) {
        
        if(showInactive){
            $scope.showInactive();
        }else{
            $scope.showActive();
        }
        $location.hash(id);
        $timeout(function(){
            
            $anchorScroll();
            console.log("scrolling");
            $timeout(function(){
                scrollBy(0, -60);
            }, 0);
        }, 1000);
        
    };
    
    
    
    $scope.patientURL = "http://killzombieswith.us/aii-api/v1/facilities/patients/" + $scope.sessionID;
    //Grab all Patients for users facility using patientURL 
    getData.get($scope.patientURL).success(function(data) {
        $scope.patientsData = data;
    })
    

    //Get all the phases info!!
    getData.get("http://killzombieswith.us/aii-api/v1/phases/" + $scope.sessionID ).success(function(data) {
        $scope.phases = data.records;
    });
    
    //Set persistData so CareTeamID, PhaseID, phasename, patient name and anchor location in patient Directory are known in different partials.
    $scope.goToQuestions = function(careTeam, phase, patient){
        
        persistData.setCareTeamID(careTeam.CareTeamID);
        persistData.setPhaseID(phase.PhaseID);
        persistData.setPhaseName(phase.Name);
        persistData.setPatientName(patient.First + " " + patient.Last);
        persistData.setPatientID(patient.PatientID);
        persistData.setDirAnchor(patient.Last);
        $cookieStore.put('PatientDOB', patient.DOB);
        $cookieStore.put('PatientSex', patient.Sex);
        $cookieStore.put('PatientInactiveStatus', patient.InactiveStatus);
        
    };
    
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
    $scope.getFacCard = function(fac){
            
        var ModalInstanceCtrl = function ($scope, $modalInstance, fac) {
            $scope.sessionID = userInfo.get().SessionID;
            console.log(fac.FacilityID);
            getData.get("http://killzombieswith.us/aii-api/v1/facilities/" + fac.FacilityID + "/"+ $scope.sessionID).success(function(data){
                $scope.facCard = data;
            });
            getData.get("http://killzombieswith.us/aii-api/v1/facilities/"+ fac.FacilityID + '/users/' + $scope.sessionID).success(function(data) {
                $scope.facCardUsers = data;
            });        
            

            $scope.ok = function () {
                $modalInstance.close();
            };

        };
        
        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: ModalInstanceCtrl,
          size: 'md',
          resolve: {
            fac: function () {
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
    $scope.addNewEvent = function(patient){
            
        var ModalInstanceCtrl = function ($scope, $modalInstance, patient) {
            var cookieSessionID = $cookieStore.get('SessionID');
            $scope.newEvent={"Description":null, "OriginalFacilityID": 100, "CurrentPhaseID":3, "CreatedOn": new Date(), "PatientID": patient.PatientID};
            $scope.patient = patient;
            
            $scope.ok = function () {
                $modalInstance.close();
                $timeout(function(){
                    $route.reload();
                }, 1000);
                $location.hash(patient.Last);
                console.log($location.hash());
                $timeout(function(){
                    $anchorScroll();
                }, 3000);
            };
            
                $scope.answer = {};
                $scope.answer.Answers = {};
                $scope.answer.PhaseID = 1;
            
            $scope.submitEvent = function(){
                if($scope.newEvent.Description == null){
                    $scope.newEvent.Description = "Edit Event Description";
                }
                $scope.answer = {};
                $scope.answer.Answers = {};
                $scope.answer.PhaseID = 1;
                $scope.answer.Answers[10] = patient.DOB;
                $scope.answer.Answers[20] = patient.Sex;
                $scope.answer.Answers[30] = patient.Race;
                $scope.answer.Answers[40] = patient.BMI;
                $scope.answer.Answers[45] = patient.Height;
                $scope.answer.Answers[46] = patient.Weight;
            
                //create new event for that patient...
                postData.post('http://killzombieswith.us/aii-api/v1/careTeams',$scope.newEvent).success(function(data) {
                    $scope.answer.CareTeamID = data.records;
                }).then(function(){
                    //post known demo answers to that event 
                    postData.post('http://killzombieswith.us/aii-api/v1/answers/' + cookieSessionID,$scope.answer).success(function(){
                        //if patient was inactive, new event re-activates them.
                        var updateToActive = {'InactiveStatus': 10};
                        putData.put('http://killzombieswith.us/aii-api/v1/patients/' + patient.PatientID, updateToActive);
                        patient.InactiveStatus = 10;
                    });
                    
                    $scope.ok();
                    
                });
            }
            $scope.cancel = function () {
                $modalInstance.close();
            };

        };
        
        var modalInstance = $modal.open({
          templateUrl: 'addNewEvent.html',
          controller: ModalInstanceCtrl,
          size: 'lg',
          resolve: {
            patient: function () {
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
    $scope.inviteToCareTeam = function(patient){
            
        var ModalInstanceCtrl = function ( $modalInstance, $scope) {
            $scope.userFacilityID = userInfo.get().FacilityID;
            $scope.patient = patient;
            $scope.selectedFac = "(No facility selected)";
            //Grab AII Facilities that are NOT already associated with the patient
            getData.get("http://killzombieswith.us/aii-api/v1/facilities/new/" + patient.PatientID).success(function(data) {
                $scope.allFacs = data;
            });

            $scope.selectFac = function (fac) {
				$scope.selectedFac = fac.Name;
                $scope.patientProvider = {"PatientID": patient.PatientID, "FacilityID": fac.FacilityID};
			}
            
            
            $scope.sendCareTeamRequest= function(){
                //Copied james sendInvite function
                $scope.postNotification = {};
                $scope.postNotification.PatientID = patient.PatientID;
                $scope.postNotification.SenderFacilityID = $scope.userFacilityID;
                $scope.postNotification.ReceiverFacilityID = $scope.selectedFac.FacilityID;

                $scope.postNotificationURL = "http://killzombieswith.us/aii-api/v1/notifications/";
                postData.post($scope.postNotificationURL, $scope.postNotification);
                /*postData.post('http://killzombieswith.us/aii-api/v1/patientProviders',$scope.patientProvider).success(function(data) {
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
            $scope.ok = function () {
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
controllers.patientFormController = function($scope, $http, postData,dateFilter,userInfo,$cookieStore,$location) {
    // create a blank object to hold form information
    $scope.formData = {};
    
    var sessionID = $cookieStore.get('SessionID');
    
    $scope.formatDate = function() {
        $scope.formData.DOB = $scope.formData.dob.toISOString().slice(0,10);
    };
    
    // Post function to add a new Patient to the system
    $scope.addPatient = function() {
        postData.post('http://killzombieswith.us/aii-api/v1/patients/' + sessionID,$scope.formData).success(function(data) {
            alert(data.records);
            
            if(data.records == "Successfully added a patient"){
                $location.path('/patientDirectory/');
            };
        });
    };
    
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
    $scope.toggleDataCollapse = function(){
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
controllers.addUserController = function($scope, $http, postData, getData){
    
    // create a blank object to hold form information
    $scope.formData = {};
    //getting the userlevels from the api and posting it to the form
    $scope.UserLevelsURL = 'http://killzombieswith.us/aii-api/v1/userLevels';
    $scope.UserTitlesURL = 'http://killzombieswith.us/aii-api/v1/userTitles';
    
    getData.get($scope.UserLevelsURL).success(function(data) {
        $scope.formData.UserLevels = data;
        //console.log($scope.formData.UserLevels);
    });
    
    getData.get($scope.UserTitlesURL).success(function(data) {
        $scope.formData.UserTitles = data;
        //console.log(data);
        console.log($scope.formData.UserTitles);
    });

    // Post function to add a new User to the system
    $scope.processForm = function() {
        //postData.post('http://killzombieswith.us/aii-api/v1/users',$scope.formData);
        postData.post('http://killzombieswith.us/aii-api/v1/users',$scope.formData);
    };
    
}


//Added by Travis. 
/**
 * @controller editUserController - 
 *      Controller used to handle any EDITS made to a User
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
controllers.editUserController = function($scope, $http, getData, putData, persistData, userInfo){
    $scope.editUser = {};
    $scope.editFacility = {};
	
	$scope.sessionID = userInfo.get().SessionID;
	$scope.facilityID = userInfo.get().FacilityID;
	
    $scope.userURL = "http://killzombieswith.us/aii-api/v1/users/one/" + $scope.sessionID;
    $scope.faciltyURL = "http://killzombieswith.us/aii-api/v1/facilities/" + $scope.facilityID + '/' + $scope.sessionID;
    $scope.userLevel = persistData.getUserLevel();
    
    //Grab single User by ID
    getData.get($scope.userURL).success(function(data) {
        $scope.userData = data;
    }).then(function(){
        $scope.editUser.email = $scope.userData.records.email;
        $scope.editUser.phone = $scope.userData.records.phone;
    });
    
    //Grab information about users Facility
    getData.get($scope.faciltyURL).success(function(data) {
        $scope.facilityData = data;
    }).then(function(){
        $scope.editFacility.Address1 = $scope.facilityData.records.Address1;
        $scope.editFacility.Phone = $scope.facilityData.records.Phone;
        $scope.editFacility.Description = $scope.facilityData.records.Description;
    });
    
    
    //Put changed User information into database
    $scope.editUserPut = function() {
        putData.put('http://killzombieswith.us/aii-api/v1/users/' + this.userData.records.UserID,$scope.editUser);
    };
    
    //Put changed Facility information into database
    $scope.editFacilityPut = function() {
        putData.put('http://killzombieswith.us/aii-api/v1/facilities/' + this.userData.records.FacilityID,$scope.editFacility);
    };
    
}


//**************************************END USER CONTROLLERS******************************************//



//*************************************MESSAGING CONTROLLERS******************************************//


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
controllers.messagingController = function ($scope, $http, $templateCache, $filter, persistData, getData, postData, putData, userInfo, messageCount) {   
    
	//User's ID (will be retrieved using session data)
	$scope.userID = userInfo.get().UserID;
	$scope.userLevelID = userInfo.get().UserLevelID;
	$scope.sessionID = userInfo.get().SessionID;
	//Controls the message display popup
    $scope.isPopupVisible = false;
	//OrderBy property : true means display contents in reverse order  
	$scope.reverse = true;
	$scope.orderFilter = 'Timestamp';
    //Messages that have been marked (for deleting, marking as read, or marking as unread)
	$scope.markedMessages = [];
	
	//The type of message currently being displayed - inbox, sent, drafts, deleted
	$scope.currentMessageType;
	$scope.currentMessages;
	
    $scope.inboxURL = "http://killzombieswith.us/aii-api/v1/users/inbox/" + $scope.sessionID;
	$scope.sentURL = "http://killzombieswith.us/aii-api/v1/users/sent/" + $scope.sessionID;
	$scope.draftsURL = "http://killzombieswith.us/aii-api/v1/users/drafts/" + $scope.sessionID;
	$scope.deletedURL = "http://killzombieswith.us/aii-api/v1/users/deleted/" + $scope.sessionID;
	$scope.messageURL = "http://killzombieswith.us/aii-api/v1/messages/";
    
    
    
    //Grab all inbox messages using patientURL 
    getData.get($scope.inboxURL).success(function(data) {
		//Combine First and Last into Name for each message
		for(i = 0; i < data.records.length; i++)
		{
			data.records[i].SenderName = data.records[i].Sender_First + " " + data.records[i].Sender_Last;
			data.records[i].ReceiverName = "Me";
			data.records[i].ShortSubject = data.records[i].Subject;
			if(data.records[i].Subject.length > 24){
				data.records[i].ShortSubject = data.records[i].Subject.substr(0,21) + "...";
			}
			data.records[i].ShortSenderName = data.records[i].SenderName;
			if(data.records[i].SenderName.length > 25){
				data.records[i].ShortSenderName = data.records[i].SenderName.substr(0,22) + "...";
			}
			data.records[i].ShortReceiverName = data.records[i].ReceiverName;
		}
		$scope.inboxMessages = data;
		$scope.currentMessages = $scope.inboxMessages;
    });
	
	 //Grab all sent messages using patientURL 
    getData.get($scope.sentURL).success(function(data) {
		//Combine First and Last into Name for each message
		for(i = 0; i < data.records.length; i++)
		{
			data.records[i].ReceiverName = data.records[i].Receiver_First + " " + data.records[i].Receiver_Last;
			data.records[i].SenderName = "Me";
			data.records[i].ShortSubject = data.records[i].Subject;
			if(data.records[i].Subject.length > 24){
				data.records[i].ShortSubject = data.records[i].Subject.substr(0,21) + "...";
			}
			data.records[i].ShortSenderName = data.records[i].SenderName;
			data.records[i].ShortReceiverName = data.records[i].ReceiverName;
			if(data.records[i].ReceiverName.length > 25){
				data.records[i].ShortReceiverName = data.records[i].ReceiverName.substr(0,22) + "...";
			}
		}
        $scope.sentMessages = data;
    });
	
	 //Grab all draft messages using patientURL 
    getData.get($scope.draftsURL).success(function(data) {
		//Combine First and Last into Name for each message
		for(i = 0; i < data.records.length; i++)
		{
			data.records[i].ReceiverName = data.records[i].Receiver_First + " " + data.records[i].Receiver_Last;
			data.records[i].SenderName = "Me";
			data.records[i].ShortSubject = data.records[i].Subject;
			if(data.records[i].Subject.length > 24){
				data.records[i].ShortSubject = data.records[i].Subject.substr(0,21) + "...";
			}
			data.records[i].ShortSenderName = data.records[i].SenderName;
			data.records[i].ShortReceiverName = data.records[i].ReceiverName;
			if(data.records[i].ReceiverName.length > 25){
				data.records[i].ShortReceiverName = data.records[i].ReceiverName.substr(0,22) + "...";
			}
		}
        $scope.draftMessages = data;
    });
	
	//Grab all deleted messages using patientURL 
    getData.get($scope.deletedURL).success(function(data) {
		//Combine First and Last into Name for each message and mark the user as either the sender or receiver
		for(i = 0; i < data.records.length; i++)
		{
			if(data.records[i].Sender_First == null && data.records[i].Sender_Last == null){
				data.records[i].SenderName = 'Me';
				data.records[i].ReceiverName = data.records[i].Receiver_First + " " + data.records[i].Receiver_Last;
			}
			if(data.records[i].Receiver_First == null && data.records[i].Receiver_Last == null){
				data.records[i].ReceiverName = 'Me';
				data.records[i].SenderName = data.records[i].Sender_First + " " + data.records[i].Sender_Last;
			}
			data.records[i].ShortSubject = data.records[i].Subject;
			if(data.records[i].Subject.length > 24){
				data.records[i].ShortSubject = data.records[i].Subject.substr(0,21) + "...";
			}
			data.records[i].ShortSenderName = data.records[i].SenderName;
			if(data.records[i].SenderName.length > 25){
				data.records[i].ShortSenderName = data.records[i].SenderName.substr(0,22) + "...";
			}
			data.records[i].ShortReceiverName = data.records[i].ReceiverName;
			if(data.records[i].ReceiverName.length > 25){
				data.records[i].ShortReceiverName = data.records[i].ReceiverName.substr(0,22) + "...";
			}
		}
        $scope.deletedMessages = data;
    });
	
	this.tab = -1;
	
	$scope.selectTab = function(selectedTab){
		this.tab = selectedTab;
	}
	$scope.isSelectedTab = function(checkTab){
		return this.tab === checkTab;
	}
	
	//Sets the current message type. This updates the current messages and
	//alters the components of the message display.
	$scope.setMessageType = function(messageType){
		$scope.currentMessageType = messageType;
		
		switch($scope.currentMessageType){
			case 'inbox':
				$scope.currentMessages = $scope.inboxMessages;
				$scope.displayMessages = true;
				//Message table columns
				$scope.showFrom = true;
				$scope.showTo = false;
				$scope.showSubject = true;
				$scope.showTimestamp = true;
				//Selected Message buttons
				$scope.showReply = true;
				$scope.showForward = true;
				$scope.showEdit = false;
				$scope.showRestore = false;
				$scope.showDelete = true;
				$scope.showFullDelete = false;
				break;
			case 'sent':
				$scope.currentMessages = $scope.sentMessages;
				$scope.displayMessages = true;
				$scope.showFrom = false;
				$scope.showTo = true;
				$scope.showSubject = true;
				$scope.showTimestamp = true;
				//Selected Message buttons
				$scope.showReply = false;
				$scope.showForward = true;
				$scope.showEdit = false;
				$scope.showRestore = false;
				$scope.showDelete = true;
				$scope.showFullDelete = false;
				break;
			case 'drafts':
				$scope.currentMessages = $scope.draftMessages;
				$scope.displayMessages = true;
				$scope.showFrom = false;
				$scope.showTo = false;
				$scope.showSubject = true;
				$scope.showTimestamp = true;
				//Selected Message buttons
				$scope.showReply = false;
				$scope.showForward = false;
				$scope.showEdit = true;
				$scope.showRestore = false;
				$scope.showDelete = true;
				$scope.showFullDelete = false;
				break;
			case 'deleted':
				$scope.currentMessages = $scope.deletedMessages;
				$scope.displayMessages = true;
				$scope.showFrom = true;
				$scope.showTo = true;
				$scope.showSubject = true;
				$scope.showTimestamp = true;
				//Selected Message buttons
				$scope.showReply = false;
				$scope.showForward = false;
				$scope.showEdit = false;
				$scope.showRestore = true;
				$scope.showDelete = false;
				$scope.showFullDelete = true;
				break;
			case 'composeMessage':
				$scope.displayMessages = false;
				break;
			default:
				break;
		}
	}
	
	$scope.isTypeSelected = function(messageType){
		if($scope.currentMessageType == messageType)
			return true;
		return false;
	}
	
	//Checks if the user wants to send a message to another user
	//whenever the page loads.
	$scope.checkForRecipients = function(){
		var recipient = persistData.getMessageRecipient();
		if(recipient != -1){
			$scope.setMessageType('composeMessage');
			$scope.composeMessage = {};
			$scope.composeMessage.ReceiverUsername = 
				recipient.username + " <" + recipient.full_name + ">";
		}
		//If there was no request to send a message to a user,
		//show the inbox page.
		else{
			$scope.setMessageType('inbox');
		}
		//Reset the persist data
		persistData.setMessageRecipient(-1);
	}
	
	//Toggles visibility of the message content display
	$scope.togglePopup = function(message){
		if($scope.selectedMessage == message || message == null){
			$scope.isPopupVisible = false;
			$scope.selectedMessage = null;
		}
		else{
            
			$scope.isPopupVisible = true;
			$scope.selectedMessage = message;
			//If the message is a user received message and has not already been marked as read, mark it
			if($scope.selectedMessage.ReceiverName == 'Me' && $scope.selectedMessage.IsRead == 0)
			{
				messageURL = "http://killzombieswith.us/aii-api/v1/messages/" + $scope.selectedMessage.MessageID;
				//Change the message's Read attribute to true
				$scope.selectedMessage.IsRead = 1;
				//PUT the message using the message URL
				putData.put(messageURL,message).success(function(data){
					$scope.refreshMessages();
				}).then(function(){
                    $scope.unreadMessageURL = "http://killzombieswith.us/aii-api/v1/users/unreadMessagesCount/" + $scope.sessionID;
                    getData.get($scope.unreadMessageURL).success(function(data) {
                        $scope.messageCount = data.records['messageCount'];
                    }).then(function (){
                        messageCount.prepForBroadcast($scope.messageCount);
                   });
                });
			}
		}
	};
	
	//Handles creation of replies to the selectedMessage
	$scope.reply = function(){
		$scope.composeMessage = {};
		
		messageTime = $filter('date')(($scope.selectedMessage.Timestamp * 1000), 'h:mm a');
		messageDate = $filter('date')(($scope.selectedMessage.Timestamp * 1000), 'M/d/yy');
		
		//Format the new reply message with info from the original message
		$scope.composeMessage.ReceiverUsername = $scope.selectedMessage.SenderUsername;
		$scope.composeMessage.Subject = "RE: " + $scope.selectedMessage.Subject;
		$scope.composeMessage.Content = "\n\n------------------------------\n"
									+	"From: " + $scope.selectedMessage.Sender_First + " " + $scope.selectedMessage.Sender_Last + "\n"
									+	"Subject: " + $scope.selectedMessage.Subject + "\n"
									+	"Time: " + messageTime + "\n"
									+	"Date: " + messageDate + "\n\n"
									+ 	$scope.selectedMessage.Content;
	}	
	
	//Handles creation of 'forwards' of the selectedMessage
	$scope.forward = function(){
		$scope.composeMessage = {};
		
		messageTime = $filter('date')(($scope.selectedMessage.Timestamp * 1000), 'h:mm a');
		messageDate = $filter('date')(($scope.selectedMessage.Timestamp * 1000), 'M/d/yy');
		
		//Format the new reply message with info from the original message
		$scope.composeMessage.Subject = "FWD: " + $scope.selectedMessage.Subject;
		$scope.composeMessage.Content = "\n\n------------------------------\n"
									+	"From: " + $scope.selectedMessage.SenderName + "\n"
									+	"To: " + $scope.selectedMessage.ReceiverName + "\n"
									+	"Subject: " + $scope.selectedMessage.Subject + "\n"
									+	"Time: " + messageTime + "\n"
									+	"Date: " + messageDate + "\n\n"
									+ 	$scope.selectedMessage.Content;
	}	
	
	//Moves the contents of a draft message into the composing message
	$scope.edit = function(){
		$scope.composeMessage = $scope.selectedMessage;
		$scope.composeMessage.isDraft = true;
	}	
	
	//Posts the input message after properly filling out the appropriate fields of the message
	$scope.sendMessage = function(message){
		//Post the user defined message to the database
		//input 'message' should only contain the recipient username (currently UserID instead),
		//the subject, and the message content.
		
		//Define the SenderID as the current user
		message.SenderID = $scope.userID;
		message.Sent = 1;
		message.SenderDeleted = 0;
		message.ReceiverDeleted = 0;
		
		//If this message is an edited draft, PUT the message instead of POSTing
		if(message.isDraft){
			putData.put($scope.messageURL + message.MessageID, message).success(function(data){
				$scope.refreshMessages();
			});
		}
		//Insure that all elements contain data before POSTing
		else if(message.ReceiverUsername && message.Subject && message.Content){
			postData.post($scope.messageURL,message).success(function(data){
				$scope.refreshMessages();
			});
		}
		//If elements are missing, inform the user and save as draft if possible
		else{
			var errorMessage = "The message could not be sent due to:"
			if(!message.ReceiverUsername){
				errorMessage += "\n     -No receiver defined."
			}
			if(!message.Subject){
				errorMessage += "\n     -No subject defined."
			}
			if(!message.Content){
				errorMessage += "\n     -No message content\nThe message has not been saved."
			}
			else if(message.Content){
				//If the message had content, save it as a draft.
				message.sent = 0;
				postData.post($scope.messageURL,message).success(function(data){
					$scope.refreshMessages();
				});
				
				errorMessage += "\nThe message has been saved as a draft."
			}
			alert(errorMessage);
		}
	}
	
	//Posts the input message similarly to the 'sendMessage' function, but marks the Sent property as
	//false. This message will populate the user's 'draft' section instead of their 'sent' section
	$scope.saveDraft = function(message){
		//POST a message where Sent is false. Only the content is required to be filled.
		message.SenderID = $scope.userID;
		//Generate Timestamp
		message.Sent = 0;
		message.SenderDeleted = 0;
		message.ReceiverDeleted = 0;
		
		//Insure that all elements contain data before posting
		if(message.Content){
			postData.post($scope.messageURL,message).success(function(data){
				$scope.refreshMessages();
			});
		}
		else{
			alert("The message could not be saved as it contained no content.");
		}
	}
	
	//Erases the content in the composed message fields
	$scope.clearComposedMessage = function(){
		$scope.composeMessage = {};
	}
	
	//Controls the ordering of messages. Filter is the field AngularJS will order messages by.
	$scope.order = function(filter){
		$scope.reverse = !($scope.reverse);
		$scope.orderFilter = filter;
	}
	
	//Controls the marking of messages for different PUT functions (marking as deleted, read, or unread)
	$scope.markMessage = function(message, checkbox){
		//If checkbox was just selected, add the message as marked
		if(checkbox.checked){
			$scope.markedMessages.push(message);
		}
		//On unselecting a checkbox, find the message and remove it from the marked messages
		else{
			for(i = 0; i < $scope.markedMessages.length; i++){
				if($scope.markedMessages[i] == message){
					foundMessage = true;
					//Remove the input message from the marked array
					$scope.markedMessages.splice(i,1);
				}
			}
		}
	}
	
	//Add all the messages in the input to the marked messages
	markAllMessages = function(messageType, sourceCheckbox){
	
		switch(messageType){
			case 'inbox':
				messages = $scope.inboxMessages.records;
				checkboxName = 'inboxCheckbox';
				break;
			case 'sent':
				messages = $scope.sentMessages.records;
				checkboxName = 'sentCheckbox';
				break;
			case 'drafts':
				messages = $scope.draftMessages.records;
				checkboxName = 'draftCheckbox';
				break;
			case 'deleted':
				messages = $scope.deletedMessages.records;
				checkboxName = 'deletedCheckbox';
				break;
			default:
				messages = [];
				break;
		}
		
		//Find all the checkboxes that will be affected by this function
		checkboxes = document.getElementsByName(checkboxName);
		for(i = 0; i < checkboxes.length; i++){
			checkboxes[i].checked = sourceCheckbox.checked;
		}
		//If the checkbox is checked, add all messages as marked
		if(sourceCheckbox.checked){
			for(i = 0; i < messages.length; i++){
				$scope.markedMessages.push(messages[i]);
			}
		}
		//When unchecked, remove all messages from marked
		else{
			$scope.markedMessages = [];
		}
	}
	
	//Remove all messages from the marked messages array
	$scope.clearMarkedMessages = function(){
		$scope.markedMessages = [];
		
		//Mark all the checkboxes as unchecked
		checkboxNames = ['inboxCheckbox', 'sentCheckbox','draftCheckbox' ,'deletedCheckbox'];
		
		for(i = 0; i < checkboxNames.length; i++)
		{
			checkboxes = document.getElementsByName(checkboxNames[i]);
			for(j = 0; j < checkboxes.length; j++)
			{
				checkboxes[j].checked = false;
			}
		}
	}
	
	//Send a PUT request with the user-defined property and value
	$scope.putMarkedMessages = function(property, value){
		//Parse value (string) as an int (in base 10)
		value = parseInt(value, 10);
		if(property == 'read'){
			for(i = 0; i < $scope.markedMessages.length; i++){
				putMessageURL = $scope.messageURL + $scope.markedMessages[i].MessageID;
				//Change the message's Deleted attribute to true
				$scope.markedMessages[i].IsRead = value;
				//PUT the message using the message URL
				putData.put(putMessageURL,$scope.markedMessages[i]).success(function(data){
					$scope.refreshMessages();
				});
			}
		}
		else if(property == 'deleted'){
			for(i = 0; i < $scope.markedMessages.length; i++){
				putMessageURL = $scope.messageURL + $scope.markedMessages[i].MessageID;
				//Change the message's Deleted attribute to true
				if($scope.markedMessages[i].ReceiverName == "Me"){
					$scope.markedMessages[i].ReceiverDeleted = value;
				}
				else if($scope.markedMessages[i].SenderName == "Me"){
					$scope.markedMessages[i].SenderDeleted = value;
				}
				//PUT the message using the message URL
				console.log("About to PUT data");
				putData.put(putMessageURL,$scope.markedMessages[i]).success(function(data) {
					console.log("PUT complete - About to get messages");
					$scope.refreshMessages();
					console.log("Got messages");
				});
			}
		}
		//$scope.refreshCurrentMessages();
	}
	
	//Refreshes all of the user's messages
	$scope.refreshMessages = function(){
		$scope.refreshInbox();
		$scope.refreshSent();
		$scope.refreshDrafts();
		$scope.refreshDeleted();
	}
	
	$scope.refreshInbox = function(){
		getData.get($scope.inboxURL).success(function(data) {
			for(i = 0; i < data.records.length; i++)
			{
				data.records[i].SenderName = data.records[i].Sender_First + " " + data.records[i].Sender_Last;
				data.records[i].ReceiverName = "Me";
				data.records[i].ShortSubject = data.records[i].Subject;
				if(data.records[i].Subject.length > 30){
					data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
				}
				data.records[i].ShortSenderName = data.records[i].SenderName;
				if(data.records[i].SenderName.length > 25){
					data.records[i].ShortSenderName = data.records[i].SenderName.substr(0,22) + "...";
				}
				data.records[i].ShortReceiverName = data.records[i].ReceiverName;
			}
			$scope.inboxMessages = data;
			if($scope.currentMessageType == 'inbox'){
				$scope.currentMessages = $scope.inboxMessages;
			}
		});
	}
	
	$scope.refreshSent = function(){
		getData.get($scope.sentURL).success(function(data) {
			for(i = 0; i < data.records.length; i++)
			{
				data.records[i].SenderName = "Me";
				data.records[i].ReceiverName = data.records[i].Receiver_First + " " + data.records[i].Receiver_Last;
				data.records[i].ShortSubject = data.records[i].Subject;
				if(data.records[i].Subject.length > 30){
					data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
				}
				data.records[i].ShortSenderName = data.records[i].SenderName;
				data.records[i].ShortReceiverName = data.records[i].ReceiverName;
				if(data.records[i].ReceiverName.length > 25){
					data.records[i].ShortReceiverName = data.records[i].ReceiverName.substr(0,22) + "...";
				}
			}
			$scope.sentMessages = data;
			if($scope.currentMessageType == 'sent'){
				$scope.currentMessages = $scope.sentMessages;
			}
		});
	}
	
	$scope.refreshDrafts = function(){
		getData.get($scope.draftsURL).success(function(data) {
			for(i = 0; i < data.records.length; i++)
			{
				data.records[i].ReceiverName = data.records[i].Receiver_First + " " + data.records[i].Receiver_Last;
				data.records[i].SenderName = "Me";
				data.records[i].ShortSubject = data.records[i].Subject;
				if(data.records[i].Subject.length > 30){
					data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
				}
				data.records[i].ShortSenderName = data.records[i].SenderName;
				data.records[i].ShortReceiverName = data.records[i].ReceiverName;
				if(data.records[i].ReceiverName.length > 25){
					data.records[i].ShortReceiverName = data.records[i].ReceiverName.substr(0,22) + "...";
				}
			}
			$scope.draftMessages = data;
			if($scope.currentMessageType == 'drafts'){
				$scope.currentMessages = $scope.draftMessages;
			}
		});
	}
	
	$scope.refreshDeleted = function(){
		getData.get($scope.deletedURL).success(function(data) {
		//Combine First and Last into Name for each message and mark the user as either the sender or receiver
			for(i = 0; i < data.records.length; i++)
			{
				if(data.records[i].Sender_First == null && data.records[i].Sender_Last == null){
					data.records[i].SenderName = 'Me';
					data.records[i].ReceiverName = data.records[i].Receiver_First + " " + data.records[i].Receiver_Last;
				}
				if(data.records[i].Receiver_First == null && data.records[i].Receiver_Last == null){
					data.records[i].ReceiverName = 'Me';
					data.records[i].SenderName = data.records[i].Sender_First + " " + data.records[i].Sender_Last;
				}
				data.records[i].ShortSubject = data.records[i].Subject;
				if(data.records[i].Subject.length > 30){
					data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
				}
				data.records[i].ShortSenderName = data.records[i].SenderName;
				if(data.records[i].SenderName.length > 25){
					data.records[i].ShortSenderName = data.records[i].SenderName.substr(0,22) + "...";
				}
				data.records[i].ShortReceiverName = data.records[i].ReceiverName;
				if(data.records[i].ReceiverName.length > 25){
					data.records[i].ShortReceiverName = data.records[i].ReceiverName.substr(0,22) + "...";
				}
			}
			$scope.deletedMessages = data;
			if($scope.currentMessageType == 'deleted'){
				$scope.currentMessages = $scope.deletedMessages;
			}
		});
	}
	
	$scope.refreshCurrentMessages = function(){
		switch($scope.currentMessageType){
			case 'inbox':
				$scope.refreshInbox();
				break;
			case 'sent':
				$scope.refreshSent();
				break;
			case 'drafts':
				$scope.refreshDrafts();
				break;
			case 'deleted':
				$scope.refreshDeleted();
				break;
		}
	}
	
	$scope.deleteSelectedMessage = function(){
		messageURL = "http://killzombieswith.us/aii-api/v1/messages/" + $scope.selectedMessage.MessageID;
		//Change the message's Deleted attribute to true
		if($scope.selectedMessage.ReceiverName == "Me"){
			$scope.selectedMessage.ReceiverDeleted = 1;
		}
		else if($scope.selectedMessage.SenderName == "Me"){
			$scope.selectedMessage.SenderDeleted = 1;
		}
		//PUT the message using the message URL and then refresh the messages
		putData.put(messageURL,$scope.selectedMessage).success(function(data){
			$scope.refreshMessages();
		});
		//$scope.$apply();
	}
	
	//Marks the message as deleted, however the message will no longer appear in the Deleted messages.
	$scope.fullyDeleteSelectedMessage = function(){
		messageURL = "http://killzombieswith.us/aii-api/v1/messages/" + $scope.selectedMessage.MessageID;
		//Change the message's Deleted attribute to true
		if($scope.selectedMessage.ReceiverName == "Me"){
			$scope.selectedMessage.ReceiverDeleted = 2;
		}
		else{
			$scope.selectedMessage.SenderDeleted = 2;
		}
		//PUT the message using the message URL and then refresh the messages
		putData.put(messageURL,$scope.selectedMessage).success(function(data){
			$scope.refreshMessages();
		});
	}
	
	$scope.restoreSelectedMessage = function(){
		messageURL = "http://killzombieswith.us/aii-api/v1/messages/" + $scope.selectedMessage.MessageID;
		//Change the message's Deleted attribute to true
		if($scope.selectedMessage.ReceiverName == "Me"){
			$scope.selectedMessage.ReceiverDeleted = 0;
		}
		else{
			$scope.selectedMessage.SenderDeleted = 0;
		}
		//PUT the message using the message URL and then refresh the messages
		putData.put(messageURL,$scope.selectedMessage).success(function(data){
			$scope.refreshMessages();
		});
		//$scope.$apply();
	}
};  


//************************************END MESSAGING CONTROLLERS***************************************//
 

 
//***************************************ALERT CONTROLLERS********************************************// 
 
 
//Added by James. 
/**
 * @controller alertsController - 
 *      DESCRIPTION OF CONTROLLER GOES HERE
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
controllers.alertsController = function ($scope, $http, $templateCache, $filter, persistData, getData, postData, putData, userInfo){

	$scope.userLevelID = userInfo.get().UserLevelID;
	$scope.sessionID = userInfo.get().SessionID;
	
	$scope.receivedURL = "http://killzombieswith.us/aii-api/v1/facilities/alerts/" + $scope.sessionID;
	$scope.deletedURL = "http://killzombieswith.us/aii-api/v1/facilities/deletedAlerts/" + $scope.sessionID;

	$scope.alertURL = "http://killzombieswith.us/aii-api/v1/alerts/";	
	
	$scope.currentAlerts;
	
	/* Miscellaneous Variables */
	//OrderBy property : true means display contents in reverse order  
	$scope.reverse = true;
	$scope.orderFilter = 'Timestamp';
    //Alerts that have been marked (for deleting, marking as read, or marking as unread)
	$scope.markedAlerts = [];
	
	getData.get($scope.receivedURL).success(function(data) {
		$scope.receivedAlerts = data;
		for(i = 0; i < data.records.length; i++){
			data.records[i].ShortSubject = data.records[i].Subject;
			if(data.records[i].Subject.length > 30){
				data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
			}
			data.records[i].ShortPatient = data.records[i].Patient;
			if(data.records[i].Patient.length > 24){
				data.records[i].ShortPatient = data.records[i].Patient.substr(0,21) + "...";
			}
			data.records[i].PatientDOBMonth = data.records[i].PatientDOB.substr(4,2);
			data.records[i].PatientDOBDay = data.records[i].PatientDOB.substr(6, 2);
			data.records[i].PatientDOBYear = data.records[i].PatientDOB.substr(0,4);
		}
		$scope.currentAlerts = $scope.receivedAlerts;
    });
	
	getData.get($scope.deletedURL).success(function(data) {
		$scope.deletedAlerts = data;
		for(i = 0; i < data.records.length; i++){
			data.records[i].ShortSubject = data.records[i].Subject;
			if(data.records[i].Subject.length > 30){
				data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
			}
			data.records[i].ShortPatient = data.records[i].Patient;
			if(data.records[i].Patient.length > 24){
				data.records[i].ShortPatient = data.records[i].Patient.substr(0,21) + "...";
			}
			data.records[i].PatientDOBMonth = data.records[i].PatientDOB.substr(4,2);
			data.records[i].PatientDOBDay = data.records[i].PatientDOB.substr(6, 2);
			data.records[i].PatientDOBYear = data.records[i].PatientDOB.substr(0,4);
		}
    }); 
	
	$scope.setAlertType = function(alertType){
		$scope.currentAlertType = alertType;
		
		switch($scope.currentAlertType){
			case 'received':
				$scope.currentAlerts = $scope.receivedAlerts;
				$scope.showFrom = true;
				$scope.showSubject = true;
				$scope.showTimestamp = true;
				$scope.showRestore = false;
				$scope.showDelete = true;
				$scope.showFullDelete = false;
				break;
			case 'deleted':
				$scope.currentAlerts = $scope.deletedAlerts;
				$scope.showFrom = true;
				$scope.showSubject = true;
				$scope.showTimestamp = true;
				$scope.showRestore = true;
				$scope.showDelete = false;
				$scope.showFullDelete = true;
				break;
		}
	}
	
	$scope.isTypeSelected = function(alertType){
		if(alertType == $scope.currentAlertType){
			return true;
		}
		return false;
	}
	
	$scope.togglePopup = function(alert){
		if($scope.showPopup){
			$scope.selectedAlert = [];
		}
		else{
			$scope.selectedAlert = alert;
			//Mark the selected alert as read
			if($scope.selectedAlert.IsRead == 0){
				putAlertURL = $scope.alertURL + $scope.selectedAlert.AlertID;
				$scope.selectedAlert.IsRead = 1;
				putData.put(putAlertURL, $scope.selectedAlert).success(function(data){
					$scope.refreshAlerts();
				});
			}
		}
		$scope.showPopup = !$scope.showPopup;
	}
	
	$scope.hidePopup = function(){
		$scope.showPopup = false;
		$scope.selectedAlert = [];
	}
	
	$scope.deleteSelectedAlert = function(deletedState){
		putAlertURL = "http://killzombieswith.us/aii-api/v1/alerts/" + $scope.selectedAlert.AlertID;
		//Change the alert's Deleted attribute to true
		$scope.selectedAlert.IsArchived = deletedState;
		//PUT the alert using the URL and then refresh the alerts
		putData.put(putAlertURL, $scope.selectedAlert).success(function(data){
			$scope.refreshAlerts();
		});
		$scope.refreshAlerts();
	}
	
	$scope.refreshAlerts = function(){
		$scope.refreshReceived();
		$scope.refreshDeleted();
	}
	
	$scope.refreshReceived = function(){
		getData.get($scope.receivedURL).success(function(data) {
			$scope.receivedAlerts = data;
			for(i = 0; i < data.records.length; i++){
				data.records[i].ShortSubject = data.records[i].Subject;
				if(data.records[i].Subject.length > 30){
					data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
				}
				data.records[i].ShortPatient = data.records[i].Patient;
				if(data.records[i].Patient.length > 24){
					data.records[i].ShortPatient = data.records[i].Patient.substr(0,21) + "...";
				}
				data.records[i].PatientDOBMonth = data.records[i].PatientDOB.substr(4,2);
				data.records[i].PatientDOBDay = data.records[i].PatientDOB.substr(6, 2);
				data.records[i].PatientDOBYear = data.records[i].PatientDOB.substr(0,4);
			}
			if($scope.currentAlertType == 'received'){
				$scope.currentAlerts = $scope.receivedAlerts;
			}
		});
	}
	
	$scope.refreshDeleted = function(){
		getData.get($scope.deletedURL).success(function(data) {
			$scope.deletedAlerts = data;
			for(i = 0; i < data.records.length; i++){
				data.records[i].ShortSubject = data.records[i].Subject;
				if(data.records[i].Subject.length > 30){
					data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
				}
				data.records[i].ShortPatient = data.records[i].Patient;
				if(data.records[i].Patient.length > 24){
					data.records[i].ShortPatient = data.records[i].Patient.substr(0,21) + "...";
				}
				data.records[i].PatientDOBMonth = data.records[i].PatientDOB.substr(4,2);
				data.records[i].PatientDOBDay = data.records[i].PatientDOB.substr(6, 2);
				data.records[i].PatientDOBYear = data.records[i].PatientDOB.substr(0,4);
			}
			if($scope.currentAlertType == 'deleted'){
				$scope.currentAlerts = $scope.deletedAlerts;
			}
		}); 
	}
	
	$scope.order = function(filter){
		$scope.reverse = !($scope.reverse);
		$scope.orderFilter = filter;
	}
	
	$scope.markAlert = function(alert, checkbox){
		//If checkbox was just selected, add the message as marked
		if(checkbox.checked){
			$scope.markedAlerts.push(alert);
		}
		//On unselecting a checkbox, find the message and remove it from the marked messages
		else{
			for(i = 0; i < $scope.markedAlerts.length; i++){
				if($scope.markedAlerts[i] == alert){
					//Remove the input message from the marked array
					$scope.markedAlerts.splice(i,1);
				}
			}
		}
	}
	
	//Add all the alerts in the input to the marked alerts
	markAllAlerts = function(sourceCheckbox){
	
		switch($scope.currentAlertType){
			case 'received':
				alerts = $scope.receivedAlerts.records;
				break;
			case 'deleted':
				alerts = $scope.deletedAlerts.records;
				break;
			default:
				alerts = [];
				break;
		}
		
		checkboxName = 'alertCheckbox';
		
		//Find all the checkboxes that will be affected by this function
		checkboxes = document.getElementsByName(checkboxName);
		for(i = 0; i < checkboxes.length; i++){
			checkboxes[i].checked = sourceCheckbox.checked;
		}
		//If the checkbox is checked, add all alerts as marked
		if(sourceCheckbox.checked){
			for(i = 0; i < alerts.length; i++){
				$scope.markedAlerts.push(alerts[i]);
			}
		}
		//When unchecked, remove all alerts from marked
		else{
			$scope.clearMarkedAlerts();
		}
	}
	
	//Remove all messages from the marked messages array
	$scope.clearMarkedAlerts = function(){
		$scope.markedAlerts = [];
		
		//Mark all the checkboxes as unchecked
		checkboxNames = ['alertCheckbox', 'controlCheckbox'];
		
		for(i = 0; i < checkboxNames.length; i++)
		{
			checkboxes = document.getElementsByName(checkboxNames[i]);
			for(j = 0; j < checkboxes.length; j++)
			{
				checkboxes[j].checked = false;
			}
		}
	}
	
	//Send a PUT request with the user-defined property and value
	$scope.putMarkedAlerts = function(property, value){
		//Parse value (string) as an int (in base 10)
		value = parseInt(value, 10);
		if(property == 'read'){
			for(i = 0; i < $scope.markedAlerts.length; i++){
				putAlertURL = $scope.alertURL + $scope.markedAlerts[i].AlertID;
				//Change the alert's Deleted attribute to true
				$scope.markedAlerts[i].IsRead = value;
				//PUT the alert using the alert URL
				putData.put(putAlertURL, $scope.markedAlerts[i]).success(function(data){
					$scope.refreshAlerts();
				});
			}
		}
		else if(property == 'deleted'){
			for(i = 0; i < $scope.markedAlerts.length; i++){
				putAlertURL = $scope.alertURL + $scope.markedAlerts[i].AlertID;
				//Change the alert's Deleted attribute to true
				$scope.markedAlerts[i].IsArchived = value;
				//PUT the alert using the alert URL
				putData.put(putAlertURL, $scope.markedAlerts[i]).success(function(data){
					$scope.refreshAlerts();
				});
			}
		}
	}
};
 
 
//*************************************END ALERT CONTROLLERS******************************************//
 

 
//***********************************NOTIFICATION CONTROLLERS*****************************************// 
 
 
//Added by James. 
/**
 * @controller notificationsController - 
 *      DESCRIPTION OF CONTROLLER GOES HERE
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
controllers.notificationsController = function ($scope, $http, $templateCache, $filter, persistData, getData, postData, putData, userInfo){

	/* User Data */
	$scope.userLevelID = userInfo.get().UserLevelID;
	$scope.sessionID = userInfo.get().SessionID;

	$scope.receivedURL = "http://killzombieswith.us/aii-api/v1/facilities/notifications/" + $scope.sessionID;
	$scope.deletedURL = "http://killzombieswith.us/aii-api/v1/facilities/deletedNotifications/" + $scope.sessionID;
	
	$scope.notificationURL = "http://killzombieswith.us/aii-api/v1/notifications/";
	$scope.currentNotificationType = 'received';
	
	/* Miscellaneous Variables */
	//OrderBy property : true means display contents in reverse order  
	$scope.reverse = true;
	$scope.orderFilter = 'Timestamp';
    //Alerts that have been marked (for deleting, marking as read, or marking as unread)
	$scope.markedNotifications = [];
	
	/* Initially executed functions */
	getData.get($scope.receivedURL).success(function(data) {
		//Generate the subject for every notification
		for(i = 0; i < data.records.length; i++){
			//If the notification was a request to join a care team...
			if(data.records[i].IsRequest == '1'){
				data.records[i].Subject = 'Invitation - ' + data.records[i]['Patient'];
			}
			//Otherwise the notification is a response to a sent care team invitation
			else{
				if(data.records[i].Response == '1'){
					data.records[i].Subject = 'Accepted - ' + data.records[i].Patient;
				}
				else if(data.records[i]['Response'] == '2'){
					data.records[i].Subject = 'Declined - ' + data.records[i].Patient;
				}
			}
			data.records[i].ShortSubject = data.records[i].Subject;
			if(data.records[i].Subject.length > 30){
				data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
			}
			data.records[i].ShortSenderFacilityName = data.records[i].SenderFacilityName;
			if(data.records[i].SenderFacilityName.length > 17){
				data.records[i].ShortSenderFacilityName = data.records[i].SenderFacilityName.substr(0,14) + "...";
			}
			data.records[i].PatientDOBMonth = data.records[i].PatientDOB.substr(4,2);
			data.records[i].PatientDOBDay = data.records[i].PatientDOB.substr(6, 2);
			data.records[i].PatientDOBYear = data.records[i].PatientDOB.substr(0,4);
		}
		$scope.receivedNotifications = data;
		$scope.currentNotifications = $scope.receivedNotifications;
    });
	
	getData.get($scope.deletedURL).success(function(data) {
		//Generate the subject for every notification
		for(i = 0; i < data.records.length; i++){
			//If the notification was a request to join a care team...
			if(data.records[i].IsRequest == '1'){
				data.records[i].Subject = 'Invitation - ' + data.records[i]['Patient'];
			}
			//Otherwise the notification is a response to a sent care team invitation
			else{
				if(data.records[i].Response == '1'){
					data.records[i].Subject = 'Accepted - ' + data.records[i].Patient;
				}
				else if(data.records[i]['Response'] == '2'){
					data.records[i].Subject = 'Declined - ' + data.records[i].Patient;
				}
			}
			data.records[i].ShortSubject = data.records[i].Subject;
			if(data.records[i].Subject.length > 30){
				data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
			}
			data.records[i].ShortSenderFacilityName = data.records[i].SenderFacilityName;
			if(data.records[i].SenderFacilityName.length > 17){
				data.records[i].ShortSenderFacilityName = data.records[i].SenderFacilityName.substr(0,14) + "...";
			}
			data.records[i].PatientDOBMonth = data.records[i].PatientDOB.substr(4,2);
			data.records[i].PatientDOBDay = data.records[i].PatientDOB.substr(6, 2);
			data.records[i].PatientDOBYear = data.records[i].PatientDOB.substr(0,4);
		}
		$scope.deletedNotifications = data;
    });
	
	$scope.setNotificationType = function(notificationType){
		$scope.currentNotificationType = notificationType;
		
		switch($scope.currentNotificationType){
			case 'received':
				$scope.currentNotifications = $scope.receivedNotifications;
				$scope.showFrom = true;
				$scope.showSubject = true;
				$scope.showTimestamp = true;
				$scope.showRestore = false;
				$scope.showDelete = true;
				$scope.showFullDelete = false;
				break;
			case 'deleted':
				$scope.currentNotifications = $scope.deletedNotifications;
				$scope.showFrom = true;
				$scope.showSubject = true;
				$scope.showTimestamp = true;
				$scope.showRestore = true;
				$scope.showDelete = false;
				$scope.showFullDelete = true;
				break;
		}
	}
	
	$scope.isTypeSelected = function(notificationType){
		if(notificationType == $scope.currentNotificationType){
			return true;
		}
		return false;
	}
	
	$scope.togglePopup = function(notification){
		if($scope.showPopup){
			$scope.selectedNotification = [];
		}
		else{
			$scope.selectedNotification = notification;
			//Mark the selected notification as read
			if($scope.selectedNotification.IsRead == 0){
				putNotificationURL = $scope.notificationURL + $scope.selectedNotification.NotificationID;
				$scope.selectedNotification.IsRead = 1;
				putData.put(putNotificationURL, $scope.selectedNotification).success(function(data){
					$scope.refreshNotifications();
				});
			}
		}
		$scope.showPopup = !$scope.showPopup;
	}
	
	$scope.hidePopup = function(){
		$scope.showPopup = false;
		$scope.selectedNotification = [];
	}
	
	$scope.deleteSelectedNotification = function(deletedState){
		notificationURL = "http://killzombieswith.us/aii-api/v1/notifications/" + $scope.selectedNotification.NotificationID;
		//Change the notification's Deleted attribute to true
		$scope.selectedNotification.IsArchived = deletedState;
		//PUT the notification using the URL and then refresh the notifications
		putData.put(notificationURL, $scope.selectedNotification).success(function(data){
			$scope.refreshNotifications();
		});
		$scope.refreshNotifications();
	}
	
	$scope.refreshNotifications = function(){
		$scope.refreshReceived();
		$scope.refreshDeleted();
	}
	
	$scope.refreshReceived = function(){
		getData.get($scope.receivedURL).success(function(data) {
			//Generate the subject for every notification
			for(i = 0; i < data.records.length; i++){
				//If the notification was a request to join a care team...
				if(data.records[i].IsRequest == '1'){
					data.records[i].Subject = 'Invitation - ' + data.records[i]['Patient'];
				}
				//Otherwise the notification is a response to a sent care team invitation
				else{
					if(data.records[i].Response == '1'){
						data.records[i].Subject = 'Accepted - ' + data.records[i].Patient;
					}
					else if(data.records[i]['Response'] == '2'){
						data.records[i].Subject = 'Declined - ' + data.records[i].Patient;
					}
				}
				data.records[i].ShortSubject = data.records[i].Subject;
				if(data.records[i].Subject.length > 30){
					data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
				}
				data.records[i].ShortSenderFacilityName = data.records[i].SenderFacilityName;
				if(data.records[i].SenderFacilityName.length > 17){
					data.records[i].ShortSenderFacilityName = data.records[i].SenderFacilityName.substr(0,14) + "...";
				}
				data.records[i].PatientDOBMonth = data.records[i].PatientDOB.substr(4,2);
				data.records[i].PatientDOBDay = data.records[i].PatientDOB.substr(6, 2);
				data.records[i].PatientDOBYear = data.records[i].PatientDOB.substr(0,4);
			}
			$scope.receivedNotifications = data;
			if($scope.currentNotificationType == 'received'){
				$scope.currentNotifications = $scope.receivedNotifications;
			}
		});
	}
	
	$scope.refreshDeleted = function(){
		getData.get($scope.deletedURL).success(function(data) {
			//Generate the subject for every notification
			for(i = 0; i < data.records.length; i++){
				//If the notification was a request to join a care team...
				if(data.records[i].IsRequest == '1'){
					data.records[i].Subject = 'Invitation - ' + data.records[i]['Patient'];
				}
				//Otherwise the notification is a response to a sent care team invitation
				else{
					if(data.records[i].Response == '1'){
						data.records[i].Subject = 'Accepted - ' + data.records[i].Patient;
					}
					else if(data.records[i]['Response'] == '2'){
						data.records[i].Subject = 'Declined - ' + data.records[i].Patient;
					}
				}
				data.records[i].ShortSubject = data.records[i].Subject;
				if(data.records[i].Subject.length > 30){
					data.records[i].ShortSubject = data.records[i].Subject.substr(0,27) + "...";
				}
				data.records[i].ShortSenderFacilityName = data.records[i].SenderFacilityName;
				if(data.records[i].SenderFacilityName.length > 17){
					data.records[i].ShortSenderFacilityName = data.records[i].SenderFacilityName.substr(0,14) + "...";
				}
				data.records[i].PatientDOBMonth = data.records[i].PatientDOB.substr(4,2);
				data.records[i].PatientDOBDay = data.records[i].PatientDOB.substr(6, 2);
				data.records[i].PatientDOBYear = data.records[i].PatientDOB.substr(0,4);
			}
			$scope.deletedNotifications = data;
			if($scope.currentNotificationType == 'deleted'){
				$scope.currentNotifications = $scope.deletedNotifications;
			}
		}); 
	}
	
	$scope.order = function(filter){
		$scope.reverse = !($scope.reverse);
		$scope.orderFilter = filter;
	}
	
	$scope.markNotification = function(notification, checkbox){
		//If checkbox was just selected, add the message as marked
		if(checkbox.checked){
			$scope.markedNotifications.push(notification);
		}
		//On unselecting a checkbox, find the message and remove it from the marked messages
		else{
			for(i = 0; i < $scope.markedNotifications.length; i++){
				if($scope.markedNotifications[i] == notification){
					//Remove the input message from the marked array
					$scope.markedNotifications.splice(i,1);
				}
			}
		}
	}
	
	//Add all the notifications in the input to the marked notifications
	markAllNotifications = function(sourceCheckbox){
	
		switch($scope.currentNotificationType){
			case 'received':
				notifications = $scope.receivedNotifications.records;
				break;
			case 'deleted':
				notifications = $scope.deletedNotifications.records;
				break;
			default:
				notifications = [];
				break;
		}
		
		checkboxName = 'notificationCheckbox';
		
		//Find all the checkboxes that will be affected by this function
		checkboxes = document.getElementsByName(checkboxName);
		for(i = 0; i < checkboxes.length; i++){
			checkboxes[i].checked = sourceCheckbox.checked;
		}
		//If the checkbox is checked, add all notifications as marked
		if(sourceCheckbox.checked){
			for(i = 0; i < notifications.length; i++){
				$scope.markedNotifications.push(notifications[i]);
			}
		}
		//When unchecked, remove all notifications from marked
		else{
			$scope.clearMarkedNotifications();
		}
	}
	
	//Remove all messages from the marked messages array
	$scope.clearMarkedNotifications = function(){
		$scope.markedNotifications = [];
		
		//Mark all the checkboxes as unchecked
		checkboxNames = ['notificationCheckbox', 'controlCheckbox'];
		
		for(i = 0; i < checkboxNames.length; i++)
		{
			checkboxes = document.getElementsByName(checkboxNames[i]);
			for(j = 0; j < checkboxes.length; j++)
			{
				checkboxes[j].checked = false;
			}
		}
	}
	
	//Send a PUT request with the user-defined property and value
	$scope.putMarkedNotifications = function(property, value){
		//Parse value (string) as an int (in base 10)
		value = parseInt(value, 10);
		if(property == 'read'){
			for(i = 0; i < $scope.markedNotifications.length; i++){
				putNotificationURL = $scope.notificationURL + $scope.markedNotifications[i].NotificationID;
				//Change the message's Deleted attribute to true
				$scope.markedNotifications[i].IsRead = value;
				//PUT the message using the message URL
				putData.put(putNotificationURL,$scope.markedNotifications[i]).success(function(data){
					$scope.refreshNotifications();
				});
				
			}
		}
		else if(property == 'deleted'){
			for(i = 0; i < $scope.markedNotifications.length; i++){
				putNotificationURL = $scope.notificationURL + $scope.markedNotifications[i].NotificationID;
				//Change the message's Deleted attribute to true
				$scope.markedNotifications[i].IsArchived = value;
				//PUT the message using the message URL
				putData.put(putNotificationURL,$scope.markedNotifications[i]).success(function(data){
					$scope.refreshNotifications();
				});
			}
		}
	}
	
	$scope.respondToRequest = function(status){
		putNotificationURL = $scope.notificationURL + $scope.selectedNotification.NotificationID;
		$scope.selectedNotification.Response = status;
		$scope.selectedNotification.IsArchived = 2;
		putData.put(putNotificationURL, $scope.selectedNotification).success(function(data){
			$scope.refreshNotifications();
		});
	}
};


//*********************************END NOTIFICATION CONTROLLERS***************************************// 
 
 
 
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
controllers.loginControl = function ($scope,$http,$window,persistData,getData, $location, userInfo, cookie, $cookieStore, $timeout ){
    
    $scope.userlogin = {};
    $scope.dataObj = {};
    $scope.loggedIn = false;
    $scope.invalidLogin = false;
    $scope.tokenTimeout = false;
    $scope.invalidToken = false;
    
    //Used by Terry for testing. Will delete before production
    var c = {};
    c['one'] = 1;
    cookie.set(c);
    //end added by Terry
    
	//Check if the user has a SessionID stored on their machine
	var cookieSessionID = $cookieStore.get('SessionID');
	//If SessionID is stored...
	if(cookieSessionID){
		//Check if this token is valid
		var userTokenURL = "http://killzombieswith.us/aii-api/v1/users/one/" + cookieSessionID;
		getData.get(userTokenURL).success(function(data) {
			//If SessionID is valid:
			//		-store user information
			//		-redirect to dashboard
			if(data.records['error'] != 'Token Timeout' && data.records['error'] != "Invalid Token"){
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
				info.UserLevelID = data.records.UserLevelID;
                $scope.userLevel = data.records.UserLevelID;
				userInfo.set(info);
				
				//Store the user level in the persistData factory
				persistData.setUserLevel(info.UserLevelID);
				
				//Redirect the user to the dashboard if they were going to the login page
				if($window.location.pathname == "#" || $window.location.pathname == ""){
					$window.location.href = "#/dashboard";
				}
			}
			//If SessionID is invalid, redirect to login page
			else{
				console.log("Bad cookie! sending to login page")
				$scope.loggedIn = false;
				$cookieStore.remove('SessionID');
				$cookieStore.remove('UserLevel');
                if(data.records['error'] == 'Token Timeout'){
                    $cookieStore.put('BadToken','Token Timeout');
                }
                if(data.records['error'] == "Invalid Token"){
                    $cookieStore.put('BadToken','Invalid Token');
                }
                $window.location.href = "#";
				location.reload();
			}
		});
	}
	//If no stored SessionID, redirect to login page
	else{
		$scope.loggedIn = false;
        if($cookieStore.get('BadToken') == "Token Timeout"){
            $scope.tokenTimeout = true;
        }
        if($cookieStore.get('BadToken') == "Invalid Token"){
            $scope.invalidToken = true;
        }
	}
	
	
    $scope.loginStatus = function(){
        $scope.loggedIn = persistData.getLogged();
        console.log("Logged In Status Called");
        console.log($scope.loggedIn);
    };
    
    $scope.devLogin = function(){
        $scope.loggedIn = true;
    };
    
    $scope.setUsername = function(){
        $scope.name = userInfo.get().Name;
        $scope.title = userInfo.get().Title;
    }

    $scope.submit = function(){

        $cookieStore.remove('BadToken');
        $scope.tokenTimeout = false;
        $scope.invalidToken = false;
        
        $http({
            method  : 'POST',
            url     : 'http://killzombieswith.us/aii-api/v1/sessionLogs',
            data    : $scope.userlogin,
            headers : { 'Content-Type': 'application/json' }
        })
        .then(function(data){
            if(data.data.records.SessionID){
                $scope.sessionID=data.data.records.SessionID;
                persistData.setLoggedIn(true);
                userInfo.set(data.data.records);
                $scope.userLevel = data.data.records.UserLevelID;
                $scope.loggedIn = true;
                $window.location.href = "#/dashboard";
                
            }
            else {
              
                $window.location = "#/";
                $scope.invalidLogin = true;
                $scope.userlogin.username = "";
                $scope.userlogin.password = "";
                $timeout(function(){
                    $scope.invalidLogin = false;
                }, 2000);
                
            
            }
        });
    }
    
    $scope.logout = function() {
        console.log("in logout function");
        $http({
            method  : "DELETE",
            url     : "http://killzombieswith.us/aii-api/v1/sessionLogs/" + cookieSessionID,
            headers : { 'Content-Type': 'application/json' }
        })
        .then(function(response){
            $scope.loggedIn = false;
        });
		
		//Remove the Session ID and User Level from the cookie
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
    }
}

    
//**********************************END LOGIN/LOGOUT CONTROLLERS**************************************//



//************************************MISCELLANEOUS CONTROLLERS***************************************//


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
controllers.composeMessage = function($scope, $http){

    $scope.composeObject = {};

    $scope.messageForm = function() {
        $http({
            method  : 'POST',
            url     : 'http://killzombieswith.us/aii-api/v1/messages',
            data    : $scope.composeObject,  // do not put param
            headers : { 'Content-Type': 'application/json' }
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
controllers.ngBindHtmlCtrl = function ($scope, $sce) {
  $scope.myHTML =
     'I am an <code>HTML</code>string with <a href="#">links!</a> and other <em>stuff</em>';
    $scope.trustedHtml = $sce.trustAsHtml($scope.myHTML);
    $scope.textBox= $sce.trustAsHtml('<input  type="text" > </input>'); 
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
	$scope.unreadMessageURL = "http://killzombieswith.us/aii-api/v1/users/unreadMessagesCount/" + $scope.sessionID;
	
    
getData.get($scope.unreadMessageURL).success(function(data) {
            $scope.messageCount = data.records.messageCount;
            $scope.icon = {"count" : $scope.messageCount};
        });
    
    $scope.$on('handleBroadcast', function(){
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
 
