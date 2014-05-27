<!DOCTYPE html>
<html lang="en" data-ng-app="careTeamApp">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<meta charset="utf-8">
		<meta name="generator" content="Bootply" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<link href="css/bootstrap.min.css" rel="stylesheet">
		<!--[if lt IE 9]>
			<script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
		<link href="css/styles.css" rel="stylesheet">


	</head>
	<body>
<!-- Header -->
<div id="top-nav" class="navbar navbar-inverse navbar-static-top">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
          <span class="icon-toggle"></span>
      </button>
      <a class="navbar-brand" href="../route.html">AII</a>
    </div>
    <div class="navbar-collapse collapse">
      <ul class="nav navbar-nav navbar-right">

	    <li class="dropdown">
          <a class="dropdown-toggle" role="button" data-toggle="dropdown" href="#">
            <i class="glyphicon glyphicon-user"></i> Care Teams <span class="caret"></span></a>
          <ul id="g-account-menu" class="dropdown-menu" role="menu">
            <li><a href="#/newCareTeam">New Care Team</a></li>
            <li><a href="#/editCareTeam">Edit Care Team</a></li>
          </ul>
        </li>

        <li class="dropdown">
          <a class="dropdown-toggle" role="button" data-toggle="dropdown" href="#">
            <i class="glyphicon glyphicon-user"></i> User <span class="caret"></span></a>
          <ul id="g-account-menu" class="dropdown-menu" role="menu">
            <li><a href="#">My Profile</a></li>
            <li><a href="#"><i class="glyphicon glyphicon-lock"></i> Logout</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div><!-- /container -->
</div>
<!-- /Header -->

<!-- Main -->

        <div class="container">

  <!-- upper section -->
  <div class="row">
	<div class="col-md-3">
      <!-- left -->
      <a href="#"><strong><i class="glyphicon glyphicon-briefcase"></i> Toolbox</strong></a>
      <hr>

      <ul class="nav nav-pills nav-stacked">
        <li><a href="#home"> Facility Home</a></li>
        <li><a href="#careteams">Care Teams</a></li>
        <li><a href="#patientpage">Patient Page</a></li>
        <li><a href="#insert">Insert Patient</a></li>
        <li><a href="#invitations">Invitations</a></li>
        <li><a href="#providers">Providers</a></li>
        <li><a href="#tools"><i class="glyphicon glyphicon-briefcase"></i> Tools</a></li>
      </ul>

      <hr>

  	</div><!-- /span-3 -->
    <div class="col-md-9">

      <!-- column 2 -->


       <a href="#"><strong><i class="glyphicon glyphicon-dashboard"></i> My Dashboard</strong></a>

       <hr>

	  <div ng-view></div>


  </div><!--/row-->
  <!-- /upper section -->


  <!-- lower section -->


</div><!--/container-->
<!-- /Main -->






<footer class="text-center">This Bootstrap 3 dashboard layout is compliments of <a href="http://www.bootply.com/85850"><strong>Bootply.com</strong></a></footer>


<div class="modal" id="addWidgetModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">�</button>
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
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular.min.js"></script>
<!--<script src="js/angular.js"></script> -->
<script src="js/angular-route.js"></script>      
<script src="js/jquery.min.js"></script>
<script src="js/app.js"></script>
<script src="js/app.directives.js"></script>
<script src="js/careTeamControllers/ct_patientcontrollers.js"></script>
<script src="js/careTeamControllers/ct_careteamcontrollers.js"></script>
<script src="js/careTeamControllers/ct_invitationscontrollers.js"></script>
<script src="js/careTeamControllers/ct_insertpatientcontrollers.js"></script>
<script src="js/careTeamControllers/ct_newCareTeamCtrl.js"></script>
<script src="js/careTeamControllers/ct_editCareTeamCtrl.js"></script>            
<script src="//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.10.0/ui-bootstrap.js"></script>
<link rel="stylesheet" type="text/css" href="css/styles.css">
<link href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet">
<script src="//angular-ui.github.io/bootstrap/ui-bootstrap-tpls-0.11.0.js"></script>
	</body>
</html>
