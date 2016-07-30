'use strict';
angular.module('portalControllers', ['ui.bootstrap'])
    .run(function ($rootScope, $location,$window,$route,$uibModalStack) {
        console.log("refresh page");
        //on refreshing through the browser should land to login page
        $rootScope.$on("$locationChangeStart", function(event, next, current) {
            console.log("refresh page event"+event);
            console.log("refresh page event next"+next);
            console.log("refresh page event current"+current);
            if(next==current) {
                console.log("refresh page");
                $location.path('/') ;
            }
        });
        $rootScope.$on('$locationChangeSuccess', function() {
            $rootScope.actualLocation = $location.path();
        });

        /*$rootScope.$on('$locationChangeStart', function(event, next, current){
            alert('Sorry ! Back Button is disabled');
            // Prevent the browser default action (Going back):
            event.preventDefault();
        });
*/
        // while going back through the browser should land to the previous page

       /* $rootScope.$on('$locationChangeStart', function(event) {
            if (!$rootScope.isAuthenticated) {
                event.preventDefault();
            }
        });*/
        $rootScope.$watch(function () {return $location.path()}, function (newLocation, oldLocation) {
            if($rootScope.actualLocation === newLocation) {

                $uibModalStack.dismissAll();
                event.preventDefault();
                window.history.forward();
            }
        });
    })


.filter('bytes', function() {
    return function(bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (typeof precision === 'undefined') precision = 1;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
    }
})


.directive("outsideClick", ['$document','$parse', function( $document, $parse ){
    return {
        link: function( $scope, $element, $attributes ){
            var scopeExpression = $attributes.outsideClick,
                onDocumentClick = function(event){
                    var isChild = $element.find(event.target).length > 0;

                    if(!isChild) {
                        $scope.$apply(scopeExpression);
                    }
                };

            $document.on("click", onDocumentClick);

            $element.on('$destroy', function() {
                $document.off("click", onDocumentClick);
            });
        }
    }
}])

     // directive for menu slide bar
    .directive('sidebarDirective', function() {
        return {
            link : function(scope, element, attr) {
                scope.$watch(attr.sidebarDirective, function(newVal) {
                    if(newVal)
                    {
                        element.addClass('show');
                        return;
                    }
                    element.removeClass('show');
                });
            }
        };
    })

    .directive('onlyDigits', function () {

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    if (inputValue == undefined) return '';
                    var transformedInput = inputValue.replace(/[^0-9]/g, '');
                    if (transformedInput !== inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }
                    return transformedInput;
                });
            }
        };
    })

    .directive('integer', function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl){
            modelCtrl.$parsers.unshift(function(viewValue){
                return parseInt(viewValue, 10);
            });
        }
    };
    })

    .directive('myEnter', function () {
        return function (scope, element, attrs) {
            element.bind('keydown keypress', function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.myEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })

    // controller for login page
    .controller('mainController',['$scope','$http','$location','$uibModal','sharedProperties','$anchorScroll','$window',function($scope,$http,$location,$uibModal,sharedProperties,$anchorScroll,$window){
        console.log("inside sample controller");
        $scope.showErrormsg = false;
        $scope.showMSP = true;
        $scope.showHybrid = true;
        $scope.showDepl = true;
        $scope.state = false;
        // function to logout from the portal
        $scope.logoutMsp = function() {
            console.log("inside logout msp");
            localStorage.clear();
            $location.path('/');
        };
       // on click of get started go to the services offered section
        $scope.gotoBottom = function() {
            $location.hash('bottom');
            $anchorScroll();
        };
        $http.get('/api/things').success(function (response) {
            $scope.sessionData = response;
            console.log('Session Data in Client Side-->'+JSON.stringify($scope.sessionData));
            $scope.UserDetails=$scope.sessionData.passport.user.emailaddress;
            $scope.contactName = $scope.sessionData.passport.user.cn;
            console.log('$scope.contactName===' +JSON.stringify($scope.contactName));
            sharedProperties.setProperty($scope.UserDetails);
            sharedProperties.setContactName($scope.contactName);
            console.log('Session User-->'+JSON.stringify($scope.UserDetails));
/*            $scope.Name=$scope.UserDetails._json.displayName;
            console.log('Email ID-->'+$scope.Name);*/
           

        });

        $scope.loadHybrid = function(){
            /*$location.path('/canvas');*/
            $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '../components/modal/solArchitecture.html',
                controller: 'solCtrl',
                windowClass: 'app-modal-window-sa',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                }
            });
        }

        $scope.navigateToMSP=function(){
            alert('MSP');
        };




        $scope.toggleState = function() {
            $scope.state = !$scope.state;
        };
        $scope.toggleStateHide = function(){
            $scope.state = false;
        }
        /*$scope.loadHybrid=function(){
            alert('Hybrid');
        };*/
        $scope.viewDepl=function(){
            $location.path('/deployment');
        };
        $scope.navMsp = function(){
            console.log('inside nav msp');
            /*$location.path('/MSP');*/
            $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '../components/modal/solArchitectureMsp.html',
                windowClass: 'app-modal-window-sam',
                controller: 'solCtrlMsp',
                backdrop: 'static',
                keyboard: false,
                resolve: {

                }
            });
        }

        $scope.logoutMsp = function() {
            console.log("inside logout msp");
            localStorage.clear();
            $location.path('/');
        }

        $scope.gotoBottom = function() {
            $location.hash('bottom');
            $anchorScroll();
        };
        /*$scope.load = function(){
            /!*$location.path('/canvas');*!/
            $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '../components/modal/solArchitecture.html',
                controller: 'solCtrl',
                windowClass: 'app-modal-window-sa',
                backdrop: 'static',
                resolve: {
                }
            });
        }*/

        $scope.navigateToMSP=function(){
            alert('MSP');
        };
        /*$scope.loadHybrid=function(){
            alert('Hybrid');
        };*/
        $scope.viewDepl=function(){
            //alert('Deployment');
            $location.path('/deployment');
        };

        $scope.navMsp = function(){
            console.log('inside nav msp');
            /*$location.path('/MSP');*/
            $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '../components/modal/solArchitectureMsp.html',
                windowClass: 'app-modal-window-sam',
                controller: 'solCtrlMsp',
                backdrop: 'static',
                keyboard: false,
                resolve: {

                }
            });
        }




        $scope.inputType = 'password';

        // Hide & show password function
        $scope.hideShowPassword = function(){
            $scope.isActive = !$scope.isActive;
            if ($scope.inputType == 'password')
                $scope.inputType = 'text';
            else
                $scope.inputType = 'password';
        };

        $scope.loginAuthentication = function(){
            console.log('inside login authentication');
            console.log($scope.itemData.userId);
            console.log($scope.itemData.pwd);
            $scope.loading=true;
            $http({
                method  : 'POST',
                url     : '/api/login',
                data    : $.param({uid: $scope.itemData.userId, pwd: $scope.itemData.pwd}),
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                //forms user object
            }).success(function(data,status,header,config) {

                console.log(data);
                $scope.response = data
                console.log($scope.response);
                console.log($scope.response.mystatus);
                $scope.uid = $scope.itemData.userId;
                $scope.pwd  = $scope.itemData.pwd;
                //console.log($scope.pwd);


                if (data.errors) {
                    // Showing errors.
                    $scope.errorName = data.errors.name;
                    console.log('$scope.errorName===' +JSON.stringify($scope.errorName));
                } else {
                    console.log("inside success function");
                    if ($scope.uid.length === 0) {
                        $scope.errorMsg = 'Login id is wrong';
                    }
                    else {
                        if ($scope.response.mystatus === true) {
                            console.log($scope.pwd);
                            console.log($scope.uid);
                            //sharedProperties.setProperty($scope.uid);
                            //$state.go('/home');
                            $location.path('/home');
                        }

                    }
                }

                $scope.loading=false;
            })
                .error(function(data,status,header,config){
                    console.log("header data" +header);
                    console.log("status data" +status);
                    console.log("config data" +JSON.stringify(config));
                    console.log("data===" +JSON.stringify(data));
                    $scope.loading=false;
                    $scope.showErrormsg = true;
                    $scope.msg = data;
                })

        }
    }])
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
            template: '<span class="loading"><img src="../images/ajax-loader.gif" width="80" height="80" /></span>',
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
        var Cn='';


        this.setProperty = function(userId) {
            console.log("userId==="+userId);
            user=userId;

        };
        this.getProperty=function () {
            return user;
        };
        this.setContactName = function(conName){
            console.log("conName===" +conName);
            Cn = conName;
        };
         this.getContactName = function(){
             return Cn;
         };

        this.setSoln = function(solutionName) {
            console.log("solnName==="+solutionName);
            soln=solutionName;
        };

        this.getSoln=function () {
            return soln;
        }
    })

