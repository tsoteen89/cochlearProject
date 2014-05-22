-- phpMyAdmin SQL Dump
-- version 4.0.6
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 10, 2014 at 03:34 AM
-- Server version: 5.5.33
-- PHP Version: 5.5.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `aii`
--
CREATE DATABASE IF NOT EXISTS `aii` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `aii`;

-- --------------------------------------------------------

--
-- Table structure for table `AuditTrail`
--

DROP TABLE IF EXISTS `AuditTrail`;
CREATE TABLE IF NOT EXISTS `AuditTrail` (
  `Timestamp` int(14) NOT NULL COMMENT 'Time when action occurred.',
  `UserID` int(8) NOT NULL COMMENT 'Id of user interacting with system.',
  `QuestionID` int(8) NOT NULL COMMENT 'Id of question being updated.',
  `Action` enum('Insert','Edit','Delete') NOT NULL,
  `ci_sessions_session_id` varchar(40) NOT NULL,
  PRIMARY KEY (`Timestamp`,`UserID`),
  KEY `UserID` (`UserID`),
  KEY `QuestionID` (`QuestionID`),
  KEY `fk_AuditTrail_ci_sessions1_idx` (`ci_sessions_session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `AuditTrail`
--

TRUNCATE TABLE `AuditTrail`;
-- --------------------------------------------------------

--
-- Table structure for table `CareTeam`
--

DROP TABLE IF EXISTS `CareTeam`;
CREATE TABLE IF NOT EXISTS `CareTeam` (
  `CareTeamID` int(8) NOT NULL,
  `PatientID` int(8) NOT NULL,
  `FacilityID` int(8) NOT NULL,
  PRIMARY KEY (`CareTeamID`,`PatientID`,`FacilityID`),
  KEY `CareTeam_ibfk_1` (`FacilityID`),
  KEY `CareTeam_ibfk_2` (`PatientID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `CareTeam`
--

TRUNCATE TABLE `CareTeam`;
-- --------------------------------------------------------

--
-- Table structure for table `ci_sessions`
--

DROP TABLE IF EXISTS `ci_sessions`;
CREATE TABLE IF NOT EXISTS `ci_sessions` (
  `session_id` varchar(40) NOT NULL DEFAULT '0',
  `UserID` int(8) DEFAULT NULL,
  `ip_address` varchar(45) NOT NULL DEFAULT '0',
  `user_agent` varchar(120) NOT NULL,
  `last_activity` int(10) unsigned NOT NULL DEFAULT '0',
  `user_data` text NOT NULL,
  PRIMARY KEY (`session_id`),
  KEY `last_activity_idx` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `ci_sessions`
--

TRUNCATE TABLE `ci_sessions`;
-- --------------------------------------------------------

--
-- Table structure for table `ErrorLog`
--

DROP TABLE IF EXISTS `ErrorLog`;
CREATE TABLE IF NOT EXISTS `ErrorLog` (
  `UserID` int(8) NOT NULL,
  `Timestamp` int(14) NOT NULL,
  `Action` int(4) NOT NULL,
  `Level` varchar(32) NOT NULL,
  PRIMARY KEY (`UserID`,`Timestamp`),
  KEY `Level` (`Level`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `ErrorLog`
--

TRUNCATE TABLE `ErrorLog`;
-- --------------------------------------------------------

--
-- Table structure for table `ErrorLogLevels`
--

DROP TABLE IF EXISTS `ErrorLogLevels`;
CREATE TABLE IF NOT EXISTS `ErrorLogLevels` (
  `Level` varchar(32) NOT NULL,
  `Severity` int(3) NOT NULL,
  `Description` varchar(128) NOT NULL,
  PRIMARY KEY (`Level`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `ErrorLogLevels`
--

TRUNCATE TABLE `ErrorLogLevels`;
-- --------------------------------------------------------

--
-- Table structure for table `EventAnswers`
--

DROP TABLE IF EXISTS `EventAnswers`;
CREATE TABLE IF NOT EXISTS `EventAnswers` (
  `EventID` int(8) NOT NULL,
  `QuestionID` int(8) NOT NULL,
  `AnswerID` int(8) NOT NULL,
  `Timestamp` int(14) NOT NULL,
  PRIMARY KEY (`EventID`,`QuestionID`),
  KEY `QuestionID` (`QuestionID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `EventAnswers`
--

TRUNCATE TABLE `EventAnswers`;
-- --------------------------------------------------------

--
-- Table structure for table `EventAnswersOther`
--

DROP TABLE IF EXISTS `EventAnswersOther`;
CREATE TABLE IF NOT EXISTS `EventAnswersOther` (
  `EventID` int(8) NOT NULL,
  `QuestionID` int(8) NOT NULL,
  `Text` varchar(128) NOT NULL,
  `Timestamp` int(14) NOT NULL,
  PRIMARY KEY (`EventID`,`QuestionID`),
  KEY `EventAnswersOther_ibfk_1_idx` (`QuestionID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Truncate table before insert `EventAnswersOther`
--

TRUNCATE TABLE `EventAnswersOther`;
-- --------------------------------------------------------

--
-- Table structure for table `Events`
--

DROP TABLE IF EXISTS `Events`;
CREATE TABLE IF NOT EXISTS `Events` (
  `EventID` int(8) NOT NULL,
  `FacilityID` int(8) NOT NULL,
  `UserID` int(8) NOT NULL,
  `PatientID` int(8) NOT NULL,
  `Timestamp` int(14) NOT NULL,
  PRIMARY KEY (`EventID`),
  KEY `FacilityID` (`FacilityID`),
  KEY `UserID` (`UserID`),
  KEY `PatientID` (`PatientID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `Events`
--

TRUNCATE TABLE `Events`;
-- --------------------------------------------------------

--
-- Table structure for table `Facilities`
--

DROP TABLE IF EXISTS `Facilities`;
CREATE TABLE IF NOT EXISTS `Facilities` (
  `FacilityID` int(8) NOT NULL,
  `Name` varchar(128) NOT NULL,
  `Address1` varchar(128) NOT NULL,
  `Address2` varchar(128) NOT NULL,
  `ZipCode` int(5) NOT NULL,
  `Phone` int(10) NOT NULL,
  `TypeID` int(8) NOT NULL,
  `GeoLocation` point NOT NULL,
  `Description` text NOT NULL,
  PRIMARY KEY (`FacilityID`),
  KEY `TypeID` (`TypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `Facilities`
--

TRUNCATE TABLE `Facilities`;
--
-- Dumping data for table `Facilities`
--

INSERT INTO `Facilities` (`FacilityID`, `Name`, `Address1`, `Address2`, `ZipCode`, `Phone`, `TypeID`, `GeoLocation`, `Description`) VALUES
(1, 'midwestern state', '3410 taft blvd', '', 76308, 2147483647, 1, '', 'A nice audiology clinic.');

-- --------------------------------------------------------

--
-- Table structure for table `FacilityTypes`
--

DROP TABLE IF EXISTS `FacilityTypes`;
CREATE TABLE IF NOT EXISTS `FacilityTypes` (
  `TypeID` int(8) NOT NULL,
  `Type` varchar(128) NOT NULL COMMENT 'Short description of a facility.',
  `Description` text NOT NULL COMMENT 'Detailed description of type of facility.',
  PRIMARY KEY (`TypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `FacilityTypes`
--

TRUNCATE TABLE `FacilityTypes`;
--
-- Dumping data for table `FacilityTypes`
--

INSERT INTO `FacilityTypes` (`TypeID`, `Type`, `Description`) VALUES
(1, 'Audiologist', 'Audiology clinic');

-- --------------------------------------------------------

--
-- Table structure for table `Groups`
--

DROP TABLE IF EXISTS `Groups`;
CREATE TABLE IF NOT EXISTS `Groups` (
  `GroupID` int(8) NOT NULL,
  `GroupName` varchar(128) NOT NULL,
  `GroupDescription` text NOT NULL,
  PRIMARY KEY (`GroupID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `Groups`
--

TRUNCATE TABLE `Groups`;
--
-- Dumping data for table `Groups`
--

INSERT INTO `Groups` (`GroupID`, `GroupName`, `GroupDescription`) VALUES
(0, 'Hist_Exam ', ' History and Exam Items\r\n'),
(1, 'Image_Ancill', 'Imaging and Ancillary Items\r\n'),
(2, 'Perio', 'Perioperative Items\r\n'),
(3, 'User_Registration', 'User Registration\r\n'),
(4, 'Facility_registration', 'Facility Registration\r\n'),
(5, 'Care_Team', 'Care Team\r\n'),
(6, 'Audio_candidate', 'Audiometric Candidacy Testing'),
(7, 'Audio_1month', 'Audiometric Testing, 1 month'),
(8, 'Audio_3months', 'Audiometric Testing, 3 months'),
(9, 'Audio_6months', 'Audiometric Testing, 6 months'),
(10, 'Audio_12months', 'Audiometric Testing, 12 months'),
(11, 'Audio_24months', 'Audiometric Testing, 24 months');

-- --------------------------------------------------------

--
-- Table structure for table `Ion_groups`
--

DROP TABLE IF EXISTS `Ion_groups`;
CREATE TABLE IF NOT EXISTS `Ion_groups` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `description` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Truncate table before insert `Ion_groups`
--

TRUNCATE TABLE `Ion_groups`;
--
-- Dumping data for table `Ion_groups`
--

INSERT INTO `Ion_groups` (`id`, `name`, `description`) VALUES
(1, 'admin', 'Administrator'),
(2, 'members', 'General User'),
(3, 'SU', 'super user'),
(4, 'viewer', 'viewer');

-- --------------------------------------------------------

--
-- Table structure for table `Ion_login_attempts`
--

DROP TABLE IF EXISTS `Ion_login_attempts`;
CREATE TABLE IF NOT EXISTS `Ion_login_attempts` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ip_address` varbinary(16) NOT NULL,
  `login` varchar(100) NOT NULL,
  `time` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Truncate table before insert `Ion_login_attempts`
--

TRUNCATE TABLE `Ion_login_attempts`;
-- --------------------------------------------------------

--
-- Table structure for table `Ion_users`
--

DROP TABLE IF EXISTS `Ion_users`;
CREATE TABLE IF NOT EXISTS `Ion_users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ip_address` varbinary(16) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(80) NOT NULL,
  `salt` varchar(40) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `activation_code` varchar(40) DEFAULT NULL,
  `forgotten_password_code` varchar(40) DEFAULT NULL,
  `forgotten_password_time` int(11) unsigned DEFAULT NULL,
  `remember_code` varchar(40) DEFAULT NULL,
  `created_on` int(11) unsigned NOT NULL,
  `last_login` int(11) unsigned DEFAULT NULL,
  `active` tinyint(1) unsigned DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `FacilityID` int(8) NOT NULL,
  `Title` int(8) NOT NULL,
  `UserLevelID` varchar(128) CHARACTER SET latin1 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Truncate table before insert `Ion_users`
--

TRUNCATE TABLE `Ion_users`;
--
-- Dumping data for table `Ion_users`
--

INSERT INTO `Ion_users` (`id`, `ip_address`, `username`, `password`, `salt`, `email`, `activation_code`, `forgotten_password_code`, `forgotten_password_time`, `remember_code`, `created_on`, `last_login`, `active`, `first_name`, `last_name`, `company`, `phone`, `FacilityID`, `Title`, `UserLevelID`) VALUES
(1, '\0\0', 'administrator', '59beecdf7fc966e2f17fd8f65a4a9aeb09d4a3d4', '9462e8eee0', 'admin@admin.com', '', NULL, NULL, NULL, 1268889823, 1389393080, 1, 'Admin', 'istrator', 'ADMIN', '0', 0, 0, ''),
(2, 'aM.¹', 'joe bob', '1319218b44bac073fec515b1d20f5cf1c44564eb', NULL, 'joe.bob@gmail.com', NULL, NULL, NULL, NULL, 1388773018, 1388774458, 1, 'joe', 'bob', 'msu', '1112223333', 0, 0, ''),
(3, 'aM.¹', 'joe smith', 'efac7390992bc4c42608ffd69657f193a16d2c54', NULL, 'joe.smith@gmail.com', NULL, NULL, NULL, NULL, 1389216407, 1390508076, 1, 'joe', 'smith', 'msu', '1112223333', 0, 0, ''),
(4, 'aM.Ç', 'dali llama', 'c44aac30b3435ef80ab7f35cb79db3bd3b821132', NULL, 'dali.llama@llama.com', NULL, NULL, NULL, NULL, 1389391167, 1389391167, 1, 'dali', 'llama', 'llama', '1112223333', 0, 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `Ion_users_groups`
--

DROP TABLE IF EXISTS `Ion_users_groups`;
CREATE TABLE IF NOT EXISTS `Ion_users_groups` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `group_id` mediumint(8) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_users_groups` (`user_id`,`group_id`),
  KEY `fk_users_groups_users1_idx` (`user_id`),
  KEY `fk_users_groups_groups1_idx` (`group_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Truncate table before insert `Ion_users_groups`
--

TRUNCATE TABLE `Ion_users_groups`;
--
-- Dumping data for table `Ion_users_groups`
--

INSERT INTO `Ion_users_groups` (`id`, `user_id`, `group_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(4, 2, 4),
(6, 3, 1),
(7, 4, 2);

-- --------------------------------------------------------

--
-- Table structure for table `MenuContents`
--

DROP TABLE IF EXISTS `MenuContents`;
CREATE TABLE IF NOT EXISTS `MenuContents` (
  `LinkID` int(8) NOT NULL,
  `MenuID` int(8) NOT NULL,
  `ParentLinkID` int(8) NOT NULL,
  `Label` varchar(64) NOT NULL,
  `Order` int(8) NOT NULL,
  `Description` text NOT NULL,
  `Tooltip` varchar(128) NOT NULL,
  `Icon` varchar(128) NOT NULL,
  `URI` varchar(128) NOT NULL,
  `Active` tinyint(1) NOT NULL,
  `UserLevelID` int(8) NOT NULL,
  PRIMARY KEY (`LinkID`),
  KEY `fk_UserLevels_1` (`UserLevelID`),
  KEY `fk_MenuID` (`MenuID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Holds all the links for all the menus.';

--
-- Truncate table before insert `MenuContents`
--

TRUNCATE TABLE `MenuContents`;
--
-- Dumping data for table `MenuContents`
--

INSERT INTO `MenuContents` (`LinkID`, `MenuID`, `ParentLinkID`, `Label`, `Order`, `Description`, `Tooltip`, `Icon`, `URI`, `Active`, `UserLevelID`) VALUES
(0, 1, 0, 'Dummy Button', 0, 'Dummy menu used so that fk constraint is met for other tables', 'Dummy Button. Remove from array', '', '#', 0, 3),
(1, 1, 0, 'Home', 10, 'Clicking here will take you back to the site''s homepage.', 'Go back to the site''s homepage.', 'fa-home', 'Home', 1, 3),
(2, 1, 0, 'About', 20, 'Clicking this page will take you to the about page. This page describes what our organization does, and how we do it.', 'Click here to find out about the AII', 'fa-question-circle', 'About', 1, 3),
(3, 1, 0, 'Donate', 30, 'Find out about how to donate to the AII', 'Find out how to donate to the AII', 'fa-money', 'Donate', 1, 3),
(4, 1, 3, 'IRS and Tax exempt Information', 10, 'To get information about our tax exempt status', 'Tax exempt status', 'fa-ban', 'Tax_exempt', 1, 3),
(5, 1, 3, 'Donate to the AII', 20, 'Click here to donate to the AII', 'Click here to donate to the AII', 'fa-money', 'Donate', 1, 3),
(6, 2, 0, 'Administration', 10, 'Administration Links', 'Same as Description', 'admin-icon', 'Administration', 1, 3),
(7, 2, 6, 'Users', 20, 'Allows an administrator to manage users.', 'User Administration', 'user-icon', 'Users', 1, 3),
(8, 2, 6, 'Facilities', 30, 'This page allows an administrator to invite or edit facilities.', 'Manage Facilities', 'facility-icon', 'Facilities_manager', 1, 3),
(9, 2, 6, 'Care Teams', 50, 'Manage Care Teams', 'Manage Care Teams', 'care-teams', 'Careteam_Manager', 1, 3),
(15, 1, 0, 'Join Us', 40, 'Find out how to join our network', 'Find out how to join our network', '', 'Join_us', 1, 3),
(16, 1, 0, 'AII Professional Forum', 60, 'Ask questions of your peers and get help on many topics', 'Click here to ask questions or get answers from the professionals', '', 'Professional_forum', 1, 3),
(17, 1, 0, 'Member Portal', 70, 'Access the many tools available to professionals', 'Access the many tools available to professionals', '', 'Member_portal', 1, 3),
(18, 1, 0, 'Member Directory', 80, 'Find a doctor, therapist, or facility that can aid you', 'Find a doctor, therapist, or facility that can aid you', '', 'Member_directory', 1, 3),
(19, 1, 2, 'Mission Statement', 10, 'Find out what the AII is does and what it is all about', 'Find out what the AII is does and what it is all about', 'fa-bullseye', 'Mission_statement', 1, 3),
(20, 1, 2, 'Background and History', 10, 'Find out about the AII''s history', 'Find out about the AII''s history', '', 'Background_and_history', 1, 3),
(21, 1, 2, 'Board Members', 30, 'Find out more about our board members', 'Click here to find out more about our board members', '', 'Board_members', 1, 3),
(22, 1, 2, 'Affiliated Organizations', 40, 'Click here to find out about our affiliates', 'Click here to find out about our affiliated organizations', '', 'Affiliated_organizations', 1, 3),
(23, 1, 15, 'Register', 10, 'Click here to become a member of the AII network', 'Click here to become a member of the AII Network', '', 'Register', 1, 3),
(24, 1, 15, 'Benefits to Members', 20, 'Click here to find out why you should become a member of the AII', 'Click here to find out why you should become a member of the AII', '', 'Member_benefits', 1, 3),
(25, 1, 15, 'How to Join', 30, 'Click here to find out how to become a member of the AII Network', 'Click here to find out how to become a member of the AII Network', '', 'Join_us', 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `Menus`
--

DROP TABLE IF EXISTS `Menus`;
CREATE TABLE IF NOT EXISTS `Menus` (
  `MenuID` int(8) NOT NULL,
  `MenuName` varchar(128) NOT NULL,
  `Description` text NOT NULL,
  PRIMARY KEY (`MenuID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `Menus`
--

TRUNCATE TABLE `Menus`;
--
-- Dumping data for table `Menus`
--

INSERT INTO `Menus` (`MenuID`, `MenuName`, `Description`) VALUES
(1, 'Navigation', 'Main Page Navigation Menu'),
(2, 'SideBar', 'Sidebar Menu');

-- --------------------------------------------------------

--
-- Table structure for table `Patient`
--

DROP TABLE IF EXISTS `Patient`;
CREATE TABLE IF NOT EXISTS `Patient` (
  `PatientID` int(8) NOT NULL,
  `DOB` date NOT NULL,
  `Sex` varchar(1) NOT NULL,
  `Race` varchar(112) NOT NULL,
  `BMI` float(5,2) NOT NULL,
  `Height` int(4) NOT NULL,
  `Weight` int(4) NOT NULL,
  PRIMARY KEY (`PatientID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `Patient`
--

TRUNCATE TABLE `Patient`;
-- --------------------------------------------------------

--
-- Table structure for table `QuestionAnswerChoices`
--

DROP TABLE IF EXISTS `QuestionAnswerChoices`;
CREATE TABLE IF NOT EXISTS `QuestionAnswerChoices` (
  `QuestionID` int(8) NOT NULL,
  `AnswerID` int(8) NOT NULL,
  `Text` text NOT NULL,
  PRIMARY KEY (`QuestionID`,`AnswerID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `QuestionAnswerChoices`
--

TRUNCATE TABLE `QuestionAnswerChoices`;
--
-- Dumping data for table `QuestionAnswerChoices`
--

INSERT INTO `QuestionAnswerChoices` (`QuestionID`, `AnswerID`, `Text`) VALUES
(1, 0, '1'),
(1, 1, '2'),
(1, 2, '3'),
(1, 3, '4'),
(1, 4, '5'),
(1, 5, '6'),
(1, 6, '7'),
(1, 7, '8'),
(1, 8, '9'),
(1, 9, '10'),
(1, 10, '11'),
(1, 11, '12'),
(1, 12, '13'),
(1, 13, '14'),
(1, 14, '15'),
(1, 15, '16'),
(1, 16, '17'),
(1, 17, '18'),
(1, 18, '19'),
(1, 19, '20'),
(1, 20, '21'),
(1, 21, '22'),
(1, 22, '23'),
(1, 23, '24'),
(1, 24, '25'),
(1, 25, '26'),
(1, 26, '27'),
(1, 27, '28'),
(1, 28, '29'),
(1, 29, '30'),
(1, 30, '31'),
(1, 31, '32'),
(1, 32, '33'),
(1, 33, '34'),
(1, 34, '35'),
(1, 35, '36'),
(1, 36, '37'),
(1, 37, '38'),
(1, 38, '39'),
(1, 39, '40'),
(1, 40, '41'),
(1, 41, '42'),
(1, 42, '43'),
(1, 43, '44'),
(1, 44, '45'),
(1, 45, '46'),
(1, 46, '47'),
(1, 47, '48'),
(1, 48, '49'),
(1, 49, '50'),
(1, 50, '51'),
(1, 51, '52'),
(1, 52, '53'),
(1, 53, '54'),
(1, 54, '55'),
(1, 55, '56'),
(1, 56, '57'),
(1, 57, '58'),
(1, 58, '59'),
(1, 59, '60'),
(1, 60, '61'),
(1, 61, '62'),
(1, 62, '63'),
(1, 63, '64'),
(1, 64, '65'),
(1, 65, '66'),
(1, 66, '67'),
(1, 67, '68'),
(1, 68, '69'),
(1, 69, '70'),
(1, 70, '71'),
(1, 71, '72'),
(1, 72, '73'),
(1, 73, '74'),
(1, 74, '75'),
(1, 75, '76'),
(1, 76, '77'),
(1, 77, '78'),
(1, 78, '79'),
(1, 79, '80'),
(1, 80, '81'),
(1, 81, '82'),
(1, 82, '83'),
(1, 83, '84'),
(1, 84, '85'),
(1, 85, '86'),
(1, 86, '87'),
(1, 87, '88'),
(1, 88, '89'),
(1, 89, '90'),
(1, 90, '91'),
(1, 91, '92'),
(1, 92, '93'),
(1, 93, '94'),
(1, 94, '95'),
(1, 95, '96'),
(1, 96, '97'),
(1, 97, '98'),
(1, 98, '99'),
(1, 99, '100'),
(2, 0, 'M'),
(2, 1, 'F'),
(3, 0, 'Arctic (Siberian or Eskimo)'),
(3, 1, 'Caucasian (European)'),
(3, 2, 'Caucasian (Indian)'),
(3, 3, 'Caucasian (Middle East)'),
(3, 4, 'Caucasian (North African or Other)'),
(3, 5, 'Indigenous Australian'),
(3, 6, 'Native American'),
(3, 7, 'North East Asian (Mongol - Tibetan - Korean Japanese - etc)'),
(3, 8, 'Pacific (Polynesian - Micronesian - etc)'),
(3, 9, 'South East Asian (Chinese -  Thai - Malay - Filipino - etc)'),
(3, 10, 'West African'),
(3, 11, 'Bushmen'),
(3, 12, 'Ethiopian'),
(3, 13, 'Other Race'),
(4, 0, 'Right'),
(4, 1, 'Left'),
(5, 0, 'Cochlear implant electric only'),
(5, 1, 'Cochlear implant'),
(5, 2, 'Electro acoustic'),
(6, 0, 'Cochlear implant electric only'),
(6, 1, 'Cochlear implant electro acoustic'),
(6, 2, 'Hearing Aide'),
(6, 3, 'Nothing'),
(7, 0, '10.0'),
(7, 1, '10.1'),
(7, 2, '10.2'),
(7, 3, '10.3'),
(7, 4, '10.4'),
(7, 5, '10.5'),
(7, 6, '10.6'),
(7, 7, '10.7'),
(7, 8, '10.8'),
(7, 9, '10.9'),
(7, 10, '11'),
(7, 11, '11.1'),
(7, 12, '11.2'),
(7, 13, '11.3'),
(7, 14, '11.4'),
(7, 15, '11.5'),
(7, 16, '11.6'),
(7, 17, '11.7'),
(7, 18, '11.8'),
(7, 19, '11.9'),
(7, 20, '12'),
(7, 21, '12.1'),
(7, 22, '12.2'),
(7, 23, '12.3'),
(7, 24, '12.4'),
(7, 25, '12.5'),
(7, 26, '12.6'),
(7, 27, '12.7'),
(7, 28, '12.8'),
(7, 29, '12.9'),
(7, 30, '13'),
(7, 31, '13.1'),
(7, 32, '13.2'),
(7, 33, '13.3'),
(7, 34, '13.4'),
(7, 35, '13.5'),
(7, 36, '13.6'),
(7, 37, '13.7'),
(7, 38, '13.8'),
(7, 39, '13.9'),
(7, 40, '14'),
(7, 41, '14.1'),
(7, 42, '14.2'),
(7, 43, '14.3'),
(7, 44, '14.4'),
(7, 45, '14.5'),
(7, 46, '14.6'),
(7, 47, '14.7'),
(7, 48, '14.8'),
(7, 49, '14.9'),
(7, 50, '15'),
(7, 51, '15.1'),
(7, 52, '15.2'),
(7, 53, '15.3'),
(7, 54, '15.4'),
(7, 55, '15.5'),
(7, 56, '15.6'),
(7, 57, '15.7'),
(7, 58, '15.8'),
(7, 59, '15.9'),
(7, 60, '16'),
(7, 61, '16.1'),
(7, 62, '16.2'),
(7, 63, '16.3'),
(7, 64, '16.4'),
(7, 65, '16.5'),
(7, 66, '16.6'),
(7, 67, '16.7'),
(7, 68, '16.8'),
(7, 69, '16.9'),
(7, 70, '17'),
(7, 71, '17.1'),
(7, 72, '17.2'),
(7, 73, '17.3'),
(7, 74, '17.4'),
(7, 75, '17.5'),
(7, 76, '17.6'),
(7, 77, '17.7'),
(7, 78, '17.8'),
(7, 79, '17.9'),
(7, 80, '18'),
(7, 81, '18.1'),
(7, 82, '18.2'),
(7, 83, '18.3'),
(7, 84, '18.4'),
(7, 85, '18.5'),
(7, 86, '18.6'),
(7, 87, '18.7'),
(7, 88, '18.8'),
(7, 89, '18.9'),
(7, 90, '19'),
(7, 91, '19.1'),
(7, 92, '19.2'),
(7, 93, '19.3'),
(7, 94, '19.4'),
(7, 95, '19.5'),
(7, 96, '19.6'),
(7, 97, '19.7'),
(7, 98, '19.8'),
(7, 99, '19.9'),
(7, 100, '20'),
(7, 101, '20.1'),
(7, 102, '20.2'),
(7, 103, '20.3'),
(7, 104, '20.4'),
(7, 105, '20.5'),
(7, 106, '20.6'),
(7, 107, '20.7'),
(7, 108, '20.8'),
(7, 109, '20.9'),
(7, 110, '21'),
(7, 111, '21.1'),
(7, 112, '21.2'),
(7, 113, '21.3'),
(7, 114, '21.4'),
(7, 115, '21.5'),
(7, 116, '21.6'),
(7, 117, '21.7'),
(7, 118, '21.8'),
(7, 119, '21.9'),
(7, 120, '22'),
(7, 121, '22.1'),
(7, 122, '22.2'),
(7, 123, '22.3'),
(7, 124, '22.4'),
(7, 125, '22.5'),
(7, 126, '22.6'),
(7, 127, '22.7'),
(7, 128, '22.8'),
(7, 129, '22.9'),
(7, 130, '23'),
(7, 131, '23.1'),
(7, 132, '23.2'),
(7, 133, '23.3'),
(7, 134, '23.4'),
(7, 135, '23.5'),
(7, 136, '23.6'),
(7, 137, '23.7'),
(7, 138, '23.8'),
(7, 139, '23.9'),
(7, 140, '24'),
(7, 141, '24.1'),
(7, 142, '24.2'),
(7, 143, '24.3'),
(7, 144, '24.4'),
(7, 145, '24.5'),
(7, 146, '24.6'),
(7, 147, '24.7'),
(7, 148, '24.8'),
(7, 149, '24.9'),
(7, 150, '25'),
(7, 151, '25.1'),
(7, 152, '25.2'),
(7, 153, '25.3'),
(7, 154, '25.4'),
(7, 155, '25.5'),
(7, 156, '25.6'),
(7, 157, '25.7'),
(7, 158, '25.8'),
(7, 159, '25.9'),
(7, 160, '26'),
(7, 161, '26.1'),
(7, 162, '26.2'),
(7, 163, '26.3'),
(7, 164, '26.4'),
(7, 165, '26.5'),
(7, 166, '26.6'),
(7, 167, '26.7'),
(7, 168, '26.8'),
(7, 169, '26.9'),
(7, 170, '27'),
(7, 171, '27.1'),
(7, 172, '27.2'),
(7, 173, '27.3'),
(7, 174, '27.4'),
(7, 175, '27.5'),
(7, 176, '27.6'),
(7, 177, '27.7'),
(7, 178, '27.8'),
(7, 179, '27.9'),
(7, 180, '28'),
(7, 181, '28.1'),
(7, 182, '28.2'),
(7, 183, '28.3'),
(7, 184, '28.4'),
(7, 185, '28.5'),
(7, 186, '28.6'),
(7, 187, '28.7'),
(7, 188, '28.8'),
(7, 189, '28.9'),
(7, 190, '29'),
(7, 191, '29.1'),
(7, 192, '29.2'),
(7, 193, '29.3'),
(7, 194, '29.4'),
(7, 195, '29.5'),
(7, 196, '29.6'),
(7, 197, '29.7'),
(7, 198, '29.8'),
(7, 199, '29.9'),
(7, 200, '30'),
(7, 201, '30.1'),
(7, 202, '30.2'),
(7, 203, '30.3'),
(7, 204, '30.4'),
(7, 205, '30.5'),
(7, 206, '30.6'),
(7, 207, '30.7'),
(7, 208, '30.8'),
(7, 209, '30.9'),
(7, 210, '31'),
(7, 211, '31.1'),
(7, 212, '31.2'),
(7, 213, '31.3'),
(7, 214, '31.4'),
(7, 215, '31.5'),
(7, 216, '31.6'),
(7, 217, '31.7'),
(7, 218, '31.8'),
(7, 219, '31.9'),
(7, 220, '32'),
(7, 221, '32.1'),
(7, 222, '32.2'),
(7, 223, '32.3'),
(7, 224, '32.4'),
(7, 225, '32.5'),
(7, 226, '32.6'),
(7, 227, '32.7'),
(7, 228, '32.8'),
(7, 229, '32.9'),
(7, 230, '33'),
(7, 231, '33.1'),
(7, 232, '33.2'),
(7, 233, '33.3'),
(7, 234, '33.4'),
(7, 235, '33.5'),
(7, 236, '33.6'),
(7, 237, '33.7'),
(7, 238, '33.8'),
(7, 239, '33.9'),
(7, 240, '34'),
(7, 241, '34.1'),
(7, 242, '34.2'),
(7, 243, '34.3'),
(7, 244, '34.4'),
(7, 245, '34.5'),
(7, 246, '34.6'),
(7, 247, '34.7'),
(7, 248, '34.8'),
(7, 249, '34.9'),
(7, 250, '35'),
(7, 251, '35.1'),
(7, 252, '35.2'),
(7, 253, '35.3'),
(7, 254, '35.4'),
(7, 255, '35.5'),
(7, 256, '35.6'),
(7, 257, '35.7'),
(7, 258, '35.8'),
(7, 259, '35.9'),
(7, 260, '36'),
(7, 261, '36.1'),
(7, 262, '36.2'),
(7, 263, '36.3'),
(7, 264, '36.4'),
(7, 265, '36.5'),
(7, 266, '36.6'),
(7, 267, '36.7'),
(7, 268, '36.8'),
(7, 269, '36.9'),
(7, 270, '37'),
(7, 271, '37.1'),
(7, 272, '37.2'),
(7, 273, '37.3'),
(7, 274, '37.4'),
(7, 275, '37.5'),
(7, 276, '37.6'),
(7, 277, '37.7'),
(7, 278, '37.8'),
(7, 279, '37.9'),
(7, 280, '38'),
(7, 281, '38.1'),
(7, 282, '38.2'),
(7, 283, '38.3'),
(7, 284, '38.4'),
(7, 285, '38.5'),
(7, 286, '38.6'),
(7, 287, '38.7'),
(7, 288, '38.8'),
(7, 289, '38.9'),
(7, 290, '39'),
(7, 291, '39.1'),
(7, 292, '39.2'),
(7, 293, '39.3'),
(7, 294, '39.4'),
(7, 295, '39.5'),
(7, 296, '39.6'),
(7, 297, '39.7'),
(7, 298, '39.8'),
(7, 299, '39.9'),
(7, 300, '40'),
(7, 301, '40.1'),
(7, 302, '40.2'),
(7, 303, '40.3'),
(7, 304, '40.4'),
(7, 305, '40.5'),
(7, 306, '40.6'),
(7, 307, '40.7'),
(7, 308, '40.8'),
(7, 309, '40.9'),
(7, 310, '41'),
(7, 311, '41.1'),
(7, 312, '41.2'),
(7, 313, '41.3'),
(7, 314, '41.4'),
(7, 315, '41.5'),
(7, 316, '41.6'),
(7, 317, '41.7'),
(7, 318, '41.8'),
(7, 319, '41.9'),
(7, 320, '42'),
(7, 321, '42.1'),
(7, 322, '42.2'),
(7, 323, '42.3'),
(7, 324, '42.4'),
(7, 325, '42.5'),
(7, 326, '42.6'),
(7, 327, '42.7'),
(7, 328, '42.8'),
(7, 329, '42.9'),
(7, 330, '43'),
(7, 331, '43.1'),
(7, 332, '43.2'),
(7, 333, '43.3'),
(7, 334, '43.4'),
(7, 335, '43.5'),
(7, 336, '43.6'),
(7, 337, '43.7'),
(7, 338, '43.8'),
(7, 339, '43.9'),
(7, 340, '44'),
(7, 341, '44.1'),
(7, 342, '44.2'),
(7, 343, '44.3'),
(7, 344, '44.4'),
(7, 345, '44.5'),
(7, 346, '44.6'),
(7, 347, '44.7'),
(7, 348, '44.8'),
(7, 349, '44.9'),
(7, 350, '45'),
(7, 351, '45.1'),
(7, 352, '45.2'),
(7, 353, '45.3'),
(7, 354, '45.4'),
(7, 355, '45.5'),
(7, 356, '45.6'),
(7, 357, '45.7'),
(7, 358, '45.8'),
(7, 359, '45.9'),
(7, 360, '46'),
(7, 361, '46.1'),
(7, 362, '46.2'),
(7, 363, '46.3'),
(7, 364, '46.4'),
(7, 365, '46.5'),
(7, 366, '46.6'),
(7, 367, '46.7'),
(7, 368, '46.8'),
(7, 369, '46.9'),
(7, 370, '47'),
(7, 371, '47.1'),
(7, 372, '47.2'),
(7, 373, '47.3'),
(7, 374, '47.4'),
(7, 375, '47.5'),
(7, 376, '47.6'),
(7, 377, '47.7'),
(7, 378, '47.8'),
(7, 379, '47.9'),
(7, 380, '48'),
(7, 381, '48.1'),
(7, 382, '48.2'),
(7, 383, '48.3'),
(7, 384, '48.4'),
(7, 385, '48.5'),
(7, 386, '48.6'),
(7, 387, '48.7'),
(7, 388, '48.8'),
(7, 389, '48.9'),
(7, 390, '49'),
(7, 391, '49.1'),
(7, 392, '49.2'),
(7, 393, '49.3'),
(7, 394, '49.4'),
(7, 395, '49.5'),
(7, 396, '49.6'),
(7, 397, '49.7'),
(7, 398, '49.8'),
(7, 399, '49.9'),
(7, 400, '50'),
(7, 401, '50.1'),
(7, 402, '50.2'),
(7, 403, '50.3'),
(7, 404, '50.4'),
(7, 405, '50.5'),
(7, 406, '50.6'),
(7, 407, '50.7'),
(7, 408, '50.8'),
(7, 409, '50.9'),
(7, 410, '51'),
(7, 411, '51.1'),
(7, 412, '51.2'),
(7, 413, '51.3'),
(7, 414, '51.4'),
(7, 415, '51.5'),
(7, 416, '51.6'),
(7, 417, '51.7'),
(7, 418, '51.8'),
(7, 419, '51.9'),
(7, 420, '52'),
(7, 421, '52.1'),
(7, 422, '52.2'),
(7, 423, '52.3'),
(7, 424, '52.4'),
(7, 425, '52.5'),
(7, 426, '52.6'),
(7, 427, '52.7'),
(7, 428, '52.8'),
(7, 429, '52.9'),
(7, 430, '53'),
(7, 431, '53.1'),
(7, 432, '53.2'),
(7, 433, '53.3'),
(7, 434, '53.4'),
(7, 435, '53.5'),
(7, 436, '53.6'),
(7, 437, '53.7'),
(7, 438, '53.8'),
(7, 439, '53.9'),
(7, 440, '54'),
(7, 441, '54.1'),
(7, 442, '54.2'),
(7, 443, '54.3'),
(7, 444, '54.4'),
(7, 445, '54.5'),
(7, 446, '54.6'),
(7, 447, '54.7'),
(7, 448, '54.8'),
(7, 449, '54.9'),
(7, 450, '55'),
(7, 451, '55.1'),
(7, 452, '55.2'),
(7, 453, '55.3'),
(7, 454, '55.4'),
(7, 455, '55.5'),
(7, 456, '55.6'),
(7, 457, '55.7'),
(7, 458, '55.8'),
(7, 459, '55.9'),
(7, 460, '56'),
(7, 461, '56.1'),
(7, 462, '56.2'),
(7, 463, '56.3'),
(7, 464, '56.4'),
(7, 465, '56.5'),
(7, 466, '56.6'),
(7, 467, '56.7'),
(7, 468, '56.8'),
(7, 469, '56.9'),
(7, 470, '57'),
(7, 471, '57.1'),
(7, 472, '57.2'),
(7, 473, '57.3'),
(7, 474, '57.4'),
(7, 475, '57.5'),
(7, 476, '57.6'),
(7, 477, '57.7'),
(7, 478, '57.8'),
(7, 479, '57.9'),
(7, 480, '58'),
(7, 481, '58.1'),
(7, 482, '58.2'),
(7, 483, '58.3'),
(7, 484, '58.4'),
(7, 485, '58.5'),
(7, 486, '58.6'),
(7, 487, '58.7'),
(7, 488, '58.8'),
(7, 489, '58.9'),
(7, 490, '59'),
(7, 491, '59.1'),
(7, 492, '59.2'),
(7, 493, '59.3'),
(7, 494, '59.4'),
(7, 495, '59.5'),
(7, 496, '59.6'),
(7, 497, '59.7'),
(7, 498, '59.8'),
(7, 499, '59.9'),
(7, 500, '60'),
(7, 501, '60.1'),
(7, 502, '60.2'),
(7, 503, '60.3'),
(7, 504, '60.4'),
(7, 505, '60.5'),
(7, 506, '60.6'),
(7, 507, '60.7'),
(7, 508, '60.8'),
(7, 509, '60.9'),
(7, 510, '61'),
(7, 511, '61.1'),
(7, 512, '61.2'),
(7, 513, '61.3'),
(7, 514, '61.4'),
(7, 515, '61.5'),
(7, 516, '61.6'),
(7, 517, '61.7'),
(7, 518, '61.8'),
(7, 519, '61.9'),
(7, 520, '62'),
(7, 521, '62.1'),
(7, 522, '62.2'),
(7, 523, '62.3'),
(7, 524, '62.4'),
(7, 525, '62.5'),
(7, 526, '62.6'),
(7, 527, '62.7'),
(7, 528, '62.8'),
(7, 529, '62.9'),
(7, 530, '63'),
(7, 531, '63.1'),
(7, 532, '63.2'),
(7, 533, '63.3'),
(7, 534, '63.4'),
(7, 535, '63.5'),
(7, 536, '63.6'),
(7, 537, '63.7'),
(7, 538, '63.8'),
(7, 539, '63.9'),
(7, 540, '64'),
(7, 541, '64.1'),
(7, 542, '64.2'),
(7, 543, '64.3'),
(7, 544, '64.4'),
(7, 545, '64.5'),
(7, 546, '64.6'),
(7, 547, '64.7'),
(7, 548, '64.8'),
(7, 549, '64.9'),
(7, 550, '65'),
(7, 551, '65.1'),
(7, 552, '65.2'),
(7, 553, '65.3'),
(7, 554, '65.4'),
(7, 555, '65.5'),
(7, 556, '65.6'),
(7, 557, '65.7'),
(7, 558, '65.8'),
(7, 559, '65.9'),
(7, 560, '66'),
(7, 561, '66.1'),
(7, 562, '66.2'),
(7, 563, '66.3'),
(7, 564, '66.4'),
(7, 565, '66.5'),
(7, 566, '66.6'),
(7, 567, '66.7'),
(7, 568, '66.8'),
(7, 569, '66.9'),
(7, 570, '67'),
(7, 571, '67.1'),
(7, 572, '67.2'),
(7, 573, '67.3'),
(7, 574, '67.4'),
(7, 575, '67.5'),
(7, 576, '67.6'),
(7, 577, '67.7'),
(7, 578, '67.8'),
(7, 579, '67.9'),
(7, 580, '68'),
(7, 581, '68.1'),
(7, 582, '68.2'),
(7, 583, '68.3'),
(7, 584, '68.4'),
(7, 585, '68.5'),
(7, 586, '68.6'),
(7, 587, '68.7'),
(7, 588, '68.8'),
(7, 589, '68.9'),
(7, 590, '69'),
(7, 591, '69.1'),
(7, 592, '69.2'),
(7, 593, '69.3'),
(7, 594, '69.4'),
(7, 595, '69.5'),
(7, 596, '69.6'),
(7, 597, '69.7'),
(7, 598, '69.8'),
(7, 599, '69.9'),
(8, 0, 'Congenital'),
(8, 1, 'Progressive'),
(8, 2, 'Trauma'),
(8, 3, 'Infection'),
(8, 4, 'Ototoxicity'),
(8, 5, 'Meningitis'),
(8, 6, 'Menier''s Disease'),
(8, 7, 'Other'),
(9, 0, '1'),
(9, 1, '2'),
(9, 2, '3'),
(9, 3, '4'),
(9, 4, '5'),
(9, 5, '6'),
(9, 6, '7'),
(9, 7, '8'),
(9, 8, '9'),
(9, 9, '10'),
(9, 10, '11'),
(9, 11, '12'),
(9, 12, '13'),
(9, 13, '14'),
(9, 14, '15'),
(9, 15, '16'),
(9, 16, '17'),
(9, 17, '18'),
(9, 18, '19'),
(9, 19, '20'),
(9, 20, '21'),
(9, 21, '22'),
(9, 22, '23'),
(9, 23, '24'),
(9, 24, '25'),
(9, 25, '26'),
(9, 26, '27'),
(9, 27, '28'),
(9, 28, '29'),
(9, 29, '30'),
(9, 30, '31'),
(9, 31, '32'),
(9, 32, '33'),
(9, 33, '34'),
(9, 34, '35'),
(9, 35, '36'),
(9, 36, '37'),
(9, 37, '38'),
(9, 38, '39'),
(9, 39, '40'),
(9, 40, '41'),
(9, 41, '42'),
(9, 42, '43'),
(9, 43, '44'),
(9, 44, '45'),
(9, 45, '46'),
(9, 46, '47'),
(9, 47, '48'),
(9, 48, '49'),
(9, 49, '50'),
(9, 50, '51'),
(9, 51, '52'),
(9, 52, '53'),
(9, 53, '54'),
(9, 54, '55'),
(9, 55, '56'),
(9, 56, '57'),
(9, 57, '58'),
(9, 58, '59'),
(9, 59, '60'),
(9, 60, '61'),
(9, 61, '62'),
(9, 62, '63'),
(9, 63, '64'),
(9, 64, '65'),
(9, 65, '66'),
(9, 66, '67'),
(9, 67, '68'),
(9, 68, '69'),
(9, 69, '70'),
(9, 70, '71'),
(9, 71, '72'),
(9, 72, '73'),
(9, 73, '74'),
(9, 74, '75'),
(9, 75, '76'),
(9, 76, '77'),
(9, 77, '78'),
(9, 78, '79'),
(9, 79, '80'),
(9, 80, '81'),
(9, 81, '82'),
(9, 82, '83'),
(9, 83, '84'),
(9, 84, '85'),
(9, 85, '86'),
(9, 86, '87'),
(9, 87, '88'),
(9, 88, '89'),
(9, 89, '90'),
(9, 90, '91'),
(9, 91, '92'),
(9, 92, '93'),
(9, 93, '94'),
(9, 94, '95'),
(9, 95, '96'),
(9, 96, '97'),
(9, 97, '98'),
(9, 98, '99'),
(9, 99, '100'),
(10, 0, 'Yes'),
(10, 1, 'No'),
(11, 0, 'Right'),
(11, 1, 'Left'),
(11, 2, 'Both'),
(12, 0, 'Yes'),
(12, 1, 'No'),
(13, 0, 'Right'),
(13, 1, 'Left'),
(13, 2, 'Both'),
(15, 0, 'Yes'),
(15, 1, 'No'),
(16, 0, 'Right'),
(16, 1, 'Left'),
(16, 2, 'Neither'),
(17, 0, 'Normal'),
(17, 1, 'Fluid'),
(17, 2, 'Mass'),
(17, 3, 'Cholesteatoma'),
(17, 4, 'Retracted'),
(17, 5, 'Perforation'),
(17, 6, 'Other'),
(18, 0, 'Normal'),
(18, 1, 'Fluid'),
(18, 2, 'Mass'),
(18, 3, 'Cholesteatoma'),
(18, 4, 'Retracted'),
(18, 5, 'Perforation'),
(18, 6, 'Other'),
(19, 0, 'Yes'),
(19, 1, 'No'),
(21, 0, 'Yes'),
(21, 1, 'No'),
(22, 0, 'Yes'),
(22, 1, 'No'),
(23, 0, 'Yes'),
(23, 1, 'No'),
(24, 0, 'Yes'),
(24, 1, 'No'),
(24, 2, 'N/A'),
(25, 0, 'Yes'),
(25, 1, 'No'),
(25, 2, 'N/A'),
(26, 0, 'Yes'),
(26, 1, 'No'),
(26, 2, 'N/A'),
(27, 0, 'Yes'),
(27, 1, 'No'),
(27, 2, 'N/A'),
(28, 0, 'Yes'),
(28, 1, 'No'),
(28, 2, 'N/A'),
(29, 0, 'Yes'),
(29, 1, 'No'),
(30, 0, 'Yes'),
(30, 1, 'No'),
(30, 2, 'N/A'),
(31, 0, 'Yes'),
(31, 1, 'No'),
(31, 2, 'N/A'),
(32, 0, 'Yes'),
(32, 1, 'No'),
(32, 2, 'N/A'),
(33, 0, 'Yes'),
(33, 1, 'No'),
(34, 0, 'Yes'),
(34, 1, 'No'),
(34, 2, 'N/A'),
(35, 0, 'Right'),
(35, 1, 'Left'),
(35, 2, 'N/A'),
(36, 0, 'Yes'),
(36, 1, 'No'),
(36, 2, 'N/A'),
(37, 0, 'Yes'),
(37, 1, 'No'),
(37, 2, 'N/A'),
(39, 0, 'Right'),
(39, 1, 'Left'),
(41, 0, 'Yes'),
(41, 1, 'No'),
(42, 0, 'Yes'),
(42, 1, 'No'),
(44, 0, 'Yes'),
(44, 1, 'No'),
(45, 0, 'Yes'),
(45, 1, 'No'),
(46, 0, 'Yes'),
(46, 1, 'No'),
(47, 0, 'Yes'),
(47, 1, 'No'),
(49, 0, 'Yes'),
(49, 1, 'No'),
(50, 0, 'Yes'),
(50, 1, 'No'),
(51, 0, 'Yes'),
(51, 1, 'No');

-- --------------------------------------------------------

--
-- Table structure for table `QuestionAnswerTypes`
--

DROP TABLE IF EXISTS `QuestionAnswerTypes`;
CREATE TABLE IF NOT EXISTS `QuestionAnswerTypes` (
  `TypeID` int(8) NOT NULL,
  `Name` varchar(45) NOT NULL,
  `Description` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`TypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Truncate table before insert `QuestionAnswerTypes`
--

TRUNCATE TABLE `QuestionAnswerTypes`;
--
-- Dumping data for table `QuestionAnswerTypes`
--

INSERT INTO `QuestionAnswerTypes` (`TypeID`, `Name`, `Description`) VALUES
(1, 'Select', 'Drop down form element.'),
(2, 'Radio', 'Radio button form element.'),
(3, 'Checkbox', 'Checkbox form element.'),
(4, 'Text', 'Input text box form element.'),
(5, 'Multi-Select', 'Multi-select form element.'),
(6, 'Null', 'Question has no inputs, but has sub question.'),
(7, 'Date', 'Date field with no time.'),
(8, 'EarSurgery', 'Date, side, and type of surgery performed.');

-- --------------------------------------------------------

--
-- Table structure for table `QuestionGroups`
--

DROP TABLE IF EXISTS `QuestionGroups`;
CREATE TABLE IF NOT EXISTS `QuestionGroups` (
  `GroupID` int(8) NOT NULL,
  `QuestionID` int(8) NOT NULL,
  PRIMARY KEY (`GroupID`,`QuestionID`),
  KEY `QuestionID` (`QuestionID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `QuestionGroups`
--

TRUNCATE TABLE `QuestionGroups`;
--
-- Dumping data for table `QuestionGroups`
--

INSERT INTO `QuestionGroups` (`GroupID`, `QuestionID`) VALUES
(0, 1),
(0, 2),
(0, 3),
(0, 4),
(0, 5),
(0, 6),
(0, 7),
(0, 8),
(0, 9),
(0, 10),
(0, 11),
(0, 12),
(0, 13),
(0, 14),
(0, 15),
(0, 16),
(0, 17),
(0, 18),
(0, 19),
(0, 20),
(0, 21),
(0, 22),
(1, 23),
(1, 24),
(1, 25),
(1, 26),
(1, 27),
(1, 28),
(1, 29),
(1, 30),
(1, 31),
(1, 32),
(1, 33),
(1, 34),
(1, 35),
(1, 36),
(1, 37),
(2, 38),
(2, 39),
(2, 40),
(2, 41),
(2, 42),
(2, 43),
(2, 44),
(2, 45),
(2, 46),
(2, 47),
(2, 48),
(2, 49),
(2, 50),
(2, 51),
(2, 52),
(2, 53);

-- --------------------------------------------------------

--
-- Table structure for table `Questions`
--

DROP TABLE IF EXISTS `Questions`;
CREATE TABLE IF NOT EXISTS `Questions` (
  `QuestionID` int(11) NOT NULL,
  `QuestionText` text NOT NULL,
  `QuestionHelp` text NOT NULL,
  `ParentID` int(8) NOT NULL,
  `GroupID` int(8) NOT NULL,
  `Trigger` varchar(128) DEFAULT NULL COMMENT 'If this field is populated it triggers the sub question',
  `TypeID` int(8) DEFAULT NULL COMMENT 'Format for answers to be displayed.',
  PRIMARY KEY (`QuestionID`),
  KEY `GroupID` (`GroupID`),
  KEY `fk_TypeID_idx` (`TypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `Questions`
--

TRUNCATE TABLE `Questions`;
--
-- Dumping data for table `Questions`
--

INSERT INTO `Questions` (`QuestionID`, `QuestionText`, `QuestionHelp`, `ParentID`, `GroupID`, `Trigger`, `TypeID`) VALUES
(1, 'Age', 'Predefined field choices will only allow integers to be inserted', 0, 0, '', 1),
(2, 'Gender', 'If Patient is a male or female', 0, 0, '', 2),
(3, 'Ethnicity', 'Patient''s race', 0, 0, '', 1),
(4, 'Which ear is being treated for this event?', 'Indicates which ear the patient wishes to treat.', 0, 0, '', 2),
(5, 'What type of implant?', 'Indicates what type of implant the patient wants', 0, 0, '', 2),
(6, 'Define non-treated ear', 'What type of implant does the ear have if any?', 0, 0, '', 3),
(7, 'Body Mass Index (BMI)', 'Predefined field choices will only allow numbers rounded to 1 decimal point  to be inserted.', 0, 0, '', 1),
(8, 'Cause of Deafness', 'One of the described causes of deafness must be chosen. If the patient''s cause of deafness is not listed, the choice "Other" may be selected. If "Other" is selected, the cause of deafness should be free texted into the space provided.', 0, 0, 'Other', 3),
(9, 'Duration of Deafness', 'If the duration of deafness is less than one year, "<1" should be selected. Otherwise, predefined field choices will only allow integers to be inserted. Example: When did patient stop talking on telephone, or when did patient stop benefitting from hearing aids.', 0, 0, '', 1),
(10, 'History of Chronic Mastoiditis', 'If the patient has been treated in the past for  chronic mastoiditis "Yes" should be selected. Otherwise, "No" is the correct choice.', 0, 0, '{"yes":11}', 2),
(11, 'Which ear?', 'Predefined field choices will only allow "Left", "Right" or "Both" to be inserted.', 10, 0, '', 2),
(12, 'History of Previous Ear Surgery', 'Predefined field choices will allow "Yes" or "No"', 0, 0, '{"yes":[13,14]}', 2),
(13, 'If there is a history of ear surgery, which side?', 'Prefefined field choices will allow "Left", "Right" or "Both"', 12, 0, '', 2),
(14, 'For each previous ear surgery, please list the date (MM/YYYY), side and type of surgery performed', 'All previous ear surgeries should be listed. The month and year (in MM/YYYY format) should be listed first. Second, the side should be listed, followed by the type of surgery. If the type of surgery performed is not included in a predefined answer field, "Other" should be selected and the type of surgery should be free-texted. List mulitple surguries on same date as seperate events.', 12, 0, '', 8),
(15, 'Is there is history of vertigo within the last 6 months?', 'Predefined field choices will only allow "Yes" or "No"', 0, 0, '', 2),
(16, 'Which ear is the better hearing ear?', 'Predefined field choices will only allow "Left", "Right" or "Neither"', 0, 0, '', 2),
(17, 'Please list the LEFT ear exam findings', 'The exam findings should be listed. All thay apply may be selected. If the finding does not exist in the predefined choices, "Other" should be used. The finding should then be free texted.', 0, 0, 'Other', 3),
(18, 'Please list the RIGHT ear exam findings', 'The exam findings should be listed. All thay apply may be selected. If the finding does not exist in the predefined choices, "Other" should be used. The finding should then be free texted.', 0, 0, 'Other', 3),
(19, 'Was a PneumoVax \\copy Given?', 'Predefined field choices only allow "Yes" or "No". CDC recommends PneumoVax and Prevnar vaccination before cochlear implantation. Ask about hyper link.', 0, 0, '{"yes":20}', 2),
(20, 'Date Given', 'Date the PneumoVax was given to patient', 19, 0, '', 4),
(21, 'Is the patient a current tobacco user?', 'Predefined field choices only allow "Yes" or "No".', 0, 0, '', 2),
(22, 'Is there a history of Diabetes Mellitus (type I or type II)?', 'Predefined field choices only allow "Yes" or "No".', 0, 0, '', 2),
(23, 'Was a CT scan of the temporal bones performed?', 'Predefined field choices only allow "Yes" or "No".  If a CT scan is performed, it should be a thin slice CT of the temporal bones, without IV contrast.', 0, 1, '{"yes":[24,25,26,27,28]}', 2),
(24, 'On the CT scan, was the course of the facial nerve normal in the ear to be implanted?', 'Predefined answer choices should be "Yes" or "No". If no CT scan was obtained, select "N/A".', 23, 1, '', 2),
(25, 'On the CT scan, was the mastoid/middle ear aerated on the ear to be implanted?', 'Predefined answer choices should be "Yes" or "No". If no CT scan was obtained, select "N/A". If the mastoid or middle ear is partially or totally opacified, select "No".', 23, 1, '', 2),
(26, 'On the CT scan, was there any bony dehischence  (tegmen tympani or tegmen mastoideum) in the ear to be implanted?', 'Predefined answer choices should be "Yes" or "No". If no CT scan was obtained, select "N/A".', 23, 1, '', 2),
(27, 'On the CT scan, was the cochlea patent in the ear to be implanted?', 'Predefined answer choices should be "Yes" or "No". If no CT scan was obtained, select "N/A".', 23, 1, '', 2),
(28, 'On the CT scan, was the cochlea well partitioned in the ear to be implanted?', 'Predefined answer choices should be "Yes" or "No". If no CT scan was obtained, select "N/A".', 23, 1, '', 2),
(29, 'Was an MRI performed?', 'Predefined field choices only allow "Yes" or "No".  If an MRI scan is obtained, it should be an MRI of the brain/brainstem with and without gadolinium.', 0, 1, '{"yes":[30,31,32]}', 2),
(30, 'On the MRI, was the course of the facial nerve normal in the ear to be implanted?', 'Predefined answer choices should be "Yes" or "No". If no MRI scan was obtained, select "N/A".', 29, 1, '', 2),
(31, 'On the MRI scan, is there an adequate cochlear fluid signal in the ear to be implanted?', 'Predefined answer choices should be "Yes" or "No".If no MRI scan was obtained, select "N/A".', 29, 1, '', 2),
(32, 'On the MRI scan, is the 7th/8th nerve complex normal in the ear to be implanted?', 'Predefined answer choices should be "Yes" or "No". If no MRI scan was obtained, select "N/A".', 29, 1, '', 2),
(33, 'Was an ENG/VNG performed?', 'Predefined field choices only allow "Yes" or "No".', 0, 1, '{"yes":[34,35,36,37]}', 2),
(34, 'On the ENG/VNG, was there a caloric weakness (>20%)?', 'Predefined answer choices should be "Yes" or "No". If no ENG/VNG was obtained, select "N/A".', 33, 1, '', 2),
(35, 'If a caloric weakness was found on the ENG/VNG, which side was the weaker ear?', 'Predefined answer choices should be "Left" or "Right". If no ENG/VNG was obtained, select "N/A".', 33, 1, '', 2),
(36, 'Does the ENG/VNG suggest central causes of vertigo?', 'Predefined answer choices should be "Yes" or "No". If no ENG/VNG was obtained, select "N/A".', 33, 1, '', 2),
(37, 'Was the Dix-Hallpike normal?', 'Predefined answer choices should be "Yes" or "No". If no ENG/VNG was obtained, select "N/A".', 33, 1, '', 2),
(38, 'Date of Implanation', 'Answer should be listed in date format (MM/DD/YYYY).', 0, 2, '', 7),
(39, 'Which ear is implanted?', 'The predefined answer choices only allow "Right", "Left".', 0, 2, '', 2),
(40, 'This is the surgeon''s  (X)th implant', 'Please list how many CI surgeries for the surgeon this implantation represents. Please do not count surgeries during residency ,  fellowship, or when assisting the primary. Were you primary or not?', 0, 2, '', 4),
(41, 'Were preoperative antibiotics given?', 'Only "Yes" or "No" may be selected. In general, cefazolin (or other cephalosporin) should be given (clindamycin for penallergic patients).', 0, 2, '', 2),
(42, 'Was intraoperative NRT performed?', 'Only "Yes" or "No" may be selected. It is recommended that NRT be performed on all patients at the end of the procedure in the operating room.', 0, 2, '', 2),
(43, 'On the NRT, which (if any) electrodes did not respond?', 'Please list any electrodes that were not responding. If all electrodes responded, select "All electrodes responded".', 42, 2, 'Yes', 4),
(44, 'Was a Stenver''s view X-ray performed?', 'Only "Yes" or "No" may be selected. It is recommended that a Stenver''s view Xray be performed on all patients at the end of the procedure in the operating room.', 0, 2, '', 2),
(45, 'During surgery, was there a facial nerve injury?', 'Only "Yes" or "No" may be selected. Uncovering the fallopian canal (to expose nerve sheath) should not be counted as a nerve injury. Any other observed injury should be listed as a "Yes". Additionally, if no observed injury is noted intraoperativey, but the patient has a facial nerve weakness (after allowing time for local anesthesia to wear off), "Yes" should also be selected.', 0, 2, '', 2),
(46, 'During surgery, was there a CSF Leak', 'Only "Yes" or "No" may be selected. If the tegmen is removed to expose dura, a "No" should be selected. If the dura is violated in any way to expose CSF, a "Yes" should be selected.', 0, 2, '', 2),
(47, 'During surgery, were there any other intra operative complications?', 'If "Yes" is selected, please list any other complications.', 0, 2, 'Yes', 2),
(48, 'Date of activation', 'Answer should be listed in date format (MM/DD/YYYY).', 0, 2, '', 7),
(49, 'During the postoperative period, was there any wound infection?', 'Only "Yes" or "No" may be selected. List "Yes" if an infection requiring antibioitics occurs.', 0, 2, '', 2),
(50, 'During the postoperative period, was there any wound dehiscence?', 'Only "Yes" or "No" may be selected. The surgeon should use judgment determining what defines dehiscence. In general, any additional treatment (steristrips, wet-to-dry dressing, additional suture) would consistitue a dehiscence.', 0, 2, '', 2),
(51, 'During the postoperative period, was there any vertigo or dizziness?', 'Only "Yes" or "No" may be selected.  Any complaints by the patient of feeling disequilibrium, sense of motion or fall should be listed as a "Yes".', 0, 2, '', 2),
(52, 'If there was postoperative vertigo or dizziness, how many days until resolution?', 'Please list the number of days until the dizziness (if present) resolved.', 51, 2, 'Yes', 4),
(53, 'Please list the type of device that was implanted?', 'The model number of the implant device should be inserted.', 0, 2, '', 4);

-- --------------------------------------------------------

--
-- Table structure for table `UserLevels`
--

DROP TABLE IF EXISTS `UserLevels`;
CREATE TABLE IF NOT EXISTS `UserLevels` (
  `UserLevelID` int(8) NOT NULL,
  `Name` varchar(32) NOT NULL,
  `Description` varchar(128) NOT NULL,
  `Level` int(8) NOT NULL,
  PRIMARY KEY (`UserLevelID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `UserLevels`
--

TRUNCATE TABLE `UserLevels`;
--
-- Dumping data for table `UserLevels`
--

INSERT INTO `UserLevels` (`UserLevelID`, `Name`, `Description`, `Level`) VALUES
(1, 'Super User', 'Super access to all data.', 10),
(2, 'Administrator', 'Access to all data for one facility with all privileges.', 20),
(3, 'User', 'Insert and Edit access for one facility.', 30);

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
CREATE TABLE IF NOT EXISTS `Users` (
  `UserID` int(8) NOT NULL,
  `FacilityID` int(8) NOT NULL,
  `FirstName` varchar(64) NOT NULL,
  `LastName` varchar(64) NOT NULL,
  `Email` varchar(128) NOT NULL,
  `Title` int(8) NOT NULL,
  `UserLevelID` int(8) NOT NULL,
  `Password` varchar(128) NOT NULL,
  PRIMARY KEY (`UserID`,`FacilityID`),
  UNIQUE KEY `Email` (`Email`),
  KEY `FacilityID` (`FacilityID`),
  KEY `Title` (`Title`),
  KEY `fk_UserLevels` (`UserLevelID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `Users`
--

TRUNCATE TABLE `Users`;
--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`UserID`, `FacilityID`, `FirstName`, `LastName`, `Email`, `Title`, `UserLevelID`, `Password`) VALUES
(1, 1, 'Joe', 'Smith', 'joe.smith@gmail.com', 1, 1, '1ce54354d5c075e31ebca047479a24cb219fc7a2'),
(2, 1, 'Terry', 'Griffin', 'terry.griffin@mwsu.edu', 2, 1, 'a90933235fa081ca8d463dde04651a21e68bb7f0');

-- --------------------------------------------------------

--
-- Table structure for table `UsersTitles`
--

DROP TABLE IF EXISTS `UsersTitles`;
CREATE TABLE IF NOT EXISTS `UsersTitles` (
  `Title` int(11) NOT NULL,
  `Name` varchar(64) NOT NULL,
  `Abbreviation` varchar(32) NOT NULL,
  PRIMARY KEY (`Title`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `UsersTitles`
--

TRUNCATE TABLE `UsersTitles`;
--
-- Dumping data for table `UsersTitles`
--

INSERT INTO `UsersTitles` (`Title`, `Name`, `Abbreviation`) VALUES
(1, 'Medical Doctor', ' MD'),
(2, 'Licensed Vocational Nurse', 'LVN'),
(3, 'Registered Nurse', 'RN');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `AuditTrail`
--
ALTER TABLE `AuditTrail`
  ADD CONSTRAINT `audittrail_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`),
  ADD CONSTRAINT `audittrail_ibfk_2` FOREIGN KEY (`QuestionID`) REFERENCES `Questions` (`QuestionID`),
  ADD CONSTRAINT `fk_AuditTrail_ci_sessions1` FOREIGN KEY (`ci_sessions_session_id`) REFERENCES `ci_sessions` (`session_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `CareTeam`
--
ALTER TABLE `CareTeam`
  ADD CONSTRAINT `careteam_ibfk_1` FOREIGN KEY (`FacilityID`) REFERENCES `Facilities` (`FacilityID`),
  ADD CONSTRAINT `careteam_ibfk_2` FOREIGN KEY (`PatientID`) REFERENCES `Patient` (`PatientID`);

--
-- Constraints for table `ErrorLog`
--
ALTER TABLE `ErrorLog`
  ADD CONSTRAINT `errorlog_ibfk_1` FOREIGN KEY (`Level`) REFERENCES `ErrorLogLevels` (`Level`),
  ADD CONSTRAINT `errorlog_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`);

--
-- Constraints for table `EventAnswers`
--
ALTER TABLE `EventAnswers`
  ADD CONSTRAINT `eventanswers_ibfk_1` FOREIGN KEY (`QuestionID`) REFERENCES `Questions` (`QuestionID`),
  ADD CONSTRAINT `eventanswers_ibfk_2` FOREIGN KEY (`EventID`) REFERENCES `Events` (`EventID`);

--
-- Constraints for table `EventAnswersOther`
--
ALTER TABLE `EventAnswersOther`
  ADD CONSTRAINT `eventanswersother_ibfk_1` FOREIGN KEY (`QuestionID`) REFERENCES `Questions` (`QuestionID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `eventanswersother_ibfk_2` FOREIGN KEY (`EventID`) REFERENCES `Events` (`EventID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `Events`
--
ALTER TABLE `Events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`FacilityID`) REFERENCES `Facilities` (`FacilityID`),
  ADD CONSTRAINT `events_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`),
  ADD CONSTRAINT `events_ibfk_3` FOREIGN KEY (`PatientID`) REFERENCES `Patient` (`PatientID`);

--
-- Constraints for table `Facilities`
--
ALTER TABLE `Facilities`
  ADD CONSTRAINT `facilities_ibfk_1` FOREIGN KEY (`TypeID`) REFERENCES `FacilityTypes` (`TypeID`);

--
-- Constraints for table `Ion_login_attempts`
--
ALTER TABLE `Ion_login_attempts`
  ADD CONSTRAINT `ion_login_attempts_ibfk_1` FOREIGN KEY (`id`) REFERENCES `Ion_users` (`id`);

--
-- Constraints for table `MenuContents`
--
ALTER TABLE `MenuContents`
  ADD CONSTRAINT `fk_MenuID` FOREIGN KEY (`MenuID`) REFERENCES `Menus` (`MenuID`),
  ADD CONSTRAINT `menucontents_ibfk_1` FOREIGN KEY (`UserLevelID`) REFERENCES `UserLevels` (`UserLevelID`);

--
-- Constraints for table `QuestionAnswerChoices`
--
ALTER TABLE `QuestionAnswerChoices`
  ADD CONSTRAINT `questionanswerchoices_ibfk_1` FOREIGN KEY (`QuestionID`) REFERENCES `Questions` (`QuestionID`);

--
-- Constraints for table `QuestionGroups`
--
ALTER TABLE `QuestionGroups`
  ADD CONSTRAINT `questiongroups_ibfk_1` FOREIGN KEY (`QuestionID`) REFERENCES `Questions` (`QuestionID`),
  ADD CONSTRAINT `questiongroups_ibfk_2` FOREIGN KEY (`GroupID`) REFERENCES `Groups` (`GroupID`);

--
-- Constraints for table `Questions`
--
ALTER TABLE `Questions`
  ADD CONSTRAINT `fk_TypeID` FOREIGN KEY (`TypeID`) REFERENCES `QuestionAnswerTypes` (`TypeID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `Users`
--
ALTER TABLE `Users`
  ADD CONSTRAINT `fk_UserLevels` FOREIGN KEY (`UserLevelID`) REFERENCES `UserLevels` (`UserLevelID`),
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`FacilityID`) REFERENCES `Facilities` (`FacilityID`),
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`Title`) REFERENCES `UsersTitles` (`Title`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
