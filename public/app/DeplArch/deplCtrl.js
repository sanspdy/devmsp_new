angular.module('portalControllers').controller('deplCtrl', function ($scope,$location,$uibModal,sharedProperties,$http,$rootScope) {
     console.log("inside depl ctrl");
    $scope.state = false;
    $scope.toggleState = function() {
        $scope.state = !$scope.state;
    };
    $scope.showMSP = true;
    $scope.showHybrid = true;
    $scope.showDepl = false;
    $scope.navMsp = function(){
        console.log('inside nav msp');
        /*$location.path('/MSP');*/
        $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: '../components/modal/solArchitectureMsp.html',
            windowClass: 'app-modal-window-sam',
            controller: 'solCtrlMsp',
            backdrop: 'static',
            resolve: {
            }
        });
    };
    $scope.loadHybrid = function(){
        /*$location.path('/canvas');*/
        $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: '../components/modal/solArchitecture.html',
            controller: 'solCtrl',
            windowClass: 'app-modal-window-sa',
            backdrop: 'static',
            resolve: {
            }
        });
    };

    $scope.redirectHome = function () {
        console.log("inside depl controller");
        $location.path('/home');
    };
        var pagesShown = 1;
        var pageSize = 3;
        var pagesShown1 = 1;
        var pageSize1 = 3;
        $scope.SolnArray = [];
    $scope.SolnArrayHybrid=[];
    $scope.versionarray=[]
        $scope.username = sharedProperties.getProperty();
        console.log('$scope.username' +$scope.username);
        $http.get("/api/v2/viewMyDeployArchNames?uname="+$scope.username+"&version="+1)
            .success(function(data){
                console.log('inside view DeployArch function');
                $scope.components = data;
                console.log("Array of solution name : " + JSON.stringify($scope.components));
                console.log(" length of Array of solution name of MSP : " + $scope.components.msp.length);
                console.log(" length of Array of solution name of Hybrid : " + $scope.components.hybrid.length);
                 $scope.SolnArray =$scope.components.msp;
                $scope.SolnArrayHybrid = $scope.components.hybrid;
                for(var i=0;i<$scope.SolnArray.length;i++){
                    $scope.SolutionNames = $scope.SolnArray[i];
                    console.log("$scope.SolutionNames===" +$scope.SolutionNames);
                }

                for(var j=0;j<$scope.SolnArrayHybrid.length;j++){
                    $scope.SolutionNamesHybrid = $scope.SolnArrayHybrid[j];
                    console.log("$scope.SolutionNames===" +$scope.SolutionNamesHybrid);
                }

            })
            .error(function(data,status,header,config){
                console.log("header data" +header);
                console.log("status data" +status);
                console.log("config data" +config);
                console.log("Data:" +data);
            });
        $scope.paginationLimit = function(data) {
            return pageSize * pagesShown;
        };
    $scope.paginationLimit1 = function(data) {
        return pageSize1 * pagesShown1;
    };
        $scope.hasMoreItemsToShow = function() {
            return pagesShown1 < ($scope.SolnArrayHybrid.length / pageSize1);
        };
        $scope.showMoreItems = function() {
            pagesShown1 = pagesShown1 + 1;
        };
    $scope.hasMoreItemsToShowMSP = function() {
        return pagesShown < ($scope.SolnArray.length / pageSize);
    };
    $scope.showMoreItemsMSP = function() {
        pagesShown = pagesShown + 1;
    };
   /* $scope.moveToViewArch = function (index) {
        console.log('inside view Arch'+index);
        sharedProperties.setCurrentCSolName(index);
        $location.path('/viewArchietecture');

    }*/
    $scope.moveToViewArch = function (index) {


        $scope.solName=index;
        console.log('solution name'+ index);
        sharedProperties.setCurrentCSolName(index);
        $scope.vers=sharedProperties.getVersion();
        console.log("version ----------------->"+$scope.vers)


        $http.get("/api/v2/viewMyDeployArchVersions?uname="+$scope.username+"&solname="+index).success(function(data) {
            $scope.ResponseDataViewBillObject = data;
            console.log('version details === '+JSON.stringify($scope.ResponseDataViewBillObject));
            $scope.hybridData = $scope.ResponseDataViewBillObject;
            ///* $location.path('/viewArchietecture');*/

            $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '../components/modal/versiondetail.html',
                /* windowClass: 'app-modal-window-sam',*/
                controller: 'versionCtrl',
                backdrop: 'static',
                resolve: {
                    indexVersion:function () {
                        return $scope.ResponseDataViewBillObject;
                    }


                }
            });
        });

    };
    $scope.viewBomHybrid = function(data){
        console.log('sol name index value'+data);
        $scope.currentVBOMSolName= data;
        console.log('$scope.currentVBOMSolName === '+$scope.currentVBOMSolName);
        $scope.showOrderBtn =false;
        $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: '../components/modal/orderBill.html',
            size: 'lg',
            controller: 'orderViewBillCtrl',
            backdrop: 'static',
            resolve: {
                isOrderButton:function () {
                    return 'deplBOM';
                },
                indexViewBOM:function () {
                    return $scope.currentVBOMSolName;
                }
            }
        });
    };



    $scope.viewBomMsp = function(data){
        console.log('sol name index value'+data);
        $scope.currentVBOMSolName= data;
        console.log('$scope.currentVBOMSolName === '+$scope.currentVBOMSolName);
        $scope.showOrderBtn =false;
        $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: '../components/modal/orderBillMsp.html',
            size: 'lg',
            controller: 'orderViewBillCtrlMsp',
            backdrop: 'static',
            resolve: {
                isOrderButton:function () {
                    return 'deplBOM';
                },
                indexViewBOM:function () {
                    return $scope.currentVBOMSolName;
                }
            }
        });
    };

    $scope.deleteArch = function (index) {
        console.log('data of msp is' +index);
        var solIndex = $scope.SolnArray.indexOf(index);
        console.log('solIndex === '+solIndex);
        var uid = sharedProperties.getProperty();
        console.log("user name in solution ctrl === "+uid);
        console.log('$scope.SolnArray === ' +JSON.stringify($scope.SolnArray));
        $scope.deletedSolnName = $scope.SolnArray[solIndex];
        console.log('index of msp is' +solIndex);
        console.log("$scope.deletedSolnName === " +$scope.deletedSolnName);

    $http({
        method: 'POST',
        url: 'api/v2/deleteAllSolution',
        data: $.param({'user': uid, 'soln_name': $scope.deletedSolnName}),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        //forms user object
    })
        .success(function (data, status, header, config) {
            $scope.deletedSolName = data;
            console.log('$scope.deleteArchitectureData ==== '+JSON.stringify($scope.deletedSolName));

        })
        .error(function (data, status, header, config) {
            console.log("header data" + header);
            console.log("status data" + status);
            console.log("config data" + JSON.stringify(config));
        })
        $scope.SolnArray.splice(solIndex,1);
    }

    $scope.deleteArchHybrid = function (index) {
        console.log('data of hybrid is------->' +index);
        var solIndex = $scope.SolnArrayHybrid.indexOf(index);
        console.log('solIndex hybrid === '+solIndex);
        var uid = sharedProperties.getProperty();
        console.log("user name in solution ctrl === "+uid);
        $scope.deletedSolnNameHybrid = $scope.SolnArrayHybrid[solIndex];
        console.log('index of hybrid is' +solIndex);
        /*$rootScope.solnName = $scope.itemData.solnInput;*/
        console.log("$scope.deletedSolnNameHybrid === " +$scope.deletedSolnNameHybrid);

        $http({
            method: 'POST',
            url: '/api/deleteSolution',
            data: $.param({'user': uid, 'soln_name': $scope.deletedSolnNameHybrid}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            //forms user object
        })
            .success(function (data, status, header, config) {


                $scope.deletedSolNameHybrid = data;
                console.log('$scope.deleteArchitectureData ==== '+JSON.stringify($scope.deletedSolNameHybrid));

            })
            .error(function (data, status, header, config) {
                console.log("header data" + header);
                console.log("status data" + status);
                console.log("config data" + JSON.stringify(config));
            })
        $scope.SolnArrayHybrid.splice(solIndex,1);
    }
})

