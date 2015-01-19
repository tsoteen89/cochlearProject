<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <title><?php echo $PageLogo; ?></title>

    <!-- Bootstrap core CSS -->
    <link href="<?php echo asset_url();?>/modern-business/css/bootstrap.css" rel="stylesheet">

    <!-- Add custom CSS here -->
    <link href="<?php echo asset_url();?>/modern-business/css/modern-business.css" rel="stylesheet">
    <link href="<?php echo asset_url();?>/modern-business/font-awesome/css/font-awesome.min.css" rel="stylesheet">
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

    <div id="myCarousel" class="carousel slide">
        <!-- Indicators -->
        <ol class="carousel-indicators">
            <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
            <li data-target="#myCarousel" data-slide-to="1"></li>
            <li data-target="#myCarousel" data-slide-to="2"></li>
        </ol>

        <!-- Wrapper for slides -->
        <div class="carousel-inner">
            <div class="item active">
                <div class="fill" style="background-image:url('<?php echo asset_url();?>images/Hear_spectrum.png');"></div>
                <div class="carousel-caption" style="padding-bottom:200px">
                    <h1>Cutting Edge Technology</h1>
                </div>
            </div>
            <div class="item">
                <div class="fill" style="background-image:url('<?php echo asset_url();?>images/collage_big2.png');"></div>
                <div class="carousel-caption" style="padding-bottom:200px">
                    <h1>Give Better Care to Your Patients</h1>
                </div>
            </div>
            <div class="item">
                <div class="fill" style="background-image:url('<?php echo asset_url();?>images/research_network.jpg');"></div>
                <div class="carousel-caption" style="padding-bottom:200px;padding-right:300px">
                    <h1><a href="#">Register Your Facility Today</a>
                    </h1>
                </div>
            </div>
        </div>

        <!-- Controls -->
        <a class="left carousel-control" href="#myCarousel" data-slide="prev">
            <span class="icon-prev"></span>
        </a>
        <a class="right carousel-control" href="#myCarousel" data-slide="next">
            <span class="icon-next"></span>
        </a>
    </div>
