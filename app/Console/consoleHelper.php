<?php
/**
 * Created by PhpStorm.
 * User: shaybar-elozana
 * Date: 28/05/2017
 * Time: 3:28
 */

namespace App\Console;


class consoleHelper
{

    public static function debug_to_console( $data ) {
        $output = $data;
        if ( is_array( $output ) )
            $output = implode( ',', $output);

        echo "<script>console.log( 'Debug Objects: " . $output . "' );</script>";
    }

}