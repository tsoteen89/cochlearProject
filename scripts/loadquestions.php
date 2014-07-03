<?php
ini_set('display_errors', 1);
error_reporting(1);

$json = '{"host":"localhost","user":"griffin","pass":"rugger31","db":"Aii2"}';
$temp = new Load_questions($json);

/**
 * Class to load Aii database from a text file. Rudimentary start, but easier than
 * creating question forms (and faster) to load a quick basic database.
 *
 * @category   Database
 * @package
 * @author     Terry Griffin <terry.griffin@mwsu.edu>
 * @author
 * @copyright  2013 Auditory Implant Initiative
 * @license    http://www.php.net/license/3_01.txt  PHP License 3.01
 * @version    1.0
 *
 */
class Load_questions{

    var $FileName;
    var $FileContents;
    var $QuestionsArray;
    var $FilePath;
    var $GroupsArray;
    var $QuestionAnswerTypesArray;
    var $Temp;
    var $db;

    /**
     * Constructor -
     *
     * @category   Database wrapper
     * @package
     * @author     Terry Griffin <terry.griffin@mwsu.edu>
     * @author
     * @copyright  2014 Auditory Implant Initiative
     * @license    http://www.php.net/license/3_01.txt  PHP License 3.01
     * @version    1.0
     *
     * Public Methods:
     *
     *   AddGroup($GroupID,$GroupName,$GroupTitle)
     *   DumpQuestionsArray()
     *   FixCase($str)                           - Forces everything to lower case
     *   LoadQuestions($truncate=FALSE)          - Meat and potatoes to process "input file" and load DB
     *   LoadAuditoryQuestions($StartIndex=0)    - Same as LoadQuestoins except we concentrate on the Audiology format.
     *   GenerateGroupIdsArray()                 - returns an array of uniques group id's from DB
     *   SetQuestionAnswerTypes()                - returns an array of uniques question types from DB
     *   SetFileName($file_name)                 - Sets filename for questions db to be initialized from
     *
     * Private Methods:
     *   MyPrintR($foo)                          - Synonomous with print_r except includes <pre> tags.
     *   AddGroup($id,$name,$title)              - Adds group name  = (page / list of questions) to DB
     ************************************************************************************************************/

    function __construct($json=NULL)
    {
        //opens a file at /var (out of web directory)
        if(!$json)
          $json = json_decode(file_get_contents("db_connect.json"));
        else
          $json = json_decode($json);

        $this->db = new PDO("mysql:host={$json->host};dbname={$json->db};charset=utf8", $json->user, $json->pass);
        //$this->SetGroupIds();
        //$this->SetQuestionAnswerTypes();
        // $stmt = $this->db->query('SHOW TABLES');
        // $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        // echo "<pre>";
        // print_r($results);
        $this->GenerateGroupIdsArray();
    }

    public function index(){

    }

