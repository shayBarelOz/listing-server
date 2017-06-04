(function(){
    var myFBAapp = angular.module('myFBAapp',[])
        .filter('split', function() {
            return function(input, splitChar, splitIndex) {
                // do some bounds checking here to ensure it has that index
                return input.split(splitChar)[splitIndex];
            }
        });
        
    myFBAapp.controller('fbaController',['$scope','$http','manageAsins',function($scope,$http,manageAsins){
        
        $scope.tabledata = [];
        $scope.asinSearch = '' ;
        $scope.itemizeddata = [];
        $scope.barcode = '';
        $scope.Math = window.Math;
        $scope.batchdata =[];
                         
      $scope.getproducts = function(){
          manageAsins.listAsin()
              .then(
                  function( itemList ) {
                      $scope.tabledata = itemList;
                  }
              );
      }
      
      $scope.getBatch = function(){
           $http.get("../getBatch.php")
                .then(function(response) {
                    $scope.batchdata.availableOptions = response.data;
            });
        }
    
      $scope.hideBatch = function(){
           var bid = $scope.batchdata.batch_id;
           if(bid == undefined) {
            alert("Please Select the Batch to Close");
            return;
           }
           $http.get("../hideBatch.php?bid=" + bid)
                .then(function(response) {
                    alert('We closed the batch no. ' + bid);
                    $scope.myWelcome = response.data;
            });
        }    
        
      $scope.onstatusChange = function(state){
         var batchid = $scope.batchdata.batch_id;
         console.log(batchid);
         if (batchid != undefined ) {
          manageAsins.listshipmentsIds(state,batchid)
              .then(
                  function( itemList ) {
                      $scope.itemIds = itemList;
                      $scope.ditemIds = Object.keys(itemList).map(function(key) {
                        return itemList[key];
                      });
                  }
              );
         } else {
             alert('Please Select the batch id');
         }      
              $scope.prepareShipment('');
      }
      
      $scope.getShipmentonly = function(){
          var asinupc =  $scope.asinSearch;
          //alert(asinupc);
          manageAsins.listshipmentforid(asinupc)
              .then(
                  function( itemList ) {
                      $scope.itemIds = itemList;
                      $scope.ditemIds = Object.keys(itemList).map(function(key) {
                        return itemList[key];
                      });
                  }
              );
      }
      
      
      $scope.getShipmentidonly = function(shipid,asiupc){
          var batchid = $scope.batchdata.batch_id;
          console.log(asiupc + ' >>>' + batchid);
          if(batchid == undefined ) {
             alert('Please Select the batch id');
             return;
          }
          manageAsins.listshipmentforupc(asiupc,batchid)
              .then(
                  function( itemList ) {
                      angular.forEach(itemList, function(value, key) {
                        //console.log(shipid + ' >>  ' + key + ' >> ' + value);
                        if($('#shipment_'+value).length>0) {
                            $('#found').get(0).play();
                            var scrollIndex = $('#move2_' + value).offset();
                            $("html, body").animate({scrollTop:(scrollIndex.top)},500,"linear");
                            $('#shipment_'+value).toggleClass('success');
                            $('#index_'+value).attr('color',"red");
                            $('#index_'+value).attr('size',"8px");
                            setTimeout(function(){
                                 // toggle back after 1 second
                                 $('#index_'+value).attr('size',"5px");
                                 $('#index_'+value).attr('color',"black");
                                 $('#shipment_'+value).toggleClass('success');  
                               },5000);
                        } else {
                            $scope.setAlert('alert-danger','<H2>Sorry </h2>: Item Not found in ALL Shipments !');
                            //alert('Item not found in this shipment');
                            $('#notfound').get(0).play();
            	  			return;
                        }
                  });
                 }
              );
      }
      
      $scope.prepareShipment = function(shipid) {
          var pressed = false; 
		    var chars = []; 
		    $(window).keypress(function(e) {
		        if ((e.which >= 48 && e.which <= 57) || (e.which >= 65 && e.which <= 90) || (e.which >= 97 && e.which <= 122)) {
		            chars.push(String.fromCharCode(e.which));
		        }
		        //console.log(e.which + ":" + chars.join("|"));
		        if (pressed == false) {
		            setTimeout(function(){
		                if (chars.length >= 10) {
		                    var barcode = chars.join("");
		                    console.log("Barcode Scanned: " + barcode);
		                    // assign value to some input (or do whatever you want)
		                    console.log(shipid + ' >>  ' + barcode);
		                   if(shipid == '') {
		                       //alert('alert barcode');
		                        $scope.getShipmentidonly(shipid, barcode);
		                   } else {
		                        //alert(shipid);
		                        $scope.searchKeyData(shipid, barcode);
		                   }
		                }
		                chars = [];
		                pressed = false;
		            },500);
		        }
		        pressed = true;
		    });
      }
      
      $scope.searchKeyData = function(shipid,barcode){
          
              var checkesistance = 0;
              angular.forEach($scope.itemizeddata, function(value, key) {
                if (barcode != '' && $scope.itemizeddata[key].upc.search(barcode) > -1) {
                    if(shipid != '') {
                        $scope.itemizeddata[key].checked = true;
                        $scope.itemizeddata[key].checkedqty = $scope.itemizeddata[key].checkedqty < $scope.itemizeddata[key].qty ? $scope.itemizeddata[key].checkedqty + 1 : $scope.itemizeddata[key].qty;
                        $('#found').get(0).play();
                        
                    } else {
                         alert('Found');
                     }
                   checkesistance = 1;
                } 
    
            });
          
        if(checkesistance === 0){
             $scope.setAlert('alert-danger','<h2>NOT FOUND</h2>: Item Not found in this Shipment !');
                //alert('Item not found in this shipment');
                $('#notfound').get(0).play();
	  			return;
        }
        $scope.$apply();
      }
      
      
      
      
      $scope.onshipmentChange = function(a){
         $scope.shipmentid = a;
          manageAsins.listItemIds(a)
              .then(
                  function( itemList ) {
                      $scope.itemizeddata = itemList;
                  }
              );
      }
      
      $scope.printBarcode = function(asin){
	  			if(asin != undefined && asin != '' && asin.length >= 10){
    	  			window.open("http://54.205.55.110/listing/barcode/barcode.php?asin=" + asin);
      		       } else {
      		           alert('Passed ASIN is not Valid');
  		       }
  	 }
  	 
  	 $scope.printBarcode2 = function(asin,t){
	  			if(asin != undefined && asin != '' && asin.length >= 10){
    	  			window.open("http://192.168.1.12/setfsku.php?code=" + asin + "&title=" + t);
      		       } else {
      		           alert('Passed ASIN is not Valid');
  		       }
  	 }
      
      $scope.createShipment = function(){
         location.replace("/listing/fba/reviewshiment.html");
         return;

          manageAsins.createshipment($scope.shipmentid)
              .then(
                  function( itemList ) {
                      $scope.onshipmentChange($scope.shipmentid);
                      window.location('/reviewshiment.html');
                  }
              );
      }
      
      $scope.updateItem = function(a){
         var b={};
            b[0] = a;
         manageAsins.updateShipment($scope.itemIds[$scope.shipmentid],b)
              .then(
                  function( ) {
                      $scope.onshipmentChange($scope.shipmentid);
                      $scope.onstatusChange('WORKING')
                  }
              );
      }
      
      $scope.deleteItem = function(a){
         var b={};
            b[0] = a;
         manageAsins.deleteShipment($scope.itemIds[$scope.shipmentid],b)
              .then(
                  function( ) {
                      $scope.onshipmentChange($scope.shipmentid);
                      $scope.onstatusChange('WORKING')
                  }
              );
      }
      
      $scope.setShipmentid = function(a) {
          manageAsins.setShipmentid(JSON.stringify(a));
          location.replace("/listing/fba/prepareshipment.html");
      }
      
      $scope.openShipmentid = function(a,b) {
          if(b >=1){
            var check = confirm('Please check FSKU printed');
              
          }
          
            window.open("https://sellercentral.amazon.com/gp/fba/inbound-shipment-workflow/index.html/ref=sm_fbaisw_name_fbasqs#" + a + "/prepare","_blank");
          
      }
      
      $scope.getShipmentid = function(a) {
         var data = JSON.parse(manageAsins.getShipmentid());
        
         $scope.shipment =  data;
         $scope.onshipmentChange(data.id);
      }
      
      $scope.addtoShipment = function(a){
          
          if($scope.shipmentid) {
             //alert($scope.shipmentid + ' for ' + JSON.stringify(a) + ' ' + JSON.stringify($scope.itemIds[$scope.shipmentid]));
             //return;
             manageAsins.updateShipment($scope.itemIds[$scope.shipmentid],a)
              .then(
                  function( ) {
                      $scope.onshipmentChange($scope.shipmentid)
                  }
              );
              
          } else {
            manageAsins.createShipmentPlan(a)
              .then(
                  function( newShipmentid ) {
                      $scope.onstatusChange('Plan');
                  }
              );
          }
         
      }
      
      $scope.getShippingAddress = function(){
          $scope.address = {'name':"G. Deals LLC",'addressline1':'20719 JAMAICA AVE','city':'QUEENS VILLAGE','state':'NY','zip':'11428-1544','country':'US'};
          /**
          manageAsins.getshippingaddress()
              .then(
                  function( itemList ) {
                      
                  }
              );
        **/      
      }
      $scope.getproducts();
      $scope.getShippingAddress();
      $scope.getBatch();
      
      $scope.setAlert = function(a,m){
  		    $('#e-message').html(m);
		    $('#errordiv').attr('class', 'alert').addClass(a).show().fadeOut(2000);
  		}
      
    }]);
  
   
  myFBAapp.service('manageAsins',function($http,$q){
      
      var currentshipmentid = {};
      
      this.listAsin = function(){
          var request = $http({
                        method: "get",
                        url: "getItems.php",
                        params: {
                            action: "get"
                        }
           });
          return( request.then( handleSuccess, handleError ) );
      }
      
      this.listshipmentsIds = function(a,b){
          var request = $http({
                        method: "get",
                        url: "listShipments.php?shipstatus=" + a + '&bid=' + b,
                        
           });
          return( request.then( handleSuccess, handleError ) );
      }
      
      this.listshipmentforid = function(a){
          var request = $http({
                        method: "get",
                        url: "listShipmentforid.php?upc=" + a,
                        
           });
          return( request.then( handleSuccess, handleError ) );
      }
      
      this.listshipmentforupc = function(a,b){
          var request = $http({
                        method: "get",
                        url: "listShipmentforupc.php?upc=" + a + '&bid=' + b,
                        
           });
          return( request.then( handleSuccess, handleError ) );
      }
      
      this.updateShipment = function(s,i){
          var request = $http({
                        method: "get",
                        url: "updateShipment.php",
                        params: {
                            s: s,
                            i: i
                        }
           });
          return( request.then( handleSuccess, handleError ) );
      }
      
      this.deleteShipment = function(s,i){
          var request = $http({
                        method: "get",
                        url: "deleteShipment.php",
                        params: {
                            s: s,
                            i: i
                        }
           });
          return( request.then( handleSuccess, handleError ) );
      }
      
      this.createShipmentPlan = function(i){
          var request = $http({
                        method: "get",
                        url: "createShipmentPlan.php",
                        params: {
                            i: i
                        }
           });
          return( request.then( handleSuccess, handleError ) );
      }
      
      this.createshipment = function(shipid){
          var request = $http({
                        method: "get",
                        url: "createShipment.php",
                        params: {
                            shipid: shipid
                        }
           });
          return( request.then( handleSuccess, handleError ) );
      }
      
      this.listItemIds = function(a){
          var request = $http({
                        method: "get",
                        url: "listShipmentsItems.php?shipid=" + a,
                        params: {
                            action: "get"
                        }
           });
          return( request.then( handleSuccess, handleError ) );
      }
      
      this.removeAsin = function(a){
          return a + " ASIN in Request";
      }
      
      this.searchAsin = function(a){
          return a + " ASIN in Request";
      }
      
      this.setShipmentid = function(shipid){
          localStorage.setItem('shipmentid',shipid);
      }
      
      this.getShipmentid = function(){
          return localStorage.getItem('shipmentid');
      }
      
      function handleError( response ) {
                    // The API response from the server should be returned in a
                    // nomralized format. However, if the request was not handled by the
                    // server (or what not handles properly - ex. server error), then we
                    // may have to normalize it on our end, as best we can.
                    if (
                        ! angular.isObject( response.data ) ||
                        ! response.data.message
                        ) {
                        return( $q.reject( "An unknown error occurred." ) );
                    }
                    // Otherwise, use expected error message.
                    return( $q.reject( response.data.message ) );
                }
                // I transform the successful response, unwrapping the application data
                // from the API response payload.
     
      function handleSuccess( response ) {
          return(response.data);
      }
      
  });
       
    
})();