<?php
  function mws_signed_request_report($region, $params)
{
    /*
    Copyright (c) 2011 Prabhjit Singh

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    DEALINGS IN THE SOFTWARE.
    */
    
    /*
    Parameters:
        $region - the Amazon(r) region (ca,com,co.uk,de,fr,jp)
        $params - an array of parameters, eg. array("Operation"=>"ItemLookup",
                        "ItemId"=>"B000X9FLKM", "ResponseGroup"=>"Small")
    */

    // some paramters
    $method = "POST";
    $host = "mws.amazonservices.".$region;
    $uri = "/Products/2011-10-01";
    
    // additional parameters
    //$params["Service"] = "AWSECommerceService";
    $params["AWSAccessKeyId"] = ACCESS_KEY_ID;
	$params["SignatureVersion"] = "2";
	$params["SignatureMethod"] = "HmacSHA256";
    // GMT timestamp
    $params["Timestamp"] = gmdate("Y-m-d\TH:i:s\Z");
    // API version
    $params["Version"] = "2011-10-01";
    
    // sort the parameters
    ksort($params);
    
    // create the canonicalized query
    $canonicalized_query = array();
    foreach ($params as $param=>$value)
    {
        $param = str_replace("%7E", "~", rawurlencode($param));
        $value = str_replace("%7E", "~", rawurlencode($value));
        $canonicalized_query[] = $param."=".$value;
    }
    //print_r($canonicalized_query);
    $canonicalized_query = implode("&", $canonicalized_query);
    
    // create the string to sign
    $string_to_sign = $method."\n".$host."\n".$uri."\n".$canonicalized_query;
    
    // calculate HMAC with SHA256 and base64-encoding
    $signature = base64_encode(hash_hmac("sha256", $string_to_sign,SECRET_ACCESS_KEY, True));
    
    // encode the signature for the request
    $signature = str_replace("%7E", "~", rawurlencode($signature));
    
    // create request
    $request = "https://".$host.$uri.'?'.$canonicalized_query."&Signature=".$signature;
    //echo $request;
    
    $response = '';
    $response = getProcess($request);
            
    if ($response === False)
    {
        return False;
    }
    else
    {
        // parse XML
        
        if ($response === False)
        {
            return False; // no xml
        }
        else
        {
            return $response;
        }
    }
}

function getProcess($uri) {

 
 $userAgent = constructUserAgentHeader('fupload','build1');
 
 
 $header = array("Content-Type: text/tab-separated-values; charset=iso-8859-1","Host: mws.amazonservices.com","Transfer-Encoding: chunked");

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $uri);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_VERBOSE, 1);
  curl_setopt($ch, CURLOPT_HEADER, 0);
  curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_USERAGENT, $userAgent);
  $html = curl_exec($ch);
  
  if(curl_errno($ch))
	{
    		echo 'error:' . curl_error($ch);
		getProcess($uri);
	}	
  curl_close($ch); 
  return $html;
}


function constructUserAgentHeader($applicationName, $applicationVersion, $attributes = null) {

         
    $userAgent = '<' . $applicationName
        . '>/<'
        . $applicationVersion .'>';

    $userAgent .= ' (';

    $userAgent .= 'Language=PHP/' . phpversion();
   
    $userAgent .= ')';
   
    return $userAgent;
  }

?>  
