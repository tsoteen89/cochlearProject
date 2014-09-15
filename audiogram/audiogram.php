<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Audiogram Test</title>
		<link rel="stylesheet" href="media/css/style.css" type="text/css" media="screen" />
		<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/themes/overcast/jquery-ui.css" type="text/css" media="screen" />
    <link href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet">
    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
	</head>
	<body>
		<div id="container">
			<h1>Audiogram Page</h1>
			<form action="test.php" method="POST">
				<fieldset class="audiogram">
					<legend class="audiogram">Audiometric threshold entry</legend>
					<table id="01496673" data-appointment="10041362"  data-audiogram="new">
						<thead>
							<tr>
								<th>Frequency</th>
								<th>Right Air Threshold</th>
								<th>Right Bone Threshold</th>
								<th>Left Air Threshold</th>
								<th>Left Bone Threshold</th>
								<th>Sound Field Unaided</th>
								<th>Sound Field Aided</th>
								<th>Cochlear Implant</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>t125</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>t180</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>t250</td>
								<td>10</td>
								<td>5</td>
								<td>15</td>
								<td>10</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>t375</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>t500</td>
								<td>10</td>
								<td>5</td>
								<td>15</td>
								<td>15</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>t750</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>t1k</td>
								<td>15</td>
								<td>15</td>
								<td>30</td>
								<td>25-m</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>t1500</td>
								<td>15</td>
								<td></td>
								<td>60</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>t2k</td>
								<td>10</td>
								<td>10</td>
								<td>80</td>
								<td>75-m</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>t3k</td>
								<td>30</td>
								<td></td>
								<td>80</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>t4k</td>
								<td>40</td>
								<td>35</td>
								<td>85</td>
								<td>75-m</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>t6k</td>
								<td>35-m</td>
								<td></td>
								<td>90-m</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>t8k</td>
								<td>50</td>
								<td></td>
								<td>100</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>t12k</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
						</tbody>
					</table>
					
					<fieldset class="reliability">
						<legend>Test reliability</legend>
						<label for="reliability_good">Good</label>
						<input type="radio" name="reliability" id="reliability_good" />
						<label for="reliability_fair">Fair</label>
						<input type="radio" name="reliability" id="reliability_fair" />
						<label for="reliability_poor">Poor</label>
						<input type="radio" name="reliability" id="reliability_poor" />
					</fieldset>
					<fieldset class="speech">
						<legend>Speech audiometry</legend>
						<!-- Yes, Captain Semantics, an html table is appropriate here because this is a table of data-->
						<table class="speech">
							<thead>
								<tr>
									<td><!--Empty since we have labels for both columns and rows--></td>
									<td>Right</td>
									<td>Left</td>
									<td>SF<br />Unaided</td>
									<td>SF<br />Aided</td>
								</tr>
							</thead>
							<tbody>
								<tr class="srt">
									<td>SRT</td>
									<td><input type="text" id="srt_right" name="srt_right" class="speech_table_input" value="15" /></td>
									<td><input type="text" id="srt_left"  name="srt_left"  class="speech_table_input" value="30" /></td>
									<td><input type="text" id="srt_sfua"  name="srt_sfua"  class="speech_table_input" /></td>
									<td><input type="text" id="srt_sfa"   name="srt_sfa"   class="speech_table_input" /></td>
								</tr>
								<tr class="srt_masking">
									<td>SRT Masking</td>
									<td><input type="text" id="srt_right_masking" name="srt_right_masking" class="speech_table_input" /></td>
									<td><input type="text" id="srt_left_masking"  name="srt_left_masking"  class="speech_table_input" /></td>
									<td><input type="text" id="srt_sfua_masking"  name="srt_sfua_masking"  class="speech_table_input" /></td>
									<td><input type="text" id="srt_sfa_masking"   name="srt_sfa_masking"   class="speech_table_input" /></td>
								</tr>
								<tr class="discrimination">
									<td>Discrim</td>
									<td><input type="text" id="discrim_right" name="discrim_right" class="speech_table_input" value="96" /></td>
									<td><input type="text" id="discrim_left"  name="discrim_left"  class="speech_table_input" value="54" /></td>
									<td><input type="text" id="discrim_sfua"  name="discrim_sfua"  class="speech_table_input" /></td>
									<td><input type="text" id="discrim_sfa"   name="discrim_sfa"   class="speech_table_input" /></td>
								</tr>
								<tr class="discrimination_masking">
									<td>Discrim masking</td>
									<td><input type="text" id="discrim_right_masking" name="discrim_right_masking" class="speech_table_input" /></td>
									<td><input type="text" id="discrim_left_masking"  name="discrim_left_masking"  class="speech_table_input" value="50" /></td>
									<td><input type="text" id="discrim_sfua_masking"  name="discrim_sfua_masking"  class="speech_table_input" /></td>
									<td><input type="text" id="discrim_sfa_masking"   name="discrim_sfa_masking"   class="speech_table_input" /></td>
								</tr>
								<tr class="discrimination_level">
									<td>Level / list</td>
									<td><input type="text" id="discrim_right_level" name="discrim_right_level" class="speech_table_input" value="55 / NU-6" /></td>
									<td><input type="text" id="discrim_left_level"  name="discrim_left_level"  class="speech_table_input" value="70 / NU-6" /></td>
									<td><input type="text" id="discrim_sfua_level"  name="discrim_sfua_level"  class="speech_table_input" /></td>
									<td><input type="text" id="discrim_sfa_level"   name="discrim_sfa_level"   class="speech_table_input" /></td>
								</tr>
							</tbody>
						</table>
					</fieldset>
					<fieldset class="tympanometry">
						<legend>Tympanometry</legend>
							<fieldset class="tympanometry_right">
								<legend>Right:</legend>
								<label for="tymp_a_right">A</label>
								<input type="radio" name="tympanometry_right" id="tymp_a_right"  />
								<label for="tymp_as_right">A<sub>S</sub></label>
								<input type="radio" name="tympanometry_right" id="tymp_as_right" />
								<label for="tymp_ad_right">A<sub>D</sub></label>
								<input type="radio" name="tympanometry_right" id="tymp_ad_right" />
								<label for="tymp_b_right">B</label>
								<input type="radio" name="tympanometry_right" id="tymp_b_right"  />
								<label for="tymp_c_right">C</label>
								<input type="radio" name="tympanometry_right" id="tymp_c_right"  />								
							</fieldset>
							<fieldset class="tympanometry_right">
								<legend>Left:</legend>
								<label for="tymp_a_left">A</label>
								<input type="radio" name="tympanometry_left" id="tymp_a_left" />
								<label for="tymp_as_left">A<sub>S</sub></label>
								<input type="radio" name="tympanometry_left" id="tymp_as_left" />
								<label for="tymp_ad_left">A<sub>D</sub></label>
								<input type="radio" name="tympanometry_left" id="tymp_ad_left" />
								<label for="tymp_b_left">B</label>
								<input type="radio" name="tympanometry_left" id="tymp_b_left" />
								<label for="tymp_c_left">C</label>
								<input type="radio" name="tympanometry_left" id="tymp_c_left" />								
							</fieldset>
					</fieldset>
			
					<fieldset class="controls">
						<legend class = "controls">Selector</legend>
						<section id="buttons">
							<section id="buttons_controller">
								<fieldset class="radioSetSelector">
									<label for="button_ear_specific">Ear specific markers</label>
									<input type="radio" name="ear_specific.soundfield" id="button_ear_specific" />
									<label for="button_soundfield">Sound field markers</label>
									<input type="radio" name="ear_specific.soundfield" id="button_soundfield" />
								</fieldset>

								<fieldset class="radioSetSelector">
									<label for="button_add">Add point</label>
									<input type="radio" name="addRemove" id="button_add" />
									<label for="button_remove">Remove point</label>
									<input type="radio" name="addRemove" id="button_remove" />
								</fieldset>
								
								<button id="button_save" type="button">Save</button>
							</section>
							
							<section id="buttons_ear_specific">
								<fieldset class="radioSetSelector">
									<label for="button_left">Left</label>
									<input type="radio" name="leftRight"  id="button_left" />
									<label for="button_right">Right</label>
									<input type="radio" name="leftRight" id="button_right" />
								</fieldset>

								<fieldset class="radioSetSelector">
									<label for="button_air">Air</label>
									<input type="radio" name="airBone" id="button_air" />
									<label for="button_bone">Bone</label>
									<input type="radio" name="airBone" id="button_bone" />
								</fieldset>

								<fieldset class="radioSetSelector">
									<label for="button_unmasked">Unmasked</label>
									<input type="radio" name="masking" id="button_unmasked" />
									<label for="button_masked">Masked</label>
									<input type="radio" name="masking" id="button_masked" />
								</fieldset>
							</section>
							
							<section id="buttons_soundfield">
								<fieldset class="radioSetSelector">
									<label for="button_unaided">Unaided</label>
									<input type="radio" name="sft" id="button_unaided" />
									<label for="button_aided">Aided</label>
									<input type="radio" name="sft" id="button_aided" />
									<label for="button_ci">Cochlear implant</label>
									<input type="radio" name="sft" id="button_ci" />
								</fieldset>
							</section>
						</section>
					</fieldset>
				</fieldset>
			</form>
		</div>
	
	
		<!-- Using Google's CDN to save on http requests to our server and use what is likely cached on the user's machine anyway -->
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/jquery-ui.min.js"></script>
		<script type="text/javascript" src="media/js/ba-debug.min.js"></script>
		<script type="text/javascript" src="media/js/jquery.audiogram.js"></script>
		<script type="text/javascript">
			$('#01496673').audiogram({
				editable : true,
			});
			
			$('#button_save').button({
				text : true,
				icons : {
					primary : "ui-icon-check"
				}
			});
			$('.radioSetSelector, .tympanometry_right, .tympanometry_left, .reliability').buttonset();
		</script>
	</body>
</html>