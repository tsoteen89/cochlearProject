<!DOCTYPE HTML>
<html>
  <head>
   <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <style>
      body {
        margin: 0px;
        padding: 0px;
      }
    </style>
  </head>
  <body>
    <canvas id="myCanvas" width="600" height="600"></canvas>
    <script>
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
      var top_margin = 20;
      var left_margin = 10;
      var right_margin = 0;
      var bottom_margin = 0;
      
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
      column_width = (canvas_width - (right_margin + left_margin)) / (x_labels.length + 1);
      row_height = (canvas_height - (right_margin + left_margin)) / (y_labels.length + 1);

      column_height = canvas_height / y_labels.length;
	  
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
	  //Draw x (top) Labels
	  for(i=0,x=left_margin+column_width;i<x_labels.length;i++,x+=column_width){
      	  ctx.fillText(x_labels[i], x, top_margin);
		  ctx.beginPath();
		  ctx.moveTo(x, top_margin);
		  ctx.lineTo(x, canvas_height);
		  ctx.stroke();
      }
      
      //Draw y (left) Labels
	  for(i=0,y=top_margin+row_height;i<y_labels.length;i++,y+=row_height){
      	  ctx.fillText(y_labels[i], left_margin, y);
		  ctx.beginPath();
		  ctx.moveTo(left_margin,y);
		  ctx.lineTo(canvas_width,y);
		  ctx.stroke();
      }
      
      
      
      //Draw col lines
      
      
      
      
      
      
      
      
      
      
    </script>

  </body>
</html>