    public function GenerateGroupIdsArray(){
        $this->GroupsArray = array();
        $stmt = $this->db->query("SELECT * FROM Groups WHERE 1");
        $this->GroupsArray = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function LoadQuestions($truncate=FALSE){
        if($truncate){
            $this->db->query("DELETE FROM QuestionGroups WHERE 1");
            $this->db->query("DELETE FROM QuestionAnswerChoices WHERE 1");
            $this->db->query("DELETE FROM Groups WHERE 1");
            $this->db->query("DELETE FROM Questions WHERE 1");
        }

        $GroupID = -1;

        for($i = 0; $i < sizeof($this->FileContents); $i++)
        {
            if(strpos($this->FileContents[$i],"===")){
                $this->LoadAuditoryQuestions($i);
                return;
            }else if(substr($this->FileContents[$i],0,1) == '/' && substr($this->FileContents[$i],1,1)){
                continue;
            }
            //* (asterisk) means new group
            $temp = explode("|",$this->FileContents[$i]);
            if($temp[0] == '*'){
                $GroupID++;
                list($null,$GroupName,$GroupTitle) = $temp;
                echo "{$GroupID} {$GroupName}<br>";
                $this->AddGroup($GroupID,$GroupName,$GroupTitle);
            }else{
                list($QuestionNumber,$QuestionText,$AnswerChoices,$Help,$ParentId,$Trigger,$AnswerType,$Validation) = $temp;

                $QuestionNumber = trim($QuestionNumber);



                $this->QuestionsArray[$GroupID][$QuestionNumber]['QuestionID']=$QuestionNumber;
                $this->QuestionsArray[$GroupID][$QuestionNumber]['QuestionText']=trim($QuestionText);
                $this->QuestionsArray[$GroupID][$QuestionNumber]['QuestionHelp']=trim($Help);
                $this->QuestionsArray[$GroupID][$QuestionNumber]['ParentID']=$ParentId;
                $this->QuestionsArray[$GroupID][$QuestionNumber]['TriggerSubQuestion']=$this->FixCase($Trigger);
                $this->QuestionsArray[$GroupID][$QuestionNumber]['TypeID']=$this->FixCase($AnswerType);

                echo $QuestionNumber." ".$this->FixCase($AnswerType)."=>".$this->QuestionAnswerTypesArray[$this->FixCase($AnswerType)]."<br>";

                $Data = array();

                $Data['GroupID']=$GroupID;
                $Data['QuestionID']=$QuestionNumber;
                $Data['QuestionText']=trim($QuestionText);
                $Data['QuestionHelp']=trim($Help);
                $Data['ParentID']=$ParentId;
                $Data['TriggerSubQuestion']=$this->FixCase($Trigger);
                $Data['TypeID']=$this->QuestionAnswerTypesArray[$this->FixCase($AnswerType)];

                $this->AddQuestion((array)$Data);
                $this->AddQuestionToGroup($GroupID,$QuestionNumber);

                //If answer choices contains commas, then there are multiple values to be put in the database
                if(strpos($AnswerChoices,',')){
                    $AnswerChoices=explode(',',$AnswerChoices);
                    //Create an array of answers
                    for($j=0; $j < sizeof($AnswerChoices);$j++)
                    {
                        $AnswerChoices[$j] = ucfirst(trim($AnswerChoices[$j]));
                        $this->AddQuestionAnswer($QuestionNumber,$j,$AnswerChoices[$j]);
                    }
                }
                //If a "dash" (-) exists, then it is a range of answers for that question (e.g. 1-5 = 1,2,3,4,5).
                else if(strpos($AnswerChoices,'-'))
                {
                    list($start,$end) = explode('-',trim($AnswerChoices));
                    $AnswerChoices = array();

                    if(strpos($start,'.'))
                        $increment = .1;
                    else
                        $increment = 1;

                    for($a=$start,$c=0; $a<=$end; $a+=$increment,$c++)
                    {
                        $AnswerChoices[$c]=$a;
                        $this->AddQuestionAnswer($QuestionNumber,$c,$a);

                    }
                }
            }
        }
    }

    public function SetFileName($file_name){
        $this->FileName = $file_name;
        $this->FilePath = APPPATH.$this->FileName;
        $this->FileContents = file($this->FilePath);
    }

  // public function LoadAuditoryQuestions($StartIndex=0){
  //     $DeleteIDs = "";        //List of nums to used to delete from DB
  //     $MaxGid = 0;            //Max group ID
  //     $MaxQid = 0;            //Max questions ID
  //
  //     //If were at top of questions file, advance to the dilimiter (===)
  //
  //     $GroupIDs = $this->db->query("SELECT * FROM Groups WHERE GroupName REGEXP 'Audio'");
  //     $GroupIDs = $stmt->fetchAll(PDO::FETCH_ASSOC);
  //
  //
  //     //Build an "IN" clause to delete Auditory groups with.
  //     for($j=0;$j<sizeof($GroupIDs);$j++){
  //         $DeleteIDs .= $GroupIDs[$j]['GroupID'];
  //         if($j<sizeof($GroupIDs)-1)
  //             $DeleteIDs .= ',';
  //     }
  //
  //     if($DeleteIDs){
  //     //Delete all the auditory groups from the DB
  //         $this->db->query("DELETE FROM Groups WHERE GroupID IN ({$DeleteIDs})");
  //     }
  //
  //     $this->db->query("DELETE FROM Auditory_Questions WHERE 1");
  //     $this->db->query("DELETE FROM Auditory_Categorys WHERE 1");
  //     $this->db->query("DELETE FROM Auditory_Tests WHERE 1");
  //
  //     //Get next available group id
  //     $MaxGid = $this->db->query("SELECT MAX(GroupID) as Max FROM Groups WHERE 1");
  //     $MaxGid = $MaxGid->result_array();
  //     $MaxGid = $MaxGid[0]['Max'];
  //
  //     //Get next available question id from table
  //     //$MaxQid = $this->db->query("SELECT MAX(QuestionID) as Max FROM Auditory_Questions WHERE 1");
  //     //$MaxQid = $MaxQid->result_array();
  //     //$MaxQid = $MaxQid[0]['Max'];
  //
  //     $MaxQid = 0;    //Max Questions ID. Should be zero right now, dealing with empty auditory_questions table.
  //     $MaxCid = 0;    //Max category id.
  //     $MaxTid = 0;    //Max Test Id.
  //
  //     $QuestionsArray = array();
  //     $CategoryArray = array();
  //     $TypeArray = array();
  //
  //     //Position file pointer to proper row in file (auditory questions).
  //     if($StartIndex == 0){
  //         while(!strpos($this->FileContents[$StartIndex],"===")){
  //             $StartIndex++;
  //         }
  //     }
  //
  //
  //     //Loop through file
  //     for($i = $StartIndex+1; $i < sizeof($this->FileContents); $i++)
  //     {
  //         if(substr($this->FileContents[$i],0,1) == '/' && substr($this->FileContents[$i],1,1) == '/'){
  //             continue;
  //         }
  //         switch($this->FileContents[$i][0]){
  //             //New Group
  //             case '*':
  //                 list($null,$GroupName,$GroupDescription) = explode('|',$this->FileContents[$i]);
  //                 $MaxGid++;
  //                 echo "{$MaxGid} {$GroupName} {$GroupDescription}<br>";
  //                 $this->AddGroup($MaxGid,$GroupName,$GroupDescription);
  //                 break;
  //             //Question built of associated id's
  //             case '~':
  //                 $MaxQid++;
  //                 list($null,$Questions) = explode('|',$this->FileContents[$i]);
  //                 $Questions = explode(',',$Questions);
  //                 for($q=0;$q<sizeof($Questions);$q++){
  //                     $CurrentQuestion = $Questions[$q];
  //                     echo"<pre>";
  //                     print_r($CurrentQuestion);
  //                 }
  //
  //                 break;
  //             //Auditory question heading / titles for questions
  //             default:
  //                 $MaxQid++;
  //                 $Parts = explode('|',$this->FileContents[$i]);
  //                 echo"<pre>";
  //                 print_r($Parts);
  //                 if($Parts[1] == 'C'){
  //                     $MaxCid++;
  //                     $this->db->insert('Auditory_Categorys',array('CategoryID'=>$MaxCid,'Category'=>$Parts[2]));
  //                     $CategoryArray[$MaxCid] = $Parts[2];
  //                 }else if($Parts[1] == 'T'){
  //                     $MaxTid++;
  //                     (trim($measurement) == '%') ? $measurement = 'pct' : NULL;
  //                     $this->db->insert('Auditory_Tests',array('TestID'=>$MaxTid,'TestName'=>$Parts[2],'TestDescription'=>'None','MeasurementType'=>$Parts[3]));
  //                     $TypeArray[$MaxTid] = array($Parts[2],$Parts[3]);
  //                 }else if($Parts[1] == 'Q'){
  //                     $MaxQid++;
  //                     list($id,$type,$question) = explode($Parts);
  //                     $QuestionArray[$MaxQid] = array($Parts[2]);
  //                 }
  //         }
  //     }
  //     echo"<pre>";
  //     print_r($CategoryArray);
  //     print_r($TypeArray);
  //     print_r($QuestionArray);
  //     echo"</pre>";
  // }

    /* Private Functions
    /************************************************************************************************************/

    private function AddGroup($GroupID,$GroupName,$GroupTitle){
        $this->db->insert('Groups',
                           array('GroupID'=>$GroupID,'GroupName'=>$GroupName,'GroupDescription'=>$GroupTitle));
    }

    private function AddQuestion($Group,$Id=NULL,$Text=NULL,$Help=NULL,$PId=NULL,$Trigger=NULL,$TypeID=NULL){

        $Data = array();

        if(!is_array($Group)){
            $Data['GroupID']=$Group;
            $Data['QuestionID']=$Id;
            $Data['QuestionText']=trim($Text);
            $Data['QuestionHelp']=trim($Help);
            $Data['ParentID']=$PId;
            $Data['TriggerSubQuestion']=$this->FixCase($Trigger);
            $Data['TypeID']=$this->QuestionAnswerTypesArray[$this->FixCase($TypeID)];
        }else{
            $Data = $Group;
        }

        $result = $this->db->insert('Questions', $Data);
        print_r($result);
    }

    private function AddQuestionToGroup($group,$question_id){
        $this->db->insert('QuestionGroups',array('GroupID'=>$group,'QuestionID'=>$question_id));
    }

    private function AddQuestionAnswer($question_id,$answer_id,$text){
        $this->db->insert('QuestionAnswerChoices',array('QuestionID'=>$question_id,'AnswerID'=>$answer_id,'Text'=>$text));
    }
    private function FixCase($str){
        return ucfirst(strtolower(trim($str)));
    }

    private function MyPrintR($foo){
        echo"<pre>";
        print_r($foo);
        echo"</pre>";
    }

    private function SetQuestionAnswerTypes(){
        $this->QuestionAnswerTypesArray = array();
        $query = $this->db->query("SELECT * FROM QuestionAnswerTypes WHERE 1");
        foreach ($query->result() as $row){
            $this->QuestionAnswerTypesArray[$this->FixCase($row->Name)] = $this->FixCase($row->TypeID);
        }
    }

    private function query($sql,$array=true){
        if($array)
          $Tmp = array();
        else
          $Tmp = new stdClass();
        $result = mysql_query($sql);
        if($array){
          while($Arr[] = mysql_fetch_array($result)){;}
        }else{
          while($Arr[] = mysql_fetch_object($result)){;}
        }
        return $Arr;
    }
}
