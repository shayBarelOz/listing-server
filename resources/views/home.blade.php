@extends('layouts.app')

@section('content')


    @include('checking')


    <link rel="stylesheet" type="text/css" href ="{{asset('bower_components/bootstrap/dist/css/bootstrap.css')}}" >

    <div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Dashboard</div>

                <div class="panel-body">
                    You are logged in!
                </div>
            </div>
        </div>
    </div>

        {{--<script type="text/javascript" src="{{asset('bower_components/angular/angular.min.js')}}"></script>--}}
        {{--<script type="text/javascript" src="{{asset('bower_components/angular-route/angular-route.min.js')}}"></script>--}}
        {{--<script type="text/javascript" src="{{asset('bower_components/angular-cookies/angular-cookies.min.js')}}"></script>--}}
        {{--<script type="text/javascript" src="{{asset('js/app.js')}}"></script>--}}
        {{--<script type="text/javascript" src="{{asset('js/controllers.js')}}"></script>--}}


        {{--<div ng-controller="userController">--}}

            {{--First Name: <input type="text"><br>--}}
            {{--Last Name: <input type="text"><br>--}}
            {{--<br>--}}
            {{--Full Name: {{firstName + " " + lastname}}--}}

        {{--</div>--}}
    {{----}}



    </div>
@endsection
