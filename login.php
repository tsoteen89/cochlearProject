<?php
	/*
	$U = new Users('rootLoginName', 'rootLoginPassword');
	$encryptedPassword = md5($_POST['password']);
	if(isset($_POST['login']))
	{
		$U->login($_POST['username'], $encryptedPassword);
	}
	
	class Users
	{
		var $connect;
		var $db;
		function __construct($username, $password)
		{
			if(!$this->connect = mysql_connect('localhost', $username, $password))
			{
				echo "Failed to connect!";
			}
			$this->db = mysql_select_db('databaseName');
		}
		//Moves to the home page if username and password are correct
		public function login($username, $password)
		{
			$result = mysql_query("SELECT * FROM users WHERE username='$username' and password='$password'");
			$count = mysql_num_rows($result);
			if($count==1)
			{
				$_SESSION["username"] = $username;
				$_SESSION["password"] = $password;
				header("location:#/myHome");
			}
			else
			{
				echo "Incorrect Username/Password";
			}
		}
		//Returns the next unique ID
		private function getMaxID()
		{
			$result = mysql_query("SELECT MAX(userID) AS Max FROM users");
			list($id) = mysql_fetch_array($result);
			
			$id++;
			return $id;
		}
	}
	*/
?>

<!DOCTYPE html>
<html lang="en" ng-app="myApp">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<meta charset="utf-8">
		<title>Login</title>
		<meta name="generator" content="Bootply" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<link href="css/bootstrap.min.css" rel="stylesheet">
		<!--[if lt IE 9]>
			<script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
		<link href="css/styles.css" rel="stylesheet">
	<style>
		.txt {
		width: 300px;
		}
	</style>
	</head>
	
	<body>
<!-- Header -->

<!-- /Header -->

<!-- Main -->
<div class="container">
  
  <!-- upper section -->
  <div class="row">
	
    <div class="col-md-9">
      	
      <!-- column 2 -->	
	   <div class="row">
            <!-- center left-->	
         	<div class="col-md-12">
			 

              
              <div class="panel panel-default">
				<div class="panel-heading">
				  <div class="panel-title">
					<i class="glyphicon glyphicon-wrench pull-right"></i>
					<h4>User Login</h4>
				  </div>
				</div>
				<div class="panel-body" ng-controller="TabController as tab">
				  <div class="tabbable"> <!-- Only required for left/right tabs -->
					  <br>
					  
					  <!--<div class="tab-content">-->
					  
						<div class="tab-pane">
						  <form id="userLogin" class="form form-vertical" action="login.php" method="post">
							
							<div class="control-group">
							  <label>Username</label>
							  <div class="controls">
								<input type='text' class="form-control" name='username' placeholder="Enter Username">
							  </div>
							</div>
							
							<div class="control-group">
							  <label>Password</label>
							  <div class="controls">
								<input type='password' class="form-control" name='password' placeholder="Enter Password">
							  </div>
							</div>
							
							<div class="control-group">
							  <label></label>
							  <div class="controls">
								<button type="submit" name='login' class="btn btn-primary">
									Login
								</button>
								<a href="#/register">
								  Register
								</a>
							  </div>
							  <br><br>
							  <a href="#/myHome">(Developer) Bypass Login</a>
							</div>
							
							
							
						  </form>
						</div>
					  <!--</div>-->
				</div>
				
				<!-- password title form box?  
				<div class="control-group">
					  <label>Title</label>
					  <div class="controls">
						<input type="password" class="form-control" placeholder="Password">
						
					  </div>
					</div>-->
				  <!-- DropDown thing
					<div class="control-group">
					<label>Select Phase of Care</label>				  
				  <div class="controls">
								<select class="form-control">
								<option>Demographics</option>
								<option>Candidacy Testing</option>
								<option>Initial Surgical Consultation</option>
								<option>Preoperative Visit</option>
								<option>1 Week Postoperative Check</option>
								<option>Activation (3 weeks)</option>
								<option>1 month Audiometric Testing</option>  
								<option>3 month Audiometric Testing</</option>
								<option>6 month Audiometric Testing</</option>
								<option>12 month Audiometric Testing</</option>
								<option>24 month Audiometric Testing</</option>
								</select>
							  </div>
							  </div>  
				   -->
				</div><!--/panel content-->
			  </div><!--/panel-->
			  
			  
			
             <!--<div class="panel panel-default">
                  <div class="panel-heading"><h4>Processing Status</h4></div>
                  <div class="panel-body">
                    
                    <small>Complete</small>
                    <div class="progress">
                      <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100" style="width: 72%">
                        <span class="sr-only">72% Complete</span>
                      </div>
                    </div>
                    <small>In Progress</small>
                    <div class="progress">
                      <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 20%">
                        <span class="sr-only">20% Complete</span>
                      </div>
                    </div>
                    <small>At Risk</small>
                    <div class="progress">
                      <div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: 80%">
                        <span class="sr-only">80% Complete</span>
                      </div>
                    </div>

                  </div><!--/panel-body-->
             <!-- </div>--><!--/panel-->                    
              
          	</div><!--/col-->
         
            <!--center-right-->
        	<div class="col-md-5">
              <!--
                <div class="btn-group btn-group-justified">
                  <a href="#" class="btn btn-info col-sm-3">
                    <i class="glyphicon glyphicon-plus"></i><br>
                    Service
                  </a>
                  <a href="#" class="btn btn-info col-sm-3">
                    <i class="glyphicon glyphicon-cloud"></i><br>
                    Cloud
                  </a>
                  <a href="#" class="btn btn-info col-sm-3">
                    <i class="glyphicon glyphicon-cog"></i><br>
                    Tools
                  </a>
                  <a href="#" class="btn btn-info col-sm-3">
                    <i class="glyphicon glyphicon-question-sign"></i><br>
                    Help
                  </a>
                </div>
				-->
              
			</div><!--/col-span-6-->
     
       </div><!--/row-->
  	</div><!--/col-span-9-->
    
  </div><!--/row-->
  <!-- /upper section -->
  
  
  
</div><!--/container-->
<!-- /Main -->


<footer class="text-center">This Bootstrap 3 dashboard layout is compliments of <a href="http://www.bootply.com/85850"><strong>Bootply.com</strong></a></footer>


<div class="modal" id="addWidgetModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">?/button>
        <h4 class="modal-title">Add Widget</h4>
      </div>
      <div class="modal-body">
        <p>Add a widget stuff here..</p>
      </div>
      <div class="modal-footer">
        <a href="#" class="btn">Close</a>
        <a href="#" class="btn btn-primary">Save changes</a>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dalog -->
</div><!-- /.modal -->



  
	<!-- script references -->
		<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js"></script>
		<script src="js/bootstrap.min.js"></script>
		<script src="js/scripts.js"></script>
		<link href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet">
	</body>
</html>