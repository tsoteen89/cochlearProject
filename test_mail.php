<?php
require_once './swiftmailer/lib/swift_required.php';

// Create the Transport
$transport = Swift_SmtpTransport::newInstance('smtp.zoho.com', 465)
  ->setUsername('admin@aii-hermes.org')
  ->setPassword('rugger31')
  ;

/*
You could alternatively use a different transport such as Sendmail or Mail:

// Sendmail
$transport = Swift_SendmailTransport::newInstance('/usr/sbin/sendmail -bs');

// Mail
$transport = Swift_MailTransport::newInstance();
*/

// Create the Mailer using your created Transport
$mailer = Swift_Mailer::newInstance($transport);

// Create a message
$message = Swift_Message::newInstance('Wonderful Subject')
  ->setFrom(array('admin@aii-hermes.org' => 'Administrator'))
  ->setTo(array('terry.griffin@mwsu.edu' => 'Terry Griffin'))
  ->setBody('Here is the message itself')
  ;

// Send the message
$result = $mailer->send($message);
