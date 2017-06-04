/**
 * Created by shaybar-elozana on 01/06/2017.
 */

// var app = angular.module("myApp2",[]);
//
// app.controller("userController", function($scope) {
//     $scope.firstName = "John";
//     $scope.lastName = "Doe";
// });
// var myApp = angular.module('myApp', []); //['ngRoute,ngCookies']

// (function(app){
//     "use strict";
//     app.controller("userController", function($scope, $http){
//         // $http.get('data/data.json').then(function(prd){
//         //     $scope.prd = prd.data;
//         // });
//         $scope.firstName = "John";
//         $scope.lastname = "Doe";
//
//     });
// })(myApp);

    myApp.controller("userController", function($scope, $http){
        // $http.get('data/data.json').then(function(prd){
        //     $scope.prd = prd.data;
        // });
        $scope.firstName = "Shay";
        $scope.lastname = "Doe";

    });
