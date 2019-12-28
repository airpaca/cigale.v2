<!-- Doctype HTML5 -->
<!DOCTYPE html>
<html lang="en">
<html dir="ltr">
    <head>

        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="description" content="CIGALE - Méthanisation">
        <meta name="author" content="GERES | AtmoSud">

        <title>CIGALE - Méthanisation</title>
        <!-- <link rel="icon" type="image/png" href="../../../img/icone.planetsearchg.png"> -->
        
        <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
            <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
        <![endif]-->     
        
    </head>

    <body>
        
        <div class="container-fluid bg-color-blue d-flex h-100 flex-column main-container">
            <?php include '../config.php'; ?>
            <?php include 'modal.php'; ?>
            <?php include 'modal.contact.php'; ?>
            <?php include 'nav.php'; ?>
            <!-- <div class="row bg-color-white flex-fill d-flex" style="height: 100vh; overflow: auto;"  id="main-row"></div>-->
            <div class="row bg-color-white flex-fill d-flex scroller" style="height: 100vh; overflow: auto;"  id="main-row"></div>
        <!-- flex-sm-row-reverse   flex-md-row-->
        </div>

        <!-- Libraries --> 
        <?php include 'sources.html'; ?>        

        <!-- App CSS  --> 
        <link href="style.css" rel="stylesheet">

        <!-- App scripts -->
        <script src="../lib/datablock.js"></script>
        <script src="../lib/select.js"></script>
        <script src="../lib/geoserver.js"></script>

        
        <!-- Main App -->
        <script src="app.js"></script>


        
    </body>
</html>
