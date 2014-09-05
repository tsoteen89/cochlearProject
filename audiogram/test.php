<?php

$data = print_r($_POST,true);
file_put_contents("data.txt",$data);
