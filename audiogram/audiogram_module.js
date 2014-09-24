var audiogramModule = (function (jQ) {
    //Data members
    var i=0;		//indexes
    var x=0;
    var y=0;

    var canvas = null;          //Future reference to html element
    var ctx = null;             //Future canvas reference

    var canvas_width = 0        //Width of canvas in pixels
    var canvas_height = 0       //Height of canvas in pixels

    var column_width = 0;		//width of a column function based on width of canvas
    var row_height = 0;			//height of a row function based on height of canvas
 
    var canvas_buffer = 0;		//padding in pixels?
    var top_margin = 20;
    var left_margin = 10;
    var right_margin = 0;
    var bottom_margin = 0;

    var x_labels = [];          //Arrays to hold labels
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

    
    function audiogrammodule(target_id) {
        canvas = document.getElementById(target_id);
        ctx = canvas.getContext('2d');
        canvas_width = $('#'+target_id).width();
        canvas_height = $('#'+target_id).height();
        console.log(canvas_width+ " " + canvas_height);
        ctx.font = '10pt helvetica';
        canvas.addEventListener('click', function(evt) {
            var mousePos = _getMousePos(canvas, evt);
            var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
            console.log(message);
            _getFrequency(mousePos.x,mousePos.y);
        }, false);
        _calcRowColSize();
        _drawOuterBorder();
        _addFrequencyLabels();
        _addDBLabels();
    }
    
    //Calculate row and column size based on:
    //		canvas width and height
    //		any margins that might effect them
    //Added one to x.labels.length for spacing
    function _calcRowColSize() {
        column_width = (canvas_width - (right_margin + left_margin)) / (x_labels.length + 1);
        row_height = (canvas_height - (right_margin + left_margin)) / (y_labels.length + 1);
    }


    //Draw Outer border
    function _drawOuterBorder(){
        ctx.rect(0, 0, canvas_width, canvas_height);      
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }
    
    //Draw x (top) Labels
    function _addFrequencyLabels(){
        for(i=0,x=left_margin+column_width;i<x_labels.length;i++,x+=column_width){
            ctx.fillText(x_labels[i], x, top_margin);
            ctx.beginPath();
            ctx.moveTo(x, top_margin);
            ctx.lineTo(x, canvas_height);
            ctx.stroke();
        }
    }

    //Draw y (left) Labels
    function _addDBLabels(){
        for(i=0,y=top_margin+row_height;i<y_labels.length;i++,y+=row_height){
            ctx.fillText(y_labels[i], left_margin, y);
            ctx.beginPath();
            ctx.moveTo(left_margin,y);
            ctx.lineTo(canvas_width,y);
            ctx.stroke();
        }
    }
    
    function _getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }      

    function _snapToGrid(x,y){

    }

    //Get the closest frequency based on a mouseclick
    function _getFrequency(x,y){
        x = Math.round(x / column_width);
        console.log(x*column_width);
        console.log(x_labels[x-1]);
    }
    

    
    audiogrammodule.prototype = {
        initCanvas: function(element_id) {
            this.audiogrammodule(element_id);
        } 
    }
    
    // Return an object exposed to the public
    return audiogrammodule;
})(jQuery);   
    
    
    