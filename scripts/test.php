<?php

exec("phantomjs pie.js",$ret);

echo $ret[0];
