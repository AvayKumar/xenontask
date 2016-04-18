
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>System Metrics</title>

    <!-- Bootstrap core CSS -->
    <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <script src= "https://cdn.zingchart.com/zingchart.min.js"></script>
    <script> zingchart.MODULESDIR = "https://cdn.zingchart.com/modules/";</script>
  </head>

  <body>
    <nav class="navbar navbar-inverse">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">System Metrics</a>
        </div>
      </div>
    </nav>
    <div class="container">

      <div class="row">
        <div class="col-xs-12" id='loadChart'></div>  
      </div>
      <div class="row">
        <h3 class="text-center">CPU load</h3>
        <table class="table table-responsive" style="margin:0 0 50px 0">
          <head>
            <tr>
              <th>Average cpu.user_p</th>
              <th>Average cpu.sysetm_p</th>
              <th>Average mem.total</th>
               <th>Average mem.used</th>
              <th>Average mem.used_p</th>
              <th>Average mem.free</th>
            </tr>
          </head>
          <tbody id="cpuData">
          </tbody>
          <footer>
            <tr>
              <th>Average cpu.user_p</th>
              <th>Average cpu.sysetm_p</th>
              <th>Average mem.total</th>
               <th>Average mem.used</th>
              <th>Average mem.used_p</th>
              <th>Average mem.free</th>
            </tr>
          </footer>      
        </table>
      </div>

      <div class="row">
        <h3 class="text-center">Top Process statistics</h3>
        <table class="table table-responsive" style="margin:0 0 50px 0">
          <head>
            <tr>
              <th>proc.name</th>
              <th>proc.cpu.user_p</th>
              <th>proc.mem.rss</th>
              <th>proc.mem.rss_p</th>
              <th>proc.mem.share</th>
            </tr>
          </head>
          <tbody id="processData">
          </tbody>
          <footer>
            <tr>
              <th>proc.name</th>
              <th>proc.cpu.user_p</th>
              <th>proc.mem.rss</th>
              <th>proc.mem.rss_p</th>
              <th>proc.mem.share</th>
            </tr>
          </footer>      
        </table>
      </div>

    </div> <!-- /container -->

  <script type="text/javascript" src="js/jquery-2.2.3.min.js"></script>
  <script type="text/javascript" src="js/data_loader.js"></script>

  </body>
</html>
