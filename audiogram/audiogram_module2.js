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
        measureImageObj : {
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
        initArrays    : function(){
            //Load X labels (frequencies)
            for(var i=125;i<=8000;i*=2){
                var Label = "";
                if(i>=1000){
                    Label = (i/1000) + 'K';
                }else{
                    Label = i;
                }

                this.x_labels.push(Label);
            }

            //Load Y labels (dB presentation level)
            
            for(var i=-10;i<=120;i+=10){
                this.y_labels.push(i);
            }
            
            //Load Y possible values because we want more possibilities than just the labels
            for(var i=-10;i<=120;i+=5){
                this.y_values.push(i);
            }
            
            //Load extra X values because we want more possibilities than just the listed frequencies.
            this.x_values = [125,186,250,375,500,750,1000,1500,2000,3000,4000,6000,8000];
            
            this.graph_bounds['min']['x'] = this.margins["left"];
            this.graph_bounds['min']['y'] = this.margins["top"];
            this.graph_bounds['max']['x'] = this.canvas_width - this.margins["right"];
            this.graph_bounds['max']['y'] = this.canvas_height - this.margins["bottom"];
            this.graph_size["width"] = this.canvas_width-(this.margins["left"]+this.margins["right"]);
            this.graph_size["height"] = this.canvas_height-(this.margins["top"]+this.margins["bottom"]);
            
            //calculate row width and column height
            this.column_width = Math.floor((this.graph_bounds['max']['x'] - this.graph_bounds['min']['x']) / (this.x_labels.length-1));
            this.row_height = Math.floor((this.graph_bounds['max']['y'] - this.graph_bounds['min']['y']) / (this.y_labels.length-1));
            
            console.log(this.graph_bounds,this.graph_size,this.margins);
            console.log(this.row_height,this.column_width);
        },
        drawOuterBorder: function() {
            this.ctx.rect(0, 0, this.canvas_width, this.canvas_height);      
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = 'black';
            this.ctx.stroke();
        },
        addLabels: function(){
            var i;
            var x;
            var y;
            for(i=0,x=this.graph_bounds["min"]["x"];i<this.x_labels.length;i++,x+=this.column_width){
                this.ctx.fillText(this.x_labels[i],x-10,this.graph_bounds["min"]["y"]-10);
                this.ctx.stroke();
            }
            
            for(i=0,y=this.graph_bounds["min"]["y"];i<this.y_labels.length;i++,y+=this.row_height){
                this.ctx.fillText(this.y_labels[i],this.graph_bounds["min"]["x"]-30,y+5);
                this.ctx.stroke();
            }
        },
        drawGraph: function(){
            var x;
            var y;
            var i;
            
            this.ctx.rect(this.graph_bounds["min"]["x"],this.graph_bounds["min"]["y"],this.graph_size["width"],this.graph_size["height"]);      
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = 'black';
            this.ctx.stroke();  
            
            for(i=0,x=this.graph_bounds["min"]["x"];i<this.x_labels.length-1;i++,x+=this.column_width){
                this.ctx.beginPath();
                this.ctx.moveTo(x,this.graph_bounds["min"]["y"]);
                this.ctx.lineTo(x,this.graph_bounds["max"]["y"]);
                this.ctx.stroke();
            }
            for(i=0,y=this.graph_bounds["min"]["y"];i<this.y_labels.length-1;i++,y+=this.row_height){
                this.ctx.beginPath();
                this.ctx.moveTo(this.graph_bounds["min"]["x"],y);
                this.ctx.lineTo(this.graph_bounds["max"]["x"],y);
                this.ctx.stroke();
            }
        },
        getMousePos: function(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        },
        getFrequency: function(x){
            var d;
            var r;
            x = x - this.graph_bounds["min"]["x"];              //adjust x because of margins   
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
        getDecibels: function(y){
            var d;
            var r;
            y = y - this.graph_bounds["min"]["y"];              //adjust y because of margins    
            d = Math.floor(y / (this.row_height / 2));          //How many 1/2 rows divide into y
            r = y % (this.row_height / 2);                      //Remainder (how close is it to the next value).
            
            if(r/(this.row_height / 2) > .5)
                d = d + 1;
            return this.y_values[d];
        },
        snapClick: function(x,y){
            var d;      //Number of times divided into
            var r;      //Remainder after division
            var snap_x; //snapped to x value
            var snap_y; //snapped to y value

            x = x - this.graph_bounds["min"]["x"];              //adjust x because of margins   
            d = Math.floor(x / (this.column_width / 2));        //How many 1/2 columns divide into x
            r = x % (this.column_width / 2);                    //Remainder (how close is it to the next value).
            
            if(r/(this.column_width / 2) > .5)
                d = d + 1;
            
            snap_x = d * (this.column_width / 2) + this.graph_bounds["min"]["x"];//Multiply d by 1/2 column size to snap to an edge
            
            y = y - this.graph_bounds["min"]["y"];              //adjust y because of margins    
            d = Math.floor(y / (this.row_height / 2));          //How many 1/2 rows divide into y
            r = y % (this.row_height / 2);                      //Remainder (how close is it to the next value).
            
            if(r/(this.row_height / 2) > .5)
                d = d + 1;
            
            snap_y = d * (this.row_height / 2) + this.graph_bounds["min"]["y"];//Multiply d by 1/2 column size to snap to an edge
            
            return {"x":snap_x,"y":snap_y};
            
        },
        addMeasure: function(x,y,callback){
            var snap = this.snapClick(x,y);
            this.audiogram_vals.push({'measure':this.crnt_measure,'x':snap['x'],'y':snap['y'],'freq':this.getFrequency(x),'dB':this.getDecibels(y),'symbol':this.measureImageObj[this.crnt_measure][this.masked][this.side]});           
            this.audiogram_vals = callback(this.audiogram_vals,'x');
        },
        printMeasures: function(){
            var i;
            this.clearMeasures();
            this.ctx.beginPath();
            for(i=0;i<this.audiogram_vals.length-1;i++){
                this.ctx.moveTo(this.audiogram_vals[i]['x'],this.audiogram_vals[i]['y']);
                this.ctx.lineTo(this.audiogram_vals[i+1]['x'],this.audiogram_vals[i+1]['y']);               
            }
            this.ctx.stroke(); 
        },
        clearMeasures : function(delete_vals){
            //default param to NOT delete measures if params not there
            delete_vals = typeof delete_vals !== 'undefined' ? delete_vals : false;
            this.ctx.clearRect(this.graph_bounds["min"]["x"],this.graph_bounds["min"]["y"],this.graph_size['width'],this.graph_size['height']);
            this.drawGraph();
            if(delete_vals)
                this.audiogram_vals = [];
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
        setMeasure: function(measure){
            this.crnt_measure = measure;
            
            console.log(this.crnt_measure);
        },
        //sortJsonArrayByProperty(results, 'attributes.OBJECTID');
        //sortJsonArrayByProperty(results, 'attributes.OBJECTID', -1);
    }
    private['canvas'] = document.getElementById(private['element_id']);
    private['ctx'] = private['canvas'].getContext('2d');
    private['canvas_width'] = $('#'+private['element_id']).width();
    private['canvas_height'] = $('#'+private['element_id']).height();
    private['ctx'].font = '10pt helvetica';
    private['canvas'].addEventListener('click', function(evt) {
        var mousePos = private['getMousePos'](private['canvas'], evt);
        mousePos.x = Math.floor(mousePos.x);
        mousePos.y = Math.floor(mousePos.y);
        private['addMeasure'](mousePos.x,mousePos.y,MySort);
        private['printMeasures']();
        console.log(private['audiogram_vals']);
        
    }, false);
    private['initArrays']();
    private['drawOuterBorder']();
    private['addLabels']();
    private['drawGraph']();

    // Expose public API
    return {
        get: function( prop ) {
            if ( private.hasOwnProperty( prop ) ) {
                return private[ prop ];
            }
        },
        isMasked: function(masked){
            private['masked'] = masked;
        },
        setMeasure: function(char){
            private['setMeasure'](char);
        },
        clearBoard: function(){
            private['clearMeasures'](true);
        }
    }
};

//Bubble sort my audiogram array to "order"
//the 'x' values for printing and connecting 
//with a line.
var MySort = function bubbleSort(a,prop)
{
    var swapped;
    do {
        swapped = false;
        for (var i=0; i < a.length-1; i++) {
            if (a[i]['x'] > a[i+1]['x']) {
                var temp = a[i];
                a[i] = a[i+1];
                a[i+1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
    return a;
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