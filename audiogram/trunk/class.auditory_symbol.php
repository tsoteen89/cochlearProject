<?php
class AuditorySymbol{

	var $Symbols;		//Array of symbols with descriptions etc.
	var $FontSize;		//Fontsize in acceptable formats (px, em, etc.)
	var $Side;			//right or left

	function __construct(){
		$this->Symbols = [
			'AC'=>[
				'measure'=>'Air Conduction','right_symbol'=>'&bigcirc;','abbr'=>'AC','left_symbol'=>'&#10005;',
				'masked'=>['right_symbol'=>'&bigtriangleup;','left_symbol'=>'&#9634;']
			],
			'BC'=>[
				'measure'=>'Bone Conduction','right_symbol'=>'&lang;','abbr'=>'BC','left_symbol'=>'&rang;',
				'masked'=>['right_symbol'=>'&lbrack;','left_symbol'=>'&rbrack;']
			],
			'M'=>[
				'measure'=>'Most Comfortable Loudness','right_symbol'=>'M','abbr'=>'MCL','left_symbol'=>'M'	
			],
			'm'=>[
				'measure'=>'Un-Comfortable Loudness','right_symbol'=>'m','abbr'=>'MCL','left_symbol'=>'m'
			],
			'SF'=>[
				'measure'=>'Sound Field','right_symbol'=>'S','abbr'=>'SF','left_symbol'=>'S'
			],	
			'SF-A'=>[
				'measure'=>'Sound Field Aided','right_symbol'=>'A','abbr'=>'SF-A','left_symbol'=>'A'
			]
			
		];
		$this->Side = null;
		$this->FontSize = '24px';
	}
	function GetSymbol($id){
		$symbol = $this->Symbols[$id];
		return json_encode($symbol);
	}
	function SetSide($side){
		if(!in_array($side,['right','left']))
			return json_encode(['success'=>false,'message'=>'invalid option']);
		$this->Side = $side;
		return json_encode(['success'=>true]);
	}
}

$Test = new AuditorySymbol();
print_r($Test->Symbols);
print_r($Test->Get('AC'));