.service('sharedProperties', function () {
    var user='';
    var soln='';
    var MSPChoiceIndex;
    var runtimeChoiceIndex;
    var serviceChoiceIndex;
    var currentSoln;
    var version='';
    var userEntered=''
        this.setVersion = function(versionId) {
            console.log("VertionId==="+versionId);
            version=versionId;

        };
        this.getVersion=function () {
            return version;
        }
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

    this.setCurrentCSolName=function(solName){
        console.log("current solnName==="+solName);
        currentSoln=solName;
    }

    this.getCurrentCSolName=function(){
        return currentSoln;
    }
        this.setluser = function(userId) {
            console.log("userId==="+userId);
            luser=userId;

        };
        this.getluser=function () {
            return luser;
        }

});


angular.module('portalControllers').controller('orderViewBillCtrl', function ($scope,$uibModal,$uibModalInstance,isOrderButton,indexViewBOM,sharedProperties,$http,$location) {
    // alert("inside order bill ctrl");
    if(isOrderButton==='viewBOM'){
        $scope.showOrderBtn = true;
    }else if(isOrderButton==='deplBOM'){
        $scope.showOrderBtn = false;
    }

    $scope.ngShowModal4 = true;

    $scope.dismissOrder = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.patternObjectIIB_Server={};
    $scope.solnEntered=indexViewBOM;
    $scope.viewBillOfOrderArray=[];
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

});




