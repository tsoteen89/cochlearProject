<script type="text/javascript" src="https://www.google.com/jsapi"></script>
function drawVisualization() {
    // Create and populate the data table.
    var data = google.visualization.arrayToDataTable([
        ['Task', 'Hours per Day'],
        ['Work', 11],
        ['Eat', 2],
        ['Commute', 2],
        ['Watch TV', 2],
        ['Sleep', 7]
        ]);

    // Create and draw the visualization.
    var chart = new google.visualization.PieChart(document.getElementById('visualization'));
    google.visualization.events.addListener(chart, 'ready', allReady); // ADD LISTENER
    chart.draw(data, {title:"So, how was your day?"});
}

function allReady() {
    var e = document.getElementById('visualization');
    // svg elements don't have inner/outerHTML properties, so use the parents
    alert(e.getElementsByTagName('svg')[0].parentNode.innerHTML);
}

google.setOnLoadCallback(drawVisualization);
