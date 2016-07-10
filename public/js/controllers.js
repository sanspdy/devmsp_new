/*
'use strict';
angular.module('portalControllers', ['ui.bootstrap'])
	


	.directive('a', function() {
		return {
			restrict: 'E',
			link: function(scope, elem, attrs) {
				if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
					elem.on('click', function(e){
						e.preventDefault();
					});
				}
			}
		};
	})
	.directive('loading', function () {
		return {
			restrict: 'E',
			replace:true,
			template: '<span class="loading"><img src="../images/ajax-loader.gif" width="40" height="40" /></span>',
			link: function (scope, element, attr) {
				scope.$watch('loading', function (val) {
					if (val)
						$(element).show();
					else
						$(element).hide();
				});
			}
		}
	})
	.service('sharedProperties', function () {
		var user='';
		var soln='';

		this.setProperty = function(userId) {
			console.log("userId==="+userId);
			user=userId;

		};
		this.getProperty=function () {
			return user;
		}

		this.setSoln = function(solutionName) {
			console.log("solnName==="+solutionName);
			soln=solutionName;

		};
		this.getSoln=function () {
			return soln;
		}
	});

angular.module('portalControllers').controller('AttrCtrl', function ($scope,parentDivCall,countComp,serviceType,$uibModal,$uibModalInstance,sharedProperties,$http) {
	$scope.showMSPAttributes=false;
	$scope.showRuntimeAttributes=false;
	$scope.showServiceAttributes=false;
	if(serviceType==='msp') {
		console.log("inside msp portal ctrl");
		$scope.username = sharedProperties.getProperty();
		$scope.solnName = sharedProperties.getSoln();
		$scope.ngShowModal = true;
		$scope.showMSPAttributes=true;
		$scope.showRuntimeAttributes=false;
		$scope.showServiceAttributes=false;
		$scope.patternObjectIIB_Server = {};
		$scope.popupData1 = {};
		$scope.total_Price;
		$scope.totalLicenseCost;
		$scope.popupData1 = parentDivCall;
		$scope.compAdded = countComp;
		console.log('compAdded == ' + $scope.compAdded);
		console.log("$scope.popupData1 === " + JSON.stringify($scope.popupData1));
		$.each($scope.popupData1, function (key, value) {
			console.log('key===' + key);
			if (key === 'catalog_name') {
				$scope.attrCatalog_name = $scope.popupData1["catalog_name"];
			}
			if (key === 'title') {
				$scope.attrTitle = $scope.popupData1["title"];
			}
			if (key === 'priceDetails') {
				$scope.attrTotalPrice = $scope.popupData1["priceDetails"];
				console.log("total price === " + $scope.attrTotalPrice.TotalPrice);
				$scope.total_Price = $scope.attrTotalPrice.TotalPrice;
				$scope.totalLicenseCost = $scope.attrTotalPrice['Total License Cost'];
			}
			if (key === 'Pattern') {
				$scope.patternObject = {};
				$scope.patternObject = $scope.popupData1["Pattern"];
				console.log('patternObject == ' + JSON.stringify($scope.patternObject));
				Object.keys($scope.patternObject).forEach(function (key) {
					/!*if (key === 'IIB Server') {
						$scope.patternObjectIIB_Server = $scope.patternObject["IIB Server"];

					} else if (key === 'DATAPOWER Server') {
						$scope.patternObjectIIB_Server = $scope.patternObject["DATAPOWER Server"];

					} else if (key === 'MYSQL Server') {
						$scope.patternObjectIIB_Server = $scope.patternObject["MYSQL Server"];
					}*!/
					$scope.patternObjectIIB_Server = $scope.patternObject[key];
					console.log("$scope.patternObjectIIB_Server == "+JSON.stringify($scope.patternObjectIIB_Server));
				})
			}

		})

		$scope.changedValueSave = function () {

			console.log('updated object values ==== ' + JSON.stringify($scope.patternObjectIIB_Server));
			/!*$scope.popupData1["Pattern"]=$scope.patternObjectIIB_Server;*!/
			console.log('updated popupData1 values ==== ' + JSON.stringify($scope.popupData1["Pattern"]));
			var reqObj = $scope.popupData1["Pattern"];
			console.log('reqObj === ' + reqObj);
			console.log('reqObj === ' + JSON.stringify(reqObj));
			$http({
				method: 'POST',
				url: '/api/getComponentPrice',
				data: $.param({
					"IMI_Managed": "Y",
					"Pattern": reqObj
				}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				//forms user object
			})
				.success(function (data, status, header, config) {

					if (data.errors) {
						// Showing errors.
						$scope.errorName = data.errors.name;
					} else {
						// console.log("inside success function");
						$scope.resultPriceDetails = data;
						// console.log(JSON.stringify($scope.resultPriceDetails));
						$.each($scope.resultPriceDetails, function (key, value) {
							console.log('key===' + key);
							if (key === 'priceDetails') {
								$scope.priceDetailsObject = $scope.resultPriceDetails["priceDetails"];
								// console.log('total_Price == '+$scope.priceDetailsObject);
								$.each($scope.priceDetailsObject, function (key, value) {
									// console.log('key===' + key);
									if (key === 'TotalPrice') {
										$scope.total_Price = $scope.priceDetailsObject["TotalPrice"];
										$scope.popupData1["priceDetails"]["TotalPrice"] = $scope.total_Price;
										// console.log('total_Price ===' + $scope.total_Price);
									}
								})
							}
						});
					}

				})
				.error(function (data, status, header, config) {
					console.log("header data" + header);
					console.log("status data" + status);
					console.log("config data" + JSON.stringify(config));

				})
		};

		$scope.cancel = function () {
			// $scope.ngShowModal = false;
			// parentDivCall.callInitMethod();
			$uibModalInstance.dismiss('cancel');
		};

		$scope.saveData = function () {
			console.log('uname==== '+$scope.username);
			console.log('solnName==== '+$scope.solnName);
			console.log('service_name==== '+$scope.attrCatalog_name);
			console.log('component_cnt==== '+$scope.compAdded);
			console.log("popupData1=== " + JSON.stringify($scope.popupData1));
			$http({
				method: 'PUT',
				url: '/api/updateServiceInfo',
				data: $.param({
					'uname': $scope.username,
					'solnName': $scope.solnName,
					'service_details': 'msp',
					'service_name': $scope.attrCatalog_name,
					'component_cnt': $scope.compAdded,
					'solnjson': $scope.popupData1
				}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				//forms user object
			})
				.success(function (data, status, header, config) {

					if (data.errors) {
						// Showing errors.
						$scope.errorName = data.errors.name;
					} else {
						console.log("inside success function");
						$scope.PostDataResponse = data;
						console.log(JSON.stringify($scope.PostDataResponse));


					}

				})
				.error(function (data, status, header, config) {
					console.log("header data" + header);
					console.log("status data" + status);
					console.log("config data" + JSON.stringify(config));

				})
			$uibModalInstance.dismiss('cancel');


		}

	}

	if(serviceType==='runtime') {
		console.log("inside runtime ctrl");
		$scope.showMSPAttributes=false;
		$scope.showRuntimeAttributes=true;
		$scope.showServiceAttributes=false;
		$scope.username = sharedProperties.getProperty();
		$scope.solnName = sharedProperties.getSoln();
		$scope.ngShowModal = true;
		$scope.popupDataRuntime = {};
		$scope.pricePropertiesValue='';
		$scope.popupDataRuntime = parentDivCall;
		$scope.compRuntimeAdded = countComp;
		console.log("$scope.popupData1 === " + JSON.stringify($scope.popupDataRuntime));
		console.log('uname == ' + $scope.username);
		console.log("solnName === " + $scope.solnName);
		console.log("service_name === " + $scope.popupDataRuntime.title);
		console.log('compAdded == ' + $scope.compRuntimeAdded);
		// console.log("$scope.popupData1 === " + JSON.stringify($scope.popupDataRuntime));
		Object.keys($scope.popupDataRuntime).forEach(function (key) {
			if(key==='title'){
				$scope.runtimeBluemixTitle=$scope.popupDataRuntime[key];
			}
			if(key==='plan'){
				$scope.runtimeBluemixPlan=$scope.popupDataRuntime[key];
			}
			if(key==='properties'){
				$scope.memoryProperties=$scope.popupDataRuntime[key];
				console.log('$scope.memoryProperties ==== '+JSON.stringify($scope.memoryProperties));
			}
		})


		$scope.changedRuntimeValueSave = function () {

			console.log('changed valuess memory === '+JSON.stringify($scope.memoryProperties));
			Object.keys($scope.memoryProperties).forEach(function (key) {
				if(key==='instance') {
					$scope.instancePropertiesValue = $scope.memoryProperties[key];
				}
				if(key==='memory'){
					$scope.memoryPropertiesValue = $scope.memoryProperties[key];
				}
				if(key==='price'){
					$scope.pricePropertiesValue = $scope.memoryProperties[key];
				}
			})
			$scope.memoryValueArray=$scope.memoryPropertiesValue.split('MB');
			$scope.memoryValueFinal=$scope.memoryValueArray[0];
			console.log('changed valuess memory final === '+$scope.memoryValueFinal);

			console.log('changed valuess instance === '+$scope.instancePropertiesValue);
			$scope.instanceValue=$scope.instancePropertiesValue;
			/!*$scope.instanceValueArray=$scope.instanceValue.split('MB');
			$scope.instanceValueFinal=$scope.instanceValueArray[0];
			console.log('changed valuess memory final === '+$scope.instanceValueFinal);*!/
			$http({
				method: 'POST',
				url: '/api/getRuntimePrice',
				data: $.param({'inst':$scope.instanceValue, 'memory':$scope.memoryValueFinal}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				//forms user object
			})
				.success(function (data, status, header, config) {

					if (data.errors) {
						// Showing errors.
						$scope.errorName = data.errors.name;
					} else {
						// console.log("inside success function");
						$scope.resultRuntimePriceDetails = data;
						console.log('final runtime price ==== '+JSON.stringify($scope.resultRuntimePriceDetails));
						console.log('final runtime price ==== '+$scope.resultRuntimePriceDetails.final_price);
						// console.log('final runtime price ==== '+$scope.resultRuntimePriceDetails[final_price]);
						$scope.pricePropertiesValue=$scope.resultRuntimePriceDetails.final_price;

						if($scope.pricePropertiesValue<0){
							$scope.popupDataRuntime["properties"]["price"]='free';
							$scope.memoryProperties["price"]='free';
						}else{
							$scope.popupDataRuntime["properties"]["price"]=$scope.resultRuntimePriceDetails.final_price;
							$scope.memoryProperties["price"]=$scope.resultRuntimePriceDetails.final_price;
							console.log('$scope.pricePropertiesValue == '+$scope.pricePropertiesValue);
							console.log('$scope.memoryProperties[price] == '+$scope.memoryProperties["price"]);
						}
					}

				})
				.error(function (data, status, header, config) {
					console.log("header data" + header);
					console.log("status data" + status);
					console.log("config data" + JSON.stringify(config));

				})
		};

		$scope.cancel = function () {
			// $scope.ngShowModal = false;
			// parentDivCall.callInitMethod();
			$uibModalInstance.dismiss('cancel');
		};

		$scope.saveDataRuntime = function () {
			console.log("inside save function" + JSON.stringify($scope.popupDataRuntime));
			console.log("inside save function" + JSON.stringify($scope.popupDataRuntime.title));
			$http({
				method: 'PUT',
				url: '/api/updateBMRuntimeInfo',
				data: $.param({
					uname: $scope.username,
					solnName: $scope.solnName,
					service_details: 'runtime',
					service_name: $scope.popupDataRuntime.title,
					component_cnt: $scope.compRuntimeAdded,
					solnjson: $scope.popupDataRuntime
				}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				//forms user object
			})
				.success(function (data, status, header, config) {

					if (data.errors) {
						// Showing errors.
						$scope.errorName = data.errors.name;
					} else {
						console.log("inside success function");
						$scope.popupDataRuntimeResult = data;
						console.log(JSON.stringify($scope.popupDataRuntimeResult));


					}

				})
				.error(function (data, status, header, config) {
					console.log("header data" + header);
					console.log("status data" + status);
					console.log("config data" + JSON.stringify(config));

				})
			$uibModalInstance.dismiss('cancel');


		}

	}

	if(serviceType==='bluemix') {
		$scope.showMSPAttributes=false;
		$scope.showRuntimeAttributes=false;
		$scope.showServiceAttributes=true;
		$scope.ngShowModal = true;
		console.log("inside bluemix ctrl");
		$scope.username = sharedProperties.getProperty();
		$scope.solnName = sharedProperties.getSoln();
		$scope.popupDataService = {};
		$scope.popupDataService = parentDivCall;
		$scope.compServiceAdded = countComp;
		console.log('compAdded == ' + $scope.compServiceAdded);
		console.log("$scope.popupData1 === " + JSON.stringify($scope.popupDataService));

		$.each($scope.popupDataService, function (key, value) {
			console.log('key===' + key);
			if (key === 'title') {
				$scope.bluemixServiceTitle = $scope.popupDataService["title"];
			}
			if (key === 'properties') {
				// $scope.propertiesObject = {};
				$scope.propertiesObjectArray = $scope.popupDataService["properties"];
				console.log('propertiesObject == ' + JSON.stringify($scope.propertiesObjectArray));
				for (var i = 0; i < $scope.propertiesObjectArray.length; i++) {
					$scope.propertiesObject=$scope.propertiesObjectArray[i];
					Object.keys($scope.propertiesObject).forEach(function (key) {
						$scope.propertiesObjectFirstKey = key;
						console.log("$scope.propertiesObjectFirstKey == " + $scope.propertiesObjectFirstKey);
						$scope.propertiesObjectFirstKeyValue = $scope.propertiesObject[key];
						console.log("$scope.propertiesObjectFirstKeyValue == " + $scope.propertiesObjectFirstKeyValue);
					})
				}
			}
		})

		/!*$scope.changedValueSave = function () {

			console.log('updated object values ==== ' + JSON.stringify($scope.patternObjectIIB_Server));
			/!*$scope.popupData1["Pattern"]=$scope.patternObjectIIB_Server;*!/
			console.log('updated popupData1 values ==== ' + JSON.stringify($scope.popupData1["Pattern"]));
			var reqObj = $scope.popupData1["Pattern"];
			console.log('reqObj === ' + reqObj);
			console.log('reqObj === ' + JSON.stringify(reqObj));
			$http({
				method: 'POST',
				url: '/api/getComponentPrice',
				data: $.param({
					"IMI_Managed": "Y",
					"Pattern": reqObj
				}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				//forms user object
			})
				.success(function (data, status, header, config) {

					if (data.errors) {
						// Showing errors.
						$scope.errorName = data.errors.name;
					} else {
						// console.log("inside success function");
						$scope.resultPriceDetails = data;
						// console.log(JSON.stringify($scope.resultPriceDetails));
						$.each($scope.resultPriceDetails, function (key, value) {
							console.log('key===' + key);
							if (key === 'priceDetails') {
								$scope.priceDetailsObject = $scope.resultPriceDetails["priceDetails"];
								// console.log('total_Price == '+$scope.priceDetailsObject);
								$.each($scope.priceDetailsObject, function (key, value) {
									// console.log('key===' + key);
									if (key === 'TotalPrice') {
										$scope.total_Price = $scope.priceDetailsObject["TotalPrice"];
										$scope.popupData1["priceDetails"]["TotalPrice"] = $scope.total_Price;
										// console.log('total_Price ===' + $scope.total_Price);
									}
								})
							}
						});
					}

				})
				.error(function (data, status, header, config) {
					console.log("header data" + header);
					console.log("status data" + status);
					console.log("config data" + JSON.stringify(config));

				})
		};*!/

		$scope.cancel = function () {
			// $scope.ngShowModal = false;
			// parentDivCall.callInitMethod();
			$uibModalInstance.dismiss('cancel');
		};

		$scope.saveDataService = function () {
			console.log("inside save function" + JSON.stringify($scope.popupDataService));
			console.log("inside save function" + JSON.stringify($scope.popupDataService.title));
			$http({
				method: 'PUT',
				url: '/api/updateBMServiceInfo',
				data: $.param({
					uname: $scope.username,
					solnName: $scope.solnName,
					service_details: 'bluemix',
					service_name: $scope.popupDataService.title,
					component_cnt: $scope.compServiceAdded,
					solnjson: $scope.popupDataService
				}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				//forms user object
			})
				.success(function (data, status, header, config) {

					if (data.errors) {
						// Showing errors.
						$scope.errorName = data.errors.name;
					} else {
						console.log("inside success function");
						$scope.PostDataResponse = data;
						console.log(JSON.stringify($scope.PostDataResponse));


					}

				})
				.error(function (data, status, header, config) {
					console.log("header data" + header);
					console.log("status data" + status);
					console.log("config data" + JSON.stringify(config));

				});


		}

		$uibModalInstance.dismiss('cancel');

	}

});

angular.module('portalControllers').controller('solCtrl', function ($scope,$uibModal,$uibModalInstance,$location) {
	// alert("inside solution  ctrl");
	$scope.ngShowModal1 = true;
	/!*$scope.dismissModal = function () {
	 $uibModalInstance.dismiss('cancel');
	 };*!/
	$scope.createItem = function(){
		$uibModalInstance.dismiss('cancel');

		$uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: '../components/modal/solutionPopup.html',
			controller: 'solutionCtrl',
			windowClass: 'app-modal-window-solpop',
			backdrop: 'static',
			resolve: {

			}
		});
	}
	$scope.openItem = function(){
		$uibModalInstance.dismiss('cancel');
		$location.path('/deployment');
	}
});
angular.module('portalControllers').controller('newsolCtrl', function ($scope,$uibModal,$uibModalInstance,$location) {
	// alert("inside solution  ctrl");
	$scope.ngShowModalNew1 = true;
	/!*$scope.dismissModal = function () {
	 $uibModalInstance.dismiss('cancel');
	 };*!/
	$scope.createItem = function(){
		$uibModalInstance.dismiss('cancel');

		$uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: '../components/modal/newSolutionPopup.html',
			controller: 'newsolutionCtrl',
			windowClass: 'app-modal-window-nspop',
			backdrop: 'static',
			resolve: {

			}
		});
	}
	$scope.openItem = function(){
		$uibModalInstance.dismiss('cancel');
		$location.path('/deployment');
	}
});

angular.module('portalControllers').controller('solutionCtrl', function ($scope,$uibModal,$uibModalInstance,$location,$http,sharedProperties,$rootScope) {
	// alert("inside solution2  ctrl");
	$scope.ngShowModal2 = true;
	$scope.dismissModal = function () {
		$uibModalInstance.dismiss('cancel');
		$location.path('/home');
	};

	//$scope.showSuccessAlert = false;

	// switch flag
	$scope.switchBool = function (value) {
		$scope[value] = !$scope[value];
	};
	$scope.createCanvas = function(){
		$rootScope.solnName = $scope.itemData.solnInput;
		console.log("$scope.solnNameHybrid === " +$rootScope.solnName);
		var solnDesc = $scope.itemData.solDesc;
		console.log("$scope.solnDescHybrid === " +solnDesc);
		sharedProperties.setSoln($rootScope.solnName);
		//$location.path('/canvas');
		//$uibModalInstance.dismiss('cancel');
		var uid = sharedProperties.getProperty();
		console.log("user name in solution ctrl === "+uid);
		// sharedProperties.setSoln(solnName);
		console.log('inside canvas creation');
		$scope.viewCreatSol = true;
		$scope.spinsCatalogueList=false;
		$scope.spinsCanvas=false;
		$scope.spinsCatalogueList = false;
		$scope.spinsViewBoM = false;
		$scope.loading = true;
		$http({
			method  : 'POST',
			url     : '/api/v1/creatHybridSolution',
			data    : $.param({'uname': uid, 'solnName': $rootScope.solnName, 'solnDesc': solnDesc}),
			headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			//forms user object
		})
			.success(function(data,status,header,config) {

				$scope.PostDataResponse = data;
				console.log(JSON.stringify($scope.PostDataResponse));
				if(data.status === 'failed'){
				$scope.successTextAlert = "already exists";
				$scope.showSuccessAlert = true;
				}
				else {
					$location.path('/canvas');
					$uibModalInstance.dismiss('cancel');
				}


				$scope.viewCreatSol = false;
			})
			.error(function(data,status,header,config){
				console.log("header data" +header);
				console.log("status data" +status);
				console.log("config data" +JSON.stringify(config));

			})
	}

});

angular.module('portalControllers').controller('newsolutionCtrl', function ($scope,$uibModal,$uibModalInstance,$location,$http,sharedProperties,$rootScope) {
	// alert("inside solution2  ctrl");
	$scope.ngShowModalNew2 = true;
	$scope.dismissModal = function () {
		$uibModalInstance.dismiss('cancel');
		$location.path('/canvas');
	};

	//$scope.showSuccessAlert = false;

	// switch flag
	$scope.switchBool = function (value) {
		$scope[value] = !$scope[value];
	};
	$scope.createCanvas = function(){
		$rootScope.solnName = $scope.itemData.solnInput;
		console.log("$scope.solnName === " +$rootScope.solnName);
		var solnDesc = $scope.itemData.solDesc;
		console.log("$scope.solnName === " +solnDesc);
		sharedProperties.setSoln($rootScope.solnName);
		//$location.path('/canvas');
		//$uibModalInstance.dismiss('cancel');
		var uid = sharedProperties.getProperty();
		console.log("user name in solution ctrl === "+uid);
		// sharedProperties.setSoln(solnName);

		console.log('inside canvas creation');
		$scope.viewCreatSol = true;
		$scope.spinsCatalogueList=false;
		$scope.spinsCanvas=false;
		$scope.spinsCatalogueList = false;
		$scope.spinsViewBoM = false;
		$scope.loading = true;
		$http({
			method  : 'POST',
			url     : '/api/v1/creatHybridSolution',
			data    : $.param({'uname': uid, 'solnName': $rootScope.solnName, 'solnDesc': solnDesc}),
			headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			//forms user object
		})
			.success(function(data,status,header,config) {

				$scope.PostDataResponse = data;
				console.log(JSON.stringify($scope.PostDataResponse));
				if(data.status === 'failed'){
					$scope.successTextAlert = "already exists";
					$scope.showSuccessAlert = true;
				}
				else {
					$location.path('/canvas');
					$uibModalInstance.dismiss('cancel');
				}
				$scope.viewCreatSol = false;
			})
			.error(function(data,status,header,config){
				console.log("header data" +header);
				console.log("status data" +status);
				console.log("config data" +JSON.stringify(config));

			})
	}

});
angular.module('portalControllers').controller('orderBillCtrl', function ($scope,$uibModal,$uibModalInstance,isOrderButton,sharedProperties,$http,$location) {
	// alert("inside order bill ctrl");
	if(isOrderButton==='viewBOM'){
		$scope.showOrderBtn = true;
	}else if(isOrderButton==='deplBOM'){
		$scope.showOrderBtn = false;
	}

	$scope.ngShowModal4 = true;
	$scope.serialNumber=0;
	$scope.dismissOrder = function () {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.viewBillOfOrderArray=[];

	$scope.patternObjectIIB_Server={};
	$scope.solnEntered=sharedProperties.getSoln();
	$scope.quantityValueArray=[];
	$scope.spinsCatalogueList=false;
	$scope.spinsCanvas=false;
	$scope.spinsCatalogueList = false;
	$scope.spinsViewBoM = true;
	$scope.loading = true;

	$http.get("/api/v1/viewBillofMaterial?solnName="+$scope.solnEntered).success(function(data){
		$scope.ResponseDataViewBillObject = data;
		console.log('view bill of material === '+JSON.stringify($scope.ResponseDataViewBillObject));
		
		Object.keys($scope.ResponseDataViewBillObject).forEach(function (key){
			console.log('ResponseDataViewBillObject key values === '+ key);
			if(key==='msp'){
				$scope.mspDataViewBillObjectsArray=$scope.ResponseDataViewBillObject[key];
				console.log('$scope.mspDataViewBillObject === '+JSON.stringify($scope.mspDataViewBillObjectsArray));

				for(var mspArrayIndex=0;mspArrayIndex<$scope.mspDataViewBillObjectsArray.length;mspArrayIndex++) {
					$scope.viewBillOfOrder={
						'productName':'',
						'productDesc':'',
						'productProvider':'MSP',
						'productQuantity':'',
						'productPrice':'',
						'productLC':''
					};
					$scope.mspViewBillObject=$scope.mspDataViewBillObjectsArray[mspArrayIndex];
					$.each($scope.mspViewBillObject, function (key, value) {
						console.log('key===' + key);
						if (key === 'catalog_name') {
							$scope.mspVBAttrCatalog_name = $scope.mspViewBillObject["catalog_name"];
						}
						if (key === 'title') {
							$scope.MSPVBAttrTitle = $scope.mspViewBillObject["title"];
							$scope.viewBillOfOrder.productName=$scope.MSPVBAttrTitle;
							$scope.viewBillOfOrder.productDesc=$scope.MSPVBAttrTitle;
						}
						if (key === 'priceDetails') {
							$scope.mspVBAttrTotalPrice = $scope.mspViewBillObject["priceDetails"];
							console.log("total price === " + $scope.mspVBAttrTotalPrice.TotalPrice);
							$scope.msptotal_Price = $scope.mspVBAttrTotalPrice.TotalPrice;
							$scope.mspLicenseCost = $scope.mspVBAttrTotalPrice['Total License Cost'];
							console.log('$scope.mspLicenseCost == '+$scope.mspLicenseCost);
							$scope.viewBillOfOrder.productPrice=$scope.msptotal_Price;
							$scope.viewBillOfOrder.productLC=$scope.mspLicenseCost;
						}
						if (key === 'Pattern') {
							$scope.patternObject = {};
							$scope.MSPVBPatternObject = $scope.mspViewBillObject["Pattern"];
							console.log('patternObject == ' + JSON.stringify($scope.MSPVBPatternObject));
							Object.keys($scope.MSPVBPatternObject).forEach(function (key) {
								$scope.MSPVBPatternObject_Server = $scope.MSPVBPatternObject[key];
								console.log("$scope.patternObjectIIB_Server == " + JSON.stringify($scope.MSPVBPatternObject_Server));
								Object.keys($scope.MSPVBPatternObject_Server).forEach(function (key1) {
									var isQuantityKey = key1;
									console.log('isQuantityKey === '+isQuantityKey);
										if (isQuantityKey.indexOf("Server_Quantity") !== -1) {
											$scope.serialNumber++;
											console.log('found quantity key');
											$scope.MSPVBPatternObjectQuantity = $scope.MSPVBPatternObject_Server[isQuantityKey];
											console.log('$scope.MSPVBPatternObjectQuantity == ' + $scope.MSPVBPatternObjectQuantity);
											$scope.viewBillOfOrder.productQuantity=$scope.MSPVBPatternObjectQuantity;
											$scope.quantityValueArray.push($scope.MSPVBPatternObjectQuantity);
											console.log('$scope.quantityValueArray == '+$scope.quantityValueArray);
										}

								});
							});
						}
					});
					console.log('$scope.viewBillOfOrder === '+JSON.stringify($scope.viewBillOfOrder));
					$scope.pushBOMObjectsMSP($scope.viewBillOfOrder);
				}
			}

			if(key==='bluemix'){
				$scope.bluemixViewBillObjectsArray=$scope.ResponseDataViewBillObject[key];
				console.log('$scope.bluemixViewBillObjectsArray === '+JSON.stringify($scope.bluemixViewBillObjectsArray));
				for(var bluemixArrayIndex=0;bluemixArrayIndex<$scope.bluemixViewBillObjectsArray.length;bluemixArrayIndex++) {
					$scope.bluemixViewBillObject=$scope.bluemixViewBillObjectsArray[bluemixArrayIndex];
					Object.keys($scope.bluemixViewBillObject).forEach(function(key){
						if(key === 'services'){
							$scope.bluemixServiceViewBillObjectArray=$scope.bluemixViewBillObject[key];
							console.log('$scope.bluemixServiceViewBillObjectArray === '+JSON.stringify($scope.bluemixServiceViewBillObjectArray));
							for(var bluemixServiceArrayIndex=0;bluemixServiceArrayIndex<$scope.bluemixServiceViewBillObjectArray.length;bluemixServiceArrayIndex++) {
								$scope.bluemixServiceObject=$scope.bluemixServiceViewBillObjectArray[bluemixServiceArrayIndex];
								console.log('$scope.bluemixServiceObject === '+JSON.stringify($scope.bluemixServiceViewBillObjectArray));
								Object.keys($scope.bluemixServiceObject).forEach(function(key){
									if(key==='title'){
										$scope.serialNumber++;
										$scope.bluemixServicesVBTitle=$scope.bluemixServiceObject[key];
										console.log('$scope.bluemixServicesVBTitle= '+$scope.bluemixServicesVBTitle);
									}
								})
							}
						}

						if(key === 'runtime'){
							$scope.bluemixRuntimeViewBillObjectArray=$scope.bluemixViewBillObject[key];
							console.log('$scope.bluemixRuntimeViewBillObjectArray === '+JSON.stringify($scope.bluemixRuntimeViewBillObjectArray));
							for(var bluemixRuntimeArrayIndex=0;bluemixRuntimeArrayIndex<$scope.bluemixRuntimeViewBillObjectArray.length;bluemixRuntimeArrayIndex++) {
								$scope.bluemixRuntimeObject=$scope.bluemixRuntimeViewBillObjectArray[bluemixRuntimeArrayIndex];
								Object.keys($scope.bluemixRuntimeObject).forEach(function(key){
									if(key==='title'){
										$scope.serialNumber++;
										$scope.bluemixRuntimeVBTitle=$scope.bluemixRuntimeObject[key];
										console.log('$scope.bluemixRuntimeVBTitle === '+$scope.bluemixRuntimeVBTitle);
									}
									if(key==='properties'){
										$scope.bluemixRuntimeVBPropertiesObject=$scope.bluemixRuntimeObject[key];
										Object.keys($scope.bluemixRuntimeVBPropertiesObject).forEach(function(key){
											if(key==='price'){
												$scope.bluemixRuntimeVBPrice=$scope.bluemixRuntimeVBPropertiesObject[key];
												console.log('$scope.bluemixRuntimeVBPrice === '+$scope.bluemixRuntimeVBPrice);
											}
										})
									}
								})
							}
						}
					})
				}
			}
			if(key==='Final_Price'){
				$scope.viewBillFinalPrice=$scope.ResponseDataViewBillObject[key];
			}
		});
		$scope.loading = false;
	});

	$scope.pushBOMObjectsMSP=function (BOMObj) {
		$scope.viewBillOfOrderArray.push(BOMObj);
		console.log('$scope.viewBillOfOrderArray === '+JSON.stringify($scope.viewBillOfOrderArray));
	}
	
	$scope.placeOrder=function () {
		$scope.currentUser = sharedProperties.getProperty();
		console.log('userEntered == ' + $scope.currentUser);
		var user = $scope.currentUser;
		console.log("inside place order");
		console.log('$scope.solnEntered === '+$scope.solnEntered);
		$scope.placeOrderSpins = true;
		$scope.viewCreatSol = false;
		$scope.spinsCatalogueList=false;
		$scope.spinsCanvas=false;
		$scope.spinsCatalogueList = false;
		$scope.spinsViewBoM = false;
		$scope.loading = true;
		$http({
			method  : 'POST',
			url     : '/api/placeOrder',
			data    : $.param({'uname': user,soln_name: $scope.solnEntered}),
			headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			//forms user object
		}).success(function(data,status,header,config) {

			console.log("place order data ==="+JSON.stringify(data));
			$uibModalInstance.dismiss('cancel');
			$location.path('/deployment');
		})
		$scope.placeOrderSpins = false;
	}

});
angular.module('portalControllers').controller('DeleteCanvasServiceCtrl', function ($scope,$location,$uibModal,$uibModalInstance,$http) {
	console.log("inside DeleteCanvasServiceCtrl ctrl");
	$scope.showDeleteConfirmPopup = true;
	$scope.dismissDel = function () {
		$uibModalInstance.dismiss('cancel');
	};

});

angular.module('portalControllers').controller('SelectProperServiceCtrl', function ($scope,$location,$uibModal,$uibModalInstance,$http) {
	console.log("inside SelectProperServiceCtrl ctrl");
	$scope.selectProperServicePopup = true;
	$scope.dismissDel = function () {
		$uibModalInstance.dismiss('cancel');
	};

});*/
