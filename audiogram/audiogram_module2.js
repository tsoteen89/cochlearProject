var AudioGram = function(element_id, audiogram_id,side) {
    // Private data
    var imageObj = new Image();
    var private = {
        element_id    : element_id,
        audiogram_id  : audiogram_id,
        side          : side,
        i             : 0,
        x             : 0,
        y             : 0,
        canvas        : null,           //Future reference to html element
        ctx           : null,           //Future canvas reference
        canvas_width  : 0,              //Width of canvas in pixels
        canvas_height : 0,              //Height of canvas in pixels
        column_width  : 0,		        //width of a column function based on width of canvas
        row_height    : 0,              //height of a row function based on height of canvas
        canvas_buffer : 0,		        //padding in pixels?
        margin_top    : 20,
        margin_left   : 10,
        margin_right  : 0,
        margin_bottom : 20,
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
            this.x_values = [125,250,500,750,1000,1500,2000,3000,4000,6000,8000];
        },
        calcRowColSize: function() {
            this.column_width = (this.canvas_width - (this.margin_left + this.margin_right)) / (this.x_labels.length + 1);
            this.row_height = (this.canvas_height - (this.margin_top + this.margin_bottom)) / (this.y_labels.length + 1);
        },
        drawOuterBorder: function() {
            this.ctx.rect(0, 0, this.canvas_width, this.canvas_height);      
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = 'black';
            this.ctx.stroke();
        },
        addFrequencyLabels: function(){
            for(this.i=0,this.x=this.margin_left+this.column_width;this.i<this.x_labels.length;this.i++,this.x+=this.column_width){
                this.ctx.fillText(this.x_labels[this.i], this.x-10, this.margin_top*2);
                this.ctx.beginPath();
                this.ctx.moveTo(this.x, this.margin_top+this.row_height);
                this.ctx.lineTo(this.x, this.canvas_height-this.row_height-this.margin_bottom);
                this.ctx.stroke();
            }
        },
        addDBLabels: function(){
            for(this.i=0,this.y=this.margin_top+this.row_height;this.i<this.y_labels.length;this.i++,this.y+=this.row_height){
                this.ctx.fillText(this.y_labels[this.i], this.margin_left, this.y+5);
                this.ctx.beginPath();
                this.ctx.moveTo(this.margin_left+this.column_width,this.y);
                this.ctx.lineTo(this.canvas_width-this.column_width,this.y);
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
            //Find the greatest "x" value that should be clicked
            var max_x = this.column_width*(this.x_labels.length-1);
            
            //Adjust the "x" value making it zero for a click on the far left column 
            x -= this.margin_left+this.column_width;
            
            //Now just find a new x based on a percentage of the distance from 
            //the far left. Use this x as the index into the array.
            //E.g. 50% from far left gives us the "middle" value in the array
            //essentially snapping us to discrete values.
            x = Math.round(x / max_x * (this.x_values.length-1));
            
            return this.x_values[x];
        },
        getDecibels: function(y){
            //Find the greatest "y" value that should be clicked
            var max_y = this.row_height*(this.y_labels.length)-this.margin_top;
            
            //Adjust the "y" value making it zero for a click on the top of the graph 
            y -= this.margin_top+this.row_height;
            
            //Now just find a new x based on a percentage of the distance from 
            //the far left. Use this x as the index into the array.
            //E.g. 50% from far left gives us the "middle" value in the array
            //essentially snapping us to discrete values.
            y = Math.round(y / max_y * (this.y_values.length-1));
            return this.y_values[y];
        },
        snapClick: function(x,y){
            this.ctx.fillStyle = 'green';
            this.ctx.font = '16pt helvetica';
            //this.ctx.fillText(String.fromCharCode(parseInt(0x2022), 16),x-12,y+10); 
            
            var max_x = this.column_width*(this.x_labels.length)+3;
            var min_x = this.margin_left+this.column_width-3;
            var max_y = this.canvas_height-this.row_height-this.margin_bottom;     //Hack Hack
            var min_y = this.margin_top+this.row_height+6;                              //Hack Hack

            this.ctx.fillText(String.fromCharCode(parseInt(0x25A0), 16),x,min_y); 
            this.ctx.fillText(String.fromCharCode(parseInt(0x25A0), 16),x,max_y);     
            this.ctx.fillText(String.fromCharCode(parseInt(0x25A0), 16),max_x,y);  
            this.ctx.fillText(String.fromCharCode(parseInt(0x25A0), 16),min_x,y); 
            
        },
        addTxtMeasure: function(x,y){
            var font_size = 18;
            this.ctx.font = font_size+'pt helvetica';
            this.ctx.fillStyle = 'red';
            if(side=='right'){
                this.ctx.fillStyle = 'red';
                font_size = 18;
                this.ctx.font = font_size+'pt helvetica';
                //this.ctx.fillText(String.fromCharCode(parseInt(0x25CB), 16),x-10,y+10);
                this.ctx.fillText(this.current_char,x-10,y+10);
            }else{
                font_size = 18;
                this.ctx.fillStyle = 'blue';
                this.ctx.font = font_size+'pt helvetica';
                //this.ctx.fillText(String.fromCharCode(parseInt(0x0FBE), 16),x-12,y+10); 
                this.ctx.fillText(this.current_char,x-10,y+10);
            }
        },
        addMeasure: function(x,y){
            console.log(x,y);
            this.audiogram_vals.push({'measure':this.crnt_measure,'x':x,'y':y,'freq':this.getFrequency(x),'dB':this.getDecibels(y),'symbol':this.measureImageObj[this.crnt_measure][this.masked][this.side]});           
            this.snapClick(x,y);
            //imageObj.src = this.current_char;
            //this.ctx.drawImage(imageObj, x-12, y-12);
            //console.log("adj x,y ="+(x-12)+" "+(y-12));
            //console.log(this.audiogram_vals);
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
        sortJsonArrayByProperty : function(objArray, prop, direction){
            if (arguments.length<2) throw new Error("sortJsonArrayByProp requires 2 arguments");
            var direct = arguments.length>2 ? arguments[2] : 1; //Default to ascending

            if (objArray && objArray.constructor===Array){
                var propPath = (prop.constructor===Array) ? prop : prop.split(".");
                objArray.sort(function(a,b){
                    for (var p in propPath){
                        if (a[propPath[p]] && b[propPath[p]]){
                            a = a[propPath[p]];
                            b = b[propPath[p]];
                        }
                    }
                    // convert numeric strings to integers
                    a = a.match(/^\d+$/) ? +a : a;
                    b = b.match(/^\d+$/) ? +b : b;
                    return ( (a < b) ? -1*direct : ((a > b) ? 1*direct : 0) );
                });
            }
        }
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
        private['getFrequency'](mousePos.x);
        private['getDecibels'](mousePos.y);
        private['addMeasure'](mousePos.x,mousePos.y);      
        
    }, false);
    private['initArrays']();
    private['calcRowColSize']();
    private['drawOuterBorder']();
    private['addFrequencyLabels']();
    private['addDBLabels']();
    console.log(private['x_values'],private['y_values']);
    //private['tempLoadMeasures']();
    //private['printMeasures']();

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
        }
    }
};