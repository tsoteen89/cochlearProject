/*jslint eqeq: true, plusplus: true, vars: true, white: true */

/**
* Bubble sort my audiogram array to "order" the 'x' values for printing and connecting
*   with a line.
* @param {null}
* @return {null}
*/
function bubbleSort(points) {
    'use strict';
    var swapped;
    var i = 0;
    do {
        swapped = false;
        for (i=0; i < points.length-1; i++) {
            if (points[i].x > points[i+1].x) {
                var temp = points[i];
                points[i] = points[i+1];
                points[i+1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
    return points;
}


var AudioGram = function (stage, side, element_id) {
    'use strict';
    var actionStack = [];                       //Stack of "actions".
    var Colors = {
        "lineColor" : "#414141",
        "backColor" : "#ffffff",
        "containerColor" : "#7E7E7E",
        "fontLabelsColor" :  "#414141",
        "textColor" :  "#414141",
        "textShadowColor" :  "#222222",
        "strokeColor" :  "#000000"
    };
    var column_width = 0;                       //Width of each column on audiogramg
    var ctx_menu1_id = 0;                       //Context menus 
    var ctx_menu2_id = 0;
    var currentStack = [];                      //Stack of "actions".
    var ElementId = element_id;                 //Element ID of html canvas
    var globalClick = {'x' : 0, 'y' : 0};       //Global click to help me with context menu right now.
    var graph_bounds = {                        //Outer rectangle of actual audiogram not canvas
        "min" : {"x" : 0, "y" : 0},
        "max" : {"x" : 0, "y" : 0}
    };
    var graph_size = {                          //Size of graph
        "width" : null, 
        "height" : null
    };
    var isPrevious = 0;                         //Is this a previously saved audiogram
    var Layers = {};                            //Object to hold different layers by name
    var lineArray = [];                         //Array to hold x,y vals to draw line between measures
    var AudiogramImages = {
        "bcl": new Image(),
        "bcr": new Image()
    };
    var margins = {                             //Margins for all sides of audiogram
        "top" : 65,
        "bottom" : 30,
        "left" : 50,
        "right" : 30
    };
    var Masked = 'unmasked';                    //Masked = masked Unmasked = unmasked :)
    var measureType = 'AC';                     //AC, BC, MCL, etc.
    var measureID = 0;                          //Unique ID for items added to audio gram
    var noResponse = 0;                         //true = patient could hear , false = patient couldn't hear
    var redoStack = [];                         //Stack to hold items removed via "undo"
    var row_height = 0;                         //Height in pixels of each row on audiogram
    var Side = side;                            //Left or right ear
    var Stage = stage;                          //The whole kinetic stage!
    var x_labels = [];                          //Labels and values for both legends
    var x_values = [];
    var y_labels = [];
    var y_values = [];

    /**
    * Initializes the audiogram graph
    * @param {null}
    * @return {null}
    * @constructor
    */
    function initialize() {

        var i = 0;  //counter
        var x = 0;
        var y = 0;
        var Label = "";
        
        AudiogramImages.bcr.src = "http://aii-hermes.org/cochlearProject/audiogram/images/crazy_fonts/bcr.png";
        AudiogramImages.bcl.src = "http://aii-hermes.org/cochlearProject/audiogram/images/crazy_fonts/bcl.png";
        
        //Add the contex menu for audiogram
        addContextMenus();

        //Set the stroke color depending on which side it is.
        if (Side == 'right') {
            Colors.strokeColor = '#ED1D25';
        } else {
            Colors.strokeColor = '#1D72EF';
        }

        Layers.background = new Kinetic.Layer();
        Layers.measures = new Kinetic.Layer();
        Layers.connect = new Kinetic.Layer();
        Layers.error = new Kinetic.Layer();

        //Load X labels (frequencies) into array
        for (i = 125; i <= 8000; i *= 2) {

            if (i >= 1000) {
                Label = (i / 1000) + 'K';
            } else {
                Label = i;
            }

            x_labels.push(Label);
        }

        //Load Y labels (dB presentation level) into array
        for (i = -10; i <= 120; i += 10) {
            if (i < 0) {
                y_labels.push(i);
            } else if (i < 10) {
                y_labels.push('  ' + i);
            } else if (i < 100) {
                y_labels.push(' ' + i);
            } else {
                y_labels.push(i);
            }
        }

        //Sets all the boundaries necessary for computing position and intersection stuff easily
        graph_bounds.min.x = margins.left;
        graph_bounds.min.y = margins.top;
        graph_bounds.max.x = Stage.getWidth() - margins.right;
        graph_bounds.max.y = Stage.getHeight() - margins.bottom;
        graph_size.width = Stage.getWidth() - (margins.left + margins.right);
        graph_size.height = Stage.getHeight() - (margins.top + margins.bottom);

        //calculate row width and column height so they get drawn evenly in the alloted space
        column_width = Math.floor((graph_bounds.max.x - graph_bounds.min.x) / (x_labels.length));
        row_height = Math.floor((graph_bounds.max.y - graph_bounds.min.y) / (y_labels.length));

        //Load extra X values because we want more possibilities than just the listed frequencies.
        x_values = [{"value" : 125, "x" : null}, {"value" : 250, "x" : null}, {"value" : 375, "x" : null}, {"value" : 500, "x" : null}, {"value" : 750, "x" : null},
                         {"value" : 1000, "x" : null}, {"value" : 1500, "x" : null}, {"value" : 2000, "x" : null}, {"value" : 3000, "x" : null}, {"value" : 4000, "x" : null},
                         {"value" : 6000, "x" : null}, {"value" : 8000, "x" : null}];

        //Calculate the x coordinates for each line. Not necessary, but I'll do it now and store that values to make
        //it easier later to "snap" to the lines when clicking.
        for (i = 0, x = graph_bounds.min.x + column_width / 2; i < x_values.length; i = i + 1, x += column_width / 2) {
            if (i == 1) {
                x += column_width / 2;
            }
            x_values[i].x = x+4; //+4 because of ??? needs deeper fix.
        }

        //Load Y possible values because we want more possibilities than just the labels
        //I add 20 because that's how I shifted the actual lines. Needs fixing.
        for (i = -10, y = graph_bounds.min.y + 20; i <= 120; i += 5, y += row_height / 2) {
            y_values.push({"value" : i, "y" : y});
        }
        addBackgroundLayer();
    }

    /**
    * Adds the context menu to the DOM. A right click method on a "measurement" on the
    * canvas will fire off the "addContextMenu".
    * Requires context.js
    * @param {void}
    * @return {void}
    * *************** Needs redone!!! Fixed to pass in array of functions and labels to be "added" to menu
    */
    function addContextMenus () {
        context.init({preventDoubleContext: true});
        ctx_menu1_id = context.attach('#measure_choices', [
            {header: 'Options'},
            {text: 'Delete', href: '#', action: function (e) {
                e.preventDefault();
                var x = globalClick.x;
                var y = globalClick.y;
                var index = measureClicked(x, y);
                var measure = currentStack[index];
                redoStack.push(currentStack[index]);
                currentStack[index].destroy();
                currentStack.splice(index, 1);
                drawStack();
            }, fa_icon : 'fa-close'},
            {text: 'Toggle Masked', href: '#', action: function (e) {
                e.preventDefault();
                var x = globalClick.x;
                var y = globalClick.y;
                var index = measureClicked(x, y);
                toggleMasked(index);
                drawStack();
            }, fa_icon : 'fa-headphones'},
            /*{divider: true},*/
            {text: 'No Response', href: '#', action: function (e) {
                e.preventDefault();
                var x = globalClick.x;
                var y = globalClick.y;
                var index = measureClicked(x, y);
                toggleNoResponse(index);
                drawStack();
            }, fa_icon : 'fa-thumbs-o-down'}
        ]);
        ctx_menu2_id = context.attach('#audiogram_choices', [
            {header: 'Options'},
            {text: 'Undo', href: '#', action: function (e) {
                e.preventDefault();
                undoMeasure();

            }, fa_icon : 'fa-history'},
            {text: 'Redo', href: '#', fa_icon : 'fa-rotate-right'},
            {divider: true},
            {text: 'Clear Audiogram', href: '#', action: function (e) {
                e.preventDefault();
                clearStage();

            }, fa_icon : 'fa-refresh'}
        ]);
    }

    /**
    * Adds a downward arrow to a measure to indicate no-response
    * @param {int} x1 - Starting coords
    * @param {int} y1
    * @param {int} x2 - Ending coords
    * @param {int} y2
    * @param {int} w - Width of arrow head
    * @return {shape} - kinetic js line
    */
    function arrow (x1, y1, x2, y2, w) {

        var pr = (Math.atan2(y2 - y1, x2 - x1) / (Math.PI / 180));
        var pl = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));

        x2 = x1 + pl;
        y2 = y1;

        var poly = new Kinetic.Line({
            points: [0,
                     0 + w,
                     0,
                     0 - w,
                     x2 - x1 - 3 * w,
                     y2 - y1 - w,
                     x2 - x1 - 3 * w, y2 - y1 - 2 * w,
                     x2 - x1,
                     y2 - y1,
                     x2 - x1 - 3 * w,
                     y2 - y1 + 2 * w,
                     x2 - x1 - 3 * w,
                     0 + w
                    ],
            fill: Colors.strokeColor,
            stroke: Colors.strokeColor,
            strokeWidth : 2,
            closed : true,
            rotation : pr,
            x : x1,
            y : y1,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: {x : 2, y : 2},
            shadowOpacity: 0.5
        });

        return poly;
    }
    
    /**
    * Adds the layer with the "graph" looking lines
    * @param {void}
    * @return {void}
    */
    function addBackgroundLayer() {
        //Add horizontal lines
        var lines = [];
        var labels = [];
        var points = [];
        var i = 0;
        var y = 0;
        var x = 0;


        //Add horizontal lines
        for (i = 0, y = graph_bounds.min.y + 20; i < y_labels.length; ++i, y += row_height) {
            points = [graph_bounds.min.x, y, graph_bounds.max.x, y];

            lines.push(new Kinetic.Line({
                points: points,
                stroke:  Colors.lineColor,
                tension: 0,
                strokeWidth: 1,
                opacity: 0.5
            }));
        }


        //Add vertical lines
        for (i = 0, x = graph_bounds.min.x + 30; i < x_labels.length; ++i, x += column_width) {
            points = [x, graph_bounds.min.y, x, graph_bounds.max.y];

            lines.push(new Kinetic.Line({
                points: points,
                stroke: Colors.lineColor,
                tension: 0,
                strokeWidth: 1,
                opacity: 0.5
            }));
        }

        //Add dashed lines (+4 because something wasn't right in determining borders buffers etc. needs deeper fix)
        for (i = 0; i < x_values.length; i = i + 1) {
            points  =  [x_values[i].x, graph_bounds.min.y, x_values[i].x, graph_bounds.max.y];

            lines.push(new Kinetic.Line({
                points : points,
                stroke : Colors.lineColor,
                tension : 0,
                strokeWidth : 1,
                opacity : 0.2,
                dash : [3, 3]
            }));
        }

        //Add graph border (inner)
        var rect = new Kinetic.Rect({
            x : graph_bounds.min.x,
            y : graph_bounds.min.y,
            width : graph_size.width,
            height : graph_size.height,
            stroke : Colors.lineColor,
            strokeWidth : 1,
            fill : Colors.backColor
        });

//        Normal hearing: -10-25dB
//        Mild hearing loss: 26-45dB
//        Moderate hearing loss: 46-70dB
//        Severe hearing loss: 71-90dB
//        Profound Hearing Loss: 91dB and up
        
        //Combine into single funtion later....

        var mild = new Kinetic.Rect({
            x : graph_bounds.min.x,
            y : graph_bounds.min.y+row_height*3.5+20,
            width : graph_size.width,
            height : row_height*2,
            stroke : Colors.lineColor,
            strokeWidth : 1,
            fill : '#F9F8DB'
        });
        var moderate = new Kinetic.Rect({
            x : graph_bounds.min.x,
            y : graph_bounds.min.y+row_height*5.5+20,
            width : graph_size.width,
            height : row_height*2.5,
            stroke : Colors.lineColor,
            strokeWidth : 1,
            fill : '#E0EEF9'
        });
        var severe = new Kinetic.Rect({
            x : graph_bounds.min.x,
            y : graph_bounds.min.y+row_height*8+20,
            width : graph_size.width,
            height : row_height*2,
            stroke : Colors.lineColor,
            strokeWidth : 1,
            fill : '#FDE2E1'
        });
        var profound = new Kinetic.Rect({
            x : graph_bounds.min.x,
            y : graph_bounds.min.y+row_height*10+20,
            width : graph_size.width,
            height : row_height*4-6,    /*-6 for some dumb reason*/
            stroke : Colors.lineColor,
            strokeWidth : 1,
            fill : '#F9C2C4'
        });        

        //Add x labels acress top
        y = graph_bounds.min.y - 20;
        for (i = 0, x = graph_bounds.min.x + 20; i < x_labels.length; i++, x += column_width) {
            labels.push(new Kinetic.Text({
                x : x,
                y : y,
                text : x_labels[i].toString(),
                fontSize : 14,
                fontFamily : 'Calibri',
                fill : Colors.fontLabelsColor
            }));
        }

        //Add x labels down the side
        x = graph_bounds.min.x - 30;
        for (i = 0, y = graph_bounds.min.y; i < y_labels.length; ++i, y += row_height) {
            labels.push(new Kinetic.Text({
                x : x,
                y : y + 15,
                text : y_labels[i].toString(),
                fontSize : 14,
                fontFamily : 'Calibri',
                fill : Colors.fontLabelsColor
            }));
        }

        Layers.background.add(rect);
        Layers.background.add(mild);
        Layers.background.add(moderate);
        Layers.background.add(severe);
        Layers.background.add(profound);
        
        for (i = 0; i < lines.length; ++i) {
            Layers.background.add(lines[i]);
        }

        for (i = 0; i < labels.length; i++) {
            Layers.background.add(labels[i]);
        }


        Stage.add(Layers.background);
    }
    
    /**
    * Adds measures to the audiogram. Each "measure" is snapped to the closest proper decibel and frequency.
    * Each measure starts with a common set of attributes, and is then refined depending on what type of
    * measure it is.
    * Adds each new measure to a "stack" so we can "undo" the actions
    * @param {null}
    * @return {null}
    */
    function addMeasure(x, y) {
        var index = false;
        var shape = null;
        var Image = null;
        var uri = null;
        
        //Get frequency and decibels assigned to the coordinate (x,y)
        var d = getDecibels(y);
        var f = getFrequency(x);

        //Arbitrary font size right now.
        var fontSize = 34;

        //Goes and grabs the "shape" to be displayed based on these params
        var measureData = GetMeasureData(measureType,Masked,Side);

        //Common styles to most measures
        var commonStyle = {
            x : x,
            y : y,
            strokeWidth : 5,
            shadowColor : Colors.textShadowColor,
            shadowBlur : 2,
            shadowOffset : {x:1, y:1},
            shadowOpacity : 0.3,
            draggable : true,
            measure : measureType,
            center : {'x' : x,'y' : y},
            audioValues : {'frequency' : f.value, 'decibels' : d.value},
            audioLine : false,
            noResponse : noResponse,
            masked : false,
            measureID : nextID()
        };
        
        console.log(commonStyle);

        //Determine the actual measure type so it can be customized
        if (measureData.type == 'text') {
            commonStyle.text = measureData.value;
            commonStyle.fontSize = fontSize;
            commonStyle.fontFamily = 'Courier';
            commonStyle.fill = Colors.textColor;
            commonStyle.shadowColor = Colors.textShadowColor;
            commonStyle.shadowBlur = 2;
            commonStyle.shadowOffset = {'x' : 4, 'y' : 4};
            commonStyle.shadowOpacity = 0.4;
            //Adjust text to go up and left
            commonStyle.x = x - (fontSize / 4);
            commonStyle.y = y - (fontSize / 2);
            shape = new Kinetic.Text(commonStyle);
        } else {
            commonStyle.stroke = Colors.strokeColor;
            if (measureData.value == 'circle') {
                commonStyle.radius = 10;
                commonStyle.audioLine = true;
                shape = new Kinetic.Circle(commonStyle);
            } else if(measureData.value == 'triangle') {
                commonStyle.sides = 3;
                commonStyle.radius = 12;
                commonStyle.audioLine = true;
                commonStyle.masked = true;
                shape = new Kinetic.RegularPolygon (commonStyle);
            } else if(measureData.value == 'square') {
                commonStyle.width = 17;
                commonStyle.height = 17;
                commonStyle.center.x = x;
                commonStyle.center.y = y;
                commonStyle.audioLine = true;
                commonStyle.masked = true;
                //Adjust x,y so rectangle is centered on coords
                commonStyle.x -= commonStyle.width/2;
                commonStyle.y -= commonStyle.height/2;
                shape = new Kinetic.Rect(commonStyle);
            } else if(measureData.value == 'wedge') {

                if(Side == 'right') {
                    commonStyle.image =  AudiogramImages.bcr;
                }else{
                    commonStyle.image =  AudiogramImages.bcl;
                }
                commonStyle.width = 30;
                commonStyle.height = 30;
                
                shape = new Kinetic.Image(commonStyle);  
                console.log(shape);
            } else if(measureData.value == 'x') {
                commonStyle.audioLine = true;
                commonStyle.points =  [x + 10, y - 10, x, y, x + 10, y + 10, x - 10, y - 10, x, y, x - 10, y + 10];

                shape = new Kinetic.Line(commonStyle);
            } else if (measureData.value == 'bracket') {
                commonStyle.masked = true;
                if (Side == 'right') {
                    commonStyle.points =  [x + 6, y - 10, x, y - 10, x, y + 10, x + 6, y + 10];
                } else {
                    commonStyle.points =  [x - 6, y - 10, x, y - 10, x, y + 10, x - 6, y + 10];
                }
                shape = new Kinetic.Line(commonStyle);
            }
        }
        currentStack.push(shape);
        actionStack.push({"action" : "add", "measureID" : shape.get});
        drawStack();
    }

    /**
    * Binds the context menu to our canvas
    * @param {void}
    * @return {void}
    */
    function bindContextMenu() {
        $('#' + ElementId).bind('contextmenu', $.proxy(function (event) {
            event.preventDefault();
            showContextMenu();
        }));
    }
    
    function bindKeyPress() {
        $('#' + ElementId)
        // Mouse down override to prevent default browser controls from appearing
        .mousedown(function(){ $(this).focus(); return false; }) 
        .keydown(function(){ console.log("keypress"); return false; });
    }
    
    
    

    /**
    * Gets an intact stack from other ear to use as a starting point (copy the sucker)
    * @param {void}
    * @return {void}
    */
    function bulkLoadStack(stack) {
        var i = 0;
        var x = 0;
        var y = 0;
        for(i=0;i<stack.length;++i){
            Masked = stack[i].attrs.masked ? 'masked' : 'unmasked';
            measureType = stack[i].attrs.measure;
            if(stack[i].attrs.x == null){
                x = stack[i].attrs.center.x;
                y = stack[i].attrs.center.y;
            }else{
                x = stack[i].attrs.x;
                y = stack[i].attrs.y;
            }
            addMeasure(x,y);
        }
    }
    
    /**
    * Removes all items from the stage, then redraws the clean stage.
    * @param {void}
    * @return {void}
    */
    function clearStage() {
        //redo will need fixed because I'm destroying the event stack
        currentStack = [];
        Layers.measures.removeChildren();
        Layers.connect.removeChildren();
        Stage.draw();

    }
    
    /**
    * Return count of all measures on stage.
    * @param {void}
    * @return {int} count
    */
    function countMeasures() {

        return currentStack.length;

    }
    

    /**
    * Turns a measure on Audiogram into a "no-response" by adding a downward arrow to the icon.
    * @param {int} - index location within the stack of the "shape"
    * @return {void}
    */
    function drawArrow(index) {
        var arrow = null;           //holds arrow if needed (for a no response)
        var shape = currentStack[index];

        var attr = shape.getAttrs();
        var x1 = attr.center.x + 5;
        var x2 = attr.center.x + 15;
        var y1 = attr.center.y + 5;
        var y2 = attr.center.y + 15;

        var w = 2;

        var pr = (Math.atan2(y2 - y1, x2 - x1) / (Math.PI / 180));
        var pl = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));

        x2 = x1 + pl;
        y2 = y1;

        arrow = new Kinetic.Line({
            points: [0,
                     0 + w,
                     0,
                     0 - w,
                     x2 - x1 - 3 * w,
                     y2 - y1 - w,
                     x2 - x1 - 3 * w,
                     y2 - y1 - 2 * w, 
                     x2 - x1,
                     y2 - y1, 
                     x2 - x1 - 3 * w,
                     y2 - y1 + 2 * w,
                     x2 - x1 - 3 * w, 
                     0 + w
                    ],
            fill: Colors.strokeColor,
            stroke: Colors.strokeColor,
            strokeWidth: 2,
            closed: true,
            rotation: pr,
            x: x1,
            y: y1,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: {'x' : 2, 'y' : 2},
            shadowOpacity: 0.5,
            center: {'x' : x1, 'y' : y1},
            measure: measureType
        });

        return arrow;
    }

    /**
    * One function to draw contents of stack. Basically this method redraws everything on the audiogram.
    * @param {null}
    * @return {json}
    */
    function drawStack() {

        var temp = [];
        var points = [];
        var measure = null;
        var shape = null;
        var center = null;
        var arrow = null;
        var i = 0;

        //Draw measures first
        Layers.measures.removeChildren();

        for (i = 0; i < currentStack.length; ++i) {
            console.log(typeof currentStack[i].attrs.points == 'object');

            Layers.measures.add(currentStack[i]);
            if (currentStack[i].getAttr('noResponse') === true) {
                arrow = drawArrow(i);
                Layers.measures.add(arrow);
            }

        }

        //Add layer to Stage
        Stage.add(Layers.measures);

        //Draw line connecting any measure that has the attribute 'audioLine' set to 'true'
        for (i = 0; i < currentStack.length; ++i) {
            shape = currentStack[i];
            if (shape.getAttr('audioLine')) {
                center = shape.getAttr('center');
                temp.push({'x' : center.x, 'y' : center.y});
            }
        }

        temp = bubbleSort(temp);

        for (i = 0; i < temp.length; ++i) {
            points.push(temp[i].x);
            points.push(temp[i].y);
        }

        var line = new Kinetic.Line({
            points : points,
            stroke : Colors.strokeColor,
            strokeWidth : 2,
            lineCap : 'round',
            lineJoin : 'round'
        });

        Layers.connect.removeChildren();

        //Push measure into the "layer"
        Layers.connect.add(line);

        //Add layer to Stage
        Stage.add(Layers.connect);
    }
    
    function dumpStack(){
        console.log(Side + " Stack:");
        console.log(currentStack);
    }
    
    /**
    * Returns the audiogram for the current ear
    * @param {null}
    * @return {json}
    */
    function getAudiogram() {
        var audiogram = {};
        var i = 0;
        for (i = 0; i < currentStack.length; ++i) {
            console.log(currentStack[i].getAttrs());
        }
    }
    
    /**
    * Finds the closest decibel value (in increments of 5) to the mouse click
    * @param {number} y The 'y' coordinate of the mouse click.
    * @return {null}
    */
    function getDecibels(y) {
        var d;
        var r;

        y = y - graph_bounds.min.y;                    //adjust y because of margins

        d = Math.floor(y / (row_height / 2));          //How many 1/2 rows divide into y
        
        r = (y % (row_height / 2)) / row_height;        //Remainder (how close is it to the next value).
        
        if (r > 0.5) {
            d = d + 1;
        }
        return y_values[Math.abs(d - 1)];
    }

    /**
    * Finds the closest frequency value (within an array of acceptable values) to the mouse click
    * @param {number} x The 'x' coordinate of the mouse click.
    * @return {null}
    */
    function getFrequency(x) {

        var d;
        var r;
        var c = column_width;              //short var name for column width
        var c2 = c / 2;                         //ref to column width div 2
        var i;                                  //loop counter
        var p;                                  //current x pixel

        x = Math.round(x - graph_bounds.min.x);    //adjust x because of margins

        p = c;      //start off p as the width of one column

        //If x is within the first column, return 125hz
        if(x < p) {
            return x_values[0].value;
        }

        for(i = 1, p += c2; i < x_values.length; ++i, p += c2) {
            if(x < p) {
                //If it's closer to the previous value, snap to it.
                var ratio = ((x % c2) / c2);
                if(ratio < 0.5) {
                    return x_values[i - 1];
                } else {
                    return x_values[i];
                }
            }
        }

        return x_values[x_values.length - 1];
    }
    
    /**
    * A lookup object to return what shape and value when a measure is placed on the canvas
    * @param {number} x The 'x' coordinate of the mouse click.
    * @return {null}
    */
    function GetMeasureData(measure_type,masked,side) {
        'use strict';
        var measureData =
            {
                "AC" :  {
                    "unmasked" :  {
                        "right" :  {"type" : "shape", "value" : "circle"},
                        "left" :  {"type" : "shape", "value" : "x"}
                    },
                    "masked" :  {
                        "right" :  {"type" : "shape", "value" : "triangle"},
                        "left" :  {"type" : "shape", "value" : "square"}
                    }
                },
                "BC" :  {
                    "unmasked" :  {
                        "right" :  {"type" : "shape", "value" : "wedge"},
                        "left" :  {"type" : "shape", "value" : "wedge"}
                    },
                    "masked" :  {
                        "right" :  {"type" : "shape", "value" : "bracket"},
                        "left" :  {"type" : "shape", "value" : "bracket"}
                    }
                },
                "MCL" :  {
                    "unmasked" :  {
                        "right" :  {"type" : "text", "value" : "M"},
                        "left" :  {"type" : "text", "value" : "M"}
                    },
                    "masked" :  {
                        "right" :  {"type" : "text", "value" : "M"},
                        "left" :  {"type" : "text", "value" : "M"}
                    }
                },
                "UCL" :  {
                    "unmasked" :  {
                        "right" :  {"type" : "text", "value" : "m"},
                        "left" :  {"type" : "text", "value" : "m"}
                    },
                    "masked" :  {
                        "right" :  {"type" : "text", "value" : "m"},
                        "left" :  {"type" : "text", "value" : "m"}
                    }
                },
                "SF" :  {
                    "unmasked" :  {
                        "right" :  {"type" : "text", "value" : "S"},
                        "left" :  {"type" : "text", "value" : "S"}
                    },
                    "masked" :  {
                        "right" :  {"type" : "text", "value" : "S"},
                        "left" :  {"type" : "text", "value" : "S"}
                    }
                },
                "SF-A" :  {
                    "unmasked" :  {
                        "right" :  {"type" : "text", "value" : "A"},
                        "left" :  {"type" : "text", "value" : "A"}
                    },
                    "masked" :  {
                        "right" :  {"type" : "text", "value" : "A"},
                        "left" :  {"type" : "text", "value" : "A"}
                    }
                }
            };
        return measureData[measure_type][masked][side];
    }
    
    /**
    * Returns current stack in order to copy to other ears audiogram
    * @param {void} 
    * @return {object} - stack
    */
    function getCurrentStack() {
        console.log(currentStack);
        return currentStack;
    }
    
    /**
    * Simply makes sure mouse click is on the "audiogram" before adding a measure.
    * @param {int} x  -  Coords of where click happened
    * @param {int} y
    * @return {bool} - True = in bounds / False = not.
    */
    function inBounds(x, y) {
        if(x >= graph_bounds.min.x &&
           x <= graph_bounds.max.x &&
           y >= graph_bounds.min.y &&
           y <= graph_bounds.max.y) {
            return true;
        } else {
            return false;
        }
    }
    
    /**
    * Loads a previously saved audiogram
    * @param {json} data - json object of the whole shabang
    * @return {bool} - True = success or False = broke!.
    */
    function loadAudiogram(data) {
        console.log("loading");
        console.log(Side);
        console.log(data);
        for(var i=0;i<data.length;i++){
            var shape = JSON.parse(data[i]);
            if(shape.attrs.center.x){
                var x = shape.attrs.center.x;
                var y = shape.attrs.center.y;
            }else{
                var x = shape.attrs.x;
                var y = shape.attrs.y;
            }

                        
            setMeasureType(shape.attrs.measure);         
            setMasked(shape.attrs.masked);
            setNoResponse(shape.attrs.noResponse);
            addMeasure(x,y);
        }
        //This is a previously loaded audiogram.
        isPrevious = 1;

    }

    function toggleNoResponse(index) {
        
        if(currentStack[index].attrs.noResponse === true)
           currentStack[index].attrs.noResponse = false;
        else
           currentStack[index].attrs.noResponse = true;

    }
    
    function toggleMasked(index) {
        
        var MaskedState = Masked;
        var x = currentStack[index].attrs.x;
        var y = currentStack[index].attrs.y;
        
        //Toggle 
        if(currentStack[index].attrs.masked === true){
            currentStack[index].attrs.masked = false;
            Masked = 'unmasked';
        }else{
            currentStack[index].attrs.masked = true;
            Masked = 'masked';
        }
        
        currentStack.splice(index,1);
        addMeasure(x,y);
        Masked = MaskedState;

    }

    /**
    * Simple centralized id generator. Instead of incrementing 'measureID' all over the place
    * @param {void}
    * @return {int} next available id
    */
    function nextID() {
        var id = measureID;
        measureID++;
        return id;
    }
    

    /**
    * When stage is clicked, this function find the "object / measure" on the canvas that it would collide with.
    * Not allowed to be on same "y" coordinate.
    * @param {int} x - Optional x
    * @param {int} y - Optional y
    * @return {int} i - index of shape in stack
    */
    function measureClicked(x,y) {
        var attr = null;
        var snap = null;
        var i = 0;

        if(typeof x == "undefined" && typeof y == "undefined") {
            snap = snapClick();
            x = snap.x;
            y = snap.y;
        }

        for(i = 0; i < currentStack.length; ++i) {
            attr = currentStack[i].getAttrs();
            try {
                var test = (x == attr.center.x);
            }
            catch(err) {
                console.log("Stack Error:");
                console.log(currentStack);
            }
            if(x == attr.center.x && y == attr.center.y) {
                return i;
            }
        }
        return false;
    }



    /**
    * Retreives last item popped off the stack and adds it to the "stage"
    * @param {void}
    * @return {void}
    */
    function redoMeasure() {
        var shape = redoStack.pop();
        if (typeof(shape) != "undefined") {
            currentStack.push(shape);
            drawStack();
        }
    }

    /**
    * Turns a measure on Audiogram into a "no-response" by adding a downward arrow to the icon.
    * @param {void}
    * @return {void}
    */
    function setMeasureType(measure_type) {
        measureType = measure_type;
    }

    /**
    * Receives a 'bool' masked where 1 = masked and 0 = unmasked
    * @param {bool} masked
    * @return {void}
    */
    function setMasked(masked) {
        if (masked) {
            Masked = 'masked';
        } else {
            Masked = 'unmasked';
        }
    }
    
    /**
    * Receives a 'bool' and sets 'non-response' to true or not.
    * @param {bool} masked
    * @return {void}
    */
    function setNoResponse(response) {
        if (response === true) {
            noResponse = true;
        } else {
            noResponse = false;
        }
    }

    /**
    * Changes the css of our context menu and displays it at the location in which the
    * canvas was clicked.
    * @param {void}
    * @return {void}
    */
    function showContextMenu(x2, y2) {
        var x1 = $("#audiogram_"+Side).offset().left;
        var y1 = $("#audiogram_"+Side).offset().top;

        //var x2 = Stage.getPointerPosition ().x;
        //var y2 = Stage.getPointerPosition ().y;

        //Because the "bound" method on the context menu doesn't know or have access to (yet) the
        //Stages x,y click location, I'm saving that click globally so I can use it in the context
        //menu handler. Crap.
        globalClick.x = x2;
        globalClick.y = y2;

        var attr = measureClicked(x2, y2);

        if(attr !== false) {
            $('#dropdown-' + ctx_menu1_id).css('position', 'absolute');
            $('#dropdown-' + ctx_menu1_id).css('display', 'block');
            $('#dropdown-' + ctx_menu1_id).css('top', y1 + y2);
            $('#dropdown-' + ctx_menu1_id).css('left', x1 + x2);
        }else{
            $('#dropdown-' + ctx_menu2_id).css('position', 'absolute');
            $('#dropdown-' + ctx_menu2_id).css('display', 'block');
            $('#dropdown-' + ctx_menu2_id).css('top', y1 + y2);
            $('#dropdown-' + ctx_menu2_id).css('left', x1 + x2);
        }
    }

    /**
    * Takes a mouse click and "snaps" it to the closest allowable x,y that corresponds with an appropriate
    *    audiogram value set. So, it snaps it to the closest dB value in increments of 5 and an acceptable
    *    frequency (dictated by an array of frequencies).
    * @param {number} x  - Pass in x and y, in case "stage.getPointerPosition ()" is not defined.
    * @param {number} y  - Not always necessary.
    * @return {object} {x,y}
    */
    function snapClick(inX,inY) {

        var i;          //index
        var d;          //difference
        var cx;         //closest x
        var cy;         //closest y
        var min = 0;    //Helping with boundaries and adjusting actual click location
        var x = 0;
        var y = 0;

        //See if stage has a current mouse click. If it's not defined then I don't want to throw an error.
        var coord = Stage.getPointerPosition ();
        if (typeof coord != 'undefined') {
            x = Stage.getPointerPosition ().x;
            y = Stage.getPointerPosition ().y;
        }else{
            x = inX;
            y = inY;
        }

        if(!inBounds(x,y)) {
            return {"x" : null, "y" : null, "error" : true, "errorType" : "Out of bounds", "measureClicked" : false, "frequency" : false};
        }

        min = Stage.getWidth();

        for(i = 0; i < x_values.length; ++i) {
            d = Math.abs(x_values[i].x - x);
            if(d < min) {
                min = d;
                cx = x_values[i].x;
            }
        }

        min = Stage.getHeight();

        for(i = 0; i < y_values.length; ++i) {
            d = Math.abs(y_values[i].y - y);
            if(d < min) {
                min = d;
                cy = y_values[i].y;
            }
        }
        return {"x" : cx, "y" : cy, "error" : false, "measureClicked" : measureClicked(cx,cy), "sameFrequencyIndex" : sameFrequency(cx)};

    }

    /**
    * Returns the stack data (measures on the stack) as a json object. 
    * @param {json} - sawr
    * @return {bool} - returns true if saved succesfully
    */
    function getVisibleMeasures(){
        var i = 0;
        var stackData = [];
        for (i = 0; i < currentStack.length; ++i) {
            stackData.push(currentStack[i].getAttrs());
        }
        return stackData;
    }
    
    function getRawMeasures(){
        var i = 0;
        var stackData = [];
        for (i = 0; i < currentStack.length; ++i) {
            stackData.push(currentStack[i]);
        }
        return stackData;
    }
    
    /**
    * Turns the "previous audiogram" flag off
    * @param {void} 
    * @return {void}
    */
    function newAudiogram() {
        isPrevious = 0;
        clearStage();
    }
    
    /**
    * Checks to see if a measure is being added to the same frequency (Air Conduction only)
    * @param {int} - x coord
    * @return {bool} - returns true if one exists
    * @return {int} - index of item that occupies frequency
    */
    function sameFrequency(x) {

        var center = null;
        var i = 0;

        for(i = 0; i < currentStack.length; ++i) {
            center = currentStack[i].getAttr('center');
            if(x == center.x && currentStack[i].getAttr('measure') == measureType) {
                return i;
            }
        }
        return false;
    }
    
    /**
    * Pops last item off the stack and removes it from the "stage"
    * @param {void}
    * @return {void}
    */
    function undoMeasure() {
        if(currentStack.length > 0) {
            var shape = currentStack.pop();
            redoStack.push(shape);
            shape.remove();
            Layers.measures.draw();
            drawStack();
        }else{
            var tooltip = new Kinetic.Label({
                x : (graph_bounds.max.x - graph_bounds.min.x) / 2,
                y : (graph_bounds.max.y - graph_bounds.min.y) / 2,
                opacity: 0.75
            });
            tooltip.add(new Kinetic.Tag({
                fill : 'black',
                pointerDirection : 'down',
                pointerWidth : 10,
                pointerHeight : 10,
                lineJoin : 'round',
                shadowColor : 'black',
                shadowBlur : 10,
                shadowOffset : {'x' : 10, 'y' : 20},
                shadowOpacity : 0.5
            }));

            tooltip.add(new Kinetic.Text({
                text : 'Nothing to undo!',
                fontFamily : 'Calibri',
                fontSize : 18,
                padding : 5,
                fill : 'white'
            }));

            Layers.error.add(tooltip);
            Stage.add(Layers.error);
            setTimeout(
                function () {
                    tooltip.remove();
                    Layers.error.draw();
                },
                3000);
        }
    }
    
    initialize();
    
    //Create a click event for the "Stage". Based on "current state", events
    //will be handled
    $(Stage.getContent()).on ('click', function (evt) {
        //console.log(evt);
        var offsetX = evt.offsetX || evt.layerX;
        var offsetY = evt.offsetY || evt.layerY;
        console.log(offsetX+','+offsetY);
        var clickInfo = snapClick(offsetX,offsetY);
        if(isPrevious){
            //alert("Previous audiogram, do you want to use this as a template?");
            var confirmModal = modalDialog();
            confirmModal.modalType('confirm');
            confirmModal.show("Confirm:");
            
        }else{
            setTimeout(function () {
                //Remove any error messages from the canvas
                Layers.error.removeChildren ();
                Stage.draw();

                setTimeout(function () {
                    //If you clicked on the canvas
                    if(!clickInfo.error) {
                        //if you click in the same frequency, you snap the existing one to the new location
                        if(clickInfo.measureClicked !== false) {
                            showContextMenu(clickInfo.x,clickInfo.y);
                        }else if(clickInfo.sameFrequencyIndex !== false) {
                            //handle moving item on same frequency
                            currentStack.splice(clickInfo.sameFrequencyIndex,1);
                            addMeasure(clickInfo.x,clickInfo.y);                       
                        }else{
                            addMeasure(clickInfo.x,clickInfo.y);
                        }
                    }
                },0);

            },0);
        }
    });
    
    $(Stage.getContent()).on('contextmenu', function (evt) {
        console.log(evt);
    });
    
    
    // Expose public API
    return {
        bindContextMenu : bindContextMenu,
        bindKeyPress : bindKeyPress,
        bulkLoadStack : bulkLoadStack,
        clear : clearStage,
        getCurrentStack: getCurrentStack,
        countMeasures: countMeasures,
        dumpStack: dumpStack,
        getAudiogram : getAudiogram,
        getAudiogramMeasures : getVisibleMeasures,
        getAudiogramRawMeasures: getRawMeasures,
        newAudiogram: newAudiogram,
        loadAudiogram: loadAudiogram,
        toggleNoResponse : toggleNoResponse,
        toggleMasked: toggleMasked,
        redo : redoMeasure,
        setMeasureType : setMeasureType,
        setMasked : setMasked,
        showContextMenu : showContextMenu,
        undo : undoMeasure
    };
};

    var myDateObj = function(){
        /**
        * Place todays date in the patient data form
        * @param {void}
        * @return {void}
        */        
        function getTodaysDate(){
            var date = new Date();

            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();

            if (month < 10) month = "0" + month;
            if (day < 10) day = "0" + day;

            return today = year + "-" + month + "-" + day;       
            //$("#patient-audiogram-date").attr("value", today);
        }
                
        function unixTime(){
            var time = 0;
            if (!Date.now) {
                time =  new Date().getTime() / 1000;
            }else{
                time = Date.now() / 1000;
            }
            
            return Math.floor(time);
        }
        
        function fromUnixTime(UNIX_timestamp){
            var a = new Date(UNIX_timestamp*1000);

            var year = a.getFullYear();

            var month = a.getMonth() + 1;
            if (month < 10) month = "0" + month;
            
            var day = a.getDate();
            if (day < 10) day = "0" + day;
            
            return  year + "-" + month + "-" + day;  
        }
        
        return {
            today:getTodaysDate,
            unixTime:unixTime,
            fromUnixTime:fromUnixTime
        };
    }
        

    var cookieCleaner = function(){
        
        var cookies;
        
        function initialize(){
            getCookieData();
            return cookies;
        }
        
        /**
        * Trims extra double quotes and single quotes off of strings. I used a locally created
        * object because of some funny behavior I couldnt track down quickly.
        * @param {void}
        * @return {object} cookies object
        */ 
        function cleanCookies(){
            var obj = {};
            for (var key in cookies) {
              if (cookies.hasOwnProperty(key)) {
                obj[key] = cookies[key].replace(/['"]+/g, '');
              }
            }
            return obj;
        }

        /**
        * Grabs all existing cookies
        * @param {void}
        * @return {void}
        */ 
        function getCookieData(){
            cookies = cookie.all();
            cookies = cleanCookies();
        }
        
        return initialize();
    }

    var modalDialog = function() {

        var $modal = null;
        
        
        // Creating modal dialog's DOM
        var $loadingDialog = $(
            '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
            '<div class="modal-dialog modal-m">' +
            '<div class="modal-content">' +
                '<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
                '<div class="modal-body">' +
                    '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
                '</div>' +
            '</div></div></div>');
        
        var $confirmDialog = $(
            '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
            '<div class="modal-dialog modal-m">' +
            '<div class="modal-content">' +
                '<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
                '<div class="modal-body">' +
                    '<div>This is a previously saved audiogram.<br>Would you like to use this as template for your new audiogram?</div>' +
                '</div>' +
                '<div class="modal-footer">' +
                    '<button type="button" class="btn btn-default" data-dismiss="modal">Confirm</button>' +
                    '<a href="#" class="btn btn-danger danger">Cancel</a>' +
                '</div>' +
            '</div></div></div>');

        function setModalType(type){
            switch(type){
                case 'confirm':
                    $modal = $confirmDialog;
                    break;
                case 'loading':
                    $modal = $loadingDialog;
                    break;
                default:
                    alert("Error: No modaltype chosen");
            }
        }
        /**
         * Opens our dialog
         * @param message Custom message
         * @param options Custom options:
         * 				  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
         * 				  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
         */
        function show(message, options) {
            // Assigning defaults
            var settings = $.extend({
                dialogSize: 'sm',
                progressType: 'success'
            }, options);
            if (typeof message === 'undefined') {
                message = 'Loading';
            }
            if (typeof options === 'undefined') {
                options = {};
            }
            // Configuring dialog
            $modal.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
            $modal.find('.progress-bar').attr('class', 'progress-bar');
            if (settings.progressType) {
                $modal.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
            }
            $modal.find('h3').text(message);
            // Opening dialog
            $modal.modal();
        }
        
        /**
         * Closes dialog
         */
        function hide() {
            $modal.modal('hide');
        }
                
        
        return {
            modalType:setModalType,
            hide:hide,
            show:show
        };

    };    
    
    /************************************************************************************************
     * AiiApiHelper 
     * 
     * @method 
     * @method audioConditions
     * @method audioTitles/{token:[a-zA-Z0-9_-]+}
     * @method audiograms
     * @method audiograms/{audiogram_id:[0-9]+}
     * @method audiograms/{audiogram_id:[0-9]+}/patient/{patient_id:[0-9]+}
     * @method audiograms/patient/{patient_id:[0-9]+}
     * @method audiograms/getLatestAudiogramID
     ************************************************************************************************/  

    var AiiApiHelper = function(apiurl,cookie_data,stage){
        
        var ApiUrl = apiurl;
        var Token = cookie_data.SessionID;
        var PatientID = cookie_data.PatientID;
        var EventID = cookie_data.CareTeamID;
        var PhaseID = cookie_data.PhaseID;
        var Stage = stage;
        
                
        /**
        * Gets an audiogram based on id
        * @param {voId}
        * @return {void}
        */ 
        function getAudiogram(audiogram_id){
            var dynamicData = {};
            audiogram_id = typeof audiogram_id !== 'undefined' ? audiogram_id : -1;
            //Get one audiogram
            if(audiogram_id > 0){
                return $.ajax({
                          url: ApiUrl+"audiograms/"+audiogram_id,
                          type: "get",
                          data: dynamicData
                });
            }else{
                return {"Error":"No audiogram id provided"};
            }
        }
        
        /**
        * Gets the titles available for audiograms
        * @param {voId}
        * @return {void}
        */ 
        function getAudiogramTitles(){
            var dynamicData = {};
                             
            return $.ajax({
                      url: ApiUrl+"audioTitles/"+Token,
                      type: "get",
                      data: dynamicData
            });
        }
        
        /**
        * Gets the unique condition choices for each ear (cochlear, unaided, etc.)
        * @param {void}
        * @return {void}
        */ 
        function getEarConditions(){
            var dynamicData = {};
                             
            return $.ajax({
                      url: ApiUrl+"audioConditions/"+Token,
                      type: "get",
                      data: dynamicData
            });
        }
        
        /**
        * Gets the max Audiogram id
        * @param {void}
        * @return {void}
        */ 
        function getMaxAudiogramId(){
            var dynamicData = {};
                             
            return $.ajax({
                      url: ApiUrl+"audiograms/getLatestAudiogramID",
                      type: "get",
                      data: dynamicData
            });
        };
        
        /**
        * Gets the specific name of a phase, given a phase id.
        * @param {int} - phase id
        * @return {void}
        */
        function getPhaseInfo(phase_id){
            var dynamicData = {};
            
            phase_id = typeof phase_id !== 'undefined' ? phase_id : -1;
            if(phase_id > 0){
                return $.ajax({
                          url: ApiUrl+"phases/"+phase_id+"/"+Token,
                          type: "get",
                          data: dynamicData
                });
            }else{
                return {"Error":"No phase id provided."};
            }
        }

        /**
        * Gets a list of previous audiograms ... if any
        * @param {void}
        * @return {void}
        */         
        function getPrevAudiogramsList(){
            var dynamicData = {};
                             
            return $.ajax({
                      url: ApiUrl+"audiograms/patient/"+PatientID,
                      type: "get",
                      data: dynamicData
            });
        }
        
        /**
        * Gets session data for entire audiogram dealing with patient, facility, and event.  
        * @param {void}
        * @return {void}
        */
        function getSessionData(){
            var dynamicData = {};
            return $.ajax({
                      url: ApiUrl+"patients/"+PatientID+"/event/"+EventID+"/"+Token,
                      type: "get",
                      data: dynamicData
            });
        }
        

        return {
            getAudiogram:getAudiogram,
            getAudiogramTitles:getAudiogramTitles,
            getEarConditions:getEarConditions,
            getMaxAudiogramId:getMaxAudiogramId,
            getPhaseInfo:getPhaseInfo,
            getPrevAudiogramsList:getPrevAudiogramsList,
            getSessionData:getSessionData
        };
    };

    /************************************************************************************************
     * DomHelper 
     * 
     * @method loadAudiogram
     * @method loadAudiogramTitles
     * @method loadEarConditions
     * @method loadPatientInfo
     * @method loadPatientAudiogramTitles
     * @method loadPhaseName
     ************************************************************************************************/
    var DomHelper = function(stage){
        
        var Stage = stage;
        
        function loadAudiogram( data ) {

            var data = data.records;

            var right_json = JSON.parse(data.right_measures);
            var left_json = JSON.parse(data.left_measures);

            //Load measures on each canvas

            if(right_json.length > 0){
                Stage['right'].loadAudiogram(right_json);
            }
            
            if(left_json.length > 0){
                Stage['left'].loadAudiogram(left_json);
            }

            //Update audiogram title
            $('#aii-audiogram-title').val(data.title);
            $('#aii-audiogram-title').selectpicker('refresh');
            
            var AudiogramDate = fromUnixTime(data.date);

            $("#patient-audiogram-date").attr("value", AudiogramDate.year+'-'+AudiogramDate.month+'-'+AudiogramDate.day);

            //Update left and right ear conditions
            $('#right-condition-opts').val(data.right_condition);
            $('#right-condition-opts').selectpicker('refresh');
            $('#left-condition-opts').val(data.left_condition);
            $('#left-condition-opts').selectpicker('refresh');

            $('#spch_aud_srt_r').val(data.spch_aud_srt_r);
            $('#spch_aud_srt_l').val(data.spch_aud_srt_l);
            $('#spch_aud_srt_b').val(data.spch_aud_srt_b);
            $('#spch_aud_mask_r').val(data.spch_aud_mask_r);
            $('#spch_aud_mask_l').val(data.spch_aud_mask_l);
            $('#spch_aud_mask_b').val(data.spch_aud_mask_b);
            $('#word_rec_per_r').val(data.word_rec_per_r);
            $('#word_rec_per_l').val(data.word_rec_per_l);
            $('#word_rec_per_b').val(data.word_rec_per_b);
            $('#word_rec_stim_r').val(data.word_rec_stim_r);
            $('#word_rec_stim_l').val(data.word_rec_stim_l);
            $('#word_rec_stim_b').val(data.word_rec_stim_b);
            $('#word_rec_mask_r').val(data.word_rec_mask_r);
            $('#word_rec_mask_l').val(data.word_rec_mask_l);
            $('#word_rec_mask_b').val(data.word_rec_mask_b);
            $('#word_rec_noise_r').val(data.word_rec_noise_r);
            $('#word_rec_noise_l').val(data.word_rec_noise_l);
            $('#word_rec_noise_b').val(data.word_rec_noise_b);

            event.preventDefault();
        }
    
        function loadAudiogramTitles( titles ){

            var Html = '<option value="0" disabled selected>Choose Title...</option>';

            for(var i=0;i<titles.length;i++){
                Html = Html + '<option value="'+titles[i].Title+'">'+titles[i].Title+'</option>';
            }

            $('#aii-audiogram-title').html(Html).selectpicker('refresh');
        }

        function loadEarConditions( data ){
            var temp = [], conditions = [], l = data.length, i;
            for( i=0; i<l; i++) {
                if( temp[data[i].LeftAidCondition]) continue;
                temp[data[i].LeftAidCondition] = true;
                conditions.push(data[i].LeftAidCondition);
            }

            var Html = '<option value="0" disabled selected>Choose ear condition...</option>';

            for(var i=0;i<conditions.length;i++){
                Html = Html + '<option value="'+conditions[i]+'">'+conditions[i]+'</option>';
            }

            $('#right-condition-opts').html(Html).selectpicker('refresh');
            $('#left-condition-opts').html(Html).selectpicker('refresh');
        }
        
        function loadPatientAudiogramTitles( data ){
            if(data.length>0){
                var Html = '<option value="0" disabled selected>Find Previous Audiogram <i class="fa fa-search"></i></option>';
                for( i=0; i<data.length; i++) {
                    var audiogram_date = moment.unix(data[i].date).format("MM/DD/YY");
                    Html = Html + '<option value="'+data[i].audiogram_id+'">'+audiogram_date+' - '+data[i].title+'</option>';
                }
            }else{
                var Html = '<option value="0" disabled selected>NO Previous Audiograms </option>';                    
            }

            $('#aii-audiogram-prev').html(Html).selectpicker('refresh');
        }
        
        function addPatientAudiogramTitle( data ){

            var Html  = $('#aii-audiogram-prev').html();
            Html = Html + '<option value="'+data.audiogram_id+'">'+data.audiogram_date+' - '+data.audiogram_title+'</option>';


            $('#aii-audiogram-prev').html(Html).selectpicker('refresh');
        }        
        
        function loadPatientInfo( first,last,dob,facility) {
            $('#patient-name').val(first+' '+last);
            $('#patient-dob').val(dob);
            $('#facility-name').html(facility);
        }
        
        function loadPhaseName( data ){
             $('#patient-phase').html(data);
        }
        
        /**
        * updateConditionButtons - 
        * @param {obj} event
        * @return {void}
        */ 
        function updateMeasureButtons() {
            // Settings



        }
        /**
        * initMeasurementButtons - 
        * @param {obj} event
        * @return {void}
        */ 
//        function initMeasureButtons() {
//            //Added for checkbox buttons
//            $('.button-checkbox').each(function(){
//
//                // Settings
//                var $widget = $(this),
//                    $button = $widget.find('button'),
//                    $checkbox = $widget.find('input:checkbox'),
//                    color = $button.data('color'),
//                    settings = {
//                        on: {
//                            icon: 'fa fa-check-square-o'
//                        },
//                        off: {
//                            icon: 'fa fa-ban'
//                        }
//                    };
//
//                // Event Handlers
//                $button.on('click', function () {
//                    $checkbox.prop('checked', !$checkbox.is(':checked'));
//                    $checkbox.triggerHandler('change');
//                    updateMeasureButtons();
//                    event.preventDefault();
//                });
//
//                $checkbox.on('change', function () {
//                    updateMeasureButtons();
//                });
//
//            });
//        }
        
        function resetDropDowns(){
            $('#aii-audiogram-prev').selectpicker('val','0');
            $('#right-condition-opts').selectpicker('val','0');
            $('#left-condition-opts').selectpicker('val','0');
            $('#aii-audiogram-title').selectpicker('val','0');
        }
        

        
        return {
            addPatientAudiogramTitle:addPatientAudiogramTitle,
            loadAudiogram:loadAudiogram,
            loadAudiogramTitles:loadAudiogramTitles,
            loadEarConditions:loadEarConditions,
            loadPatientInfo:loadPatientInfo,
            loadPatientAudiogramTitles:loadPatientAudiogramTitles,
            loadPhaseName:loadPhaseName,
            resetDropDowns:resetDropDowns,
            updateMeasureButtons:updateMeasureButtons,
        };
    }
    
    /************************************************************************************************
     * EventHandler 
     * 
     * @method canvasMenu
     * @method chooseMeasure
     * @method loadAudiogram
     * @method loadLatestAudiogram
     * @method printAudiogram
     * @method saveAudiogram
     * @method showPatientInfo
     * @method togglePatientInfo
     ************************************************************************************************/    
    var EventHandler = (function(){
        var settings = {};
        var Stage = null;
        var aiiApi = null;
        var domHelper = null;
        var ModelHelper = new modalDialog();
        return {
            init: function(stage,aiiapi,domhelper) {
                settings.measureButtons = $('.aii-mea-btn');
                settings.canvasMenu = $('.aii-canvas-menu');
                settings.copy = $('.copy');
                settings.loadAudiogram = $('#load-audiogram');
                settings.loadLatestAudiogram = $('#load-latest');
                settings.newAudiogram = $('.newAudiogram');
                settings.printAudiogram = $('#printAudiogram');
                settings.saveAudiogram = $('.saveAudiogram');
                settings.showPatientInfo = $('#show-patient-info');
                settings.togglePatientInfo = $('#toggle-patient-info');
                settings.toggleMeasures = $('#masked');
                this.bindUIActions();
                this.bindErrorActions();
                Stage = stage;
                aiiApi = aiiapi;
                domHelper = domhelper;
            },
            bindErrorActions: function(){
                /**
                * Highlights element to show needed answers on save
                * @param {obj} element
                * @param {string} error message               
                * @return {void}
                */ 
                settings.checkSaveError = function(ele,message){

                    var $ele = ele
                    var title = $ele.val();
                    var error = 0;

                    if(title == "" || title == null){
                        error = 1;
                        $ele.selectpicker('setStyle', 'btn-danger', 'add');
                    }

                    $ele.on('change',function(){
                        $ele.selectpicker('setStyle', 'btn-danger', 'remove').selectpicker('refresh');                 
                    });

                    return error;
                }  
            },
            bindUIActions: function() {
                /**
                * Adds events to the small menu buttons below each audiogram canvas.
                * @param {obj} event
                * @return {void}
                */ 
                settings.canvasMenu.click(function (event) {
                    var side = $( this ).attr('data');                              // Right or Left
                    var action = $(event.target).closest('button').attr("data");    // Button to determine action

                    switch(action){
                        case 'Refresh': Stage[side].clear();
                            break;
                        case 'Undo':    Stage[side].undo();
                            break;
                        case 'Redo':    Stage[side].redo();
                            break;
                    }
                    $(event.target).closest('button').blur();
                    event.preventDefault();
                });
                
                /**
                * Copy left ear to right ear and vice versa 
                * @param {obj} event
                * @return {void}
                */ 
                settings.copy.click(function (event) {
                    var button = $( this );
                    var side = button.data('side');

                    if(side == 'left'){
                        var stack = Stage['left'].getCurrentStack();
                        Stage['right'].bulkLoadStack(stack);
                    }else{
                        var stack = Stage['right'].getCurrentStack();
                        Stage['left'].bulkLoadStack(stack);
                    }
                    event.preventDefault();
                });
                
                /**
                * Load a previously saved audiogram
                * Putting it back in the same state with title, and ear conditions.
                * @param {obj} event
                * @return {void}
                */     
                settings.loadAudiogram.click(function (event) {
                    Stage['right'].clear();
                    Stage['left'].clear();

                    var audiogram_id = $('#aii-audiogram-prev option:selected').val();
                    if(audiogram_id == ''){
                        console.log("error");
                        return;
                    }else{
                        var data = null
                        
                        ModelHelper.modalType('loading');
                        ModelHelper.show('Fetching audiogram ...');
                        

                        $.when(aiiApi.getAudiogram(audiogram_id)).then(function( data ) {
                            domHelper.loadAudiogram( data ); 
                            ModelHelper.hide();
                        });
                    }
                });
                
                /**
                * Gets the 'id' of the last audiogram in the list, then 'clicks' loadAudiogram
                * @param {obj} event
                * @return {void}
                */   
                settings.loadLatestAudiogram.click(function (event) {
                    $('#aii-audiogram-prev option:last-child').attr('selected', 'selected');
                    $('#load-audiogram').trigger( "click" ); 
                });
                
                /**
                * Resets the audiogram page
                * @param {obj} event
                * @return {void}
                */   
                settings.newAudiogram.click(function (event) {
                        Stage.left.newAudiogram();
                        Stage.right.newAudiogram();
                        domHelper.resetDropDowns();
                });
                
                /**
                * Controls the choosing of a measurement for an audiogram, and
                * highlighting the clicked button.
                * @param {obj} event
                * @return {void}
                */ 
                settings.measureButtons.click(function (event) {
                    var clicked = $( this )[0].id;
                    setTimeout( function (){
                        $( ".aii-mea-btn" ).each(function( index ) {
                            if($( this )[0].id != 'mask-button'){
                                if(clicked == $( this )[0].id){
                                    $( this ).addClass('aii-btn-border');
                                    $( this ).blur();
                                }else{
                                    $( this ).removeClass('aii-btn-border');
                                }
                            }
                        })
                        setTimeout( function (){
                            $( ".aii-mea-btn" ).each(function( index ) {
                                if($( this ).hasClass( "aii-btn-border" )){
                                    Stage['right'].setMeasureType(clicked);
                                    Stage['left'].setMeasureType(clicked);
                                }
                            });
                        }, 0 );
                    }, 0 );
                    event.preventDefault();
                }); 
                
                /**
                * Adds a print action to the "print" button in the top menu
                * @param {obj} event
                * @return {void}
                */ 
                settings.printAudiogram.click(function (event) {
                    var canvas_right = $("#audiogram_right").find(".kineticjs-content").children();
                    var canvas_left = $("#audiogram_left").find(".kineticjs-content").children();
                    var ImgData = {
                        "action" : "print",
                        "background" : canvas_right[0].toDataURL("image/png"),
                        "right" : {
                            "line" : canvas_right[1].toDataURL("image/png"),
                            "measures" : canvas_right[2].toDataURL("image/png")
                        },
                        "left" : {
                            "line" : canvas_left[1].toDataURL("image/png"),
                            "measures" : canvas_left[2].toDataURL("image/png")
                        }
                    }

                    console.log(ImgData);

                    //DO I NEED THIS ????????
                    $.post( "class.audiogram.php", ImgData)
                    .done(function( data ) {
                        console.log( "Data Loaded: " + data );
                    });
                    event.preventDefault();
                }); 
                
                /**
                * Adds a print action to the "print" button in the top menu
                * @param {obj} event
                * @return {void}
                */ 
                settings.saveAudiogram.click(function (event) {
                    event.preventDefault();
                    var errors = 0;
                    

                    //Check for mandatory fields on audiogram page
                    errors += settings.checkSaveError($('#aii-audiogram-title'),'Title Needed...');
                    errors += settings.checkSaveError($('#right-condition-opts'),'Condition Needed...');
                    errors += settings.checkSaveError($('#left-condition-opts'),'Condition Needed...');

                    //If errors, then quit (handle later)
                    if(errors > 0){
                        console.log("error on save");
                        //return;
                    }else{
                        saveAudiogram(Stage,domHelper.addPatientAudiogramTitle);
                        
                        Stage.left.clear();
                        Stage.right.clear();
                        domHelper.resetDropDowns();
                        
                    }
                });
                /**
                * Shows the patient info "block" that could be hidden to save screen space
                * @param {obj} event
                * @return {void}
                */ 
                settings.showPatientInfo.click(function (event) {
                    $('#patient-info').css('display','block');
                    $('#hide-patient-info').css('display','block');
                    $('#show-patient-info').css('display','none');
                    event.preventDefault();
                });
                /**
                * Shows or hides the patient information "block" (or div)
                * @param {obj} event
                * @return {void}
                */ 
                settings.togglePatientInfo.click(function (event) {
                                        
                    if($('#patient-info').hasClass('hidden')){
                        $( "#patient-info" ).slideDown( "slow", function() {
                            $('#toggle-patient-info').html('<i class="fa fa-caret-square-o-up"></i> Hide Patient Info');
                            $('#patient-info').removeClass('hidden');
                        });
                    }else{
                        $( "#patient-info" ).slideUp( "slow", function() {
                            $('#toggle-patient-info').html('<i class="fa fa-caret-square-o-down"></i> Show Patient Info');
                            $('#patient-info').addClass('hidden');
                        });
                    }
                    event.preventDefault();
                });
                /**
                * Turns masked on or off for measures, in turn changing symbols for audiogram
                * @param {obj} event
                * @return {void}
                */ 
                settings.toggleMeasures.click(function (event) {
                    
                    var $this = $(this);
                    var isChecked = false;
                                        
                    if($this.data('isChecked') == 'undefined'){
                        $this.data('isChecked',true);
                        isChecked = true;
                    }else if($this.data('isChecked') === true){
                        $this.data('isChecked',false);
                        isChecked = false;
                    }else{
                        $this.data('isChecked',true);
                        isChecked = true;  
                    }
                    
                    if (isChecked === true) {
                        $this
                        .removeClass('btn-default')
                        .addClass('aii-btn-border active')
                        .blur();
                        Stage['right'].setMasked(1);
                        Stage['left'].setMasked(1);
                        $('#BCL').html('&nbsp;&nbsp;]');
                        $('#BCR').html('[&nbsp;&nbsp;');        
                        $('#ACL').html('<i class="fa fa-square-o"></i>');
                        $('#ACR').html('&#x25b3;');
                        $this.find('.fa')
                        .removeClass()
                        .addClass('fa fa-check pull-left aii');
                    } else {
                        $this
                        .removeClass('aii-btn-border active')
                        .addClass('btn-default')
                        .blur();
                        Stage['right'].setMasked(0);
                        Stage['left'].setMasked(0);  
                        $('#BCR').html('<i class="fa fa-chevron-left"></i>&nbsp;');
                        $('#BCL').html('&nbsp;<i class="fa fa-chevron-right"></i>');
                        $('#ACR').html('<i class="fa fa-circle-o"></i>');
                        $('#ACL').html('&#10005;');
                        $this.find('.fa')
                        .removeClass()
                        .addClass('fa fa-fw');
                    }
//                    var $widget = $('.button-checkbox'),
//                        $button = $widget.find('button'),
//                        $checkbox = $widget.find('input:checkbox'),
//                        isChecked = $checkbox.is(':checked'),
//                        settings = {
//                            on: {
//                                icon: 'fa fa-check-square-o'
//                            },
//                            off: {
//                                icon: 'fa fa-ban'
//                            }
//                        };
//
//                    // Set the button's state
//                    $button.data('state', (isChecked) ? "on" : "off");
//
//                    // Set the button's icon
//                    $button.find('.state-icon')
//                    .removeClass()
//                    .addClass('state-icon ' + settings[$button.data('state')].icon);
//                    // Update the button's color

                    event.preventDefault();
                });               

            },
            bindStageReference: function(stage){
                Stage = stage;
            }
        }
    })();

     

    /************************************************************************************************
     * Main Function 
     * 
     ************************************************************************************************/    
    $(function() {
        
        var ApiUrl = "";
        var StageLeft = null;       
        var StageRight = null;
        var Stage = {};
        var aiiApi = null;
        var domHelper = null;
        var MyDate = null;
        var CookieData = null;
        var PatientData = null;
        var AudiogramData = {};
        var ModelHelper = new modalDialog();
        

        
        //combine stuff later
        $( "a" ).click(function( event ) {
          event.preventDefault();
        });

        //Create 2 canvas's using Kinetic library
        var StageRight = new Kinetic.Stage({
            container: 'audiogram_right',
            width: 450,
            height: 450
        });

        var StageLeft = new Kinetic.Stage({
            container: 'audiogram_left',
            width: 450,
            height: 450
        });


        //Pass both kinetic stages to the audiogram lib to add the audiogram
        //functionality.
        Stage['right'] = new AudioGram(StageRight,'right','audiogram_right');
        Stage['left'] = new AudioGram(StageLeft,'left','audiogram_left');
        
        Stage['right'].bindContextMenu();
        Stage['left'].bindContextMenu();
                
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        // Initialization /////////////////////////////////////////////////////////////////////////////////////
        function init() {
            ApiUrl = 'http://aii-hermes.org/aii-api/v1/';
            CookieData = new cookieCleaner();
            
            ModelHelper.modalType('loading');
    
            //If the cookie timed out, redirect home
            if(CookieData['BadToken'] == 'Token Timeout'){
                console.log("Error: Timed Out");
                window.location.href = '/cochlearProject/';
            }
            
            domHelper = new DomHelper(Stage);
            aiiApi = new AiiApiHelper(ApiUrl,CookieData,Stage);
            ModelHelper.show('Fetching patient data ...');
            EventHandler.init(Stage,aiiApi,domHelper,ModelHelper);
            
            //Get all the api data to set up the audiogram page
            $.when(aiiApi.getSessionData(),
                   aiiApi.getAudiogramTitles(),
                   aiiApi.getEarConditions(),
                   aiiApi.getMaxAudiogramId(),
                   aiiApi.getPrevAudiogramsList(),
                   aiiApi.getPhaseInfo(CookieData.PhaseID))
            .done(function(a,b,c,d,e,f){
                PatientData = a[0].records;
                AudiogramData.Titles = b[0].records;
                AudiogramData.EarConditions = c[0].records;
                AudiogramData.MaxAudiogramId = parseInt(d[0].records);
                AudiogramData.PatientsAudiograms = e[0].records;
                AudiogramData.PhaseName= f[0].records.Name;
            }).then(function(){
                domHelper.loadPatientInfo(PatientData.Patient.First,
                                          PatientData.Patient.Last,
                                          PatientData.Patient.DOB,
                                          PatientData.Facility.Name);
                domHelper.loadAudiogramTitles(AudiogramData.Titles);
                domHelper.loadEarConditions(AudiogramData.EarConditions);
                domHelper.loadPatientAudiogramTitles(AudiogramData.PatientsAudiograms);
                domHelper.loadPhaseName(AudiogramData.PhaseName);
                //domHelper.initMeasureButtons();
                ModelHelper.hide();
                $('#globalData').data('MaxID',AudiogramData.MaxAudiogramId);
                $('#globalData').data('EventID',CookieData.CareTeamID);
                $('#globalData').data('PhaseID',CookieData.PhaseID);
                $('#globalData').data('PatientID',CookieData.PatientID);
                $('#globalData').data('ApiUrl',ApiUrl);
                
            });
            
            MyDate = new myDateObj();

            setTodaysDate();

            //testing only
            loadSpeechWordData();

            //Library for bootstrap dropdowns.
            $('.selectpicker').selectpicker();
            
        }

        init();
        
    });
    //End Main Function //////////////////////////////////////////////////////////////////////////////////////////////  

   /**
    * Create the save function which builds the json package for the ajax request 
    * @param {void}
    * @return {void}
    */
    function saveAudiogram(Stage,callback){


        var Max = $('#globalData').data('MaxID') + 1;

        var unix = unixTime();
        
        var AudiogramData = {
            "date" : unix,                
            "title" : $('#aii-audiogram-title option:selected').val(),
            "audiogram_id": Max,
            "event_id": $('#globalData').data('EventID'),
            "phase_id": $('#globalData').data('PhaseID'),
            "patient_id": $('#globalData').data('PatientID'),
            "spch_aud_srt_r":$('#spch_aud_srt_r').val(),
            "spch_aud_srt_l":$('#spch_aud_srt_l').val(),
            "spch_aud_srt_b":$('#spch_aud_srt_b').val(),
            "spch_aud_mask_r":$('#spch_aud_mask_r').val(),
            "spch_aud_mask_l":$('#spch_aud_mask_l').val(),
            "spch_aud_mask_b":$('#spch_aud_mask_b').val(),
            "word_rec_per_r":$('#word_rec_per_r').val(),
            "word_rec_per_l":$('#word_rec_per_l').val(),
            "word_rec_per_b":$('#word_rec_per_b').val(),
            "word_rec_stim_r":$('#word_rec_stim_r').val(),
            "word_rec_stim_l":$('#word_rec_stim_l').val(),
            "word_rec_stim_b":$('#word_rec_stim_b').val(),
            "word_rec_mask_r":$('#word_rec_mask_r').val(),
            "word_rec_mask_l":$('#word_rec_mask_l').val(),
            "word_rec_mask_b":$('#word_rec_mask_b').val(),
            "word_rec_noise_r":$('#word_rec_noise_r').val(),
            "word_rec_noise_l":$('#word_rec_noise_l').val(),
            "word_rec_noise_b":$('#word_rec_noise_b').val(),
            "left_condition": $('#left-condition-opts option:selected').val(),
            "right_condition":$('#right-condition-opts option:selected').val(),
            "left_measures": Stage['left'].getAudiogramRawMeasures(),
            "right_measures": Stage['right'].getAudiogramRawMeasures()                       
        };
        

        var data = JSON.stringify(AudiogramData);
        
        var url = $('#globalData').data('ApiUrl')+'audiograms';
        

        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            contentType: "application/json; charset=utf-8",
        }).done(function( data ) {
            $('#globalData').data('MaxID',Max);            
            var d = fromUnixTime(unix);
            d.year = d.year-2000;
            
            callback( {
                'audiogram_title':$('#aii-audiogram-title option:selected').val(),
                'audiogram_date': d.month+'/'+d.day+'/'+d.year,
                'audiogram_id':Max
            });
        }).fail(function() {
            console.log( "fail" );
        }).always(function() {
            console.log( "always" );
        });

    }       
    /**
    * Re-sets the page back to its original "state" of cleanliness.
    * @param {void}
    * @return {void}
    */ 
    function resetPage(){
        $('#aii-audiogram-title option:first').attr('selected','selected');
        //$("#target option:first").attr('selected','selected');
    }

      
    /**
    * Place todays date in the patient data form
    * @param {void}
    * @return {void}
    */        
    function setTodaysDate(){
        var date = new Date();

        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;

        var today = year + "-" + month + "-" + day;       
        $("#patient-audiogram-date").attr("value", today);
    }

    /**
    * Debug helper to load speech and word testing forms with test data
    * @param {void}
    * @return {void}
    */
    function loadSpeechWordData(){
        $('#spch_aud_srt_r').val('45');
        $('#spch_aud_srt_l').val('50');
        $('#spch_aud_srt_b').val('30');
        $('#spch_aud_mask_r').val('30');
        $('#spch_aud_mask_l').val('30');
        $('#spch_aud_mask_b').val('None');
        $('#word_rec_per_r').val('76');
        $('#word_rec_per_l').val('80');
        $('#word_rec_per_b').val('92');
        $('#word_rec_stim_r').val('85');
        $('#word_rec_stim_l').val('90');
        $('#word_rec_stim_b').val('60');
        $('#word_rec_mask_r').val('60');
        $('#word_rec_mask_l').val('65');
        $('#word_rec_mask_b').val('None');
        $('#word_rec_noise_r').val('None');
        $('#word_rec_noise_l').val('None');
        $('#word_rec_noise_b').val('+10');          
    }

    function unixTime(){
        var time = 0;
        if (!Date.now) {
            time =  new Date().getTime() / 1000;
        }else{
            time = Date.now() / 1000;
        }

        return Math.floor(time);
    }

    function fromUnixTime(UNIX_timestamp){
        var a = new Date(UNIX_timestamp*1000);

        var year = a.getFullYear();

        var month = a.getMonth() + 1;
        if (month < 10) month = "0" + month;

        var day = a.getDate();
        if (day < 10) day = "0" + day;

        return {
            'year':year,
            'month':month,
            'day':day
        };
    }
      