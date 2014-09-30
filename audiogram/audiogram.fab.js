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
            this.canvas.calcOffset();

            console.log('constructor '+this.side);
            
            //Initialize the canvas by locking it to it's element and 
            //attaching some event listeners to it.
            console.log(this.canvas);

            //Load X labels (frequencies) into array
            for(var i=125;i<=8000;i*=2){
                var Label = "";
                if(i>=1000){
                    Label = (i/1000) + 'K';
                }else{
                    Label = i;
                }

                this.x_labels.push(Label);
            }

            //Load Y labels (dB presentation level) into array
            
            for(var i=-10;i<=120;i+=10){
                if(i<0)
                    this.y_labels.push(i);
                else if(i<10)
                    this.y_labels.push('  '+i);
                else if(i<100)
                    this.y_labels.push(' '+i);
                else
                    this.y_labels.push(i);
            }
            
            //Load Y possible values because we want more possibilities than just the labels
            for(var i=-10;i<=120;i+=5){
                this.y_values.push(i);
            }
            
            //Load extra X values because we want more possibilities than just the listed frequencies.
            this.x_values = [125,186,250,375,500,750,1000,1500,2000,3000,4000,6000,8000];
            
            //Sets all the boundaries necessary for computing position and intersection stuff easily
            this.graph_bounds.min.x = this.margins.left;
            this.graph_bounds.min.y = this.margins.top;
            this.graph_bounds.max.x = this.canvas.width - this.margins.right;
            this.graph_bounds.max.y = this.canvas.height - this.margins.bottom;
            this.graph_size.width = this.canvas.width-(this.margins.left+this.margins.right);
            this.graph_size.height = this.canvas.height-(this.margins.top+this.margins.bottom);
            
            //calculate row width and column height so they get drawn evenly in the alloted space
            this.column_width = Math.floor((this.graph_bounds.max.x - this.graph_bounds.min.x) / (this.x_labels.length));
            console.log("width:"+this.column_width);
            this.row_height = Math.floor((this.graph_bounds.max.y - this.graph_bounds.min.y) / (this.y_labels.length));            

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
                console.log(x,this.graph_bounds.min.y,x,this.graph_bounds.max.y);
                lines[i] = new fabric.Line([x,this.graph_bounds.min.y,x,this.graph_bounds.max.y], {
                            stroke: 'rgba(0, 0, 0, 0.2)',
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
        * Finds the closest frequency value (within an array of acceptable values) to the mouse click
        * @param {number} x The 'x' coordinate of the mouse click.
        * @return {null} 
        */ 
        getFrequency: function(x){
            console.log('getFrequency '+this.side);
            var d;
            var r;
            var c = this.column_width;
            var c2 = this.column_width / 2;
            
            x = Math.round(x - this.graph_bounds.min.x - this.canvas._offset.left);    //adjust x because of margins 
            
            
            console.log("x:"+x);
            d = Math.floor(x / (this.column_width / 2));                   //How many 1/2 columns divide into x
            console.log("d:"+d);            
            r = x % (this.column_width / 2);
            console.log("r:"+r);
            
            if(r/(this.column_width / 2) > .5){
                d = d + 1;
            }
                        
            //This hot mess is because:
            //Labels =              125,250,500,1000,2000,4000,8000
            //Possible Returns =    125,250,375,500,1000,1500,2000,3000,6000,8000
            //So there's a values between every label except <500. Snapping to the
            //nearest frequency changes for values below 500.
            if(d>=4){                                         
                return this.x_values[d];
            }else{
                r = x % this.column_width;
                r /= this.column_width

                if(d == 3 && r >.50)
                    return this.x_values[4]                    //Hacky
                else if(d == 0)
                    return this.x_values[0];
                else if(d == 1 && r < .50)
                    return this.x_values[0]
                else
                    return this.x_values[2]                    
            
            }
        },
        setCurrentMeasure : function(measure){
            console.log('setCurrentMeasure '+this.side);
            this.current_measure = measure;           
        },
        setMasked : function(masked){
            console.log('setMasked '+this.side);
            this.masked = masked;
            console.log(this.masked);
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
            var d;      //Number of times divided into
            var r;      //Remainder after division
            var snap_x; //snapped to x value
            var snap_y; //snapped to y value
            var frequency;

            x = x - this.graph_bounds.min.x;                    //adjust x because of margins   
            d = x / (this.column_width / 2);        //How many 1/2 columns divide into x
            r = x % (this.column_width / 2);                    //Remainder (how close is it to the next value).
            
            if(r/(this.column_width / 2) > .5)
                d = d + 1;
            
            snap_x = Math.floor(d * (this.column_width / 2) + this.graph_bounds.min.x);//Multiply d by 1/2 column size to snap to an edge
            
            y = y - this.graph_bounds.min.y;                    //adjust y because of margins    
            d = y / (this.row_height / 2);          //How many 1/2 rows divide into y
            r = y % (this.row_height / 2);                      //Remainder (how close is it to the next value).
            
            if(r/(this.row_height / 2) > .5)
                d = d + 1;
            
            snap_y = Math.floor(d * (this.row_height / 2) + this.graph_bounds.min.y);//Multiply d by 1/2 column size to snap to an edge
            frequency = this.getFrequency(snap_x);
            console.log(frequency);
            return {"x":snap_x,"y":snap_y};
        }

    }
    private._init();
    private.canvas.on('mouse:down', function(options) {
        console.log(options.e.clientX, options.e.clientY);
        var click = private.snapClick(options.e.clientX, options.e.clientY);
        console.log(click);
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