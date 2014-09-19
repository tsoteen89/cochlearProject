var GC = require('../js/googleCharts.js');

var jsonData = {
    "type": "PieChart",
    "options": {
        "title": "Cause of Deafness",
        "width": "100",
        "height": "75",
        "is3D": true,
        "pieSliceText": "value"
    },
    "columns": {
        "Cause": "string",
        "Occurences": "number"
    },
    "rows": {
        "Congenital": 4,
        "Infection": 2,
        "Menier's Disease": 6,
        "Meningitis": 3,
        "Ototoxicity":5,
        "Trauma":2,
        "Progressive":8,
        "Other":1
    }

};

GC.generateChart(jsonData, function(svgHtml){
    console.log(svgHtml);
    phantom.exit();
});