angular.module('portalControllers').controller('orderViewBillCtrlMsp', function ($scope,$uibModal,$uibModalInstance,isOrderButton,indexViewBOM,sharedProperties,$http,$location) {
    // alert("inside order bill ctrl");
    if(isOrderButton==='viewBOM'){
        $scope.showOrderBtn = true;
    }else if(isOrderButton==='deplBOM'){
        $scope.showOrderBtn = false;
    }

    $scope.ngShowModal4Msp = true;

    $scope.dismissOrder = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.patternObjectIIB_Server={};
    $scope.solnEntered=indexViewBOM;
    $scope.viewBillOfOrderArray=[];
    $scope.spinsCatalogueList=false;
    $scope.spinsCanvas=false;
    $scope.spinsCatalogueList = false;
    $scope.spinsViewBoM = true;
    $scope.loading = true;

    $http.get("/api/v1/viewMspBillofMaterial?solnName="+$scope.solnEntered).success(function(data){
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

});
angular.module('portalControllers').controller('versionCtrl', function ($scope,$uibModal,$uibModalInstance,$location,$http,$filter,indexVersion,sharedProperties) {
    $scope.varray=[];
    $scope.versionData = indexVersion;
    $scope.solutionname=sharedProperties.getCurrentCSolName();


    $scope.do_some_action = function(version) {
        $location.path('/viewArchietecture');
        console.log('version===  ' +JSON.stringify(version));
        sharedProperties.setVersion(version);

        $uibModalInstance.close();


    }
    console.log('$scope.versionData===>>>' +JSON.stringify($scope.versionData));
    Object.keys($scope.versionData).forEach(function (key) {
            console.log('versionData key values === ' + key);
            if (key === 'hybrid') {
                $scope.hybridversionObjectsArray = $scope.versionData[key];
                console.log('$scope.hybridversionObjectsArray === ' + JSON.stringify($scope.hybridversionObjectsArray));
                //sharedProperties.setVersion($rootScope.hybridversionObjectsArray);
                for(var i=0;i< $scope.hybridversionObjectsArray.length;i++) {
                    console.log('$scope.hybridversionObjectsArray === ' + JSON.stringify($scope.hybridversionObjectsArray[i].version));
                    $scope.varray.push(JSON.stringify($scope.hybridversionObjectsArray[i].version));

                }

            }
            if(key === 'msp') {
                $scope.mspversionObjectsArray = $scope.versionData[key];
                console.log('$scope.mspversionObjectsArray === ' + JSON.stringify($scope.mspversionObjectsArray));

            }
       

    });


  Object.keys($scope.versionData).forEach(function (key) {
        if (key === 'provisioning_status') {
            $scope.statusversionObjectsArray = $scope.versionData[key];
            console.log('$scope.statusversionObjectsArray === ' + JSON.stringify($scope.statusversionObjectsArray));

        }
    });
    // remove
    $scope.removeUser = function(index) {
        $scope.users.splice(index, 1);
    };
    //close buuton
    $scope.dismissOrder = function () {
        $uibModalInstance.dismiss('cancel');
    };
    /*$scope.rowclick = function(){
        console.log("Click 1 method")
    }*/
    $scope.verEdit =function(version){

        $location.path('/viewArchietecture');
        console.log('version===  ' +JSON.stringify(version));

        $uibModalInstance.close();
    };
    $scope.savetoPdf=function(){


   };
   /*$scope.viewdelete=function(version,index) {

      // $scope.versionarray
       $scope.versionarray=[];
       var verIndex =  $scope.versionarray.indexOf($scope.solN);
       console.log('$scope.versionarray === '+verIndex );
       //console.log('index===' +index);

       console.log('version22222===  ' +version);
       $scope.solN=sharedProperties.getCurrentCSolName();
       console.log("current solution name"+ $scope.solN);

       var solnIndex = $scope.solN.indexOf(version);
       console.log('solnIndex===' +solnIndex);

       $scope.username = sharedProperties.getProperty();
       console.log("current user"+  $scope.username );

       $http({
           method: 'POST',
           url: '/api/v2/deleteSolutionVersion',
           data: $.param({
               "uname":$scope.username ,
               "solnName": $scope.solN,
              "version":version
           }),
           headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
           //forms user object
       })
           .success(function (data, status, header, config) {

               if (data.errors) {
                   // Showing errors.
                   $scope.errorName = data.errors.name;
               } else {
                $scope.deletedSolName = data;
                  // $scope.data.splice(index, 1);
                console.log('deleted solution name==== '+JSON.stringify($scope.deletedSolName));
               }
           })
           .error(function (data, status, header, config) {
               console.log("header data" + header);
               console.log("status data" + status);
               console.log("config data" + JSON.stringify(config));
           })

       $scope.hybridversionObjectsArray.splice(version ,1);

       // $location.path('/deployment');
       $uibModalInstance.close();
   }
*/
    $scope.viewdelete=function(version,index) {
        console.log("geting data--->"+ $scope.varray[0]);
        console.log("index------>"+version)

        $scope.versionarray=[];

        var verIndex =  $scope.versionarray.indexOf($scope.solN);
        console.log('$scope.versionarray === '+verIndex );
        //console.log('index===' +index);

        console.log('version22222===  ' +version);
        $scope.solN=sharedProperties.getCurrentCSolName();
        console.log("current solution name"+ $scope.solN);

        var solnIndex = $scope.solN.indexOf(version);
        console.log('solnIndex===' +solnIndex);

        $scope.username = sharedProperties.getProperty();
        console.log("current user"+  $scope.username );

        $http({
            method: 'POST',
            url: '/api/v2/deleteSolutionVersion',
            data: $.param({
                "uname":$scope.username ,
                "solnName": $scope.solN,
                "version":version
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            //forms user object
        })
            .success(function (data, status, header, config) {

                if (data.errors) {
                    // Showing errors.
                    $scope.errorName = data.errors.name;
                } else {
                    $scope.deletedSolName = data;
                    // $scope.data.splice(index, 1);

                    console.log('deleted solution name==== '+JSON.stringify($scope.deletedSolName));
                }
            })
            .error(function (data, status, header, config) {
                console.log("header data" + header);
                console.log("status data" + status);
                console.log("config data" + JSON.stringify(config));
            })

        $scope.hybridversionObjectsArray.splice(version, 1);

        // $location.path('/deployment');
        // $uibModalInstance.close();
    }

    $scope.do_some_action_msp = function(version) {
        console.log('version===' +JSON.stringify(version));

        // alert(123);
        //$scope.users.splice(index, 1);
        $location.path('/viewArchietecture');
        $uibModalInstance.close();


    }
    /*$scope.savetoPdf=function(){
        /!*var doc = new jsPDF();
         doc.text(20,20,'Test Page1');
         doc.addPage();
         doc.text(20,20,'Test Page2');
         doc.save('Test.pdf');*!/
        console.log("from PDF button")
        html2canvas(document.getElementById("myArch"),{
            onrendered:function(canvas){
                var img = canvas.toDataURL("image/png");
                var doc = new jsPDF('landscape');
                doc.addImage(img,'JPEG',10,10);
                doc.save('ViewArch.pdf');
            }
        })
    }*/
   
})
