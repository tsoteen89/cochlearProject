<?php
require './PHPMailer/PHPMailerAutoload.php';

$mail = new PHPMailer;

//$mail->SMTPDebug = 3;                               // Enable verbose debug output

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'smtp.zoho.com';  // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'admin@aii-hermes.org';                 // SMTP username
$mail->Password = 'Z0h0411!!xyz';                           // SMTP password
$mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 465;                                    // TCP port to connect to

$mail->From = 'admin@aii-hermes.org';
$mail->FromName = 'Administrator';
$mail->addAddress('jrrowe55@yahoo.com', 'James Rowe');     // Add a recipient
$mail->addAddress('anne.v.lam@gmail.com', 'Anne Lam');            // Name is optional
$mail->addAddress('t.osteen89@gmail.com', 'Travis Osteen');            // Name is optional
$mail->addAddress('sanan.aamir@mwsu.edu', 'Sanan Amir');            // Name is optional
$mail->addAddress('terry.griffin@mwsu.edu','Terry Griffin');            // Name is optional
//$mail->addReplyTo('info@example.com', 'Information');
//$mail->addCC('cc@example.com');
//$mail->addBCC('bcc@example.com');

$mail->WordWrap = 50;                                 // Set word wrap to 50 characters
//$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
//$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
$mail->addAttachment('/var/www/cochlearProject/images/hermesCI.png');
$mail->isHTML(true);                                  // Set email format to HTML

$mail->Subject = 'Test Email';
$mail->Body    = 'Hey!<br>';
$mail->Body    .= '<br>';
$mail->Body    .= 'This is a test email from Aii-Hermes!!<br>';
$mail->Body    .= 'I actually think it might work. Check there is an image attached.<br>';
$mail->Body    .= 'Email me back if you get this, otherwise, I guess you won\'t know about it.<br>';
$mail->Body    .= '<br>';
$mail->Body    .= 'Terry<br>';
//$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

if(!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message has been sent';
}
