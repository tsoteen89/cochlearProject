var AudioGram = function(stage,audiogram_id,side) {
    var stage = stage;
    var layers = {};
    // Private data
    
    var private = {
        audiogramId     : audiogram_id,         //Unique identifier for this audiogram
        side            : side,                 //Left or right ear
        strokeColor     : null,
        stage           : stage,                //Element id for kinetic canvas  
        margins         : {
                            "top":30,
                            "bottom":30,
                            "left":40,
                            "right":40
                          },
        graph_bounds    : {
                            "min":{"x":0,"y":0},
                            "max":{"x":0,"y":0}
                          },
        currentMeasure  : 'AC',                 //AC, BC, MCL, etc.
        masked          : 'unmasked',           //Masked = masked Unmasked = unmasked :)
        
        /**
        * Initializes the audiogram graph
        * @param {null} 
        * @return {null} 
        * @constructor
        */
        _init : function(){
            

            
            //Set the stroke color depending on which side it is.
            if(this.side == 'right')
                this.strokeColor = 'red';
            else
                this.strokeColor = 'blue';
            
            layers['temp'] = new Kinetic.Layer();
            layers['measures'] = new Kinetic.Layer();
            
            var triangle = new Kinetic.RegularPolygon({
                x: 190,
                y: 120,
                sides: 3,
                radius: 80,
                fill: '#00D2FF',
                stroke: 'black',
                strokeWidth: 4
            });

            var text = new Kinetic.Text({
                x: 10,
                y: 10,
                fontFamily: 'Calibri',
                fontSize: 24,
                text: '',
                fill: 'black'
            });

            triangle.on('mouseout', function() {
                text.setText('Mouseout triangle');
                layers['temp'].draw();
            });

            triangle.on('mousemove', function() {
                var mousePos = stage.getPointerPosition();
                console.log(mousePos);
                var x = mousePos.x - 190;
                var y = mousePos.y - 40;
                text.setText('x: ' + x + ', y: ' + y);
                layers['temp'].draw();
            });

            var circle = new Kinetic.Circle({
                x: 380,
                y: 250,
                radius: 70,
                fill: 'red',
                stroke: 'black',
                strokeWidth: 4
            });

            circle.on('mouseover', function() {
                text.setText('Mouseover circle');
                layers['temp'].draw();
            });
            circle.on('mouseout', function() {
                text.setText('Mouseout circle');
                layers['temp'].draw();
            });
            circle.on('mousedown', function() {
                text.setText('Mousedown circle');
                layers['temp'].draw();
            });
            circle.on('mouseup', function() {
                text.setText('Mouseup circle');
                layers['temp'].draw();
            });

            layers['temp'].add(triangle);
            layers['temp'].add(circle);
            layers['temp'].add(text);
            //stage.add(layers['temp']);
        },
        addSymbol: function(){

            
            this.createMeasure(this.measure,this.masked,this.side);
        },
        clearStage: function(){
            layers['measures'].clear();
            layers['measures'] = new Kinetic.Layer();
        },
        createMeasure: function(){
            


            var x = stage.getPointerPosition().x;
            var y = stage.getPointerPosition().y;
            
            var commonStyle = {
                x: x,
                y: y,
                strokeWidth: 3,
                shadowColor: 'black',
                shadowBlur: 2,
                shadowOffset: {x:3, y:3},
                shadowOpacity: 0.3               
            }
            
            var measureData = GetMeasureData(this.currentMeasure,this.masked,this.side);
            console.log(this.currentMeasure,this.masked,this.side);          
            
            if (measureData.type == 'text')
            {
                commonStyle['text'] = measureData.value;
                commonStyle['fontSize'] = 28;
                commonStyle['fontFamily'] = 'Calibri';
                commonStyle['fill'] = 'black';

                var shape = new Kinetic.Text(commonStyle); 
            }else{
                commonStyle['stroke'] = this.strokeColor;
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
            layers['measures'].add(shape);
            stage.add(layers['measures']);
             
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
        }
    }

    
    private._init();
 
    console.log(GetMeasureData('AC','masked','right'));
    
    //Create a click event for the "stage". Based on "current state", events
    //will be handled
    $(stage.getContent()).on('click', function(evt) {
        var mousePos = stage.getPointerPosition();
        console.log(mousePos);
        private.createMeasure();
    });

    
    // Expose public API
    return {
        get: function( prop ) {
            if ( private.hasOwnProperty( prop ) ) {
                return private[ prop ];
            }
        },
        clearStage: function(){
            private.clearStage();
        },
        setCurrentMeasure: function(measure){
            private.setCurrentMeasure(measure);
        },
        setMasked: function(masked){
            private.setMasked(masked);
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
    
