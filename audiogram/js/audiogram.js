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
    var margins = {                             //Margins for all sides of audiogram
        "top" : 65,
        "bottom" : 30,
        "left" : 50,
        "right" : 30
    };
    var Masked = 'unmasked';                    //Masked = masked Unmasked = unmasked :)
    var measureType = 'AC';                     //AC, BC, MCL, etc.
    var measureID = 0;                          //Unique ID for items added to audio gram
    var no_response = 0;                        //true = patient could hear , false = patient couldn't hear
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
            noResponse : false,
            masked : false,
            measureID : nextID()
        };

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

                //remove base x,y because it throws line way off
                commonStyle.x = null;
                commonStyle.y = null;

                if(Side == 'right') {
                    commonStyle.points =  [x + 10, y - 10, x, y, x + 10, y + 10];
                }else{
                    commonStyle.points =  [x - 10, y - 10, x, y, x - 10, y + 10];
                }

                shape = new Kinetic.Line(commonStyle);                
            } else if(measureData.value == 'x') {
                //remove base x,y because it throws line way off
                commonStyle.x = null;
                commonStyle.y = null;
                commonStyle.audioLine = true;
                commonStyle.points =  [x + 10, y - 10, x, y, x + 10, y + 10, x - 10, y - 10, x, y, x - 10, y + 10];

                shape = new Kinetic.Line(commonStyle);
            } else if (measureData.value == 'bracket') {
                //remove base x,y because it throws line way off
                commonStyle.x = null;
                commonStyle.y = null;
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
            Layers.measures.add(currentStack[i]);
            console.log(currentStack[i]);
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

        r = (y % (row_height / 2)) / row_height;  //Remainder (how close is it to the next value).

        if (r > 0.5) {
            d = d + 1;
        }

        return y_values[d - 1];
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
        for(var i=0;i<data.length;i++){
            var shape = JSON.parse(data[i]);
            if(shape.attrs.x)
                var x = shape.attrs.x;
            else
                var x = shape.attrs.center.x;
            if(shape.attrs.y)
                var y = shape.attrs.y;
            else
                var y = shape.attrs.center.y;
            setMeasureType(shape.attrs.measure);         
            setMasked(shape.attrs.masked);
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
        
        console.log(currentStack);
        
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
        var clickInfo = snapClick();
        
        if(isPrevious){
            alert("Previous audiogram, do you want to use this as a template?");
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
    
    // Expose public API
    return {
        bindContextMenu : bindContextMenu,
        bindKeyPress : bindKeyPress,
        clear : clearStage,
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