.service('sharedPropertiesCanvas', function(){
        var cinfo='';
        var GuidPlanArray = [];
        var setPlansArray = [];

        this.setPlans = function (plan) {
            var index = _.findIndex(setPlansArray, function (data) {
                return data.serviceName === plan.serviceName;
            });
            if(index< 0 ){
            setPlansArray.push(plan);
            }
            else{
                setPlansArray[index] = plan;
            }

        }
        this.getPlans = function(){
            return setPlansArray;
        };

        this.setGuidPlan = function(guid){
            GuidPlanArray.push(guid);
        };
        this.getGuidPlan = function(){
            return GuidPlanArray;
        };

    this.setviewArchData = function(canInfo){
        console.log("canInfo===" +canInfo);
        cinfo = canInfo;
    };
    this.getCanvasinfo = function(){
        return cinfo;
    }
});

angular.module('portalControllers').controller('AttrCtrl', function ($scope,parentDivCall,countComp,serviceType,$uibModal,$uibModalInstance,sharedProperties,$http,$rootScope) {
    $scope.showMSPAttributes=false;
    $scope.showRuntimeAttributes=false;
    $scope.showServiceAttributes=false;

    $scope.Flavor = [
        {
            id:1,
            flavorName:'Redhat'
        }
    ]

    $scope.serverSize = [
        {
            id: 1,
            size: 'Small'
        },
        {
            id:2,
            size:'Medium'
        },
        {
            id:3,
            size:'Large'
        }

    ];

    $scope.names = [
        {
        id:1,
        name:'IND'
    },
        {
            id:2,
            name:'USD'
        }
    ]

    /*console.log('$scope.names[0].name===' +JSON.stringify($scope.names[0].name));
    $scope.selectedCountry = $scope.names[0].name;*/

    $scope.GetValue = function (con) {
        /*console.log('countryselect===' +JSON.stringify($scope.countryselect));*/
        $scope.countryId = $scope.ddlFruits;
        console.log('$scope.countryId===' + JSON.stringify($scope.countryId));
        console.log('$scope.currencyData===' + JSON.stringify($scope.currencyData));
        for(var i =0;i<$scope.currencyData.length;i++){
            $scope.countryselect = $scope.currencyData[i];
            console.log('$scope.countryselect==' + JSON.stringify($scope.countryselect));
            $scope.amountData = $scope.countryselect.amount;
            console.log('$scope.amountData==' + JSON.stringify($scope.amountData));
            $scope.countryData = $scope.countryselect['country'];
            console.log('$scope.countryData==' + JSON.stringify($scope.countryData));
            Object.keys($scope.amountData).forEach(function (key) {
                $scope.amountDataFirstKey = key;
                console.log("$scope.amountDataFirstKey == " + JSON.stringify($scope.amountDataFirstKey));
                $scope.amountDataFirstKeyValue = $scope.amountData[key];
                console.log("$scope.amountDataFirstKeyValue == " + JSON.stringify($scope.amountDataFirstKeyValue));
            })
            $scope.CountryPrice = $scope.amountDataFirstKeyValue;
        }
        /*var CountryPrice = $.grep($scope.amountData, function (con) {
            return con.country == countryId;
        })[0].amountDataFirstKeyValue;*/
        console.log("Selected Country: " + $scope.countryId + "\nSelected Price: " + $scope.CountryPrice);
    }
    if(serviceType==='msp') {
        console.log("inside msp portal ctrl");
        $scope.username = sharedProperties.getProperty();
        $scope.solnName = sharedProperties.getSoln();
        $scope.ngShowModal = true;
        $scope.showMSPAttributes=true;
        $scope.showRuntimeAttributes=false;
        $scope.showServiceAttributes=false;
        $scope.patternObjectIIB_Server = [];
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
                    console.log('key===' +key);
                    /*if (key === 'IIB Server') {
                     $scope.patternObjectIIB_Server = $scope.patternObject["IIB Server"];

                     } else if (key === 'DATAPOWER Server') {
                     $scope.patternObjectIIB_Server = $scope.patternObject["DATAPOWER Server"];

                     } else if (key === 'MYSQL Server') {
                     $scope.patternObjectIIB_Server = $scope.patternObject["MYSQL Server"];
                     }*/
                    $scope.patternObjectIIB_Server.push($scope.patternObject[key]);
                    console.log('$scope.patternObject[key]===' +JSON.stringify($scope.patternObject[key]));
                    $scope.sizing = $scope.patternObject[key];
                    console.log("sizing ==="+JSON.stringify($scope.sizing));
                    var keys=Object.keys($scope.patternObject);
                    var len=keys.length;
                    console.log("sizing obj length === "+len);
                    console.log("$scope.patternObjectIIB_Server == "+JSON.stringify($scope.patternObjectIIB_Server));
                    if($scope.sizing.hasOwnProperty("size") && $scope.sizing.size !== null && $scope.sizing.size !== undefined){
                        console.log("size property ====" +JSON.stringify($scope.sizing.size));
                        $scope.sizevalue = $scope.sizing.size;
                    }
                    else{
                        console.log("no key size");
                       $scope.sizing.size={"id":1,"size":"Small"};
                        console.log("printing sizing.size ===="+JSON.stringify($scope.sizing.size));
                        $scope.sizevalue = $scope.sizing.size;
                    }

                })
            }

        });

        $scope.changeServerSize = function(index,size,key){
            console.log('inside changeServerSize');
            console.log('key===>' +key);
            console.log('index===>' +index);
            console.log('size===>' +size);
            console.log('updated object values ==== ' + JSON.stringify($scope.patternObjectIIB_Server));
            var updatedSizeProperties = [
                {
                    type:'Small',
                    cpu :2,
                    memory:8,
                    disksize:40
                },
                {
                    type:'Medium',
                    cpu :4,
                    memory:16,
                    disksize:80

                },
                {
                    type:'Large',
                    cpu :8,
                    memory:32,
                    disksize:160

                }
            ]
            $scope.a = $scope.patternObjectIIB_Server[index];
            for(var i=0;i<updatedSizeProperties.length;i++){
                //var serverType = type[i]
                // ;
                var namCPU = key+'_vCPU';
                var namMemory = key+'_Memory';
                //invoke getComponentPrice on ng-change
                console.log('updated object values ==== ' + JSON.stringify($scope.patternObjectIIB_Server));
                /*$scope.popupData1["Pattern"]=$scope.patternObjectIIB_Server;*/
                console.log('updated popupData1 values ==== ' + JSON.stringify($scope.popupData1["Pattern"]));
                var reqObj = $scope.popupData1["Pattern"];
                console.log('reqObj === ' + reqObj);
                console.log('reqObj === ' + JSON.stringify(reqObj));
                $http({
                    method: 'POST',
                    url: 'http://cbicportal.mybluemix.net/api/getComponentPrice',
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
                        $scope.loading=false;
                    })

                //invokation ends
                var namDisksize = key+'_DiskSize';
                console.log('namCPU==' +namCPU);
                console.log("sizee ==="+JSON.stringify(size));
                console.log("size22 ====="+updatedSizeProperties[i].type);
                if(size.size.toLowerCase() === updatedSizeProperties[i].type.toLowerCase()){
                    console.log('inside if');
                    $scope.a['size']= size;  //adding size key and value to existing json
                    $scope.a[namCPU] = updatedSizeProperties[i].cpu;
                    $scope.a[namMemory] = updatedSizeProperties[i].memory;
                    $scope.a[namDisksize] = updatedSizeProperties[i].disksize;
                    break;
                }
            }
            $scope.patternObjectIIB_Server[index] = $scope.a;
            console.log('updated object values ==== ' + JSON.stringify($scope.patternObjectIIB_Server));
            //console.log('a===' +JSON.stringify(a));
        };


        $scope.changedValueSave = function () {
            console.log('updated object values ==== ' + JSON.stringify($scope.patternObjectIIB_Server));
            /*$scope.popupData1["Pattern"]=$scope.patternObjectIIB_Server;*/
            console.log('updated popupData1 values ==== ' + JSON.stringify($scope.popupData1["Pattern"]));
            var reqObj = $scope.popupData1["Pattern"];
            var data1={
                "IMI_Managed": "Y",
                "Pattern": JSON.stringify(reqObj)
            }
            console.log('data1==' +JSON.stringify(data1));
            console.log('reqObj === ' + reqObj);
            console.log('reqObj === ' + JSON.stringify(reqObj));
            $http({
                method: 'POST',
                url: '/api/getComponentPrice',
                data: $.param(data1),
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
                    $scope.loading=false;
                })
        };

        $scope.cancel = function () {
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
                url: '/api/v2/updateServiceInfo',
                data: $.param({
                    'uname': $scope.username,
                    'solnName': $scope.solnName,
                    'service_details': 'msp',
                    'service_name': $scope.attrCatalog_name,
                    'component_cnt': $scope.compAdded,
                    'solnjson': JSON.stringify($scope.popupData1),
                    'version':1
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
                    $scope.loading=false;

                });
            $uibModalInstance.dismiss('cancel');


        }

    }

    if(serviceType==='runtime') {
        console.log("inside runtime ctrl");
        $scope.showMSPAttributes=false;
        //$scope.quantityRuntime = '';
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
            /*$scope.instanceValueArray=$scope.instanceValue.split('MB');
             $scope.instanceValueFinal=$scope.instanceValueArray[0];
             console.log('changed valuess memory final === '+$scope.instanceValueFinal);*/
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
                    $scope.loading=false;

                })
        };

        $scope.cancel = function () {
            // $scope.ngShowModal = false;
            // parentDivCall.callInitMethod();
            $uibModalInstance.dismiss('cancel');
        };

        $scope.saveDataRuntime = function () {
            console.log("username==" +JSON.stringify($scope.username));
            console.log("solnName==" +JSON.stringify($scope.solnName));
            console.log("popupDataRuntime.title" + JSON.stringify($scope.popupDataRuntime.title));
            console.log("compRuntimeAdded" + JSON.stringify($scope.compRuntimeAdded));
            console.log("popupDataRuntime" + JSON.stringify($scope.popupDataRuntime));
            $http({
                method: 'PUT',
                url: '/api/v2/updateBMRuntimeInfo',
                data: $.param({
                    uname: $scope.username,
                    solnName: $scope.solnName,
                    service_details: 'runtime',
                    service_name: $scope.popupDataRuntime.title,
                    component_cnt: $scope.compRuntimeAdded,
                    solnjson: JSON.stringify($scope.popupDataRuntime),
                    version:1
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
                    $scope.loading=false;

                })
            $uibModalInstance.dismiss('cancel');


        }

    }

    if(serviceType==='bluemix') {
        /*console.log('$scope.names[0].name===' +JSON.stringify($scope.names[0].name));
        $scope.selectedCountry = $scope.names[0].name;
        console.log('$scope.selectedCountry[$index]===' +JSON.stringify($scope.selectedCountry));*/
        $scope.showMSPAttributes=false;
        $scope.showRuntimeAttributes=false;
        $scope.showServiceAttributes=true;
        $scope.ngShowModal = true;
        $scope.totalbluemixQuantity;
        $scope.planDataArray = [];
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
                console.log('$scope.bluemixServiceTitle===' +JSON.stringify($scope.bluemixServiceTitle));
            }
           /* if(key === 'quantity'){
                var quantity=$scope.popupDataService["quantity"];
                console.log("Quantity ======"+ quantity);
                $scope.unitQuantity=quantity;
            }*/
            if (key === 'properties') {
                // $scope.propertiesObject = {};
                $scope.propertiesObjectArray = $scope.popupDataService["properties"];
                console.log('propertiesObject == ' + JSON.stringify($scope.propertiesObjectArray));
                $scope.propertiesObjectArrayData = $scope.propertiesObjectArray[0];
                console.log('propertiesObject == ' + JSON.stringify($scope.propertiesObjectArrayData));
                /*console.log('$scope.names[0].name===' +JSON.stringify($scope.names[0].name));
                $scope.selectedCountry = $scope.names[0].name;
                console.log('$scope.selectedCountry[$index]===' +JSON.stringify($scope.selectedCountry));*/
                //console.log('propertiesObject == ' + JSON.stringify($scope.propertiesObjectArray[0].selected));
                $scope.propertiesObjectArrayData.names = $scope.names;
                for (var i = 0; i < $scope.propertiesObjectArrayData.length; i++) {
                    $scope.propertiesObject=$scope.propertiesObjectArrayData[i];
                    Object.keys($scope.propertiesObject).forEach(function (key) {
                        $scope.propertiesObjectFirstKey = key;
                        console.log("$scope.propertiesObjectFirstKey == " + JSON.stringify($scope.propertiesObjectFirstKey));
                        $scope.propertiesObjectFirstKeyValue = $scope.propertiesObject[key];
                        console.log("$scope.propertiesObjectFirstKeyValue == " + JSON.stringify($scope.propertiesObjectFirstKeyValue));


                        if($scope.propertiesObjectFirstKey === 'selected'){
                            $scope.selectedFlag = $scope.propertiesObjectFirstKeyValue;
                            console.log('$scope.selectedFlag===' +JSON.stringify($scope.selectedFlag));
                            if($scope.selectedFlag === "true"){
                                console.log("selectedflag"+$scope.selectedFlag)
                                console.log("data is===="+JSON.stringify($scope.propertiesObject));
                                console.log("plan data ===="+$scope.propertiesObject.entity.extra.displayName);
                                $scope.selectvalue = $scope.propertiesObject.entity.extra.displayName;
                                console.log("plan data ===="+$scope.selectvalue);
                                $.each($scope.popupDataService, function (key, value) {
                                    if(key === 'quantity'){
                                        var quantity=$scope.popupDataService["quantity"];
                                        console.log("Quantity ======"+ quantity);
                                        $scope.unitQuantity=quantity;
                                    }

                                })

                            }

                        }
                        if($scope.propertiesObjectFirstKey === 'metadata'){
                            $scope.guid_data = $scope.propertiesObjectFirstKeyValue;
                            console.log('$scope.guid_data===' +JSON.stringify($scope.guid_data));
                            $scope.service_plan_guid = $scope.guid_data.guid;
                            console.log('$scope.service_plan_guid===' +$scope.service_plan_guid);
                        }

                        if($scope.propertiesObjectFirstKey === 'entity') {
                            $scope.entity_data = $scope.propertiesObjectFirstKeyValue;
                            console.log('$scope.entity_data===' + JSON.stringify($scope.entity_data));
                            /*$scope.planData = $scope.entity_data.name;
                            console.log('$scope.planData===' + $scope.planData);
                            $scope.planDataArray.push($scope.planData);*/
                            console.log('$scope.planDataArray===' +JSON.stringify($scope.planDataArray));
                            $scope.descriptionData = $scope.entity_data.description;
                            console.log('$scope.descriptionData===' + JSON.stringify($scope.descriptionData));
                            $scope.planDataArray.push($scope.descriptionData);
                            console.log('$scope.planDataArray===' +JSON.stringify($scope.planDataArray));
                            $scope.extraData = $scope.entity_data.extra;
                            console.log('$scope.extraData===' + JSON.stringify($scope.extraData));
                            if ($scope.entity_data.free === false) {
                                $scope.bulletdata = $scope.extraData.bullets[0];
                                console.log('$scope.bulletdata===' + JSON.stringify($scope.bulletdata));
                                $scope.costData = $scope.extraData.costs;
                                console.log('$scope.costdata===' + JSON.stringify($scope.costData));
                                console.log('$scope.costdata===' + JSON.stringify($scope.costData[0]));
                                $scope.totalbluemixQuantity = $scope.costData[0].unitQuantity;
                                console.log('$scope.totalbluemixQuantity===' + JSON.stringify($scope.totalbluemixQuantity));
                                $scope.unitID = $scope.costData[0].unitId;
                                console.log('$scope.unitID===' + JSON.stringify($scope.unitID));
                            }
                            else if($scope.entity_data.free === true){
                                $scope.unitID = 'discount';
                                console.log('$scope.unitID===' + JSON.stringify($scope.unitID));
                            }
                        }

                        if($scope.propertiesObjectFirstKey === 'extra'){
                            $scope.extraData = $scope.propertiesObjectFirstKeyValue;
                            console.log(' $scope.extraData===' + JSON.stringify($scope.extraData));
                            /*$scope.bulletData = $scope.extraData.bullets[0];
                            console.log(' $scope.bulletData===' + JSON.stringify($scope.bulletData));*/
                            $scope.costData = $scope.extraData.costs;
                            console.log('$scope.costdata===' + JSON.stringify($scope.costData));
                            //$scope.currencyData = $scope.costData[0].currencies;
                            console.log('$scope.currencyData===' + JSON.stringify($scope.currencyData));

                        }
                    })


                }
            }
        });
        $scope.pricedata = {};
        $scope.showPriceBefore= true;
        $scope.showPriceAfter = false;

        $scope.changedBluemixValueSave = function(quantity,guid,unitID,country,price){
            console.log('property.entity.extra.costs[0].unitQuantity===' +JSON.stringify(quantity[price]));
            console.log('guid===' +guid);
           /* $scope.guidPlanArray = [];
            $scope.guidPlanArray.push(guid);*/
           // console.log('$scope.guidPlanArray===' +JSON.stringify($scope.guidPlanArray));
            console.log('country===' +country.name );
            console.log('unitID===' +unitID );
            //console.log('isselected===' +isselected);
            console.log('price===' +price);
            //$scope.latestPrice = price;
            $scope.latestQuantity = quantity;
            console.log('$scope.bluemixServiceTitle===' +JSON.stringify($scope.bluemixServiceTitle));
            $scope.viewbluemixPrice = true;
            $scope.loading=true;
            $http({
                method: 'POST',
                url: '/api/getBMServicePrice',
                data: $.param({
                    "quantity": quantity[price],
                    "country": country.name,
                    "serviceplan_guid":guid,
                    "service_name":$scope.bluemixServiceTitle,
                    "unit_id":unitID
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
                        //$scope.latestQuantity = data;
                        $scope.pricedata[price] = data;
                        $scope.latestPrice = $scope.pricedata[price]
                        console.log(JSON.stringify($scope.pricedata));
                        console.log(JSON.stringify($scope.latestPrice));
                        $scope.showPriceBefore= false;
                        $scope.showPriceAfter = true;
                    }
                    $scope.loading=false;
                    $scope.viewbluemixPrice = false;

                })
                .error(function (data, status, header, config) {
                    console.log("header data" + header);
                    console.log("status data" + status);
                    console.log("config data" + JSON.stringify(config));
                    $scope.loading=false;

                })
        };
        $scope.cost = function(index) {
            return $scope.pricedata;

        };

        $scope.cancel = function () {
            // parentDivCall.callInitMethod();
            $uibModalInstance.dismiss('cancel');
        };
        $scope.saveDataService = function (radioselected,displayName,title) {

            console.log('radioselected===' +JSON.stringify(radioselected));
            console.log("display name===="+ displayName);
            //console.log('index===' +index);
            console.log('$scope.latestPrice==' +$scope.latestPrice);
            console.log('$scope.latestPrice==' +$scope.pricedata);
            console.log('$scope.latestQuantity===' +$scope.latestQuantity);
            //console.log('quantity==' +quantity);
            //console.log('price===' +price);
            console.log('title===' +title);
            console.log("BluemixTitle" + JSON.stringify($scope.popupDataService.title));
            var indexCourseId = _.findIndex($scope.propertiesObjectArrayData, function (data) {
                return data.entity.extra.displayName === radioselected;
            });
            console.log('indexCourseId==' +indexCourseId);
            var guid = $scope.propertiesObjectArrayData[indexCourseId].metadata.guid;
            console.log('guid===' +JSON.stringify(guid));


             $rootScope.bluemixPlanModal = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '../components/modal/BluemixPlanSave.html',
                windowClass: 'app-modal-window-sam-Plan',
                controller: 'BluemixPlanCtrl',
                backdrop: 'static',
                keyboard: false,
                scope:$rootScope,
                resolve: {
                    serviceTitle: function () {
                        return $scope.popupDataService.title;
                    },
                    compCount:function () {
                        return $scope.compServiceAdded;
                    },
                    popupData:function () {
                        return $scope.popupDataService;
                    },
                    guidPlan:function () {
                        return guid;
                    },
                    planName : function(){
                        return radioselected;
                    },
                   quantitySelected : function(){
                        return $scope.latestQuantity ;
                    },
                    estimateSelected : function(){
                        return $scope.latestPrice;
                    },
                    latestTitle : function(){
                        return title;
                    },
                }
            });
        }



    }



});


