var AudioGram = function(canvas,audiogram_id,side) {
    // Private data
    var private = {
        font_size       : 12,
        audiogram_id    : audiogram_id,
        side            : side,
        canvas          : canvas,
        column_width    : 0,		        //width of a column function based on width of canvas
        row_height      : 0,                //height of a row function based on height of canvas
        margins         : {"top":30,"bottom":30,"left":40,"right":40},
        graph_bounds    : {"min":{"x":0,"y":0},"max":{"x":0,"y":0}},
        graph_size      : {"width":0,"height":0},
        current_measure : null,
        masked          : 'unmasked',       //Masked = masked Unmasked = unmasked :)
        x_labels        : [],               //Values displayed on top of audiogram
        y_labels        : [],               //These are the values on the left of the audiogram
        x_labls_grp     : null,
        y_labls_grp     : null, 
        horiz_lines_grp : null,
        vert_lines_grp  : null,
        rectgles_grp    : null,
        background_group: null,             //fabric group that represents all background drawings.
        x_values        : [],               //When audiogram is clicked, these are the values that
        y_values        : [],               //-are "snapped" to.
        audiogram_vals  : [],
        coordsrect      : null,
        snapcircle      : null,
        colors          : {
                            "background":"#000000",
                            "draw_line":"#000000",
                            "border":"#000000",
                            "graph_lines":"#000000",
                            "labels":"#000000",
                            "fill":"#000000"
                        },
        measureImages : {
                "AC": {
                    "unmasked": {
                        "right": "./images/AC_Right.png",
                        "left": "./images/AC_Left.png"
                    },
                    "masked": {
                        "right": "./images/AC_Right_Masked.png",
                        "left": "./images/AC_Left_Masked.png"
                    }
                },
                "BC": {
                    "unmasked": {
                        "right": "./images/BC_Right.png",
                        "left": "./images/BC_Left.png"
                    },
                    "masked": {
                        "right": "./images/BC_Right_Masked.png",
                        "left": "./images/BC_Left_Masked.png"
                    }
                },
                "MCL": {
                    "unmasked": {
                        "right": "./images/MCL.png",
                        "left": "./images/MCL.png"
                    },
                    "masked": {
                        "right": "./images/MCL.png",
                        "left": "./images/MCL.png"
                    }
                },
                "UCL": {
                    "unmasked": {
                        "right": "./images/UCL.png",
                        "left": "./images/UCL.png"
                    },
                    "masked": {
                        "right": "./images/UCL.png",
                        "left": "./images/UCL.png"
                    }
                },
                "SF": {
                    "unmasked": {
                        "right": "./images/SF.png",
                        "left": "./images/SF.png"
                    },
                    "masked": {
                        "right": "./images/SF.png",
                        "left": "./images/SF.png"
                    }
                },
                "SF-A": {
                    "unmasked": {
                        "right": "./images/SF-A.png",
                        "left": "./images/SF-A.png"
                    },
                    "masked": {
                        "right": "./images/SF-A.png",
                        "left": "./images/SF-A.png"
                    }
                }
        },
        /**
        * Initializes the audiogram graph
        * @param {null} 
        * @return {null} 
        * @constructor
        */
        _init : function(){
            var x;
            var y;
            var i;
            
            this.canvas.calcOffset();

            console.log('constructor '+this.side);
            
            //Initialize the canvas by locking it to it's element and 
            //attaching some event listeners to it.
            console.log(this.canvas);

            //Load X labels (frequencies) into array
            for(i=125;i<=8000;i*=2){
                var Label = "";
                if(i>=1000){
                    Label = (i/1000) + 'K';
                }else{
                    Label = i;
                }

                this.x_labels.push(Label);
            }

            //Load Y labels (dB presentation level) into array
            
            for(i=-10;i<=120;i+=10){
                if(i<0)
                    this.y_labels.push(i);
                else if(i<10)
                    this.y_labels.push('  '+i);
                else if(i<100)
                    this.y_labels.push(' '+i);
                else
                    this.y_labels.push(i);
            }
            
            
            //Sets all the boundaries necessary for computing position and intersection stuff easily
            this.graph_bounds.min.x = this.margins.left;
            this.graph_bounds.min.y = this.margins.top;
            this.graph_bounds.max.x = this.canvas.width - this.margins.right;
            this.graph_bounds.max.y = this.canvas.height - this.margins.bottom;
            this.graph_size.width = this.canvas.width-(this.margins.left+this.margins.right);
            this.graph_size.height = this.canvas.height-(this.margins.top+this.margins.bottom);
            
            //calculate row width and column height so they get drawn evenly in the alloted space
            this.column_width = Math.floor((this.graph_bounds.max.x - this.graph_bounds.min.x) / (this.x_labels.length));      
            this.row_height = Math.floor((this.graph_bounds.max.y - this.graph_bounds.min.y) / (this.y_labels.length));            

            //Load extra X values because we want more possibilities than just the listed frequencies.
            this.x_values = [{"value":125,"x":null},{"value":250,"x":null},{"value":375,"x":null},{"value":500,"x":null},{"value":750,"x":null},
                             {"value":1000,"x":null},{"value":1500,"x":null},{"value":2000,"x":null},{"value":3000,"x":null},{"value":4000,"x":null},
                             {"value":6000,"x":null},{"value":8000,"x":null}];
            
            //Calculate the x coordinates for each line. Not necessary, but I'll do it now and store that values to make
            //it easier later to "snap" to the lines when clicking.
            for(i=0,x=this.graph_bounds.min.x+this.column_width/2 ;i<this.x_values.length;i++,x+=this.column_width/2){
                if(i==1)
                    x+=this.column_width/2;
                this.x_values[i].x = x;
            }
            
            //Load Y possible values because we want more possibilities than just the labels
            //I add 20 because that's how I shifted the actual lines. Needs fixing.
            for(i=-10,y=this.graph_bounds.min.y+20;i<=120;i+=5,y+=this.row_height/2){
                this.y_values.push({"value":i,"y":y});
            }
            //console.log(this.y_values);
            
            //Set the colors for left or right (red=right blue=left)
            if(this.side=='right')
                this.colors.draw_line = "#FF0000";
            else
                this.colors.draw_line = "#0000FF";
            
            
            //Now we draw the outerborder, addsome labels, and draw all the graph lines.
            this.drawBackground();

        },
        addMeasure : function(){
            console.log('addMeasure '+this.side);
            
        },
        drawBackground : function(){
            console.log('drawLabels '+this.side);
            
            var i;
            var x;
            var y;
            var text = [];
            var lines = [];
            
            var rect1 = new fabric.Rect({
                left: 0,
                top: 0,
                stroke : 'black',
                strokeWidth : 1,
                fill : 'white',
                width: this.canvas.width-4,
                height: this.canvas.height-4,
                shadow: 'rgba(0,0,0,0.3) 3px 3px 3px',
                selectable: false
            });            
            
            var rect2 = new fabric.Rect({
                left: this.graph_bounds.min.x,
                top: this.graph_bounds.min.y,
                stroke : 'black',
                strokeWidth : 1,
                fill : 'white',
                width: this.graph_size.width,
                height: this.graph_size.height,
                shadow: 'rgba(0,0,0,0.3) 3px 3px 3px',
                selectable: false
            });            
            
            this.rectgles_grp = new fabric.Group([rect1,rect2],{
                left:0,
                top:0,
                selectable: false
            });
            this.canvas.add(this.rectgles_grp);            
            
            //Add x labels acress top
            text = [];
            y = this.graph_bounds.min.y;
            for(i=0,x=this.graph_bounds.min.x;i<this.x_labels.length;i++,x+=this.column_width){
                text[i] = new fabric.Text(this.x_labels[i].toString(), { left: x, top: y,fontSize: 14,shadow: 'rgba(0,0,0,0.3) 2px 2px 2px'});
            }
            this.x_labls_grp = new fabric.Group(text,{
                left:60,
                top:10,
                selectable: false
            });
            this.canvas.add(this.x_labls_grp);
            
            //Add y labels down side
            text = [];
            x=this.graph_bounds.min.x;
            for(i=0,y=this.graph_bounds.min.y;i<this.y_labels.length;i++,y+=this.row_height){
                text[i] = new fabric.Text(this.y_labels[i].toString(), { left: x, top: y,fontSize: 14,shadow: 'rgba(0,0,0,0.3) 2px 2px 2px'});
            }
            this.y_labls_grp = new fabric.Group(text,{
                left:5,
                top:40,
                selectable: false
            });
            this.canvas.add(this.y_labls_grp);

            //Add horizontal lines
            lines = [];
            for(i=0,y=this.graph_bounds.min.y-10;i<this.y_labels.length;i++,y+=this.row_height){
                lines[i] = new fabric.Line([this.graph_bounds.min.x,y,this.graph_bounds.max.x,y], {
                            stroke: 'rgba(0, 0, 0, 0.2)',
                            strokeWidth: 2
                        });
            }
            
            this.horiz_lines_grp = new fabric.Group(lines,{
                left:this.graph_bounds.min.x,
                top:this.graph_bounds.min.y+20,
                selectable: false
            });
            this.canvas.add(this.horiz_lines_grp);
            
            //Add vertical lines
            lines = [];
            for(i=0,x=this.graph_bounds.min.x;i<this.x_labels.length;i++,x+=this.column_width){
                //console.log(x,this.graph_bounds.min.y,x,this.graph_bounds.max.y); 
                lines[i] = new fabric.Line([x,this.graph_bounds.min.y,x,this.graph_bounds.max.y], {
                        stroke: 'rgba(0, 0, 0, 0.2)',
                        selectable: false,
                        strokeWidth: 2
                });             
            }
            
            //console.log(this.x_values);
            //console.log("i= "+i);
            
            for(x=this.graph_bounds.min.x;i<this.x_labels.length*2;i++,x+=this.column_width){
                //console.log(x,this.graph_bounds.min.y,x,this.graph_bounds.max.y);
                lines[i] = new fabric.Line([x+(this.column_width/2),this.graph_bounds.min.y,x+(this.column_width/2),this.graph_bounds.max.y], {
                    stroke: 'rgba(0, 0, 0, 0.1)',
                    strokeDashArray: [5, 5],
                    selectable: false,
                    strokeWidth: 2
                });             
            }     
            
            this.vert_lines_grp = new fabric.Group(lines,{
                left:this.graph_bounds.min.x+30,
                top:this.graph_bounds.min.y,
                selectable: false
            });
            this.canvas.add(this.vert_lines_grp);

//            this.coordsrect = new fabric.Text('x:100,y:100', {
//              left: 100,
//              top: 100,
//              fill: '#000000',
//              fontSize: 14
//            });
//            this.canvas.add(this.coordsrect);
            
            this.snapcircle = new fabric.Circle({
                radius: 3, 
                fill: 'red', 
                left: 0, 
                top: 0, 
                shadow: 'rgba(0,0,0,0.3) 1px 1px 1px'
            });
            this.canvas.add(this.snapcircle);
        },
        
        clearCanvas : function(){
            console.log('clearCanvas '+this.side);
//            var objects = canvas.getObjects();
//
//                
//            var Group = new fabric.Group();
//            
//            for(var i=0;i<objects.length;i++){
//                Group.add(objects[i].clone());
//            }
//                
//            canvas.clear().renderAll();
            canvas.remove();
        },
        /**
        * Finds the closest decibel value (in increments of 5) to the mouse click
        * @param {number} y The 'y' coordinate of the mouse click.
        * @return {null} 
        */        
        getDecibels: function(y){
            console.log('getDecibels '+this.side);
            var d;
            var r;
            
            y = y - this.graph_bounds.min.y;                    //adjust y because of margins    
            d = Math.floor(y / (this.row_height / 2));          //How many 1/2 rows divide into y
            
            //console.log("d:"+d);
            r = (y % (this.row_height / 2)) / this.row_height;                      //Remainder (how close is it to the next value).
            //console.log("r:"+r);
            
            if(r > .5)
                d = d + 1;
            return this.y_values[d-1];
        },
        /**
        * Finds the closest frequency value (within an array of acceptable values) to the mouse click
        * @param {number} x The 'x' coordinate of the mouse click.
        * @return {null} 
        */ 
        getFrequency: function(x){
            console.log('getFrequency '+this.side);
           
            var d;
            var r;
            var c = this.column_width;              //short var name for column width
            var c2 = c / 2;                         //ref to column width div 2
            var i;                                  //loop counter
            var p;                                  //current x pixel
            
            x = Math.round(x - this.graph_bounds.min.x);    //adjust x because of margins 
            //console.log('x is: '+x);    
            
            p = c;          //start off p as the width of one column
            
            //If x is within the first column, return 125hz
            if(x < p){
                return this.x_values[0].value;
            }
            
            for(i=1,p+=c2;i<this.x_values.length;i++,p+=c2){
                if(x < p){
                    //If it's closer to the previous value, snap to it.
                    var ratio = ((x%c2) / c2);
                    if(ratio < .5)
                        return this.x_values[i-1]
                    else
                        return this.x_values[i];
                }
            }
            
            return this.x_values[this.x_values.length-1];
        },
        inBounds : function(x,y){
            return (x>=this.graph_bounds.min.x &&
                    x<=this.graph_bounds.max.x &&
                    y>=this.graph_bounds.min.y &&
                    y<=this.graph_bounds.max.y)
        },
        setCurrentMeasure : function(measure){
            console.log('setCurrentMeasure '+this.side);
            this.current_measure = measure;           
        },
        setMasked : function(masked){
            console.log('setMasked '+this.side);
            this.masked = masked;
        },
        /**
        * Takes a mouse click and "snaps" it to the closest allowable x,y that corresponds with an appropriate 
        *    audiogram value set. So, it snaps it to the closest dB value in increments of 5 and an acceptable 
        *    frequency (dictated by an array of frequencies).
        * @param {number} x 
        * @param {number} y
        * @return {object} {x,y}
        */ 
        snapClick: function(x,y){
            console.log('snapClick '+this.side);
            var i;  //index
            var d;  //difference
            var cx; //closest x
            var cy; //closest y
            var min = this.canvas.width;   //Largest value that can be on this canvas

            for(i=0;i<this.x_values.length;i++){
                d = Math.abs(this.x_values[i].x - x);
                console.log("d= "+d);
                if(d < min){
                    min = d;
                    cx = this.x_values[i].x;
                }
            }
            
            min = this.canvas.height;
            
            for(i=0;i<this.y_values.length;i++){
                d = Math.abs(this.y_values[i].y - y);
                if(d < min){
                    min = d;
                    cy = this.y_values[i].y;
                }
            }            
            
            this.canvas.add(new fabric.Text("X", { left: cx, top: cy-7,fontSize: 14,shadow: 'rgba(0,0,0,0.3) 2px 2px 2px'}));
            console.log("cx "+cx+" cy "+cy);
            return {"x":cx,"y":cy};
        },
        snapTo: function(x,y){
            var i;  //index
            var d;  //difference
            var cx; //closest x
            var cy; //closest y
            var min = this.canvas.width;   //Largest value that can be on this canvas

            for(i=0;i<this.x_values.length;i++){
                d = Math.abs(this.x_values[i].x - x);
                if(d < min){
                    min = d;
                    cx = this.x_values[i].x;
                }
            }
            
            min = this.canvas.height;
            
            for(i=0;i<this.y_values.length;i++){
                d = Math.abs(this.y_values[i].y - y);
                if(d < min){
                    min = d;
                    cy = this.y_values[i].y;
                }
            }            
            
            return {"x":cx,"y":cy};
        }

    }
    private._init();
    private.canvas.on('mouse:down', function(options) {
        var click = private.canvas.getPointer(options.e);
        click.x = Math.round(click.x);
        click.y = Math.round(click.y);
        console.log("click: "+click.x, click.y);
        var snap_click = private.snapClick(click.x, click.y);
        if(private.inBounds(click.x, click.y)){
            var frequency = private.getFrequency(click.x);
            var decibels = private.getDecibels(click.y);
            //console.log(frequency);
            //console.log(decibels);
        }
    });
    private.canvas.on('mouse:move', function(options) {
        //e.target.setFill('red');
        var hover = private.canvas.getPointer(options.e);
        var snap = private.snapTo(hover.x,hover.y);
        private.snapcircle.setTop(snap.y-1).setCoords();
        private.snapcircle.setLeft(snap.x-1).setCoords();
        //private.coordsrect.setTop(hover.y).setCoords();
        //private.coordsrect.setLeft(hover.x+25).setCoords();
        //private.coordsrect.setText(Math.round(hover.x)+","+Math.round(hover.y));
        private.canvas.renderAll();
    });

    // Expose public API
    return {
        get: function( prop ) {
            if ( private.hasOwnProperty( prop ) ) {
                return private[ prop ];
            }
        },
        setMasked: function(val){
            private.setMasked(val);
        },
        setCurrentMeasure: function(char){
            private.setCurrentMeasure(char);
        },
        clearCanvas: function(){
            private.clearCanvas();
            
        }
    }
};