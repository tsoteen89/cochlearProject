var AudioGram = function(element_id, audiogram_id,side) {
    // Private data
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
        x_labels      : [],             //Arrays to hold labels
        y_labels      : [],
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
        getFrequency: function(x,y){
            x = Math.round(x / this.column_width);
            console.log(x*this.column_width);
            console.log(this.x_labels[x-1]);
        }   
    }

    //Load X labels (frequencies)
    for(var i=125;i<=8000;i*=2){
        var Label = "";
        if(i>=1000){
            Label = (i/1000) + 'K';
        }else{
            Label = i;
        }

        private['x_labels'].push(Label);
    }
    
    //Load Y labels (dB presentation level)     
    for(var i=-10;i<=120;i+=10){
        private['y_labels'].push(i);
    }
    
    private['canvas'] = document.getElementById(private['element_id']);
    private['ctx'] = private['canvas'].getContext('2d');
    private['canvas_width'] = $('#'+private['element_id']).width();
    private['canvas_height'] = $('#'+private['element_id']).height();
    console.log(private['canvas_width']+ " " + private['canvas_height']);
    private['ctx'].font = '10pt helvetica';
    private['canvas'].addEventListener('click', function(evt) {
        var mousePos = private['getMousePos'](private['canvas'], evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        console.log(message);
        console.log(audiogram_id);
        private['getFrequency'](mousePos.x,mousePos.y);
    }, false);
    private['calcRowColSize']();
    private['drawOuterBorder']();
    private['addFrequencyLabels']();
    private['addDBLabels']();



    // Expose public API
    return {
        get: function( prop ) {
            if ( private.hasOwnProperty( prop ) ) {
                return private[ prop ];
            }
        }
    }
};