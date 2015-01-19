<?php
/**
 * CodeIgniter
 *
 * An open source application development framework for PHP 5.2.4 or newer
 *
 * NOTICE OF LICENSE
 *
 * Licensed under the Academic Free License version 3.0
 *
 * This source file is subject to the Academic Free License (AFL 3.0) that is
 * bundled with this package in the files license_afl.txt / license_afl.rst.
 * It is also available through the world wide web at this URL:
 * http://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to obtain it
 * through the world wide web, please send an email to
 * licensing@ellislab.com so we can send you a copy immediately.
 *
 * @package		CodeIgniter
 * @author		EllisLab Dev Team
 * @copyright	Copyright (c) 2008 - 2013, EllisLab, Inc. (http://ellislab.com/)
 * @license		http://opensource.org/licenses/AFL-3.0 Academic Free License (AFL 3.0)
 * @link		http://codeigniter.com
 * @since		Version 1.0
 * @filesource
 */
defined('BASEPATH') OR exit('No direct script access allowed');
?><!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <title><?php echo $PageLogo; ?></title>

    <script src="<?php echo asset_url();?>modern-business/js/jquery-1.10.2.js"></script>
    
    <!-- Bootstrap core CSS -->
    <link href="<?php echo asset_url();?>modern-business/css/bootstrap.css" rel="stylesheet">

    <!-- Add custom CSS here -->
    <link href="<?php echo asset_url();?>modern-business/css/modern-business.css" rel="stylesheet">
    <link href="<?php echo asset_url();?>modern-business/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <?php
    foreach($Includes as $Include){
        echo $Include."\n\t";
    }
    ?>
</head>

<body>

    <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="Home">
                <img src="<?php echo asset_url();?>images/AIILogoLight2.png" height="100px"></a>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse navbar-ex1-collapse">
                <ul class="nav navbar-nav navbar-right">
                    <?php
                    foreach($Menu['Navigation'] as $Link){
                        if(!array_key_exists('subMenu',$Link)){
                            echo'<li><a href="'.$Link['URI'].'">'.$Link['Label'].'</a></li>';
                        }else{
                            echo'<li class="dropdown">';
                                echo'<a href="#" class="dropdown-toggle" data-toggle="dropdown">'.$Link['Label'].' <b class="caret"></b></a>';
                                echo'<ul class="dropdown-menu">';
                                    foreach($Link['subMenu'] as $SubMenu){
                                        echo'<li><a href="'.$SubMenu['URI'].'">'.$SubMenu['Label'].'</a>';
                                        echo'</li>';
                                    }
                                echo'</ul>';
                            echo'</li>';
                        }
                    }
                    ?>
                    <li><a href="Editor"><i class="fa fa-pencil-square-o"></i> Edit</a></li>
                </ul>
            </div>
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container -->
    </nav>

    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <?php
                //total hack
                if($BreadCrumbName != 'Editor'){
                    echo"
                <ol class=\"breadcrumb\">
                    <li><a href=\"Home\">Home</a>
                    </li>
                    <li class=\"active\">{$BreadCrumbName}</li>
                </ol>";
                }
                ?>
                <h1 class="page-header"> <?php echo $BodyTitle['Big'];?> <small> <?php echo $BodyTitle['Small'];?> </small> </h1>

            </div>

        </div>
        <div class="row">
            <div class="col-lg-12">
