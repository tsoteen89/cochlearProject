            </div>

        </div>
        <!-- /.row -->

    </div>
    <!-- /.container -->
    <div class="container">

        <hr>

        <footer>
            <div class="row">
                <div class="col-lg-12">
                    <p>Copyright &copy; Company 2014</p>
                </div>
            </div>
        </footer>

    </div>
    <!-- /.container -->

    <!-- JavaScript -->
    <script src="<?php echo asset_url();?>modern-business/js/bootstrap.js"></script>
    <script src="<?php echo asset_url();?>modern-business/js/modern-business.js"></script>
    <script type="/text/javascript" src="<?php echo asset_url();?>retinajs/src/retina.js"></script>
    <?php
    foreach($Includes as $Include){
        echo $Include."\n\t";
    }
    ?>
</body>

</html>
