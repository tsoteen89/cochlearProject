var AudioGram = function(stage,audiogram_id,side) {
    var stage = stage;      //The whole kinetic stage!
    var layers = {};        //Object to hold different layers by name
    var stack = [];         //Stack of items added to board.
    var redoStack = [];     //Stack to hold items removed via "undo"
    var lineArray = [];     //Array to hold x,y vals to draw line between measures
    
    // Private data
    var private = {
        audiogramId     : audiogram_id,         //Unique identifier for this audiogram
        objectId        : 0,                    //Numerical ID for objects on stage
        side            : side,                 //Left or right ear
        colors     : {
                             "lineColor":"#414141",
                             "backColor":"#ffffff",
                             "containerColor":"#7E7E7E",
                             "fontLabelsColor": "#414141",
                             "strokeColor": "#000000"
                          },
        stage           : stage,                //Element id for kinetic canvas  
        margins         : {
                            "top":65,
                            "bottom":30,
                            "left":50,
                            "right":30
                          },
        graph_bounds    : {
                            "min":{"x":0,"y":0},
                            "max":{"x":0,"y":0}
                          },
        graph_size      : {"width":null,"height":null},
        currentMeasure  : 'AC',                 //AC, BC, MCL, etc.
        masked          : 'unmasked',           //Masked = masked Unmasked = unmasked :)
        x_labels        : [],
        y_labels        : [],
        x_values        : [],
        y_values        : [],
        
        /**
        * Initializes the audiogram graph
        * @param {null} 
        * @return {null} 
        * @constructor
        */
        _init : function(){
            
            //Set the stroke color depending on which side it is.
            if(this.side == 'right')
                this.colors['strokeColor'] = '#ED1D25';
            else
                this.colors['strokeColor'] = '#1D72EF';
            
            layers['background'] = new Kinetic.Layer();
            layers['measures'] = new Kinetic.Layer();
            layers['connect'] = new Kinetic.Layer();
            
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
            this.graph_bounds.max.x = stage.getWidth() - this.margins.right;
            this.graph_bounds.max.y = stage.getHeight() - this.margins.bottom;
            this.graph_size.width = stage.getWidth()-(this.margins.left+this.margins.right);
            this.graph_size.height = stage.getHeight()-(this.margins.top+this.margins.bottom);
            
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
            this.addBackgroundLayer();
        },
        addBackgroundLayer : function(){
            //Add horizontal lines
            var lines = [];
            var labels = [];
            

            //Add horizontal lines
            for(i=0,y=this.graph_bounds.min.y+20;i<this.y_labels.length;i++,y+=this.row_height){
                var points = [this.graph_bounds.min.x,y,this.graph_bounds.max.x,y];
                
                lines.push(new Kinetic.Line({
                    points: points,
                    stroke:  this.colors["lineColor"],
                    tension: 0,
                    strokeWidth: 1,
                    opacity: 0.5
                }));
            }
            

            //Add vertical lines
            for(i=0,x=this.graph_bounds.min.x+30;i<this.x_labels.length;i++,x+=this.column_width){ 
                var points = [x,this.graph_bounds.min.y,x,this.graph_bounds.max.y];
 
                lines.push(new Kinetic.Line({
                    points: points,
                    stroke: this.colors["lineColor"],
                    tension: 0,
                    strokeWidth: 1,
                    opacity: 0.5
                }));
            }

            //Add dashed lines
            for(i=0;i<this.x_values.length;i++){ 
                var points = [this.x_values[i].x,this.graph_bounds.min.y,this.x_values[i].x,this.graph_bounds.max.y];
 
                lines.push(new Kinetic.Line({
                    points: points,
                    stroke: this.colors["lineColor"],
                    tension: 0,
                    strokeWidth: 1,
                    opacity: 0.2,
                    dash: [3, 3]
                }));
            }
            
            //Add graph border (inner)
            var rect = new Kinetic.Rect({
                x: this.graph_bounds.min.x,
                y: this.graph_bounds.min.y,
                width: this.graph_size.width,
                height: this.graph_size.height,
                stroke: this.colors["lineColor"],
                strokeWidth: 1,
                fill:this.colors["backColor"]
            });

            //Add x labels acress top
            y = this.graph_bounds.min.y-20;
            for(i=0,x=this.graph_bounds.min.x+20;i<this.x_labels.length;i++,x+=this.column_width){
                labels.push( new Kinetic.Text({
                    x: x,
                    y: y,
                    text: this.x_labels[i].toString(),
                    fontSize: 14,
                    fontFamily: 'Calibri',
                    fill: this.colors["fontLabelsColor"],
                }));
            }           
            
            //Add x labels down the side
            x = this.graph_bounds.min.x-30;
            for(i=0,y=this.graph_bounds.min.y;i<this.y_labels.length;i++,y+=this.row_height){
                labels.push( new Kinetic.Text({
                    x: x,
                    y: y+15,
                    text: this.y_labels[i].toString(),
                    fontSize: 14,
                    fontFamily: 'Calibri',
                    fill: this.colors["fontLabelsColor"],
                }));
            }            
            
            layers['background'].add(rect);
            
            for(var i=0;i<lines.length;i++)
                layers['background'].add(lines[i]);
            
            for(var i=0;i<labels.length;i++)
                layers['background'].add(labels[i]);
            
            
            stage.add(layers['background']);
        },
        clearStage: function(){
            //redo will need fixed because I'm destroying the event stack
            stack = [];
            layers['measures'].removeChildren();
            layers['connect'].removeChildren();
            stage.draw();
            
        },
        /**
        * Adds measures to the audiogram. Each "measure" is snapped to the closest proper decibel and frequency.
        * Adds each new measure to a "stack" so we can "undo" the actions
        * @param {null}
        * @return {null} 
        */ 
        addMeasure: function(){
    
            var snap = this.snapClick();
            var x = snap.x;
            var y = snap.y;
            var d = this.getDecibels(y);
            var f = this.getFrequency(x)
            var fontSize = 34;

            //Goes and grabs the "shape" to be displayed based on these params
            var measureData = GetMeasureData(this.currentMeasure,this.masked,this.side);  
                        
            var commonStyle = {
                x: x,
                y: y,
                strokeWidth: 5,
                shadowColor: 'white',
                shadowBlur: 2,
                shadowOffset: {x:1, y:1},
                shadowOpacity: 0.3,
                draggable: true,
                name: measureData.value+"-"+this.objectId,
                center: {'x':x,'y':y},
                audioValues: {'frequency':f.value,'decibels':d.value}
            }
            
       
            
            if (measureData.type == 'text')
            {
                commonStyle['text'] = measureData.value;
                commonStyle['fontSize'] = fontSize;
                commonStyle['fontFamily'] = 'Courier';
                commonStyle['fill'] = 'white';
                commonStyle['shadowColor'] = '#15C2D2';
                commonStyle['shadowBlur'] = 2;
                commonStyle['shadowOffset'] = {x:4, y:4};
                commonStyle['shadowOpacity'] = 0.4;
                //Adjust text to go up and left
                commonStyle['x'] = x - (fontSize/4);
                commonStyle['y'] = y - (fontSize/2);
                var shape = new Kinetic.Text(commonStyle); 
            }else{
                commonStyle['stroke'] = this.colors['strokeColor'];
                if(measureData.value == 'circle'){
                    commonStyle['radius'] = 10;
                    var shape = new Kinetic.Circle(commonStyle);
                }else if(measureData.value == 'triangle'){
                    commonStyle['sides'] = 3;
                    commonStyle['radius'] = 12;
                    var shape = new Kinetic.RegularPolygon(commonStyle);
                }else if(measureData.value == 'square'){
                    commonStyle['width'] = 17;
                    commonStyle['height'] = 17;
                    commonStyle['center'].x = x;
                    commonStyle['center'].y = y;
                    commonStyle['x'] -= commonStyle['width']/2;
                    commonStyle['y'] -= commonStyle['height']/2;  

                 
                    var shape = new Kinetic.Rect(commonStyle);
                }else if(measureData.value == 'wedge'){
                    //remove base x,y because it throws line way off
                    commonStyle['x'] = null;
                    commonStyle['y'] = null;
                    if(this.side == 'right'){
                        commonStyle['points'] =  [x+10, y-10, x, y,x+10,y+10];
                    }else{
                        commonStyle['points'] =  [x-10, y-10, x, y,x-10,y+10];
                    }
                    var shape = new Kinetic.Line(commonStyle);
                }else if(measureData.value == 'x'){
                    //remove base x,y because it throws line way off
                    commonStyle['x'] = null;
                    commonStyle['y'] = null;
                    commonStyle['points'] =  [x+10, y-10, x, y,x+10,y+10,x-10, y-10, x, y,x-10,y+10];

                    var shape = new Kinetic.Line(commonStyle);
                }else if(measureData.value == 'bracket'){
                    //remove base x,y because it throws line way off
                    commonStyle['x'] = null;
                    commonStyle['y'] = null;
                    if(this.side == 'right'){
                        commonStyle['points'] =  [x+6, y-10, x, y-10,x,y+10,x+6,y+10];
                    }else{
                        commonStyle['points'] =  [x-6, y-10, x, y-10,x,y+10,x-6,y+10];
                    }
                    var shape = new Kinetic.Line(commonStyle);
                }
            }

            
            //Push latest measure onto stack
            stack.push(shape);
            
            console.log(shape);
        
            this.connectMeasures();
            
            //Push measure into the "layer"
            layers['measures'].add(stack[stack.length-1]);
            
            //Add layer to stage
            stage.add(layers['measures']);
            this.objectId++;
             
        },
        /**
        * Connect the measures with a line. 
        * @param {null}
        * @return {null}
        */ 
        connectMeasures : function()
        {
            
            var temp = [];
            var points = [];
            
            for(var i=0;i<stack.length;i++){
                var center = stack[i].getAttr('center');
                var x = center.x;
                var y = center.y;
                temp.push({'x':x,'y':y});
            }

            temp = bubbleSort(temp);

            for(var i=0;i<temp.length;i++){
                points.push(temp[i].x);
                points.push(temp[i].y);                
            }
           
            var line = new Kinetic.Line({
                points: points,
                stroke: this.colors['strokeColor'],
                strokeWidth: 2,
                lineCap: 'round',
                lineJoin: 'round'
            });
            
            layers['connect'].removeChildren();
            
            //Push measure into the "layer"
            layers['connect'].add(line);
            
            //Add layer to stage
            stage.add(layers['connect']);
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
            console.log(this.y_values[d-1]);
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
            if(x>=this.graph_bounds.min.x &&
                    x<=this.graph_bounds.max.x &&
                    y>=this.graph_bounds.min.y &&
                    y<=this.graph_bounds.max.y)
                return true;
            else
                return false;
        },
        setCurrentMeasure: function(measure){
            this.currentMeasure = measure;
        },
        setMasked: function(masked){
            if(masked){
                this.masked = 'masked';
            }else{
                this.masked = 'unmasked';
            }
        },
        /**
        * Takes a mouse click and "snaps" it to the closest allowable x,y that corresponds with an appropriate 
        *    audiogram value set. So, it snaps it to the closest dB value in increments of 5 and an acceptable 
        *    frequency (dictated by an array of frequencies).
        * @param {number} x 
        * @param {number} y
        * @return {object} {x,y}
        */ 
        snapClick: function(){
            console.log('snapClick '+this.side);
            var i;  //index
            var d;  //difference
            var cx; //closest x
            var cy; //closest y
            var min = stage.getWidth();   //Largest value that can be on this canvas
            
            var x = stage.getPointerPosition().x;
            var y = stage.getPointerPosition().y;

            for(i=0;i<this.x_values.length;i++){
                d = Math.abs(this.x_values[i].x - x);
                if(d < min){
                    min = d;
                    cx = this.x_values[i].x;
                }
            }
            
            min = stage.getHeight();
            
            for(i=0;i<this.y_values.length;i++){
                d = Math.abs(this.y_values[i].y - y);
                if(d < min){
                    min = d;
                    cy = this.y_values[i].y;
                }
            }            
            
            return {"x":cx,"y":cy};
        },
        undoMeasure: function(){
            var shape = stack.pop();
            redoStack.push(shape);
            shape.remove();
            layers['measures'].draw();
            this.connectMeasures();
            this.objectId--;
        },
        redoMeasure: function(){
            var shape = redoStack.pop();
            stack.push(shape);
            layers['measures'].add(shape);            
            layers['measures'].draw();
            this.connectMeasures();
        }
        
    }

    private._init();
     
    //Create a click event for the "stage". Based on "current state", events
    //will be handled
    $(stage.getContent()).on('click', function(evt) {
        //private.checkAdd();
        private.addMeasure();
    });
    
    layers['measures'].on('click', function(evt) {
        // get the shape that was clicked on
        var shape = evt.target;
        alert('you clicked on \"' + shape.getName() + '\"');
    });

    // Expose public API
    return {
        get: function( prop ) {
            if ( private.hasOwnProperty( prop ) ) {
                return private[ prop ];
            }
        },
        clear: function(){
            console.log("hello");
            private.clearStage();
        },
        setCurrentMeasure: function(measure){
            private.setCurrentMeasure(measure);
        },
        setMasked: function(masked){
            private.setMasked(masked);
        },
        undo: function(){
            private.undoMeasure();
        },
        redo: function(){
            private.redoMeasure();
        }
    }
}

