<?php

//print_r("Posted:");
//print_r($_POST);
//print_r(array_keys($_POST));

//$pdf = new PdfManager;
$Audiogram = new AudiogramManager();
$PatientInfo = new AiiPatientInfo();
$Errors = new AudErrors();

if($_POST){

    //A little error checking 
    if(!isset($_POST['Action'])){
        $Errors->SendMessage(10);
    }else if(isset($_POST['Token'])){
        if(!$Audiogram->tokenGood($_POST['Token'])){
            $Errors->SendMessage(20); 
        }
    }
    
    switch($_POST['Action']){
        case 'getAudiogramList'     :$Audiogram->getAudiogramList();        break;
        case 'getConditions'        :$Audiogram->getConditions();           break;
        case 'getPatientInfo'       :$PatientInfo->getPatientInfo($_POST);  break;
        case 'getAudiogramTitles'   :$PatientInfo->getAudiogramTitles($_POST); break;
        case 'saveAudiogram'        :$Audiogram->saveAudiogram($_POST);     break;
        default: break;
    }
    
    //$pdf->ConvertPostedSvgs($_POST);
    //$pdf->CompositePngs();
    //$pdf->SaveAudiogramInfo($_POST);
}

class AiiPatientInfo{
    
    function __construct(){
        //Nada
    }
    /**
     * Gets information from a single patient if PatientID is provided, otherwise all
     * active patients are returned
     */
    public function getPatientInfo($data){
        if($data['PatientID']){
            echo file_get_contents("http://aii-hermes.org/aii-api/v1/patients/{$_POST['PatientID']}/{$_POST['Token']}");
            exit;
        }else{
            echo file_get_contents("http://aii-hermes.org/aii-api/v1/patients/{$_POST['Token']}");
            exit;
        }
    }
}

class AudiogramManager{
    var $Token;
    var $FirstName;
    var $LastName;
    var $Dob;
    var $PrevAudiograms;
    var $Json;
    var $PatientInfo;
    var $Conn;

    /**
     * Ummm. Constructor
     */    
    function __construct($data=null){
        $this->Token = null;
        $this->FirstName = null;
        $this->LastName = null;
        $this->Dob = null;
        $this->PrevAudiograms = null;     
        $this->Json = null;
        //$this->Conn = mysqli_connect("localhost","audiogram_user","Rugger99!123456789","aii") or die("Error " . mysqli_error($this->Conn));
        $this->PatientInfo = new AiiPatientInfo();
    }
    
    /**
     * Checks for a valid token. Redundant.
     */    
    function tokenGood($token=null){
        global $Errors;
        if(!isset($token)){
            $Errors->SendMessage(20);
        }else if(strlen($token) != 64 ){
            $Errors->SendMessage(30);
        }else{
            return 1;
        }
    }
    
    /**
     * Gets all the conditions that each ear could be configured with. 
     */    
    public function getConditions(){
        //Api Call
        $json =  file_get_contents('http://aii-hermes.org/aii-api/v1/audioConditions');
        
        //Put huge response in a temp array to be trimmed down
        $temp = json_decode($json);
        
        //Empty out the original json array
        $json = array();
        
        //Load it back up with unique values
        for($i=0;$i<sizeof($temp->records);$i++){
            $json[$temp->records[$i]->LeftAidCondition] = $temp->records[$i]->ConditionsID;
            $json[$temp->records[$i]->RightAidCondition] = $temp->records[$i]->ConditionsID;           
        }
        
        //Send it off 
        echo json_encode($json);
        exit;
    }
 
    /**
     * Gets all Audiograms for the given patient.
     */
    public function getAudiogramList($data){
        
    }
    
    public function saveAudiogram($data){
        print_r($data);
        /*
        $link = mysqli_connect("localhost","audiogram_user","hUGMftrUAxv2BTMu","aii") or die("Error " . mysqli_error($link));
        */
        
        $pid = $data['patient_data']['PatientID'];
        $data = time();
        $phase = $data['patient_data']['CurrentPhaseID'];
        //$eid = $this->GetEventId();
        
        
        $sql = 
        "INSERT INTO `aii`.`audiograms` (`patient_id`, `event_id`, `audiogram_id`, `date`, `title`, `phase_id`, `right_measures`, 
        `left_measures`, `spch_aud_srt_r`, `spch_aud_srt_l`, `spch_aud_srt_b`, `spch_aud_mask_r`, `spch_aud_mask_l`, `spch_aud_mask_b`, 
        `word_rec_per_r`, `word_rec_per_l`, `word_rec_per_b`, `word_rec_stim_r`, `word_rec_stim_l`, `word_rec_stim_b`, `word_rec_mask_r`, 
        `word_rec_mask_l`, `word_rec_mask_b`, `word_rec_noise_r`, `word_rec_noise_l`, `word_rec_noise_b`) 
        VALUES ('{$pid}', '{$eid}', '1', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');";
        
        echo $sql;
        
    }
    
    public function SetToken($token){
        $this->Token = $token;
    }
    
    private function isAjax() {
        return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
    }
    
}

/**
 * Thrown together class to convert svg into png's then create a composite of each
 * png to then be thrown in a pdf .... whew!! Probably should be broken up into a couple
 * of classes, but not right now.
 */
class PdfManager{
    
    var $ImageArray;            //Holds each image that's part of the composite audiogram
    var $TempDirectory;         //Where to write each file. Should probably figure out how to 
                                //do it all in memory, and not use disk as temp storage.
    var $SaveDirectory;         //Where to save patient audiogram. Soon to be DB
    
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
        $this->SaveDirectory = './saved';
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

class AudErrors{
    var $ErrorArray;
    
    function __construct(){
        $this->ErrorArray = array();
        $this->ErrorArray[0] = array('error'=>0,'number'=>'0');
        $this->ErrorArray[10] = array('error'=>1,'number'=>10,'message'=>"Action must be set! (e.g. 'GetPatientInfo, SaveAudiogram, etc.)");
        $this->ErrorArray[20] = array('error'=>1,'number'=>20,'message'=>"Token is not set! Api needs access token.");
        $this->ErrorArray[30] = array('error'=>1,'number'=>30,'message'=>"Token is not valid.");
    }
    
    function SendMessage($i){
        if(array_key_exists($i,$this->ErrorArray))
            echo json_encode($this->ErrorArray[$i]);
        else
            echo json_encode(array('error'=>true,'number'=>-1,'message'=>"ERROR: Unkown!."));
        exit;
    }
    
}