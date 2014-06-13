<?php

require 'src/Cloudinary.php';
require 'src/Uploader.php';
require 'src/Api.php';


\Cloudinary::config(array( 
  "cloud_name" => "ddjsap9v3", 
  "api_key" => "666451667968492", 
  "api_secret" => "BUNUTSKGnJN2jc3EtBHHtOXS5mA" 
));


$storage = \Cloudinary\Uploader::upload("./assets/cheetah-1.jpg");

echo "<pre>";
print_r($storage);

function showImage(){

	echo cl_image_tag("http://res.cloudinary.com/ddjsap9v3/image/upload/v1401397299/fz8hhalgqmmxldbyyz3z.jpg" 
		); 
}
// array( "width" => 500, "height" => 750, "crop" => "fill" )
showImage();

?>