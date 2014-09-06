<?php

$months = array("jan"=>1,"feb"=>2,"mar"=>3,"apr"=>4,"may"=>5,"jun"=>6,"jul"=>7,"aug"=>8,"sep"=>9,"oct"=>10,"nov"=>11,"dec"=>12);

$dir = scandir('../');

array_shift($dir);
array_shift($dir);

foreach($dir as $file){
//   echo "git log -1 --format=%cd ../{$file}\n";
   exec("git log -1 --format=%cd ../{$file}",$ret);
}
foreach($ret as $line){
	list($wd,$m,$d,$time,$y,$tz) = explode(' ',$line);
	$m = strtolower($m);
	list($hr,$min,$sec) = explode(':',$time);
//	echo"{$months[$m]} {$d} {$y} {$hr} {$min} {$sec}\n";
	$latest[] = mktime($hr,$min,$sec,$months[$m],$d,$y);
}

rsort($latest);
echo date("M d Y @ h:i:s a",$latest[0])."\n";
