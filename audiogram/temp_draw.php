<!DOCTYPE html>
<html lang="en">
  <head>
   <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">

<!-- Optional theme -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css">

<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
    <style>
      body {
        margin: 10px;
        padding: 10px;
      }
      .aud-measure{
      	 font-size:24px;
      	 
      }
.btn:focus {
  border: 1px solid blue;
}
    </style>
  </head>
  <body>
	<div class="container-fluid">
	  <div class="row">
		<div class="col-md-4">
			<canvas id="myCanvas" width="500" height="500"></canvas>
		</div>
		<div class="col-md-2">
		  <div class="btn-group-vertical">
		     <button type="button" class="btn btn-default aud-measure" >&bigcirc;&nbsp;&nbsp;&nbsp;AC&nbsp;&nbsp;&nbsp;&#10005;</button>
		     <button type="button" class="btn btn-default aud-measure" >&lt;&nbsp;&nbsp;&nbsp;BC&nbsp;&nbsp;&nbsp;&gt;</button>
		     <button type="button" class="btn btn-default aud-measure" >M&nbsp;&nbsp;&nbsp;MCL&nbsp;&nbsp;&nbsp;M</button>
		     <button type="button" class="btn btn-default aud-measure" >m&nbsp;&nbsp;&nbsp;UCL&nbsp;&nbsp;&nbsp;m</button>
		     <button type="button" class="btn btn-default aud-measure" >S&nbsp;&nbsp;&nbsp;SF&nbsp;&nbsp;&nbsp;S</button>
		     <button type="button" class="btn btn-default aud-measure" >A&nbsp;&nbsp;&nbsp;SF-A&nbsp;&nbsp;&nbsp;A</button>
		  </div>
		</div>
		<div class="col-md-4">
			<canvas id="myCanvas" width="600" height="600"></canvas>
		</div>
	  </div> <!-- End Row -->
	</div> <!-- End Container -->
    <script>
    // poll design
      var i=0;		//indexes
      var x=0;
      var y=0;
      
      var canvas = document.getElementById('myCanvas');
      var ctx = canvas.getContext('2d');
      
      ctx.font = '12pt helvetica';
      
      var canvas_width = $('#myCanvas').width();
      var canvas_height = $('#myCanvas').height();
      
      var column_width = 0;			//width of a column function based on width
      var row_height = 0;			//height of a row function based on height
      
      var canvas_buffer = 0;		//padding in pixels?
      var margin_top = 20;
      var margin_left = 10;
      var margin_right = 0;
      var margin_bottom = 20;
      
      //Arrays to hold labels
      var x_labels = [];
      var y_labels = [];
      
      //Load X labels (frequencies)
      for(var i=125;i<=8000;i*=2){
      	  var Label = "";
      	  if(i>=1000){
      	  	 Label = (i/1000) + 'K';
      	  }else{
      	     Label = i;
      	  }
      	  	 
      	  x_labels.push(Label);
      }     

      //Load Y labels (dB presentation level)     
      for(var i=-10;i<=120;i+=10){
      	  y_labels.push(i);
      }     
      
	  //Calculate row and column size based on:
	  //		canvas width and height
	  //		any margins that might effect them
	  //Added one to x.labels.length for spacing
      column_width = (canvas_width - (margin_right + margin_left)) / (x_labels.length + 1);
      row_height = (canvas_height - (margin_top + margin_bottom)) / (y_labels.length + 1);
	  
      // add linear gradient
//       var grd = ctx.createLinearGradient(canvas_width/2, 0, canvas_width/2, canvas.height);
//       grd.addColorStop(0, '#FFFFFF');   
//       grd.addColorStop(1, '#EEEEEE');
//       ctx.fillStyle = grd;
//       ctx.fill();

      //Draw Outer border
      ctx.rect(0, 0, canvas_width, canvas_height);      
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'black';
	  ctx.stroke();	  
	  //Draw x (top) Labels and lines
	  for(i=0,x=margin_left+column_width;i<x_labels.length;i++,x+=column_width){
      	  ctx.fillText(x_labels[i], x-10, margin_top*2);
		  ctx.beginPath();
		  ctx.moveTo(x, margin_top+row_height);
		  ctx.lineTo(x, canvas_height-row_height-margin_bottom);
		  ctx.stroke();
      }
      
      //Draw y (left) Labels and lines
	  for(i=0,y=margin_top+row_height;i<y_labels.length;i++,y+=row_height){
      	  ctx.fillText(y_labels[i], margin_left, y+5);
		  ctx.beginPath();
		  ctx.moveTo(margin_left+column_width,y);
		  ctx.lineTo(canvas_width-column_width,y);
		  ctx.stroke();
      }
      
      canvas.addEventListener('click', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        console.log(message);
        getFrequency(mousePos.x,mousePos.y);
      }, false);
      
    
      function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }      
      
      function snapToGrid(x,y){
      
      }
      
      //Get the closest frequency based on a mouseclick
      function getFrequency(x,y){
      	 x = Math.round(x / column_width);
      	 console.log(x*column_width);
      	 console.log(x_labels[x-1]);
      }
      
    </script>

  </body>
</html>