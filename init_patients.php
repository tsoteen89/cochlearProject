<?php

//github project called PHP-MySQLi-Database-Class
require_once '../includes/PHP-MySQLi-Database-Class/MysqliDb.php';

class InitPatientTable{
    var $DbConn;
    var $users;

    function __construct(){
        $DbData  = json_decode(file_get_contents('../config/db.json'));
        $this->DbConn = new Mysqlidb($DbData->host, $DbData->username, $DbData->password, $DbData->databaseName);
    }

    function CreatePatientTable($drop_table=false){
        $sql = '
        CREATE TABLE IF NOT EXISTS `patient` (
          `patient_id` int(8) NOT NULL,
          `fname` varchar(32) NOT NULL,
          `mi` varchar(1) NOT NULL,
          `lname` varchar(32) NOT NULL,
          `dob` date NOT NULL,
          `street_address` varchar(32) NOT NULL,
          `city` varchar(32) NOT NULL,
          `state` varchar(16) NOT NULL,
          `zip` int(16) NOT NULL,
          `sex` varchar(8) NOT NULL,
          `race` varchar(112) NOT NULL,
          `bmi` float(5,2) NOT NULL,
          `height` int(4) NOT NULL,
          `weight` int(4) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=latin1;';

        if($drop_table){
            $this->DbConn->rawQuery("drop table patient");
        }

        $this->DbConn->rawQuery($sql);

        $tables = $this->DbConn->rawQuery('show tables');

        print_r($tables[0]);

        if(in_array('patient',$tables[0])){
            return true;
        }

        return false;
    }

    //Get users in blocks of 20
    function GetPatientData($num_users=40,$chunks=20){

        $this->Users = array();
        for($Gotten=0;$Gotten<$num_users;$Gotten+=$chunks){
            $temp = json_decode(file_get_contents('http://api.randomuser.me/?results='.$chunks));
            foreach($temp->results as $user){
                $this->Users[] = $user;
            }
        }
    }


    //Load patients from api to patients table
    function LoadPatientData($truncate_table=false){
        if($truncate_table){
            $trunc = $this->DbConn->rawQuery('truncate patient');
        }


    }
}

//only run this code if this file is called directly
if (!debug_backtrace()) {
    $LoadUp = new InitPatientTable();
    echo "Connected...\n";
    if($LoadUp->CreatePatientTable(true))
        echo "Table patient created....\n";
    else{
        echo "Table patient not created!! .... Exiting... \n";
        exit;
    }
    echo "Getting patient data .... \n";
    $LoadUp->GetPatientData(40);
    echo "Done! ... \n"
    echo "Loading patient table....\n";
    $LoadUp->LoadPatientTable(true);
    echo "Done! ... \n";
}
