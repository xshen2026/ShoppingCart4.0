define([
	'angular',
	'angular-ui-router',
	'draganddrop',
	'google-maps',
	'vs-google-autocomplete'
], function (angular, angularUiRouter, dragAndDrop, googleMaps, googleAutocomplete){
	var app = angular.module('ShoppingCart',['ui.router',/*'ngRoute',*/'vsGoogleAutocomplete','ngDragDrop']);
	app.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
		$stateProvider.
		  state('store',{
		  	url: '/store',
		  	templateUrl: 'partials/store.html',
		  	controller: 'CartController'
		  }).
		  state('shipping',{
		  	url: '/shipping/:subtotal?totalQuantity?totalWeight',	
		  	templateUrl:'partials/shipping.html',
		  	controller:'CartController'
		  });/*.
		  otherwise({
		  	redirectTo:'/store'
		  })*/
		  $urlRouterProvider.otherwise("store");
	}]);

	app.controller('CartController',['$scope', '$state','myService',/*'dataService',*/ 'shippingFee', function($scope, $state, myService,/*dataService,*/shippingFee){
		$scope.shippingMethods = ['Fast Shipping','Ground Shipping'];
		$scope.test = "abcdefg";
		$scope.fruits = [
			{
				name: 'banana',
				price: 0.49,
				quantity: 1,
				weight: 3,
				information: 'very fresh bananas',
				inCart: false
			},
			{
				name: 'apple',
				price: 2.99,
				quantity: 1,
				weight:2,
				information: 'Gala',
				inCart: false
			},
			{
				name: 'blueberry',
				price: 3.49,
				quantity: 1,
				weight: 4,
				information: 'farmers blueberry, member price',
				inCart:false
			}
		];
        $scope.cart = [
			{
				name: 'default',
				price: 0.00,
				quantity: 0,
				weight: 0,
				information: 'very fresh bananas',
				inCart: false
			}
		];
		/*$scope.addToCart = function(itemname) {
			for (var i = 0; i < $scope.fruits.length; i++) {
				if ($scope.fruits[i].name === itemname) {
					$scope.fruits[i].inCart = true;
					$scope.fruits[i].quantity = 1;
				}
			}
		};*/
		$scope.addToCart1 = function(itemname) {
			for (var i = 0; i < $scope.fruits.length; i++) {
				if ($scope.fruits[i].name === itemname) {

					$scope.cart.push($scope.fruits[i]);
					$scope.fruits.splice(i,1);
				}
			}
		};
		/*$scope.remove = function(itemname) {
			for(var i = 0; i < $scope.fruits.length; i++) {
				if ($scope.fruits[i].name === itemname) {
					$scope.fruits[i].inCart = false;
				}
			}
		};*/
		$scope.remove1 = function(itemname) {
			for (var i = 0; i < $scope.cart.length; i++) {
				if ($scope.cart[i].name === itemname) {
					$scope.cart[i].quantity = 1;
					$scope.fruits.push($scope.cart[i]);
					$scope.cart.splice(i,1);
				}
			}
		};
        /*----------------Caculate the subtotal and the total Quantity-------------------*/
		/*$scope.calculate = function() {
			var sum = 0;
			var sum1 = 0;
			var sum2 = 0;
			//alert('nima');
			for(var i = 0; i < $scope.fruits.length; i++) {
				if ($scope.fruits[i].inCart == true) {
					//alert('fruits[i].quantity');
					sum = sum + $scope.fruits[i].price * $scope.fruits[i].quantity;
					sum1 = sum1 +  $scope.fruits[i].quantity * 1;
					sum2 = sum2 + $scope.fruits[i].weight * $scope.fruits[i].quantity;
					//sum = sum.toFixed(2);
				}
			}
			//alert(sum1);
			$scope.subtotal = sum;
			dataService.subtotal = sum;
			$scope.totalQuantity = sum1;
			dataService.totalQuantity = sum1;
			$scope.totalWeight = sum2;
			dataService.totalWeight = sum2;
		};*/
		$scope.calculate1 = function() {
			var sum = 0;
			var sum1 = 0;
			var sum2 = 0;
			//alert('nima');
			for(var i = 0; i < $scope.cart.length; i++) {
				
					sum = sum + $scope.cart[i].price * $scope.cart[i].quantity;
					sum1 = sum1 +  $scope.cart[i].quantity * 1;
					sum2 = sum2 + $scope.cart[i].weight * $scope.cart[i].quantity;
					
			}
			//alert(sum1);
			$scope.subtotal = sum;
			//dataService.subtotal = sum;
			$scope.totalQuantity = sum1;
			//dataService.totalQuantity = sum1;
			$scope.totalWeight = sum2;
			//dataService.totalWeight = sum2;
		};
        /*------------------calculate the tax and the extra fee-------------------*/
		$scope.doTax = function(){
			//alert('Now calculate the tax and the extra fee');
			//alert('$scope.address.components.state='+$scope.address.components.state);
			$scope.subtotal = $state.params.subtotal;
			//alert($scope.subtotal);
			/*alert($state.params.subtotal);
			alert($state.params.totalQuantity);
			alert($state.params.totalWeight);*/
			$scope.tax = myService.calTax($scope.address.components.state, $state.params.subtotal);
			//alert(dataService.totalQuantity);
			if ($state.params.totalQuantity < 10) {
				$scope.extra = 20;
			} else {
				$scope.extra = 0;
			}
		};
		$scope.getDistance = function(){
			//alert('Now Calculate the distance');
			//alert($scope.address1.name);
			//alert($scope.address.name);
			var source = "1700 Rockville Pike, Rockville, MD 20852, USA"/*$scope.address1.name*/;
			var destination = $scope.address.name;
			var service = new google.maps.DistanceMatrixService();
		    service.getDistanceMatrix({
		        origins: [source],
		        destinations: [destination],
		        travelMode: google.maps.TravelMode.DRIVING,
		        unitSystem: google.maps.UnitSystem.METRIC,
		        avoidHighways: false,
		        avoidTolls: false
		    }, function (response, status) {
		        if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
		            //var distance = response.rows[0].elements[0].distance.text;
		           // var duration = response.rows[0].elements[0].duration.text;
		            var distance1 = response.rows[0].elements[0].distance.value;
		            /*var dvDistance = document.getElementById("dvDistance");
		            dvDistance.innerHTML = "";
		            dvDistance.innerHTML += "Distance: " + distance + "<br />";*/
		            $scope.distance = distance1/1609.344;               //convert from meter to mile
		            $scope.$apply();
		            //alert(distance1);
		            //alert('$scope.distance='+$scope.distance);
		        } else {
		            alert("Unable to find the distance via road.");
		        }
		    });
		};
        $scope.doShip = function(){
			//alert('Now calculate the shipping fee');
			//alert('$scope.distance = '+$scope.distance);
			//alert('totalweight ='+dataService.totalWeight);
			$scope.shippingFee = shippingFee.calShipping($scope.SM, $scope.distance, $state.params.totalWeight);
			//alert('shippingFee='+$scope.shippingFee);
			$scope.total = $scope.subtotal*1+$scope.extra*1+$scope.tax*1+$scope.shippingFee*1;
		};
		$scope.dropSuccessHandler = function($event,index,array){
          
          array.splice(index,1);
      	};
        $scope.onDrop = function($event,$data,array){

          array.push($data);
      	};

      	$scope.checkOut = function(){
      	    if ($scope.address.components.state == "HI") {
      	    	alert('cannot ship to Hawaii');
      	    } else if ($scope.address.components.state == "AK") {
      	    	alert('cannot ship to Alaska');
      	    } else {
      	    	alert('Check out successfully!');
      	    }
      	}
      	$scope.nextStep = function(){
      		$state.go('shipping',{
      			subtotal:$scope.subtotal, 
      			totalQuantity: $scope.totalQuantity, 
      			totalWeight: $scope.totalWeight
      		});
      	}
	}]);

/*-------------calculate tax service--------------------------------------*/
	app.factory('myService',function() {
		var service = {};
		service.calTax = function(dest, sub_total){
			var tax = 0;
			//alert("destination="+dest);
			if (dest == "MD") {
				//alert("Now the destination is Maryland, you need to pay tax");
				tax = sub_total* 0.06;
			} else { 
				//alert("Now the destination is not Maryland, free of tax");
			}
			return tax;
		}
		return service;
	});
 /*------------------data share service-------------------- */
	app.factory('dataService',function(){
		var para = {};
		para.subtotal = 0;
		para.totalQuantity = 0;
		para.totalWeight = 0;
		return para;
	});
  /*--------------- Calculate shippingFee Service-------------------*/
	app.factory('shippingFee', function(){           //$0.05/lb/mile
		var service = {};
		service.calShipping = function(shipping_method, distance, total_weight) {
			var fee = 0;
			if (shipping_method === "Fast Shipping") {
				fee = fee + 10 * 1;                   //additional 10 dollars for fast shipping
			}
			fee = fee + 0.05*distance*total_weight;
			return fee;
		}
		return service;
	});

	app.directive('myAddress',function(){
		return {
			restrict:'E',
			templateUrl:'partials/address.html'
		};
	});
});

