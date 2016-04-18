<?php

if( isset($_POST['query']) && !empty($_POST['query']) ) {

      header('Content-Type: application/json');

      $url = "http://localhost:9200/topbeat-*/_search";

      $fields_string = $_POST['query'];  

      //open connection
      $ch = curl_init();

      //set the url, number of POST vars, POST data
      curl_setopt($ch,CURLOPT_URL, $url);
      curl_setopt($ch,CURLOPT_POST, 1);
      curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);

      //execute post
      $result = curl_exec($ch);

      //close connection
      curl_close($ch);

}