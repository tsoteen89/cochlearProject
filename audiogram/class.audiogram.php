<?php


$pdf = new AudiogramPdf;


if($_POST){
    $pdf->ConvertPostedSvgs($_POST);
    $pdf->CompositePngs();
}

/**
 * Thrown together class to convert svg into png's then create a composite of each
 * png to then be thrown in a pdf .... whew!! Probably should be broken up into a couple
 * of classes, but not right now.
 */
class AudiogramPdf{
    
    var $ImageArray;            //Holds each image that's part of the composite audiogram
    var $TempDirectory;         //Where to write each file. Should probably figure out how to 
                                //do it all in memory, and not use disk as temp storage.
    
    /**
     * Constructor builds ImageArray with a few hard coded "parts" of the audiogram
     * Also sets up ...
     */
    function __construct(){
        $this->ImageArray = [
            'background'=>'',
            'right'=>['line'=>'','measures'=>''],
            'left'=>['line'=>'','measures'=>'']
        ];
        $this->TempDirectory = './composite';
    }
    
    /**
     * Actually compose the png's into one using Imagick. Final png is written to 
     * disk, but could be returned with a "header type" if necessary
     * @type none
     */    
    public function CompositePngs(){
        $Images = array();

        $Images[] = new Imagick($this->ImageArray['background']); 
        $Images[] = new Imagick($this->ImageArray['right']['line']); 
        $Images[] = new Imagick($this->ImageArray['left']['line']); 
        $Images[] = new Imagick($this->ImageArray['right']['measures']); 
        $Images[] = new Imagick($this->ImageArray['left']['measures']);         
        
        for($i=1;$i<sizeof($Images);$i++){
            $Images[0]->compositeImage($Images[$i], $Images[$i]->getImageCompose(), 0 , 0); 
        }
        //new image is saved as final.jpg 
        $Images[0]->writeImage($this->TempDirectory.'/composite.png');
    }

    /**
     * Converts Svg's to Png's using Imagick
     * @type array - Array holding all generated SVG's to be added to composite png.
     */
    public function ConvertPostedSvgs($data){
        //Hard coded bullsh**
        $this->ImageArray['background'] = $this->SvgToPng($data['background'],"{$this->TempDirectory}/background.png");
        $this->ImageArray['right']['line'] = $this->SvgToPng($data['right']['line'],"{$this->TempDirectory}/right-line.png");
        $this->ImageArray['left']['line'] = $this->SvgToPng($data['left']['line'],"{$this->TempDirectory}/left-line.png");
        $this->ImageArray['right']['measures'] = $this->SvgToPng($data['right']['measures'],"{$this->TempDirectory}/right-measures.png");
        $this->ImageArray['left']['measures'] = $this->SvgToPng($data['left']['measures'],"{$this->TempDirectory}/left-measures.png");
        return $this->ImageArray;
    }
    
    /**
     * A helper method that manipulates the SVG data and then converts it to base 64 before returning it.
     * @type string - svg data
     * @type string - file name to write to.
     * @returns string - the file name or false on failure to write.
     */
    private function SvgToPng($img_data,$file_name){
        $img_data = str_replace('data:image/png;base64,', '', $img_data);
        $img_data = str_replace(' ', '+', $img_data);
        $data = base64_decode($img_data);
        $success = file_put_contents($file_name, $data);
        if($success)
            return $file_name;
        else
            return false;
    }
}