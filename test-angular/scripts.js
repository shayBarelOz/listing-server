(function(){
    var myListingTool = angular.module('myListingTool',[]);
    
    myListingTool.controller('mylistingController',['$compile','$scope','$http','$window','listingService','$interval','$filter',function($compile,$scope,$http,$window,listingService,$interval,$filter){
        
        $scope.tabledata = [];
        $scope.resultdata = [];
        $scope.batchdata =[];
        $scope.status=0;
        $scope.ebayprocessingStatus=0;
        $scope.amazonprocessingStatus=0;
        $scope.fbaprocessingStatus=0;
        todaydate = new Date(); 
        $scope.dateAsString = 'FBA-' + $filter('date')(todaydate, "yyyy-MMM-dd HH:mm");
        $scope.batchdata.new_batchid = $scope.dateAsString
        
        
        $scope.getShipids = function(ship_ids){
            return ship_ids.replace(', ','').replace(' ,','').split(' ');
        }
        
        $scope.getBatch = function(){
           $http.get("getBatch.php")
                .then(function(response) {
                    $scope.batchdata.availableOptions = response.data;
            });
        }
        
        $scope.windowOpen = function(){
            if($scope.batchdata.batch_id == undefined) {
            alert("Please Select the Batch to Process");
            return;
           }
            $window.open('readytoprocessItems.php?bid=' + $scope.batchdata.batch_id);
        }
        
        $scope.hideBatch = function(){
           var bid = $scope.batchdata.batch_id;
           if(bid == undefined) {
            alert("Please Select the Batch to Close");
            return;
           }
           $http.get("hideBatch.php?bid=" + bid)
                .then(function(response) {
                    $scope.myWelcome = response.data;
                    $scope.getlistitems(); 
            });
        }
        
        
        $scope.updateQty = function(asin,qty){
           
           if (confirm("Are you sure to update Quantty")){
           
           var bid = $scope.batchdata.batch_id;
           if(bid == undefined || bid == '') {
            alert("Please Select the Batch to Update");
            return;
           }
           if(asin == undefined || asin == '') {
            alert("Please Select the ASIN to Update");
            return;
           }
           if(qty == undefined || qty == '' || qty < 1) {
            alert("Quantity must be above 0 to Update");
            return;
           }
           
           $http.get("updateqty.php?bid=" + bid + "&asin=" + asin + "&qty=" +qty)
                .then(function(response) {
                    $scope.myWelcome = response.data;
                    alert("Quantity of " + asin + " Updated with " + qty);
            });
            
           }
        }
        
        $scope.processItems = function(){
             $scope.ebayprocessingStatus=1;
             $scope.amazonprocessingStatus=1;
             $scope.fbaprocessingStatus=1;
            $http.get("createShipmentPlan.php?bid=" + $scope.batchdata.batch_id)
                .then(function(response) {
                    $scope.fbaprocessingStatus=0;
                    $scope.myWelcome = response.data;
                    $scope.showBatch();
            });
            $http.get("amazonUpload.php?bid=" + $scope.batchdata.batch_id)
                .then(function(response) {
                    $scope.amazonprocessingStatus=0;
                    $scope.myWelcome = response.data;
                    $scope.showBatch();
            });
            $http.get("ebaylib/ebayUpload.php?bid=" + $scope.batchdata.batch_id)
                .then(function(response) {
                    $scope.ebayprocessingStatus=0;
                    $scope.myWelcome = response.data;
                    $scope.showBatch();
            });
        }
        
        $scope.showProducts = function(shipid){
            $scope.ship_id = shipid;
            listingService.listShipmentItems(shipid)
              .then(
                  function( itemList ) {
                      
                   if (itemList == 'null') {
                        $scope.shipmentdata = [];  
                      } else  {
                        $scope.shipmentdata = itemList;
                      }    
                  }
             );
            $('#portfolioModal1-2').modal('show');
        }
        
         $scope.getproducts = function(){
          var bid = $scope.batchdata.batch_id;      
          listingService.listAsin(bid)
              .then(
                  function( itemList ) {
                      
                   if (itemList == 'null') {
                        $scope.tabledata = [];  
                      } else  {
                        $scope.tabledata = itemList;
                      }    
                  }
              );
         }
    
        $scope.getlistitems = function(){
              
          listingService.listItems()
              .then(
                  function( itemList ) {
                      
                   if (itemList == 'null') {
                        $scope.resultdata = [];  
                      } else  {
                        $scope.resultdata = itemList;
                      }    
                  }
              );
         }
         
         $scope.showBatch = function(){
            var bid = $scope.batchdata.batch_id;
           // alert(bid);
           $interval.cancel(timer2);
          listingService.listBatchItems(bid)
              .then(
                  function( itemList ) {
                      
                   if (itemList == 'null') {
                        $scope.resultdata = [];  
                      } else  {
                        $scope.resultdata = itemList;
                      }    
                  }
              );
         }
         
         $scope.addNewBatch = function(){
            var bid = $scope.batchdata.new_batchid;
            if(bid == '' || bid.length < 3) {
                alert("Batch name cannot be empty");
                return;
            }
            $scope.batchdata.availableOptions = $scope.batchdata.availableOptions.concat([{id : bid,name:bid}]);
            $('#batch_list').val(bid);
            $scope.batchdata.batch_id = bid;
            
         }
        
        $scope.refreshBatch = function(){
           var timer2=$interval(function(){
                 $scope.getlistitems(); 
                },2000); 
        }
         
        var timer=$interval(function(){
         $scope.getproducts(); 
        },2000);
        
        var timer2=$interval(function(){
         $scope.getlistitems(); 
        },2000);
        
        var timer4=$interval(function(){
         $http.get("getStatus.php")
                .then(function(response) {
                    $scope.status = response.data;
            }); 
        },2000);
        
        $scope.asinRemove = function(asin){
                alert(asin);
	  			$.ajax({
		    	type : "GET",
				dataType : 'html',
				url :  'remove.php?a=' + asin ,
			    success : function(response){
			    	  $scope.setAlert('alert-success','<strong>Success</strong> Remove Successfully !');
			    	  $scope.getproducts();
		 		}});
  		}
  		
  		$scope.printBarcode = function(asin){
               if(asin=='getasin'){
                  asin = $('#asin-upc').val();
                  color = $('#color').val();
                  model = $('#modelno').val();
                  size = $('#size').val();
                  upc = $('#upc-ean').val();
               }  else {
                   asin = '';
               }		    
  		    
  		       if(asin != undefined && asin != '' && asin.length >= 10){
	  			window.open("http://54.205.55.110/listing/barcode/barcode.php?asin=" + asin + '&c=' + color + '&m=' + model + '&s=' + size + '&u=' + upc);
  		       } else {
  		           alert('Passed ASIN is not Valid');
  		       }
  		}
  		
  		$scope.uploadFile = function(){
            var file = $scope.myFile;
            console.log('file is ' );
            console.dir(file);
    
            var uploadUrl = "fileupload.php";
            var text = $scope.name;
            listingService.uploadFileToUrl(file, uploadUrl, text)
            .then(function(response){
                $scope.readCSV();
            });
       };
  		
  		$scope.processFile = function(){
           alert($scope.batchdata.batch_id);
           $http.get("processExcelFile.php?b="+$scope.batchdata.batch_id)
                .then(function(response) {
                    alert('Data Processed');
            });
       };
  		
  		$scope.clearFields = function() {
  		    $('#ebay_category').val(0);
  		    $('input[type=text], textarea').val('');
  		    $('#errordiv').fadeOut(1000);
  		    $('#images_preview').html('<img alt="Bootstrap Image Preview" src="http://lorempixel.com/140/140/" class="img-thumbnail">');
  		    $('#amazonlink').html('');
  		    $('#item_condition').val(0);
  		    $('#asin-upc').focus();
  		}
  		
  		$scope.totalqty = function(){
  		    
  		    var total = 0;
  		    angular.forEach($scope.resultdata, function(x){
                  total = parseInt(total) + parseInt(x.qty);
                })
             return total;
  		    
  		}
  		
  		$scope.totalqtypending = function(){
  		    
  		    var total = 0;
  		    angular.forEach($scope.tabledata, function(x){
                  total = parseInt(total) + parseInt(x.qty);
                })
             return total;
  		    
  		}
  		
  		$scope.asinRefresh = function(asin,reset){
            reset = reset == null ? 1 : reset;
            asin = asin == null ? 1 : asin;
            alert(asin);
	  			$.ajax({
                type : "GET",
                dataType : 'html',
                url :  'refresh.php?a=' + asin + + "&rset=" + reset  + "&batchId=" + $scope.batchdata.batch_id,
                success : function(response){
			          location.href = "index.html?asin=" + asin + "&batchId=" + $scope.batchdata.batch_id;
			    	  $scope.getproducts();
		 		}});
  		}
  		
  		$scope.setAlert = function(a,m){
  		    $('#e-message').html(m);
		    $('#errordiv').attr('class', 'alert').addClass(a).show().fadeOut(2000);
  		}
  		
  		$scope.pushtoQue = function(){
  			var jsonRes = [];
  			
  			 if($("#asin").val() == ''){
	  				$scope.setAlert('alert-warning','<strong>Warning</strong> Asin Not Available !');
	  				return;
  	    	 }
  	    	
  	    	if($("#batch_list").val() == '' || $("#batch_list").val() == undefined || $('#batch_list').val() == '? undefined:undefined ?'){
	  				$scope.setAlert('alert-warning','<strong>Warning</strong> Batch id Not Available !');
	  				return;
  	    	 }
  	    	
  			if($("#listEbay").is(":checked") == 1){
	  			if($("#ebay_category").val() < 1 || $("#ebay_category").val() == undefined) {
	  			    if($("#fixedPrice").is(":checked") || $("#auction").is(":checked")) { 
    	  				$scope.setAlert('alert-warning','<strong>Warning</strong> Ebay Category Missing !');
    	  				return;
	  			    }	
	  			}
  			}
  			
  			if($("#item_condition").val() < 1 || $("#item_condition").val() == undefined) {
	  				$scope.setAlert('alert-warning','<strong>Warning</strong> Item Condition Missing !');
	  				return;
	  		}
	  		
	  		if($("#item_condition").val() != 11 && $("#condition_notes").val() == '' ) {
	  				  $scope.setAlert('alert-warning','<strong>Warning</strong> Condition notes Missing !');
	  				  return;
	  		}
  			
  			if($("#listEbay").is(":checked")) {
	  			if($('input[name="selectedimage"]:checked').val() == '' || $('input[name="selectedimage"]:checked').val() == undefined) {
		            $scope.setAlert('alert-warning','<strong>Warning</strong> Main Image Missing !');
	  				return;
	  			}
  			}
  	
  			if($("#qty").val() < 1 || $("#qty").val() == '') {
  			    $scope.setAlert('alert-warning','<strong>Warning</strong> Quantity cannot less than 1 !');
  				return;
  			}
  			
  			if($("#title").val().length > 80  || $("#title").val() == '') {
  			    if($("#fixedPrice").is(":checked") || $("#auction").is(":checked")) { 
  			        $scope.setAlert('alert-warning','<strong>Warning</strong> Title length must be greater than 0 or less than 80 chars. !');
  			        return;
  			    }
  				
  			}
  			
  			if($("#msrp").val() < 1 || $("#msrp").val() == '') {
		        $scope.setAlert('alert-warning','<strong>Warning</strong> MSRP cannot less than $1 !');
  				return;
  			}
  			
  			if ($("#fixedPrice").is(":checked") || $("#auction").is(":checked")) {
  			    if(!$("#listEbay").is(":checked")) {
		            $scope.setAlert('alert-warning','<strong>Warning</strong> Please Click Checked on List on Ebay !');
	  				return;
  			    }
  			    if($("#upc-ean").val() == '' || $("#upc-ean").val().length < 11) {
		            $scope.setAlert('alert-warning','<strong>Warning</strong> Please Enter Valid UPC !' + $("#upc-ean").val().length);
	  				return;
  			    }
  			}
  			
  			if($("#auction").is(":checked")) {
  			    if ($("#listAmazon").is(":checked") || $("#amazonfba").is(":checked")) {
  			        $scope.setAlert('alert-warning','<strong>Warning</strong> Ebay auction cannot be with Amazon FBA/FBM !');
	  			    return;
  			        }
  			    }
  			
  			jsonRes.push({"asin":$('#asin').val(),"images":jsonimages,"title":$('#title').val(),"costprice":$("#costprice").val(),"mainprice":$("#msrp").val(),"qty":$("#qty").val(),"mainimg":$('input[name="selectedimage"]:checked').val(),"ebayCategory":$("#ebay_category").val(),"fixedPrice":$("#fixedPrice").is(":checked"),"auction":$("#auction").is(":checked"),"duration":$("#duration").val(),"amazonfba":$("#amazonfba").is(":checked"),"listAmazon":$("#listAmazon").is(":checked"),"listEbay":$("#listEbay").is(":checked"),"amazonImages":$("#amazonImages").is(":checked"),"localImages":$("#localImages").is(":checked"),"itemCondition":$("#item_condition").val(),"batchid":$("#batch_list").val(),"desc":$('#description').val(),"upc":$('#upc-ean').val(),"color":$('#color').val(),"modelno":$('#modelno').val(),"condition_notes":$('#condition_notes').val()});
  			$.ajax({
	    	type : "POST",
			dataType : 'html',
			data : {a:jsonRes},
			url :  'queasin.php',
		    success : function(response){
		          if (response == '') {
    		          $scope.setAlert('alert-success','<strong>Success</strong> Queued Successfully !');
    		          $scope.clearFields();
		          } else {
		              $scope.setAlert('alert-danger', response);
		          }
		    	  $scope.getproducts();
	 		}});
  		}
  		
  		$scope.readCSV = function() {
    		// http get request to read CSV file content
    		$http.get('uploadfile/products.txt').success($scope.processData);
    	};
    
    	$scope.processData = function(allText) {
    		// split content based on new line
    		var allTextLines = allText.split(/\r\n|\n/);
    		var headers = allTextLines[0].split(",");
    		var lines = [];
    
    		for ( var i = 0; i < allTextLines.length; i++) {
    			// split content based on comma
    			var data = allTextLines[i].split(',');
    			if (data.length == headers.length) {
    				var tarr = [];
    				for ( var j = 0; j < headers.length; j++) {
    					tarr.push(data[j]);
    				}
    				lines.push(tarr);
    			}
    		}
    		$scope.filedata = lines;
    	};

  		
  		
  	
      $scope.getproducts();
      $scope.getBatch()
      $scope.getlistitems();
      
      var timer3 = $interval(function(){
          if ($('#batch_list').val() == '' ) {
            $('#batch_list option:contains("Working")').prop("selected",true);
          }    
          if ($('#batch_list').val() != '? undefined:undefined ?'){
            $scope.batchdata.batch_id = $('#batch_list').val();
            $scope.showBatch();
          }
          $interval.cancel(timer3);
      },2000);
    }]);
    
    myListingTool.service('listingService',function($http,$q){
        
        this.listAsin = function(bid){
          var request = $http({
                        method: "get",
                        url: "listItems.php?bid=" + bid,
                        params: {
                            action: "get"
                        }
           });
          return( request.then( handleSuccess, handleError ) );
      }
       
      this.listItems = function(){
          var request = $http({
                        method: "get",
                        url: "listResultItems.php",
                        params: {
                            action: "get"
                        }
           });
          return( request.then( handleSuccess, handleError ) );
      }
      
      this.listBatchItems = function(bid){
          var request = $http({
                        method: "get",
                        url: "listResultItems.php?bid=" + bid,
                        params: {
                            action: "get"
                        }
           });
          return( request.then( handleSuccess, handleError ) );
      }
      
      this.listShipmentItems = function(sh_id){
          var request = $http({
                        method: "get",
                        url: "fba/listShipmentsItems.php?shipid=" + sh_id,
                        params: {
                            action: "get"
                        }
           });
          return( request.then( handleSuccess, handleError ) );
      }
      
      this.uploadFileToUrl = function(file, uploadUrl, name){
             var fd = new FormData();
             fd.append('file', file);
             fd.append('name', name);
             var request = $http.post(uploadUrl, fd, {
                 transformRequest: angular.identity,
                 headers: {'Content-Type': undefined,'Process-Data': false}
             });
            return( request.then( handleSuccess, handleError ) ); 
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
    
    myListingTool.directive('fileModel', ['$parse', function ($parse) {
        return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
    
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
       };
    }]);
    
})();