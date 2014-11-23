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

function GetMeasureData(measure,masked,side) {
    //console.log(measure+", "+masked+", "+side);
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
    return measureData[measure][masked][side];
}


var AudioGram = function (stage, audiogram_id, side, element_id) {
    'use strict';
    var Stage = stage;                          //The whole kinetic stage!
    var layers = {};                            //Object to hold different layers by name
    var currentStack = [];                      //Stack of "actions".
    var actionStack = [];                       //Stack of "actions".
    var redoStack = [];                         //Stack to hold items removed via "undo"
    var lineArray = [];                         //Array to hold x,y vals to draw line between measures
    var globalClick = {'x' : 0, 'y' : 0};       //Global click to help me with context menu right now.

    // Private data
    var my_private = {
        audiogramId     : audiogram_id,         //Unique identifier for this audiogram
        side            : side,                 //Left or right ear
        element_id      : element_id,           //Element ID of html canvas
        colors     : {
            "lineColor" : "#414141",
            "backColor" : "#ffffff",
            "containerColor" : "#7E7E7E",
            "fontLabelsColor" :  "#414141",
            "textColor" :  "#414141",
            "textShadowColor" :  "#222222",
            "strokeColor" :  "#000000"
        },
        margins : {
            "top" : 65,
            "bottom" : 30,
            "left" : 50,
            "right" : 30
        },
        graph_bounds : {
            "min" : {"x" : 0, "y" : 0},
            "max" : {"x" : 0, "y" : 0}
        },
        graph_size      : {"width" : null, "height" : null},
        measureType     : 'AC',                 //AC, BC, MCL, etc.
        measureID       : 0,                    //Unique ID for items added to audio gram
        masked          : 'unmasked',           //Masked = masked Unmasked = unmasked :)
        no_response     : 0,             //true = patient could hear , false = patient couldn't hear
        ctx_menu1_id    : 0,
        ctx_menu2_id    : 0,
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
        my_init : function () {

            var i = 0;  //counter
            var x = 0;
            var y = 0;
            var Label = "";

            //Add the contex menu for audiogram
            this.addContextMenus();

            //Set the stroke color depending on which side it is.
            if (this.side == 'right') {
                this.colors.strokeColor = '#ED1D25';
            } else {
                this.colors.strokeColor = '#1D72EF';
            }

            layers.background = new Kinetic.Layer();
            layers.measures = new Kinetic.Layer();
            layers.connect = new Kinetic.Layer();
            layers.error = new Kinetic.Layer();

            //Load X labels (frequencies) into array
            for (i = 125; i <= 8000; i *= 2) {

                if (i >= 1000) {
                    Label = (i / 1000) + 'K';
                } else {
                    Label = i;
                }

                this.x_labels.push(Label);
            }

            //Load Y labels (dB presentation level) into array
            for (i = -10; i <= 120; i += 10) {
                if (i < 0) {
                    this.y_labels.push(i);
                } else if (i < 10) {
                    this.y_labels.push('  ' + i);
                } else if (i < 100) {
                    this.y_labels.push(' ' + i);
                } else {
                    this.y_labels.push(i);
                }
            }

            //Sets all the boundaries necessary for computing position and intersection stuff easily
            this.graph_bounds.min.x = this.margins.left;
            this.graph_bounds.min.y = this.margins.top;
            this.graph_bounds.max.x = Stage.getWidth() - this.margins.right;
            this.graph_bounds.max.y = Stage.getHeight() - this.margins.bottom;
            this.graph_size.width = Stage.getWidth() - (this.margins.left + this.margins.right);
            this.graph_size.height = Stage.getHeight() - (this.margins.top + this.margins.bottom);

            //calculate row width and column height so they get drawn evenly in the alloted space
            this.column_width = Math.floor((this.graph_bounds.max.x - this.graph_bounds.min.x) / (this.x_labels.length));
            this.row_height = Math.floor((this.graph_bounds.max.y - this.graph_bounds.min.y) / (this.y_labels.length));

            //Load extra X values because we want more possibilities than just the listed frequencies.
            this.x_values = [{"value" : 125, "x" : null}, {"value" : 250, "x" : null}, {"value" : 375, "x" : null}, {"value" : 500, "x" : null}, {"value" : 750, "x" : null},
                             {"value" : 1000, "x" : null}, {"value" : 1500, "x" : null}, {"value" : 2000, "x" : null}, {"value" : 3000, "x" : null}, {"value" : 4000, "x" : null},
                             {"value" : 6000, "x" : null}, {"value" : 8000, "x" : null}];

            //Calculate the x coordinates for each line. Not necessary, but I'll do it now and store that values to make
            //it easier later to "snap" to the lines when clicking.
            for (i = 0, x = this.graph_bounds.min.x + this.column_width / 2; i < this.x_values.length; i = i + 1, x += this.column_width / 2) {
                if (i == 1) {
                    x += this.column_width / 2;
                }
                this.x_values[i].x = x;
            }

            //Load Y possible values because we want more possibilities than just the labels
            //I add 20 because that's how I shifted the actual lines. Needs fixing.
            for (i = -10, y = this.graph_bounds.min.y + 20; i <= 120; i += 5, y += this.row_height / 2) {
                this.y_values.push({"value" : i, "y" : y});
            }
            this.addBackgroundLayer();
        },
        /**
        * Adds the context menu to the DOM. A right click method on a "measurement" on the
        * canvas will fire off the "addContextMenu".
        * Requires context.js
        * @param {void}
        * @return {void}
        * *************** Needs redone!!! Fixed to pass in array of functions and labels to be "added" to menu
        */
        addContextMenus : function () {
            var self = this;
            context.init({preventDoubleContext: true});
            this.ctx_menu1_id = context.attach('#measure_choices', [
                {header: 'Options'},
                {text: 'Delete', href: '#', action: function (e) {
                    e.preventDefault();
                    var x = globalClick.x;
                    var y = globalClick.y;
                    var index = self.measureClicked(x, y);
                    var measure = currentStack[index];
                    redoStack.push(currentStack[index]);
                    currentStack[index].destroy();
                    currentStack.splice(index, 1);
                    //console.log("Deleted: "+index);
                    self.drawStack();
                }, fa_icon : 'fa-close'},
                {text: 'Toggle Masked', href: '#', action: function (e) {
                    e.preventDefault();
                    var x = globalClick.x;
                    var y = globalClick.y;
                    var index = self.measureClicked(x, y);
                    var measure = currentStack[index];
                    var attr = measure.getAttr('masked');
                    currentStack[index].destroy();
                    currentStack.splice(index, 1);
                    self.drawStack();
                }, fa_icon : 'fa-headphones'},
                /*{divider: true},*/
                {text: 'No Response', href: '#', action: function (e) {
                    e.preventDefault();
                    var x = globalClick.x;
                    var y = globalClick.y;
                    var index = self.measureClicked(x, y);
                    self.makeNoResponse(index);
                }, fa_icon : 'fa-thumbs-o-down'}
            ]);
            this.ctx_menu2_id = context.attach('#audiogram_choices', [
                {header: 'Options'},
                {text: 'Undo', href: '#', action: function (e) {
                    e.preventDefault();
                    self.undoMeasure();
                    //console.log("Undo");
                }, fa_icon : 'fa-history'},
                {text: 'Redo', href: '#', fa_icon : 'fa-rotate-right'},
                {divider: true},
                {text: 'Clear Audiogram', href: '#', action: function (e) {
                    e.preventDefault();
                    self.clearStage();
                    //console.log("Clear");
                }, fa_icon : 'fa-refresh'}
            ]);
        },
        /**
        * Adds a downward arrow to a measure to indicate no-response
        * @param {int} x1 - Starting coords
        * @param {int} y1
        * @param {int} x2 - Ending coords
        * @param {int} y2
        * @param {int} w - Width of arrow head
        * @return {shape} - kinetic js line
        */
        arrow : function (x1, y1, x2, y2, w) {

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
                fill: this.colors.strokeColor,
                stroke: this.colors.strokeColor,
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
        },
        /**
        * Adds the layer with the "graph" looking lines
        * @param {void}
        * @return {void}
        */
        addBackgroundLayer : function () {
            //Add horizontal lines
            var lines = [];
            var labels = [];
            var points = [];
            var i = 0;
            var y = 0;
            var x = 0;


            //Add horizontal lines
            for (i = 0, y = this.graph_bounds.min.y + 20; i < this.y_labels.length; ++i, y += this.row_height) {
                points = [this.graph_bounds.min.x, y, this.graph_bounds.max.x, y];

                lines.push(new Kinetic.Line({
                    points: points,
                    stroke:  this.colors.lineColor,
                    tension: 0,
                    strokeWidth: 1,
                    opacity: 0.5
                }));
            }


            //Add vertical lines
            for (i = 0, x = this.graph_bounds.min.x + 30; i < this.x_labels.length; ++i, x += this.column_width) {
                points = [x, this.graph_bounds.min.y, x, this.graph_bounds.max.y];

                lines.push(new Kinetic.Line({
                    points: points,
                    stroke: this.colors.lineColor,
                    tension: 0,
                    strokeWidth: 1,
                    opacity: 0.5
                }));
            }

            //Add dashed lines
            for (i = 0; i < this.x_values.length; i = i + 1) {
                points  =  [this.x_values[i].x, this.graph_bounds.min.y, this.x_values[i].x, this.graph_bounds.max.y];

                lines.push(new Kinetic.Line({
                    points : points,
                    stroke : this.colors.lineColor,
                    tension : 0,
                    strokeWidth : 1,
                    opacity : 0.2,
                    dash : [3, 3]
                }));
            }

            //Add graph border (inner)
            var rect = new Kinetic.Rect({
                x : this.graph_bounds.min.x,
                y : this.graph_bounds.min.y,
                width : this.graph_size.width,
                height : this.graph_size.height,
                stroke : this.colors.lineColor,
                strokeWidth : 1,
                fill : this.colors.backColor
            });

            //Add x labels acress top
            y = this.graph_bounds.min.y - 20;
            for (i = 0, x = this.graph_bounds.min.x + 20; i < this.x_labels.length; i++, x += this.column_width) {
                labels.push(new Kinetic.Text({
                    x : x,
                    y : y,
                    text : this.x_labels[i].toString(),
                    fontSize : 14,
                    fontFamily : 'Calibri',
                    fill : this.colors.fontLabelsColor
                }));
            }

            //Add x labels down the side
            x = this.graph_bounds.min.x - 30;
            for (i = 0, y = this.graph_bounds.min.y; i < this.y_labels.length; ++i, y += this.row_height) {
                labels.push(new Kinetic.Text({
                    x : x,
                    y : y + 15,
                    text : this.y_labels[i].toString(),
                    fontSize : 14,
                    fontFamily : 'Calibri',
                    fill : this.colors.fontLabelsColor
                }));
            }

            layers.background.add(rect);

            for (i = 0; i < lines.length; ++i) {
                layers.background.add(lines[i]);
            }

            for (i = 0; i < labels.length; i++) {
                layers.background.add(labels[i]);
            }


            Stage.add(layers.background);
        },
        /**
        * Adds measures to the audiogram. Each "measure" is snapped to the closest proper decibel and frequency.
        * Each measure starts with a common set of attributes, and is then refined depending on what type of
        * measure it is.
        * Adds each new measure to a "stack" so we can "undo" the actions
        * @param {null}
        * @return {null}
        */
        addMeasure: function (x, y) {
            var index = false;
            var shape = null;


            //Get frequency and decibels assigned to the coordinate (x,y)
            var d = this.getDecibels(y);
            var f = this.getFrequency(x);

            //Arbitrary font size right now.
            var fontSize = 34;

            //Goes and grabs the "shape" to be displayed based on these params
            var measureData = GetMeasureData(this.measureType,this.masked,this.side);

            //Common styles to most measures
            var commonStyle = {
                x : x,
                y : y,
                strokeWidth : 5,
                shadowColor : this.colors.textShadowColor,
                shadowBlur : 2,
                shadowOffset : {x:1, y:1},
                shadowOpacity : 0.3,
                draggable : true,
                measure : this.measureType,
                center : {'x' : x,'y' : y},
                audioValues : {'frequency' : f.value, 'decibels' : d.value},
                audioLine : false,
                noResponse : false,
                masked : false,
                measureID : this.nextID()
            };

            //Determine the actual measure type so it can be customized
            if (measureData.type == 'text') {
                commonStyle.text = measureData.value;
                commonStyle.fontSize = fontSize;
                commonStyle.fontFamily = 'Courier';
                commonStyle.fill = this.colors.textColor;
                commonStyle.shadowColor = this.colors.textShadowColor;
                commonStyle.shadowBlur = 2;
                commonStyle.shadowOffset = {'x' : 4, 'y' : 4};
                commonStyle.shadowOpacity = 0.4;
                //Adjust text to go up and left
                commonStyle.x = x - (fontSize / 4);
                commonStyle.y = y - (fontSize / 2);
                shape = new Kinetic.Text(commonStyle);
            } else {
                commonStyle.stroke = this.colors.strokeColor;
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
                    if(this.side == 'right') {
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
                    if (this.side == 'right') {
                        commonStyle.points =  [x + 6, y - 10, x, y - 10, x, y + 10, x + 6, y + 10];
                    } else {
                        commonStyle.points =  [x - 6, y - 10, x, y - 10, x, y + 10, x - 6, y + 10];
                    }
                    shape = new Kinetic.Line(commonStyle);
                }
            }

            currentStack.push(shape);
            actionStack.push({"action" : "add", "measureID" : shape.get});

            this.drawStack();
        },
        /**
        * Binds the context menu to our canvas
        * @param {void}
        * @return {void}
        */
        bindContextMenu : function () {
            $('#' + this.element_id).bind('contextmenu', $.proxy(function (event) {
                event.preventDefault();
                this.showContextMenu();
            }, this));
        },
        /**
        * Removes all items from the stage, then redraws the clean stage.
        * @param {void}
        * @return {void}
        */
        clearStage: function () {
            //redo will need fixed because I'm destroying the event stack
            currentStack = [];
            layers.measures.removeChildren();
            layers.connect.removeChildren();
            Stage.draw();

        },
        /**
        * Turns a measure on Audiogram into a "no-response" by adding a downward arrow to the icon.
        * @param {int} - index location within the stack of the "shape"
        * @return {void}
        */
        drawArrow : function (index) {
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
                fill: this.colors.strokeColor,
                stroke: this.colors.strokeColor,
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
                measure: this.measureType
            });

            return arrow;
        },
        /**
        * One function to draw contents of stack. Basically this method redraws everything on the audiogram.
        * @param {null}
        * @return {json}
        */
        drawStack: function () {
            //console.log("drawStack");
            //console.log("Stack:");
            //console.log(currentStack);

            var temp = [];
            var points = [];
            var measure = null;
            var shape = null;
            var center = null;
            var arrow = null;
            var i = 0;

            //Draw measures first
            layers.measures.removeChildren();
            //console.log(layers.measures);
            for (i = 0; i < currentStack.length; ++i) {
                layers.measures.add(currentStack[i]);

                if (currentStack[i].getAttr('noResponse')) {
                    arrow = this.drawArrow(i);
                    layers.measures.add(arrow);
                }
            }

            //Add layer to Stage
            Stage.add(layers.measures);


            //Draw line connecting any measure that has the attribute 'audioLine' set to 'true'
            for (i = 0; i < currentStack.length; ++i) {
                shape = currentStack[i];
                if (shape.getAttr('audioLine')) {
                    center = shape.getAttr('center');
                    //console.log(center);
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
                stroke : this.colors.strokeColor,
                strokeWidth : 2,
                lineCap : 'round',
                lineJoin : 'round'
            });

            layers.connect.removeChildren ();

            //Push measure into the "layer"
            layers.connect.add(line);

            //Add layer to Stage
            Stage.add(layers.connect);
        },
        /**
        * Returns the audiogram for the current ear
        * @param {null}
        * @return {json}
        */
        getAudiogram: function () {
            var audiogram = {};
            var i = 0;
            for (i = 0; i < currentStack.length; ++i) {
                console.log(currentStack[i].getAttrs());
            }
        },
        /**
        * When stage is clicked, this function find the "object / measure" on the canvas that it would collide with.
        * Not allowed to be on same "y" coordinate.
        * @param {int} x - Optional x
        * @param {int} y - Optional y
        * @return {int} i - index of shape in stack
        */
        measureClicked : function (x,y) {
            //console.log(currentStack);
            var attr = null;
            var snap = null;
            var i = 0;

            if(typeof x == "undefined" && typeof y == "undefined") {
                snap = this.snapClick();
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
        },
        /**
        * Finds the closest decibel value (in increments of 5) to the mouse click
        * @param {number} y The 'y' coordinate of the mouse click.
        * @return {null}
        */
        getDecibels: function (y) {
            //console.log('getDecibels '+this.side);
            var d;
            var r;

            y = y - this.graph_bounds.min.y;                    //adjust y because of margins
            d = Math.floor(y / (this.row_height / 2));          //How many 1/2 rows divide into y

            r = (y % (this.row_height / 2)) / this.row_height;  //Remainder (how close is it to the next value).

            if (r > 0.5) {
                d = d + 1;
            }

            return this.y_values[d - 1];
        },
        /**
        * Finds the closest frequency value (within an array of acceptable values) to the mouse click
        * @param {number} x The 'x' coordinate of the mouse click.
        * @return {null}
        */
        getFrequency: function (x) {
            //console.log('getFrequency '+this.side);

            var d;
            var r;
            var c = this.column_width;              //short var name for column width
            var c2 = c / 2;                         //ref to column width div 2
            var i;                                  //loop counter
            var p;                                  //current x pixel

            x = Math.round(x - this.graph_bounds.min.x);    //adjust x because of margins

            p = c;      //start off p as the width of one column

            //If x is within the first column, return 125hz
            if(x < p) {
                return this.x_values[0].value;
            }

            for(i = 1, p += c2; i < this.x_values.length; ++i, p += c2) {
                if(x < p) {
                    //If it's closer to the previous value, snap to it.
                    var ratio = ((x % c2) / c2);
                    if(ratio < 0.5) {
                        return this.x_values[i - 1];
                    } else {
                        return this.x_values[i];
                    }
                }
            }

            return this.x_values[this.x_values.length - 1];
        },
        /**
        * Simply makes sure mouse click is on the "audiogram" before adding a measure.
        * @param {int} x  -  Coords of where click happened
        * @param {int} y
        * @return {bool} - True = in bounds / False = not.
        */
        inBounds : function (x, y) {
            if(x >= this.graph_bounds.min.x &&
               x <= this.graph_bounds.max.x &&
               y >= this.graph_bounds.min.y &&
               y <= this.graph_bounds.max.y) {
                return true;
            } else {
                return false;
            }
        },
        makeNoResponse: function (index) {
            currentStack[index].attrs.noResponse = true;
            this.drawStack();
        },
        /**
        * Simple centralized id generator. Instead of incrementing 'measureID' all over the place
        * @param {void}
        * @return {int} next available id
        */
        nextID: function () {
            var id = this.measureID;
            this.measureID++;
            return id;
        },
        /**
        * Retreives last item popped off the stack and adds it to the "stage"
        * @param {void}
        * @return {void}
        */
        redoMeasure: function () {
            var shape = redoStack.pop();
            if (typeof(shape) != "undefined") {
                currentStack.push(shape);
                this.drawStack();
            }
        },
        /**
        * Turns a measure on Audiogram into a "no-response" by adding a downward arrow to the icon.
        * @param {void}
        * @return {void}
        */
        setMeasureType: function (measure_type) {
            this.measureType = measure_type;
        },
        setMasked : function (masked) {
            if (masked) {
                this.masked = 'masked';
            } else {
                this.masked = 'unmasked';
            }
        },
        /**
        * Changes the css of our context menu and displays it at the location in which the
        * canvas was clicked.
        * @param {void}
        * @return {void}
        */
        showContextMenu : function (x2, y2) {
            //console.log('showContextMenu: '+this.ctx_menu1_id);
            var x1 = $("#audiogram_"+this.side).offset().left;
            var y1 = $("#audiogram_"+this.side).offset().top;

            //var x2 = Stage.getPointerPosition ().x;
            //var y2 = Stage.getPointerPosition ().y;

            //Because the "bound" method on the context menu doesn't know or have access to (yet) the
            //Stages x,y click location, I'm saving that click globally so I can use it in the context
            //menu handler. Crap.
            globalClick.x = x2;
            globalClick.y = y2;

            var attr = this.measureClicked(x2, y2);

            if(attr !== false) {
                $('#dropdown-' + this.ctx_menu1_id).css('position', 'absolute');
                $('#dropdown-' + this.ctx_menu1_id).css('display', 'block');
                $('#dropdown-' + this.ctx_menu1_id).css('top', y1 + y2);
                $('#dropdown-' + this.ctx_menu1_id).css('left', x1 + x2);
            }else{
                $('#dropdown-' + this.ctx_menu2_id).css('position', 'absolute');
                $('#dropdown-' + this.ctx_menu2_id).css('display', 'block');
                $('#dropdown-' + this.ctx_menu2_id).css('top', y1 + y2);
                $('#dropdown-' + this.ctx_menu2_id).css('left', x1 + x2);
            }
        },
        /**
        * Takes a mouse click and "snaps" it to the closest allowable x,y that corresponds with an appropriate
        *    audiogram value set. So, it snaps it to the closest dB value in increments of 5 and an acceptable
        *    frequency (dictated by an array of frequencies).
        * @param {number} x  //Pass in x and y, in case "stage.getPointerPosition ()" is not defined.
        * @param {number} y  //Not always necessary.
        * @return {object} {x,y}
        */
        snapClick: function (inX,inY) {
            //console.log('snapClick '+this.side);

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

            if(!this.inBounds(x,y)) {
                return {"x" : null, "y" : null, "error" : true, "errorType" : "Out of bounds", "measureClicked" : false, "frequency" : false};
            }

            min = Stage.getWidth();

            for(i = 0; i < this.x_values.length; ++i) {
                d = Math.abs(this.x_values[i].x - x);
                if(d < min) {
                    min = d;
                    cx = this.x_values[i].x;
                }
            }

            min = Stage.getHeight();

            for(i = 0; i < this.y_values.length; ++i) {
                d = Math.abs(this.y_values[i].y - y);
                if(d < min) {
                    min = d;
                    cy = this.y_values[i].y;
                }
            }
            return {"x" : cx, "y" : cy, "error" : false, "measureClicked" : this.measureClicked(cx,cy), "sameFrequency" : this.sameFrequency(cx)};

        },
        /**
        * Checks to see if a measure is being added to the same frequency (Air Conduction only)
        * @param {int} - x coord
        * @return {bool} - returns true if one exists
        * @return {int} - index of item that occupies frequency
        */
        sameFrequency : function (x) {

            var center = null;
            var i = 0;

            for(i = 0; i < currentStack.length; ++i) {
                center = currentStack[i].getAttr('center');
                //console.log(center);
                if(x == center.x && currentStack[i].getAttr('measure') == this.measureType) {
                    return i;
                }
            }
            return false;
        },
        /**
        * Pops last item off the stack and removes it from the "stage"
        * @param {void}
        * @return {void}
        */
        undoMeasure: function () {
            if(currentStack.length > 0) {
                var shape = currentStack.pop();
                redoStack.push(shape);
                shape.remove();
                layers.measures.draw();
                this.drawStack();
            }else{
                var tooltip = new Kinetic.Label({
                    x : (this.graph_bounds.max.x - this.graph_bounds.min.x) / 2,
                    y : (this.graph_bounds.max.y - this.graph_bounds.min.y) / 2,
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

                layers.error.add(tooltip);
                Stage.add(layers.error);
                setTimeout(
                    function () {
                        //console.log("doing it");
                        tooltip.remove();
                        layers.error.draw();
                    },
                    3000);
            }
        }
    };

    my_private.my_init();


    //Create a click event for the "Stage". Based on "current state", events
    //will be handled
    $(Stage.getContent()).on ('click', function (evt) {
        var clickInfo = my_private.snapClick();

        setTimeout(function () {
            //Remove any error messages from the canvas
            layers.error.removeChildren ();

            Stage.draw();
            setTimeout(function () {
                //If you clicked on the canvas
                if(!clickInfo.error) {
                    //if you click in the same frequency, you snap the existing one to the new location
                    if(clickInfo.measureClicked !== false) {
                        my_private.showContextMenu(clickInfo.x,clickInfo.y);
                    }else if(clickInfo.sameFrequency !== false) {
                        //handle moving item on same frequency
                        console.log(clickInfo.sameFrequency);
                    }else{
                        my_private.addMeasure(clickInfo.x,clickInfo.y);
                    }
                }
            },0);

        },0);
    });

    //                //console.log(" : ::"+typeof(index));
    //                if(index !== false && currentStack[index].getAttr('measure') == this.measureType) {
    //                    redoStack.push(currentStack[index])
    //                    currentStack[index].destroy();
    //                    currentStack.splice(index,1);
    //                    //console.log(currentStack);
    //                }


    // Expose public API
    return {
        get: function ( prop ) {
            if ( my_private.hasOwnProperty( prop ) ) {
                return my_private[ prop ];
            }
        },
        bindContextMenu: function () {
            my_private.bindContextMenu();
        },
        clear: function () {
            my_private.clearStage();
        },
        showContextMenu: function () {
            my_private.showContextMenu();
        },
        getAudiogram: function () {
            my_private.getAudiogram();
        },
        setMeasureType: function (measure_type) {
            my_private.setMeasureType(measure_type);
        },
        setMasked: function (masked) {
            my_private.setMasked(masked);
        },
        makeNoResponse: function (response) {
            my_private.makeNoResponse(response);
        },
        undo: function () {
            my_private.undoMeasure();
        },
        redo: function () {
            my_private.redoMeasure();
        }
    };
};


var confirmOnPageExit = function (e) {
    'use strict';
    // If we haven't been passed the event get the window.event
    e = e || window.event;

    var message = 'Are you sure you want to navigate away?';

    // For IE6-8 and Firefox prior to version 4
    if (e)
    {
        e.returnValue = message;
    }

    // For Chrome, Safari, IE8+ and Opera 12+
    return message;
};