function GetMeasureData(measure,masked,side){
    measureData = 
    {
        "AC": {
            "unmasked": {
                "right": {"type":"shape","value":"circle"},
                "left": {"type":"shape","value":"x"}
            },
            "masked": {
                "right": {"type":"shape","value":"triangle"},
                "left": {"type":"shape","value":"square"}
            }
        },
        "BC": {
            "unmasked": {
                "right": {"type":"shape","value":"wedge"},
                "left": {"type":"shape","value":"wedge"}
            },
            "masked": {
                "right": {"type":"shape","value":"bracket"},
                "left": {"type":"shape","value":"bracket"}
            }
        },
        "MCL": {
            "unmasked": {
                "right": {"type":"text","value":"M"},
                "left": {"type":"text","value":"M"}
            },
            "masked": {
                "right": {"type":"text","value":"M"},
                "left": {"type":"text","value":"M"}
            }
        },
        "UCL": {
            "unmasked": {
                "right": {"type":"text","value":"m"},
                "left": {"type":"text","value":"m"}
            },
            "masked": {
                "right": {"type":"text","value":"m"},
                "left": {"type":"text","value":"m"}
            }
        },
        "SF": {
            "unmasked": {
                "right": {"type":"text","value":"S"},
                "left": {"type":"text","value":"S"}
            },
            "masked": {
                "right": {"type":"text","value":"S"},
                "left": {"type":"text","value":"S"}
            }
        },
        "SF-A": {
            "unmasked": {
                "right": {"type":"text","value":"A"},
                "left": {"type":"text","value":"A"}
            },
            "masked": {
                "right": {"type":"text","value":"A"},
                "left": {"type":"text","value":"A"}
            }
        }
    }
    return measureData[measure][masked][side];
}

/**
* Bubble sort my audiogram array to "order" the 'x' values for printing and connecting 
*   with a line. 
* @param {null}
* @return {null}
*/ 
function bubbleSort(points){
    var swapped;
    do {
        swapped = false;
        for (var i=0; i < points.length-1; i++) {
            if (points[i]['x'] > points[i+1]['x']) {
                var temp = points[i];
                points[i] = points[i+1];
                points[i+1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
    return points;
}

//var group = new Kinetic.Group({
//    x: x,
//    y: y,
//});
//
//var rect = new Kinetic.Rect({
//    x: 0,
//    y: 0,
//    stroke: '#555',
//    strokeWidth: .5,
//    fill: 'rgba(0,0,0,.1)',
//    width: 40,
//    height: 40,
//    shadowColor: 'black',
//    shadowBlur: 5,
//    shadowOffset: {x:1,y:1},
//    shadowOpacity: 0.1,
//    cornerRadius: 5
//});            
//
//group.add(rect);
//group.add(shape);
