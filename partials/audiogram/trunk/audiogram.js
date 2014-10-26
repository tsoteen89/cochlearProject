var AudioGram = function(element_id, audiogram_id,side) {
    // Private data
    var imageObj = new Image();
    var private = {
        font_size     : 16,
        element_id    : element_id,
        audiogram_id  : audiogram_id,
        side          : side,
        canvas        : null,           //Future reference to html element
        ctx           : null,           //Future canvas reference
        canvas_width  : 0,              //Width of canvas in pixels
        canvas_height : 0,              //Height of canvas in pixels
        column_width  : 0,		        //width of a column function based on width of canvas
        row_height    : 0,              //height of a row function based on height of canvas
        margins       : {"top":40,"bottom":20,"left":40,"right":20},
        graph_bounds  : {"min":{"x":0,"y":0},"max":{"x":0,"y":0}},
        graph_size    : {"width":0,"height":0},
        crnt_measure  : null,
        masked        : 'unmasked',     //Masked = masked Unmasked = unmasked :)
        x_labels      : [],             //Values displayed on top of audiogram
        y_labels      : [],             //These are the values on the left of the audiogram
        x_values      : [],             //When audiogram is clicked, these are the values that
        y_values      : [],             //-are "snapped" to.
        audiogram_vals: [],
        colors        : {
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
            this.canvas = document.getElementById(this.element_id);
            this.ctx = this.canvas.getContext('2d');
            this.canvas_width = $('#'+this.element_id).width();
            this.canvas_height = $('#'+this.element_id).height();
            //font-family: 'Coda Caption', sans-serif;
            this.ctx.font = '10pt Courier';
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
            this.graph_bounds.max.x = this.canvas_width - this.margins.right;
            this.graph_bounds.max.y = this.canvas_height - this.margins.bottom;
            this.graph_size.width = this.canvas_width-(this.margins.left+this.margins.right);
            this.graph_size.height = this.canvas_height-(this.margins.top+this.margins.bottom);
            
            //calculate row width and column height so they get drawn evenly in the alloted space
            this.column_width = Math.floor((this.graph_bounds.max.x - this.graph_bounds.min.x) / (this.x_labels.length-1));
            this.row_height = Math.floor((this.graph_bounds.max.y - this.graph_bounds.min.y) / (this.y_labels.length-1));            

            //Set the colors for left or right (red=right blue=left)
            if(this.side=='right')
                this.colors.draw_line = "#FF0000";
            else
                this.colors.draw_line = "#0000FF";
            
            //Now we draw the outerborder, addsome labels, and draw all the graph lines.
            this.drawOuterBorder();
            this.drawLabels();
            this.drawGraph();

        },
        /**
        * When the graph is clicked, we add a "measure" to an array with: 
        *   the currently selected measure depending on whether its masked or not. 
        * @param {number} x The x coordinate for printing
        * @param {number} y The y coordinate for printing
        * @param {function} callback A callback function to sort json object base on 
        *    x coordinate.
        * @return {null} 
        */
        addMeasure: function(x,y){
            console.log('addMeasure '+this.side);
            
            if(x<this.graph_bounds.min.x ||
               x>this.graph_bounds.max.x ||
               y<this.graph_bounds.min.y ||
               y>this.graph_bounds.max.y){
                alert("error");
                return;
            }
            
            var snap = this.snapClick(x,y);
            var vals = {'measure':this.crnt_measure,
                        'x':snap.x,'y':snap.y,
                        'freq':this.getFrequency(x),
                        'dB':this.getDecibels(y),
                        'symbol':this.measureImages[this.crnt_measure][this.masked][this.side],
                        'imgObj': new Image()
                       }
            vals.imgObj.src = this.measureImages[this.crnt_measure][this.masked][this.side];
            this.audiogram_vals.push(vals);           
            this.sortMeasures();
        },
        /**
        * Used to clear everything off the graph to "refresh" the canvas. Can delete all objects or not.
        * @param {boolean} delete_vals Optional parameter to delete all values as opposed to just clearing them.
        * @return {null} 
        */
        clearBoard : function(delete_vals){
            console.log('clearBoard '+this.side);

            //default param defaults to 'false' (don't delete objects on canvas)
            delete_vals = typeof delete_vals !== 'undefined' ? delete_vals : false;
            
            this.ctx.save();

            // Use the identity matrix while clearing the canvas
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
 
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);    
            
            // Restore the transform
            this.ctx.restore();  
            
            //Clear out everything currently 'saved'
            if(delete_vals){
                console.log("buh bye "+this.side);
                this.audiogram_vals = [];
            }
            
        },
        /**
        * Clear the lines from the graph. Not really necessary but I can't figure out my ghost line problem.
        * @param {null}
        * @return {null} 
        */        
        clearGraph : function(){
            this.ctx.clearRect(this.graph_bounds.min.x,this.graph_bounds.min.y,this.graph_bounds.max.x,this.graph_bounds.max.y);
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
            
            //Draw an inner rectangle just inside the labels
            this.ctx.rect(this.graph_bounds.min.x,this.graph_bounds.min.x,this.graph_size.width,this.graph_size.height);      
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = this.colors.graph_lines;
            this.ctx.stroke();
            
            //Draw vertical lines
            for(i=0,x=this.graph_bounds.min.x;i<this.x_labels.length-1;i++,x+=this.column_width){
                this.ctx.beginPath();
                this.ctx.moveTo(x,this.graph_bounds.min.y);
                this.ctx.lineTo(x,this.graph_bounds.max.y);
                this.ctx.stroke();
            }
            
            //Draw horizontal lines
            for(i=0,y=this.graph_bounds.min.y;i<this.y_labels.length-1;i++,y+=this.row_height){
                this.ctx.beginPath();
                this.ctx.moveTo(this.graph_bounds.min.x,y);
                this.ctx.lineTo(this.graph_bounds.max.x,y);
                this.ctx.stroke();
            }
            this.ctx.closePath();
        },
        /**
        * Draws the decible and frequency labels on the graph
        * @param {null} 
        * @return {null} 
        */
        drawLabels: function(){
            console.log('drawLabels '+this.side);
            var i;
            var x;
            var y;
            this.ctx.strokeStyle = this.colors.labels;
            for(i=0,x=this.graph_bounds.min.x;i<this.x_labels.length;i++,x+=this.column_width){
                this.ctx.fillText(this.x_labels[i],x-10,this.graph_bounds.min.y-10);
                this.ctx.stroke();
            }
            
            for(i=0,y=this.graph_bounds.min.y;i<this.y_labels.length;i++,y+=this.row_height){
                this.ctx.fillText(this.y_labels[i],this.graph_bounds.min.x-30,y+5);
                this.ctx.stroke();
            }
            this.ctx.closePath();
        },
        /**
        * Prints the lines that connect measures on the graph.
        * @param {null} 
        * @return {null} 
        */ 
        drawLines: function(){
            console.log('drawLines '+this.side);
                        
            var i;
            this.clearGraph();
            this.drawGraph();
            this.ctx.beginPath();
             
            this.ctx.strokeStyle = this.colors.draw_line;
            this.ctx.lineWidth = 2;
            if(this.audiogram_vals.length>1){
                for(i=0;i<this.audiogram_vals.length-1;i++){
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.audiogram_vals[i].x,this.audiogram_vals[i].y);
                    this.ctx.lineTo(this.audiogram_vals[i+1].x,this.audiogram_vals[i+1].y);
                    console.log(this.audiogram_vals[i].x,this.audiogram_vals[i].y);
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
            }


            
        },        
        /**
        * Prints the measures currently saved in an array. Prints the "measure symbol" [X,O,M...] for each measure.
        * @param {null} 
        * @return {null} 
        */ 
        drawMeasures: function(){
            console.log('drawMeasures '+this.side);
                        
            var i;
            for(i=0;i<this.audiogram_vals.length;i++){
                this.ctx.drawImage(this.audiogram_vals[i].imgObj,this.audiogram_vals[i].x-12,this.audiogram_vals[i].y-12);
            }
        },
        /**
        * Draws the very outer border of the canvas. Could probably be combined with another method.
        * @param {null} 
        * @return {null} 
        */
        drawOuterBorder: function() {
            console.log('drawOuterBorder '+this.side);
            this.ctx.rect(0, 0, this.canvas_width, this.canvas_height);
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = this.colors.border;
            this.ctx.stroke();
            this.ctx.closePath();
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
            y = y - this.graph_bounds.min.y;              //adjust y because of margins    
            d = Math.floor(y / (this.row_height / 2));          //How many 1/2 rows divide into y
            r = y % (this.row_height / 2);                      //Remainder (how close is it to the next value).
            
            if(r/(this.row_height / 2) > .5)
                d = d + 1;
            return this.y_values[d];
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
            x = x - this.graph_bounds.min.x;                    //adjust x because of margins   
            d = Math.floor(x / (this.column_width / 2));        //How many 1/2 columns divide into x
            
            r = x % (this.column_width / 2);
            
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
        /**
        * Finds the closest frequency value (within an array of acceptable values) to the mouse click
        * @param {Element} canvas Reference to the canvas.
        * @param {Object} evt An event object of a mouse click.        
        * @return {Object} {x,y} The x and y coordinates of the mouse click pulled out of the evt object.
        */
        getMousePos: function(canvas, evt) {
            console.log('getMousePos '+this.side);
            var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        },
        /**
        * Print error
        * @param {number} error_num The error number to be handled 
        * @return {null}
        */ 
        printError: function(error_num){
            console.log(error_num);
        },
        /**
        * redrawCanvas
        * @param {null} 
        * @return {null}
        */ 
        redrawCanvas: function(){
            this.clearBoard();
            this.drawLabels();
            this.drawGraph();
            this.drawLines();
            this.drawOuterBorder();
            this.drawMeasures();
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

            x = x - this.graph_bounds.min.x;                    //adjust x because of margins   
            d = Math.floor(x / (this.column_width / 2));        //How many 1/2 columns divide into x
            r = x % (this.column_width / 2);                    //Remainder (how close is it to the next value).
            
            if(r/(this.column_width / 2) > .5)
                d = d + 1;
            
            snap_x = d * (this.column_width / 2) + this.graph_bounds.min.x;//Multiply d by 1/2 column size to snap to an edge
            
            y = y - this.graph_bounds.min.y;                    //adjust y because of margins    
            d = Math.floor(y / (this.row_height / 2));          //How many 1/2 rows divide into y
            r = y % (this.row_height / 2);                      //Remainder (how close is it to the next value).
            
            if(r/(this.row_height / 2) > .5)
                d = d + 1;
            
            snap_y = d * (this.row_height / 2) + this.graph_bounds.min.y;//Multiply d by 1/2 column size to snap to an edge
            
            return {"x":snap_x,"y":snap_y};
        },
        /**
        * Turn masking on and off
        * @param {string} mask
        * @return {object} {x,y}
        */ 
        setMasked: function(mask){
            console.log('setMasked '+this.side);
            
            if(mask)
                this.masked = 'masked';
            else
                this.masked = 'unmasked';
            console.log(this.masked);
        },        
        /**
        * Sets the current measure ['AC','BC',...] so we know what symbol to display on audiogram.
        * @param {number} x 
        * @param {number} y
        * @return {object} {x,y}
        */ 
        setMeasure: function(measure){
            console.log('setMeasure '+this.side);
            
            this.crnt_measure = measure;
            console.log(this.crnt_measure);
        },
        setTxtCharacter: function(measure){
            this.crnt_measure = measure;
//            characterSet = {
//                'AC': {'right':0x25EF,'left':0x2716}, //
//                'BC': {'right':0x276E,'left':0x276F},
//                'MCL': {'right':0x004D,'left':0x004D},
//                'UCL': {'right':0x006D,'left':0x006D},
//                'SF': {'right':0x0053,'left':0x0053},
//                'SF-A': {'right':0x0041,'left':0x0041}
//            };
            characterSet = {
                'AC': {'right':'O','left':'X'}, 
                'BC': {'right':'<','left':'>'},
                'MCL': {'right':'M','left':'M'},
                'UCL': {'right':'m','left':'m'},
                'SF': {'right':'S','left':'S'},
                'SF-A': {'right':'A','left':'A'}
            };
            this.current_char = characterSet[measure][side];
        },
        /**
        * Bubble sort my audiogram array to "order" the 'x' values for printing and connecting 
        *   with a line. 
        * @param {null}
        * @return {null}
        */ 
        sortMeasures : function()
        {
            console.log('sortMeasures '+this.side);
            var swapped;
            do {
                swapped = false;
                for (var i=0; i < this.audiogram_vals.length-1; i++) {
                    if (this.audiogram_vals[i]['x'] > this.audiogram_vals[i+1]['x']) {
                        var temp = this.audiogram_vals[i];
                        this.audiogram_vals[i] = this.audiogram_vals[i+1];
                        this.audiogram_vals[i+1] = temp;
                        swapped = true;
                    }
                }
            } while (swapped);
        },
        temp : function(){
            for (var i=0; i < this.audiogram_vals.length; i++) {
                var x = this.audiogram_vals[i]['x']-12;
                var y = this.audiogram_vals[i]['y']-12;
                var width = 24;
                var height = 24;
                var imgData = this.ctx.getImageData(x, y, width, height);
                //this.ctx.rect(x, y, 24, 24);
                console.log(imgData.data);
            }
        }
    }
    private._init();
    private.canvas.addEventListener('click', function(evt) {
        setTimeout(function () {
            var mousePos = private.getMousePos(private.canvas, evt);
            mousePos.x = Math.floor(mousePos.x);
            mousePos.y = Math.floor(mousePos.y);
            
            setTimeout(function () {
                private.addMeasure(mousePos.x,mousePos.y);
                setTimeout(function () {
                    private.clearBoard();
                    setTimeout(function () {
                        private.redrawCanvas();
                        console.log(private.audiogram_vals);
                    }, 0);
                }, 0);
            }, 0);
        },0);
    }, false);

    // Expose public API
    return {
        get: function( prop ) {
            if ( private.hasOwnProperty( prop ) ) {
                return private[ prop ];
            }
        },
        setMasked: function(val){
            setTimeout(function () {
                private.setMasked(val);
                setTimeout(function () {
                    private.clearBoard();
                    setTimeout(function () {
                        private.redrawCanvas();
                    }, 0);
                }, 0);
            }, 0);
        },
        setMeasure: function(char){
            setTimeout(function () {
                private.setMeasure(char);
                setTimeout(function () {
                    private.clearBoard();
                    setTimeout(function () {
                        private.redrawCanvas();
                    }, 0);
                }, 0);
            }, 0);
        },
        clearBoard: function(){
            setTimeout(function () {
                private.clearBoard(true);
                setTimeout(function () {
                    private.clearBoard();
                    setTimeout(function () {
                        private.redrawCanvas();
                    }, 0);
                }, 0);

            }, 0);
            
        }
    }
};



function OrderEvents() {
    var args = arguments;
    if (args.length <= 0)
        return;
    (function chain(i) {
        if (i >= args.length || typeof args[i] !== 'function')
            return;
        window.setTimeout(function() {
            args[i]();
            chain(i + 1);
        },1000);
    })(0);
}  
//var MySort = function sortJsonArrayByProperty(objArray, prop, direction){
//    if (arguments.length<2) throw new Error("sortJsonArrayByProp requires 2 arguments");
//    var direct = arguments.length>2 ? arguments[2] : 1; //Default to ascending
//
//    if (objArray && objArray.constructor===Array){
//        var propPath = (prop.constructor===Array) ? prop : prop.split(".");
//        objArray.sort(function(a,b){
//            for (var p in propPath){
//                if (a[propPath[p]] && b[propPath[p]]){
//                    a = a[propPath[p]];
//                    b = b[propPath[p]];
//                }
//            }
//            console.log(typeof(a),typeof(b));
//            // convert numeric strings to integers
//            a = a.match(/^\d+$/) ? +a : a;
//            b = b.match(/^\d+$/) ? +b : b;
//            return ( (a < b) ? -1*direct : ((a > b) ? 1*direct : 0) );
//        });
//    }
//}