angular.module('portalControllers').controller('BluemixPlanCtrl', function ($scope,$uibModal,$uibModalInstance,$location,$http,sharedProperties,serviceTitle,compCount,popupData,guidPlan,planName,sharedPropertiesCanvas,quantitySelected,estimateSelected,latestTitle,$rootScope) {
    $scope.openConfirmBluemixPlan = true;
    $scope.savebluemixPlan = false;
    //console.log('indexBluemix===' +indexBluemix);
    $scope.dismissDel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    console.log('serviceTitle==' +serviceTitle);
    console.log('quantitySelected==' +quantitySelected);
    console.log('estimateSelected===' +estimateSelected);

    console.log('latestTitle==' +latestTitle);
    console.log('compCount==' +compCount);
    console.log('popupData==' +JSON.stringify(popupData));
    /*var indexB = ob(popupData, function (data) {
        return data.title === serviceTitle;
    });*/
    //console.log('indeB===' +indexB);
   // $scope.p = $scope.popupData;
    //console.log('$scope.p===' +JSON.stringify($scope.p));
   popupData['price']= estimateSelected;
    popupData['quantity']= quantitySelected;
     //$scope.popupData[indexB] = $scope.p;
    console.log('UpdatedpopupData==' +JSON.stringify(popupData));
    console.log('guidPlan==' +guidPlan);
    sharedPropertiesCanvas.setGuidPlan(guidPlan);
    $scope.username = sharedProperties.getProperty();
    console.log('$scope.username===' +$scope.username);
    $scope.solnName = sharedProperties.getSoln();
    console.log('$scope.solnName===' +$scope.solnName);

    $scope.SavePlan = function(){
        console.log('updatedPopupData==' +JSON.stringify(popupData));
        /*console.log('index==' +indexBluemix);
        $scope.p = $scope.popupData[indexBluemix];
         $scope.p['price']= estimateSelected;
         $scope.p['quantity']= quantitySelected;
        console.log('updatedPopupData==' +JSON.stringify(popupData));*/
        $scope.guidPlanArray = [];
        //$scope.guidPlanArray.push(guidPlan);
        $scope.savebluemixPlan = true;
        $scope.loading = true;
        $http({
            method: 'PUT',
            url: '/api/v2/updateBMServiceInfo',
            data: $.param({
                uname: $scope.username,
                solnName: $scope.solnName,
                service_details: 'bluemix',
                service_name: serviceTitle,
                component_cnt: compCount,
                solnjson: JSON.stringify(popupData),
                service_guid:guidPlan,
                version:1
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
                    var plans = { serviceName : serviceTitle, guid : guidPlan,plan : planName , quantity : quantitySelected , estimate : estimateSelected};
                    sharedPropertiesCanvas.setPlans(plans);
                    $scope.PostDataResponse = data;
                    console.log(JSON.stringify($scope.PostDataResponse));
                    $scope.savebluemixPlan = true;
                    $scope.loading = true;
                    $rootScope.bluemixPlanModal.dismiss('cancel');
                    $rootScope.bluemixAttrModal.dismiss('cancel');
                   // $uibModalInstance.dismiss('cancel');

                    //$scope.modal1.dismiss('cancel');

                }

            })
            .error(function (data, status, header, config) {
                console.log("header data" + header);
                console.log("status data" + status);
                console.log("config data" + JSON.stringify(config));
                $scope.loading=false;

            });
    };

    $uibModalInstance.dismiss('cancel');

    $scope.chooseAnother = function(){
        $uibModalInstance.dismiss('cancel');
    }

});

angular.module('portalControllers').controller('solCtrl', function ($scope,$uibModal,$uibModalInstance,$location,$rootScope) {
    // alert("inside solution  ctrl");
    $scope.ngShowModal1 = true;
    $scope.dismissModal = function () {
     $uibModalInstance.dismiss('cancel');
        $location.path('/home');
     };
    $scope.createItem = function(){
        $uibModalInstance.dismiss('cancel');


        $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: '../components/modal/solutionPopup.html',
            controller: 'solutionCtrl',
            windowClass: 'app-modal-window-solpop',
            backdrop: 'static',
            keyboard: false,
            resolve: {

            }
        });
        $rootScope.componentCount=0;
        console.log("$rootScope.componentCount=====>"+$rootScope.componentCount)
    }
    $scope.openItem = function(){
        $uibModalInstance.dismiss('cancel');
        $location.path('/deployment');
    }
});
angular.module('portalControllers').controller('newsolCtrl', function ($scope,$uibModal,$uibModalInstance,$location,$rootScope) {
    // alert("inside solution  ctrl");
    $scope.ngShowModalNew1 = true;
    /*$scope.dismissModal = function () {
     $uibModalInstance.dismiss('cancel');
     };*/
    $rootScope.componentCount=0;
    $scope.createItem = function(){
        $uibModalInstance.dismiss('cancel');

        $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: '../components/modal/newSolutionPopup.html',
            controller: 'newsolutionCtrl',
            windowClass: 'app-modal-window-nspop',
            backdrop: 'static',
            keyboard: false,
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
                $scope.loading=false;

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
                $scope.loading=false;

            })
    }

});
angular.module('portalControllers').controller('orderBillCtrl', function ($scope,$uibModal,$uibModalInstance,isOrderButton,sharedProperties,$http,$location,sharedPropertiesCanvas) {
    console.log('inside orderbill');
    $scope.propMSP = false;
    $scope.propRuntime = false;
    $scope.propServices = false;
    //$scope.followBtnImgUrl = '../../images/btn_panelexpand.png';
    $scope.followBtnImgUrlRuntime = '../../images/btn_panelexpand.png';
    $scope.followBtnImgUrlServices = '../../images/btn_panelexpand.png';
    $scope.followBtnImgUrl = '../../images/btn_panelexpand.png';
    if(isOrderButton==='viewBOM'){
        $scope.showOrderBtn = true;
    }else if(isOrderButton==='deplBOM'){
        $scope.showOrderBtn = false;
    }
    $scope.latestPlans = sharedPropertiesCanvas.getPlans();
    console.log('$scope.latestPlans===' +JSON.stringify($scope.latestPlans));
    $scope.exportData = function () {
        var blob = new Blob([document.getElementById('exportable').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Report.xls");
    };
$scope.propMSP = [];
    $scope.displaypropDiv = function(index){
        console.log('index===' +index);
        console.log('inside display prop');
        if ($scope.followBtnImgUrl === '../../images/btn_panelexpand.png') {
            $scope.followBtnImgUrl = '../../images/btn_panelhide.png';
            $scope.propMSP[index] = true;
            /*$scope.propRuntime = true;
             $scope.propServices = true;*/
        } else {
            $scope.followBtnImgUrl = '../../images/btn_panelexpand.png';
            $scope.propMSP[index] = false;
            /* $scope.propRuntime = false;
             $scope.propServices = false;*/
        }
    };

    $scope.propRuntime = [];
    $scope.displaypropDivRuntime = function(index){
        console.log('index===' +index);
        console.log('inside display prop');
        if ($scope.followBtnImgUrlRuntime === '../../images/btn_panelexpand.png') {
            $scope.followBtnImgUrlRuntime = '../../images/btn_panelhide.png';
            //$scope.propMSP = true;
            $scope.propRuntime[index] = true;
            // $scope.propServices = true;
        } else {
            $scope.followBtnImgUrlRuntime = '../../images/btn_panelexpand.png';
            //$scope.propMSP = false;
            $scope.propRuntime[index] = false;
            //$scope.propServices = false;
        }
    };
    $scope.propServices = [];
    $scope.displaypropDivBluemix = function(index){
        console.log('index===' +index);
        console.log('inside display prop');
        if ($scope.followBtnImgUrlServices === '../../images/btn_panelexpand.png') {
            $scope.followBtnImgUrlServices = '../../images/btn_panelhide.png';
            //$scope.propMSP = true;
            //$scope.propRuntime = true;
            $scope.propServices[index] = true;
            console.log('$scope.propServices==' +$scope.propServices);
        } else {
            $scope.followBtnImgUrlServices = '../../images/btn_panelexpand.png';
            //$scope.propMSP = false;
            //$scope.propRuntime = false;
            $scope.propServices[index] = false;
        }
    };
    $scope.ngShowModal4 = true;
    $scope.serialNumber=0;
    $scope.dismissOrder = function () {
        $uibModalInstance.dismiss('cancel');
    };


    $scope.dismissOrderBill = function () {
        $uibModalInstance.dismiss('cancel');
        //$location.path('/deployment');
    };


    $scope.viewBillOfOrderArray=[];
    $scope.patternObjectIIB_Server={};
    $scope.solnEntered=sharedProperties.getSoln();
    $scope.quantityValueArray=[];
    var userName = sharedProperties.getProperty();
    console.log('userName===' +JSON.stringify(userName))
    $scope.spinsCatalogueList=false;
    $scope.spinsCanvas=false;
    $scope.spinsCatalogueList = false;
    $scope.spinsViewBoM = true;
    $scope.loading = true;
    /*var newver = sharedProperties.getNewersion();
    console.log("version=============="+newver);*/

    console.log()
    $http.get("/api/v2/viewBillofMaterial?solnName="+$scope.solnEntered+"&uname="+userName+"&version="+1).success(function(data){
        $scope.ResponseDataViewBillObject = data;
        console.log('view bill of material === '+JSON.stringify($scope.ResponseDataViewBillObject));
        sharedPropertiesCanvas.setviewArchData($scope.ResponseDataViewBillObject);
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
                        'productLC':'',
                        'productDisktype':'',
                        'servermw':'',
                        'servermemory':'',
                        'serveros':'',
                        'serverdisksize':'',
                        'servercpu':''
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
                                /*$scope.viewBillOfOrder.quantity=$scope.MSPVBPatternObject_Server;
                                console.log('$scope.viewBillOfOrder====' +JSON.stringify($scope.viewBillOfOrder));*/
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
                                    if (isQuantityKey.indexOf("Server_DiskType") !== -1) {
                                        $scope.serialNumber++;
                                        console.log('found disktype key');
                                        $scope.MSPVBPatternObjectDisktype = $scope.MSPVBPatternObject_Server[isQuantityKey];
                                        console.log('$scope.MSPVBPatternObjectDisktype == ' + $scope.MSPVBPatternObjectDisktype);
                                        $scope.viewBillOfOrder.productDisktype=$scope.MSPVBPatternObjectDisktype;
                                        $scope.quantityValueArray.push($scope.MSPVBPatternObjectDisktype);
                                        console.log('$scope.quantityValueArray == '+$scope.quantityValueArray);
                                    }
                                    if (isQuantityKey.indexOf("Server_M/W") !== -1) {
                                        $scope.serialNumber++;
                                        console.log('found server_m/w key');
                                        $scope.MSPVBPatternObjectservermw = $scope.MSPVBPatternObject_Server[isQuantityKey];
                                        console.log('$scope.MSPVBPatternObjectservermw == ' + $scope.MSPVBPatternObjectservermw);
                                        $scope.viewBillOfOrder.servermw=$scope.MSPVBPatternObjectservermw;
                                        $scope.quantityValueArray.push($scope.MSPVBPatternObjectservermw);
                                        console.log('$scope.quantityValueArray == '+$scope.quantityValueArray);
                                    }


                                    if (isQuantityKey.indexOf("Server_Memory") !== -1) {
                                        $scope.serialNumber++;
                                        console.log('found Server_Memory key');
                                        $scope.MSPVBPatternObjectservermemory = $scope.MSPVBPatternObject_Server[isQuantityKey];
                                        console.log('$scope.MSPVBPatternObjectservermemory == ' + $scope.MSPVBPatternObjectservermemory);
                                        $scope.viewBillOfOrder.servermemory=$scope.MSPVBPatternObjectservermemory;
                                        $scope.quantityValueArray.push($scope.MSPVBPatternObjectservermemory);
                                        console.log('$scope.quantityValueArray == '+$scope.quantityValueArray);
                                    }

                                    if (isQuantityKey.indexOf("Server_O/S") !== -1) {
                                        $scope.serialNumber++;
                                        console.log('found Server_O/S key');
                                        $scope.MSPVBPatternObjectserveros = $scope.MSPVBPatternObject_Server[isQuantityKey];
                                        console.log('$scope.MSPVBPatternObjectserveros == ' + $scope.MSPVBPatternObjectserveros);
                                        $scope.viewBillOfOrder.serveros=$scope.MSPVBPatternObjectserveros;
                                        $scope.quantityValueArray.push($scope.MSPVBPatternObjectserveros);
                                        console.log('$scope.quantityValueArray == '+$scope.quantityValueArray);
                                    }

                                    if (isQuantityKey.indexOf("Server_DiskSize") !== -1) {
                                        $scope.serialNumber++;
                                        console.log('found Server_DiskSize key');
                                        $scope.MSPVBPatternObjectserverdisksize = $scope.MSPVBPatternObject_Server[isQuantityKey];
                                        console.log('$scope.MSPVBPatternObjectserveros == ' + $scope.MSPVBPatternObjectserverdisksize);
                                        $scope.viewBillOfOrder.serverdisksize=$scope.MSPVBPatternObjectserverdisksize;
                                        $scope.quantityValueArray.push($scope.MSPVBPatternObjectserverdisksize);
                                        console.log('$scope.quantityValueArray == '+$scope.quantityValueArray);
                                    }
                                    if (isQuantityKey.indexOf("Server_vCPU") !== -1) {
                                        $scope.serialNumber++;
                                        console.log('found Server_vCPU key');
                                        $scope.MSPVBPatternObjectservercpu = $scope.MSPVBPatternObject_Server[isQuantityKey];
                                        console.log('$scope.MSPVBPatternObjectserveros == ' + $scope.MSPVBPatternObjectservercpu);
                                        $scope.viewBillOfOrder.servercpu=$scope.MSPVBPatternObjectservercpu;
                                        $scope.quantityValueArray.push($scope.MSPVBPatternObjectservercpu);
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
                                    if (key === 'properties') {
                                        $scope.propertiesOArray = $scope.bluemixServiceObject[key];
                                        console.log('propertiesOArray == ' + JSON.stringify($scope.propertiesOArray));
                                        $scope.propertiesObjectArrayData = $scope.propertiesOArray[0];
                                        console.log('propertiesObject == ' + JSON.stringify($scope.propertiesObjectArrayData));
                                        for (var i = 0; i < $scope.propertiesObjectArrayData.length; i++) {
                                            $scope.propertiesObject=$scope.propertiesObjectArrayData[i];
                                            Object.keys($scope.propertiesObject).forEach(function (key) {
                                                $scope.propertiesObjectFirstKey = key;
                                                console.log("$scope.propertiesObjectFirstKey == " + JSON.stringify($scope.propertiesObjectFirstKey));
                                                $scope.propertiesObjectFirstKeyValue = $scope.propertiesObject[key];
                                                console.log("$scope.propertiesObjectFirstKeyValue == " + JSON.stringify($scope.propertiesObjectFirstKeyValue));
                                                if($scope.propertiesObjectFirstKey === 'metadata'){
                                                    $scope.guid_data = $scope.propertiesObjectFirstKeyValue;
                                                    console.log('$scope.guid_data===' +JSON.stringify($scope.guid_data));
                                                    $scope.service_plan_guid = $scope.guid_data.guid;
                                                    console.log('$scope.service_plan_guid===' +$scope.service_plan_guid);
                                                }

                                                if($scope.propertiesObjectFirstKey === 'entity') {
                                                    $scope.entity_data = $scope.propertiesObjectFirstKeyValue;
                                                    console.log('$scope.entity_data===' + JSON.stringify($scope.entity_data));
                                                   /* $scope.planData = $scope.entity_data.name;
                                                    console.log('$scope.planData===' + $scope.planData);
                                                    $scope.descriptionData = $scope.entity_data.description;*/
                                                    //console.log('$scope.descriptionData===' + JSON.stringify($scope.descriptionData));
                                                    $scope.extraData = $scope.entity_data.extra;
                                                    console.log('$scope.extraData===' + JSON.stringify($scope.extraData));
                                                    if ($scope.entity_data.free === false) {
                                                        $scope.bulletdata = $scope.extraData.bullets[0];
                                                        console.log('$scope.bulletdata===' + JSON.stringify($scope.bulletdata));
                                                        $scope.costData = $scope.extraData.costs;
                                                        console.log('$scope.costdata===' + JSON.stringify($scope.costData));
                                                        console.log('$scope.costdata===' + JSON.stringify($scope.costData[0]));
                                                        $scope.totalbluemixQuantity = $scope.costData[0].unitQuantity;
                                                        console.log('$scope.totalbluemixQuantity===' + JSON.stringify($scope.totalbluemixQuantity));
                                                        $scope.unitID = $scope.costData[0].unitId;
                                                        console.log('$scope.unitID===' + JSON.stringify($scope.unitID));
                                                    }
                                                    else if($scope.entity_data.free === true){
                                                        $scope.unitID = 'discount';
                                                        console.log('$scope.unitID===' + JSON.stringify($scope.unitID));
                                                    }
                                                }

                                                if($scope.propertiesObjectFirstKey === 'extra'){
                                                    $scope.extraData = $scope.propertiesObjectFirstKeyValue;
                                                    console.log(' $scope.extraData===' + JSON.stringify($scope.extraData));
                                                    /*$scope.bulletData = $scope.extraData.bullets[0];
                                                     console.log(' $scope.bulletData===' + JSON.stringify($scope.bulletData));*/
                                                    $scope.costData = $scope.extraData.costs;
                                                    console.log('$scope.costdata===' + JSON.stringify($scope.costData));
                                                    //$scope.currencyData = $scope.costData[0].currencies;
                                                    console.log('$scope.currencyData===' + JSON.stringify($scope.currencyData));

                                                }
                                            })


                                        }
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
                                    if(key === 'plan'){
                                        $scope.planRuntime = $scope.bluemixRuntimeObject[key];
                                        console.log('$scope.planRuntime===' +$scope.planRuntime);
                                    }
                                    if(key==='properties'){
                                        $scope.bluemixRuntimeVBPropertiesObject=$scope.bluemixRuntimeObject[key];
                                        Object.keys($scope.bluemixRuntimeVBPropertiesObject).forEach(function(key){
                                            if(key==='price'){
                                                $scope.bluemixRuntimeVBPrice=$scope.bluemixRuntimeVBPropertiesObject[key];
                                                console.log('$scope.bluemixRuntimeVBPrice === '+$scope.bluemixRuntimeVBPrice);
                                            }
                                            if(key ==='memory'){
                                                $scope.bluemixRuntimememory=$scope.bluemixRuntimeVBPropertiesObject[key];
                                                console.log('$scope.bluemixRuntimememory === '+$scope.bluemixRuntimememory);
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
            if(key === 'Final_MSP_Price'){
                $scope.viewBillFinalMSPPrice=$scope.ResponseDataViewBillObject[key];
            }
            if(key === 'Final Bluemix service Price'){
                $scope.viewBillFinalBluemixPrice=$scope.ResponseDataViewBillObject[key];
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

});
