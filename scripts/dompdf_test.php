<?php
//require_once("dompdf_config.inc.php");
require_once("../lib/dompdf/dompdf_config.inc.php");
$html =
  '<html><body>'.
  '<p>Put your html here, or generate it with your favourite '.
  'templating system.</p>'.
  '<p><img src="http://killzombieswith.us/cochlearProject/scripts/pie.php?type=.png"></p>'.
  '</body></html>';

$dompdf = new DOMPDF();
$dompdf->load_html($html);
$dompdf->render();
$dompdf->stream("sample.pdf");

?>
