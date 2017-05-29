<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;


class AdminLoginController extends Controller
{

    public function __construct()
    {

        $this->middleware('guest:admin');
    }

    public function showLoginForm()
    {
        return view('auth.admin-login');
    }

    function debug_to_console( $data ) {
        $output = $data;
        if ( is_array( $output ) )
            $output = implode( ',', $output);

        echo "<script>console.log( 'Debug Objects: " . $output . "' );</script>";
    }

    public function login(Request $request){


        $this->validateLogin($request);

        if ($this->attemptLogin($request)){
            return redirect()->intended(route('admin.dashboard'));
        }

        return redirect()->back();

    }



    protected function validateLogin(Request $request)
    {
        $this->validate($request, [
            $this->username() => 'required|string',
            'password' => 'required|string',
        ]);

    }

    protected function credentials(Request $request)
    {
        return $request->only($this->username(), 'password');
    }

    protected function attemptLogin(Request $request)
    {
        return Auth::guard('admin')->attempt(['email'=> $request->email,'password'=> $request->password],$request->remember);
    }

//    public function has($key)
//    {
//        $keys = is_array($key) ? $key : func_get_args();
//
//        foreach ($keys as $value) {
//            if ($this->isEmptyString($value)) {
//                return false;
//            }
//        }
//
//        return true;
//    }


    public function username()
    {
        return 'email';
    }

    protected function guard()
    {
        return Auth::guard('admin');
    }

//    protected function isEmptyString($key)
//    {
//        $value = $this->input($key);
//
//        return ! is_bool($value) && ! is_array($value) && trim((string) $value) === '';
//    }





}
