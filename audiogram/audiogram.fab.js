var AudioGram = function(canvas,audiogram_id,side,canvas_width,canvas_height) {
    // Private data
    var private = {
        font_size       : 12,
        audiogram_id    : audiogram_id,
        side            : side,
        canvas          : canvas,
        column_width    : 0,		        //width of a column function based on width of canvas
        row_height      : 0,                //height of a row function based on height of canvas
        margins         : {"top":40,"bottom":40,"left":40,"right":40},
        graph_bounds    : {"min":{"x":0,"y":0},"max":{"x":0,"y":0}},
        graph_size      : {"width":0,"height":0},
        crnt_measure    : null,
        masked          : 'unmasked',       //Masked = masked Unmasked = unmasked :)
        x_labels        : [],               //Values displayed on top of audiogram
        y_labels        : [],               //These are the values on the left of the audiogram
        x_labls_grp     : null,
        y_labls_grp     : null, 
        graph_lines_grp : null,
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
            //this.drawOuterBorder();
            this.drawLabels();
            this.drawGraph();
            this.drawBackground();

        },
        drawBackground : function(){
            
        },
        /**
        * Draw labels 
        * @param {null} 
        * @return {null} 
        */
        drawLabels : function(){
            console.log('drawLabels '+this.side);
            
            var i;
            var x;
            var y;
            var text = [];
            
            
            var rect = new fabric.Rect({
                left: 0,
                top: 0,
                stroke : 'black',
                strokeWidth : 1,
                fill : 'white',
                width: this.canvas.width-4,
                height: this.canvas.height-4,
                shadow: 'rgba(0,0,0,0.3) 3px 3px 3px'
            });            
            this.canvas.add(rect);

            var rect = new fabric.Rect({
                left: this.graph_bounds.min.x,
                top: this.graph_bounds.min.y,
                stroke : 'black',
                strokeWidth : 1,
                fill : 'white',
                width: this.graph_size.width,
                height: this.graph_size.width,
                shadow: 'rgba(0,0,0,0.3) 3px 3px 3px'
            });            
            this.canvas.add(rect);
            
            y = this.graph_bounds.min.y;
            for(i=0,x=this.graph_bounds.min.x;i<this.x_labels.length;i++,x+=this.column_width){
                text[i] = new fabric.Text(this.x_labels[i].toString(), { left: x, top: y,fontSize: 14,shadow: 'rgba(0,0,0,0.3) 2px 2px 2px'});
            }
            this.x_labls_grp = new fabric.Group(text,{
                left:60,
                top:10 
            });
            this.canvas.add(this.x_labls_grp);
            
            text = [];
            x=this.graph_bounds.min.x;
            for(i=0,y=this.graph_bounds.min.y;i<this.y_labels.length;i++,y+=this.row_height){
                text[i] = new fabric.Text(this.y_labels[i].toString(), { left: x, top: y,fontSize: 14,shadow: 'rgba(0,0,0,0.3) 2px 2px 2px'});
            }
            this.y_labls_grp = new fabric.Group(text,{
                left:5,
                top:40 
            });
            this.canvas.add(this.y_labls_grp);
        },
        /**
        * Actuall draws the "lines" giving the canvas it's graph appearance.
        * @param {null}
        * @return {null} 
        */
        drawGraph: function(){
            console.log('drawGraph '+this.side);
            
            var x;
            var y;
            var i;
            var lines = [];
            
//        var rect = new fabric.Rect({
//          left: 100,
//          top: 100,
//          fill: 'red',
//          width: 20,
//          height: 20
//        });
//        canvas.add(new fabric.Line([0, 0, 200, 200], {
//            left: 0,
//            top: 0,
//            stroke: 'red'
//        }));
 
            
            for(i=0,x=this.graph_bounds.min.x;i<this.x_labels.length;i++,x+=this.column_width){
                lines[i] = new fabric.Line([x,this.graph_bounds.min.y,x,this.graph_bounds.max.y], {
                            stroke: 'black',
                            strokeWidth: 2,
                            shadow: 'rgba(0,0,0,0.3) 3px 3px 3px'
                        });
            }
            
            this.graph_lines_grp = new fabric.Group(lines,{
                left:70,
                top:40 
            });
            this.canvas.add(this.graph_lines_grp);
            
            lines = [];

            for(i=0,y=this.graph_bounds.min.y;i<this.y_labels.length-1;i++,y+=this.row_height){
                lines[i] = new fabric.Line([this.graph_bounds.min.x,y,this.graph_bounds.max.x,y], {
                            stroke: 'black',
                            strokeWidth: 2,
                            shadow: 'rgba(0,0,0,0.3) 3px 3px 3px'
                        });
            }
            
            this.graph_lines_grp = new fabric.Group(lines,{
                left:40,
                top:50 
            });
            this.canvas.add(this.graph_lines_grp);
            
//            //Draw an inner rectangle just inside the labels
//            this.ctx.rect(this.graph_bounds.min.x,this.graph_bounds.min.x,this.graph_size.width,this.graph_size.height);      
//            this.ctx.lineWidth = 2;
//            this.ctx.strokeStyle = this.colors.graph_lines;
//            this.ctx.stroke();
//            
//            //Draw vertical lines
//            for(i=0,x=this.graph_bounds.min.x;i<this.x_labels.length-1;i++,x+=this.column_width){
//                this.ctx.beginPath();
//                this.ctx.moveTo(x,this.graph_bounds.min.y);
//                this.ctx.lineTo(x,this.graph_bounds.max.y);
//                this.ctx.stroke();
//            }
//            
//            //Draw horizontal lines
//            for(i=0,y=this.graph_bounds.min.y;i<this.y_labels.length-1;i++,y+=this.row_height){
//                this.ctx.beginPath();
//                this.ctx.moveTo(this.graph_bounds.min.x,y);
//                this.ctx.lineTo(this.graph_bounds.max.x,y);
//                this.ctx.stroke();
//            }
//            this.ctx.closePath();
        }

    }
    private._init();


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
        setMeasure: function(char){
            private.setMeasure(char);
        },
        clearBoard: function(){

            
        }
    }
};