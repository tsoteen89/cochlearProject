<?php
include ("../lib/jpgraph/src/jpgraph.php");
include ("../lib/jpgraph/src/jpgraph_pie.php");

//This json could come from the api, and it will, just not yet.
$json = '{
    "data": [50,15,25,10,31,20,18,15,5],
    "title": "Cause of Deafness",
    "sub_title": "",
    "slice_colors": [
        "darkred",
        "tomato1",
        "lightblue",
        "orange",
        "gray",
        "teal",
        "violetred4",
        "gold1",
        "bisque2"
    ],
    "legend_values": [
		"Congenital (%1.1f%%)",
		"Infection (%1.1f%%)",
		"Meniers (%1.1f%%)",
		"Disease (%1.1f%%)",
		"Meningitis (%1.1f%%)",
		"Ototoxicity (%1.1f%%)",
		"Trauma (%1.1f%%)",
		"Progressive (%1.1f%%)",
		"Other (%1.1f%%)"
    ]
}';

$Data = json_decode($json);


// A new graph
$graph = new PieGraph(400,420);
$graph->SetAntiAliasing();
 
$graph->title->SetFont(FF_ARIAL, FS_BOLD, 14);
$graph->title->Set($Data->title);
$graph->title->SetMargin(10);
 
$graph->subtitle->SetFont(FF_ARIAL, FS_BOLD, 10);
$graph->subtitle->Set($Data->sub_title);
$graph->legend->SetFillColor('#cfcfcf');
 
// The pie plot
$p1 = new PiePlot($Data->data);

// Move center of pie to the left to make better room
// for the legend
$p1->SetSize(0.3);
$p1->SetCenter(0.5,0.47);
$p1->value->Show();
$p1->value->SetFont(FF_ARIAL,FS_NORMAL,10);
 
// Legends
$p1->SetLegends($Data->legend_values);
$graph->legend->SetPos(0.5,0.97,'center','bottom');
$graph->legend->SetColumns(3);
 
$graph->Add($p1);
$p1->SetSliceColors($Data->slice_colors);  //colors won't work unless after "Add"
$graph->Stroke();
?>
