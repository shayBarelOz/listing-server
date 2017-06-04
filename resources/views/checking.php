<!DOCTYPE html>
<html  ng-app="myApp" lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href ="bower_components/bootstrap/dist/css/bootstrap.css" >
    <script type="text/javascript" src="bower_components/angular/angular.min.js"></script>
    <script type="text/javascript" src="bower_components/angular-route/angular-route.min.js"></script>
    <script type="text/javascript" src="bower_components/angular-cookies/angular-cookies.min.js"></script>
<!--    <script type="text/javascript" src="js/app.js"></script>-->
<!--    <script type="text/javascript" src="js/userController.js"></script>-->
    <title>Title</title>
</head>
<body >

<div ng-controller="userController">

    First Name: <input type="text"><br>
    Last Name: <input type="text"><br>
    <br>
    Full Name: {{firstName + " " + lastname}}

</div>


</body>



</html>