angular.module('portalControllers').controller('viewDeploymentArchCtrl', function ($scope,$timeout,$window,$uibModal,$rootScope,sharedProperties,$location,$http,sharedPropertiesCanvas) {
    console.log('inside viewDeploymentArchCtrl');
    $scope.state = false;
    $rootScope.showhideprop=false;

    //pj----->
    $scope.spinsCatalogueList=false;
    $scope.lineAdded=0;
    $scope.spinsCanvas=false;
    $scope.spinsGetServiceInfo=false;
    $scope.spinsUpdateServiceInfo=false;
    $scope.spinsBOM=false;
    $scope.objCount=0;
    $scope.MSPComponentCount=0;
    $scope.bluemixRuntimeComponentCount=0;
    $scope.bluemixServiceComponentCount=0;
    $scope.openpopupMSPCount=0;
    $scope.openpopupRuntimeCount=0;
    $scope.openpopupBluemixCount=0;
    $scope.previousOrders=true;
    $scope.drafts=false;
    $scope.MSP=true;
    $scope.Bluemix=false;
    $scope.showMspCatalogue = false;
    $scope.showBlueCatalogue = false;
    $scope.runtimeCatalogue = false;
    $scope.servicesCatalogue = false;
    $scope.state = false;
    $scope.showMSP = true;
    $scope.showHybrid = true;
    $scope.showDepl = true;

    //--
    //canvas function code

    $scope.editHybrid = function(){
        $scope.isActiveHybrid = !$scope.isActiveHybrid;
    };

    $scope.toggleState = function() {
        $scope.state = !$scope.state;
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
            resolve: {

            }
        });
    }

    //bill of meterial-->
    $scope.viewBill = function(){
        console.log("from viewBill------------->")
        $scope.newVer= sharedProperties.getNewersion();
        console.log("current version ----->"+$scope.newVer)
        /*console.log("created canvas== "+canvas);
         console.log("Current canvas : " + JSON.stringify(canvas));*/
        $scope.canvasCreated=JSON.stringify(canvas);
        console.log("Current canvasCreated : " + $scope.canvasCreated);
        var s1=canvas;
        console.log('s1 type === '+typeof s1);
        $scope.currentUser1 = sharedProperties.getProperty();
        console.log('userEntered == ' + $scope.currentUser1);
        // $scope.solnEntered1 = sharedProperties.getSoln();
        $scope.solnEntered1=sharedProperties.getCurrentCSolName();
        console.log('solnEntered1 == ' + $scope.solnEntered1);

        /* /!*console.log("created canvas== "+canvas);
         console.log("Current canvas : " + JSON.stringify(canvas));*!/
         $scope.canvasCreated=JSON.stringify(canvas);
         console.log("Current canvasCreated : " + $scope.canvasCreated);
         var s1=canvas;
         console.log('s1 type === '+typeof s1);
         $scope.currentUser1 = sharedProperties.getProperty();
         console.log('userEntered == ' + $scope.currentUser1);
         $scope.solnEntered1=sharedProperties.getCurrentCSolName();
         console.log('solnEntered1 == ' + $scope.solnEntered1);

         $scope.newVer= sharedProperties.getVersion();
         console.log("current version ----->"+$scope.newVer)*/



        $scope.spinsViewBoM = true;
        $scope.spinsRuntimeList = false;
        $scope.spinsServicesList=false;
        $scope.spinsCanvasCatalogue = false;
        $scope.spinsCanvas=false;
        $scope.loading=true;
        $http({
            method: 'PUT',
            url: '/api/v2/updateCanvasInfo',
            data: $.param({
                'uname':  $scope.currentUser1,
                'solnName': $scope.solnEntered1,
                'canvasinfo': $scope.canvasCreated,
                'version':$scope.newVer
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
                $scope.spinsViewBoM = false;

            })
            .error(function (data, status, header, config) {
                console.log("header data" + header);
                console.log("status data" + status);
                console.log("config data" + JSON.stringify(config));

            })

        $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: '../components/modal/orderBill.html',
            size: 'lg',
            controller: 'orderBillCtrl',
            windowClass: 'app-modal-window-o',
            backdrop: 'static',
            resolve: {
                isOrderButton:function(){
                    return 'viewBOM';
                }
            }
        });
    };
    //------------------
//---------------


   /* var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');



    download.addEventListener("click", function() {
        // only jpeg is supported by jsPDF
        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        var pdf = new jsPDF();

        pdf.addImage(imgData, 'JPEG', 0, 0);
        var download = document.getElementById('download');

        pdf.save("download.pdf");
    }, false);
*/

    ///==================

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
    }

    $scope.viewDepl=function(){
        $location.path('/deployment');
    };

    $scope.checkTab = function (num) {
        //alert($scope.arr[0]);
        if (num == 1) {
            $scope.showMspCatalogue = true;
            $scope.showBlueCatalogue = false;
            $scope.Bluemix=false;
            $scope.MSP=true;
            $scope.previousOrders=true;
            $scope.drafts=false;
            $scope.spinsCatalogueList=true;
            $scope.spinsCanvas=false;
            $scope.spinsCanvasCatalogue = false;
            $scope.loading=true;
            $http.get("/api/v1/getMspComponentlists",{ cache: true}).success(function(data){
                // console.log("Data : " + JSON.stringify(data));
                $scope.arrayOfComponents = data;
                console.log("new array data before === "+JSON.stringify($scope.arrayOfComponents));
                console.log("new array datalength before === "+$scope.arrayOfComponents.length);
                for(var i=0 ; i<$scope.arrayOfComponents.length; i++)
                {
                    if($scope.arrayOfComponents[i].catalog_name=='ibm_tealeaf'||$scope.arrayOfComponents[i].catalog_name==='filenet'||$scope.arrayOfComponents[i].catalog_name==='ibm_bpm'||$scope.arrayOfComponents[i].catalog_name==='ibm_sterlingCPQ'||$scope.arrayOfComponents[i].catalog_name==='ibm_sterling'||$scope.arrayOfComponents[i].catalog_name==='ibm_message_sigh')
                        $scope.arrayOfComponents.splice(i);
                }
                console.log("new array data after=== "+JSON.stringify($scope.arrayOfComponents));
                console.log("new array datalength after === "+$scope.arrayOfComponents.length);

                $scope.Title=[];
                $scope.icon=[];
                $scope.catalog_category = [];
                $scope.catalog_name=[];
                for(var i=0;i<$scope.arrayOfComponents.length;i++){
                    $scope.MSPComponents=$scope.arrayOfComponents[i];
                    console.log("server $scope.objectKey data"+ i+"   ====   " + JSON.stringify($scope.MSPComponents));

                    //iterate through object keys
                    if ($scope.MSPComponents === null) {
                        console.log('errrorrrr');
                        return null;
                    }else {

                        var title = $scope.MSPComponents["Title"];
                        var icon = $scope.MSPComponents["Icon"];
                        var catalog_category=$scope.MSPComponents["catalog_category"];
                        var catalog_name = $scope.MSPComponents["catalog_name"];

                        //push the name string in the array
                        console.log("title are:: "+title);
                        console.log("catalog_category  are:: "+catalog_category);
                        console.log("server_quantity  are:: "+catalog_name);
                        console.log("icon  are:: "+icon);

                        $scope.Title.push(title);
                        $scope.catalog_category.push(catalog_category);
                        $scope.catalog_name.push(catalog_name);
                        $scope.icon.push(icon);


                    }

                }

                console.log("title are:: "+$scope.Title);
                console.log("catalog_category  are:: "+$scope.catalog_category);
                console.log("catalog_name  are:: "+$scope.catalog_name);
                console.log("icon  are:: "+$scope.icon);
                $scope.loading=false;
            })

        }
        if (num == 2) {
            $scope.MSP=false;
            $scope.Bluemix=true;
            $scope.showMspCatalogue = false;
            $scope.showBlueCatalogue = true;
            console.log("bluemix tab clicked");
            $scope.previousOrders=false;
            $scope.drafts=true;
        }
    };
    $scope.edit = function(){
        $scope.isActive = !$scope.isActive;
    };

    $scope.edit1 = function(){
        $scope.servicesCatalogue = false;
        $scope.runtimeCatalogue = true;
        console.log('inside edit1 function');
        $scope.isActive1 = !$scope.isActive1;
        $scope.spinsCatalogueList=false;
        $scope.spinsCanvas=false;
        $scope.spinsRuntimeList = true;
        $scope.spinsServicesList = false;
        $scope.loading=true;
        $http.get("/api/getBluemixBuildpackList",{ cache: true}).success(function(data){
            console.log('inside http function');
            console.log("Data : " + JSON.stringify(data));
            $scope.bluemixRuntimeLabel=[];
            $scope.bluemixRuntimeIcon = [];
            $scope.bluemixRuntimeComponentLists=[];

            $scope.arrayOfBluemixRuntimeServices = data;
            console.log("arrayOfBluemixServices length: " + $scope.arrayOfBluemixRuntimeServices.length);
            for(var i=0;i<$scope.arrayOfBluemixRuntimeServices.length;i++) {
                $scope.bluemixRuntimeObjects = $scope.arrayOfBluemixRuntimeServices[i];

                $scope.bluemixRuntimeComponentLists.push($scope.bluemixRuntimeObjects);
                var icon_bluemixRuntime = $scope.bluemixRuntimeObjects.icon;
                var label_bluemixRuntime = $scope.bluemixRuntimeObjects.title;

                $scope.bluemixRuntimeIcon.push(icon_bluemixRuntime);
                $scope.bluemixRuntimeLabel.push(label_bluemixRuntime);
            }

            console.log("Bluemix runtime list length==="+$scope.bluemixRuntimeComponentLists.length);
            console.log("Bluemix runtime icon length==="+$scope.bluemixRuntimeIcon.length);
            console.log("Bluemix runtime label length==="+$scope.bluemixRuntimeLabel.length);

            console.log("Bluemix runtime list keywise==="+JSON.stringify($scope.bluemixRuntimeComponentLists));
            console.log("Bluemix runtime icon keywise==="+JSON.stringify($scope.bluemixRuntimeIcon));
            console.log("Bluemix runtime label keywise==="+JSON.stringify($scope.bluemixRuntimeLabel));
            $scope.loading=false;
        }).error(function(data,status,header,config){
            console.log("header data" +header);
            console.log("status data" +status);
            console.log("config data" +config);
            console.log("Data:" +data);


        })

    };

    $scope.edit11 = function(){
        $scope.isActive2 = !$scope.isActive2;
    };
    $scope.edit11Tier1 = function () {
        $scope.isActive2Tier1 = !$scope.isActive2Tier1;

    };

    $scope.edit11Tier2 = function () {
        $scope.isActive2Tier2 = !$scope.isActive2Tier2;

    };

    $scope.edit2 = function(){
        $scope.isActive2 = !$scope.isActive2;
    };

    $scope.edit3 = function(){
        $scope.runtimeCatalogue = false;
        $scope.servicesCatalogue = true;

        $scope.isActive2 = !$scope.isActive2;
        $scope.spinsRuntimeList = false;
        $scope.spinsServicesList=true;
        $scope.spinsCanvasCatalogue = false;
        $scope.spinsCanvas=false;
        $scope.loading=true;

        $http.get("/api/getBluemixServicesList",{ cache: true}).success(function(data){
            console.log('inside http function');
            console.log("Data : " + JSON.stringify(data));
            $scope.bluemixServiceLabel=[];
            $scope.bluemixServiceIcon = [];
            $scope.bluemixServiceComponentLists=[];

            $scope.arrayOfBluemixService = data;
            console.log("arrayOfBluemixServices length: " + $scope.arrayOfBluemixService.length);
            for(var i=0;i<$scope.arrayOfBluemixService.length;i++) {
                $scope.bluemixServiceObjects = $scope.arrayOfBluemixService[i];

                $scope.bluemixServiceComponentLists.push($scope.bluemixServiceObjects);
                var icon_bluemixService = $scope.bluemixServiceObjects.icon;
                var label_bluemixService = $scope.bluemixServiceObjects.label;

                $scope.bluemixServiceIcon.push(icon_bluemixService);
                $scope.bluemixServiceLabel.push(label_bluemixService);
            }

            console.log("Bluemix service list length==="+$scope.bluemixServiceComponentLists.length);
            console.log("Bluemix service icon length==="+$scope.bluemixServiceIcon.length);
            console.log("Bluemix service label length==="+$scope.bluemixServiceLabel.length);

            console.log("Bluemix runtime list keywise==="+JSON.stringify($scope.bluemixServiceComponentLists));   //fetches the icon and title
            console.log("Bluemix runtime icon keywise==="+JSON.stringify($scope.bluemixServiceIcon));  // fetches the url of all icons
            console.log("Bluemix runtime label keywise==="+JSON.stringify($scope.bluemixServiceLabel));  // fetches the titles of services
            $scope.loading=false;
        }).error(function(data,status,header,config){
            console.log("header data" +header);
            console.log("status data" +status);
            console.log("config data" +config);
            console.log("Data:" +data);


        })
    }

    $scope.openpopup = function (index) {
        console.log('index in openpopup ===='+index);
        if ($scope.choices[index].type === 'msp'){
            $scope.openpopupMSPCount++;
            console.log("componentName======" + $scope.choices[index].selectedImageTitle);
            // sharedProperties.setMSP(index);
            // sharedProperties.setMSPChoiceIndex(index);
            $scope.currentUser = sharedProperties.getProperty();
            console.log('userEntered == ' + $scope.currentUser);
            // $scope.solnEntered = sharedProperties.getSoln();
            $scope.solnEntered=sharedProperties.getCurrentCSolName();
            for(var MSPIndex=0;MSPIndex<$scope.choicesMSP.length;MSPIndex++){
                if($scope.choices[index].selectedCatalogName=== $scope.choicesMSP[MSPIndex].selectedCatalogName){
                    $scope.actualMSPComponentIndex=MSPIndex;
                    console.log('$scope.actualMSPComponentIndex === '+$scope.actualMSPComponentIndex);
                }
            }


            var user = $scope.currentUser;
            var serviceName1 = $scope.choices[index].selectedCatalogName;
            console.log("serviceName ============" + serviceName1);
            var mspCount=$scope.openpopupMSPCount;
            $scope.mspCount=mspCount-1;
            console.log('componentCount MSP === '+$scope.mspCount);
            $scope.spinsCatalogueList=false;
            $scope.spinsCanvas=false;
            $scope.spinsCanvasCatalogue = true;
            $scope.loading=true;
            console.log('user===' +JSON.stringify(user));
            console.log('solnEntered===' +JSON.stringify($scope.solnEntered));
            $http({
                method: 'PUT',
                url: '/api/getServiceInfo',
                data: $.param({
                    'uname': user,
                    'solnName': $scope.solnEntered,
                    'service_details': 'msp',
                    'service_name': serviceName1,
                    'component_cnt': $scope.actualMSPComponentIndex
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                //forms user object
            })
                .success(function (data) {
                    console.log("inside getServiceInfo function === " + JSON.stringify(data));
                    $scope.popupData = data;
                    // console.log("MSP attr data == "+$scope.popupData);
                    $uibModal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: '../components/modal/attributes.html',
                        controller: 'AttrCtrl',
                        backdrop: 'static',
                        windowClass: 'app-modal-window-att',
                        resolve: {
                            parentDivCall: function () {
                                return $scope.popupData;
                            },
                            countComp:function () {
                                return $scope.actualMSPComponentIndex;
                            },
                            serviceType:function(){
                                return 'msp';
                            }
                        }
                    });

                    $scope.loading=false;
                }
            ).error(function (data, status, header, config) {
                    console.log("header data" + header);
                    console.log("status data" + status);
                    console.log("config data" + config);
                    console.log("Data:" + data);


                })
        }

        if($scope.choices[index].type === 'runtime'){
            $scope.openpopupRuntimeCount++;
            console.log("componentName======" + $scope.choices[index].selectedImageTitle);
            // sharedProperties.setRuntimeChoiceIndex($scope.openpopupRuntimeCount-1);
            $scope.currentUser = sharedProperties.getProperty();
            console.log('userEntered == ' + $scope.currentUser);
            // $scope.solnEntered = sharedProperties.getSoln();
            $scope.solnEntered =sharedProperties.getCurrentCSolName();
            var user = $scope.currentUser;
            var runtimeServiceName = $scope.choices[index].selectedImageTitle;
            console.log("serviceName ============" + runtimeServiceName);
            console.log('$scope.openpopupRuntimeCount count === '+$scope.openpopupRuntimeCount);
            var runtimeCount=$scope.openpopupRuntimeCount;
            $scope.componentCount=runtimeCount-1;
            console.log('componentCount runtime === '+$scope.componentCount);

            for(var runtimeIndex=0;runtimeIndex<$scope.choicesRuntime.length;runtimeIndex++){
                if($scope.choices[index].selectedImageTitle=== $scope.choicesRuntime[runtimeIndex].selectedImageTitle){
                    $scope.actualruntimeComponentIndex=runtimeIndex;
                    console.log('$scope.actualruntimeComponentIndex === '+$scope.actualruntimeComponentIndex);
                }
            }
            $scope.spinsCatalogueList=false;
            $scope.spinsCanvas=false;
            $scope.spinsCanvasCatalogue = true;
            $scope.loading=true;
            $http({
                method: 'PUT',
                url: '/api/getBluemixRuntimeInfo',
                data: $.param({
                    'uname': user,
                    'solnName': $scope.solnEntered,
                    'service_details': 'runtime',
                    'service_name': runtimeServiceName,
                    'component_cnt': $scope.actualruntimeComponentIndex
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                //forms user object
            })
                .success(function (data) {
                    console.log("inside runtime function === " + JSON.stringify(data));
                    $scope.runtimePopupData = data;
                    // console.log("MSP attr data == "+$scope.popupData);
                    $uibModal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: '../components/modal/attributes.html',
                        controller: 'AttrCtrl',
                        windowClass: 'app-modal-window-att2',
                        backdrop: 'static',
                        resolve: {
                            parentDivCall: function () {
                                return $scope.runtimePopupData;
                            },
                            countComp:function () {
                                return $scope.actualruntimeComponentIndex;
                            },
                            serviceType:function(){
                                return 'runtime';
                            }

                        }
                    });

                    $scope.loading=false;
                }
            ).error(function (data, status, header, config) {
                    console.log("header data" + header);
                    console.log("status data" + status);
                    console.log("config data" + config);
                    console.log("Data:" + data);


                })
        }

        if($scope.choices[index].type === 'bluemix'){
            $scope.openpopupBluemixCount++;
            console.log("componentName======" + $scope.choices[index].selectedImageTitle);
            // sharedProperties.setServiceChoiceIndex($scope.openpopupBluemixCount);s
            $scope.currentUser = sharedProperties.getProperty();
            console.log('userEntered == ' + $scope.currentUser);
            //$scope.solnEntered = sharedProperties.getSoln();
            $scope.solnEntered =sharedProperties.getCurrentCSolName();
            var user = $scope.currentUser;
            var bluemixServiceName = $scope.choices[index].selectedImageTitle;
            console.log("serviceName ============" + bluemixServiceName);
            var bluemixCount=$scope.openpopupBluemixCount;
            $scope.componentServiceCount=bluemixCount-1;
            console.log('componentCount Service === '+$scope.componentServiceCount);

            for(var serviceIndex=0;serviceIndex<$scope.choicesServices.length;serviceIndex++){
                if($scope.choices[index].selectedImageTitle=== $scope.choicesServices[serviceIndex].selectedImageTitle){
                    $scope.actualServiceComponentIndex=serviceIndex;
                    console.log('$scope.actualServiceComponentIndex === '+$scope.actualServiceComponentIndex);
                }
            }
            $scope.spinsCatalogueList=false;
            $scope.spinsCanvas=false;
            $scope.spinsCanvasCatalogue = true;
            $scope.loading=true;

            $http({
                method: 'PUT',
                url: '/api/v1/getBluemixServiceInfo',
                data: $.param({
                    'uname': user,
                    'solnName': $scope.solnEntered,
                    'service_details': 'bluemix',
                    'service_name': bluemixServiceName,
                    'component_cnt': $scope.actualServiceComponentIndex
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                //forms user object
            })
                .success(function (data) {
                    console.log("inside getBluemixServiceInfo function === " + JSON.stringify(data));
                    $scope.servicePopupData = data;
                    console.log("$scope.servicePopupData == "+JSON.stringify($scope.servicePopupData));
                    $uibModal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: '../components/modal/attributes.html',
                        controller: 'AttrCtrl',
                        windowClass: 'app-modal-window-att3',
                        backdrop: 'static',
                        resolve: {
                            parentDivCall: function () {
                                return $scope.servicePopupData;
                            },
                            countComp:function () {
                                return $scope.actualServiceComponentIndex;
                            },
                            serviceType:function(){
                                return 'bluemix';
                            }

                        }
                    });
                    $scope.loading=false;

                }
            ).error(function (data, status, header, config) {
                    console.log("header data" + header);
                    console.log("status data" + status);
                    console.log("config data" + config);
                    console.log("Data:" + data);
                })
        }

    };


    //////////////////////////////end edit canvas*/




    /*$scope.getCanvasInformation = sharedPropertiesCanvas.getCanvasinfo();
    console.log('$scope.getCanvasInformation===' +JSON.stringify($scope.getCanvasInformation));*/
    //--------------
    //edit page start here
    $scope.solnEntered11=sharedProperties.getCurrentCSolName();

       //$scope.CurrentVer = sharedProperties.getVersion();

   // $scope.versionnum =  $scope.CurrentVer;
    $scope.tname= sharedProperties.getVersion()
    $rootScope.versionnum = $scope.tname



    // edit Div
 $scope.showDiv = function () {
        $scope.showhideprop = true;
        $scope.vEdit();
    }
    // close Div
    $scope.hideDiv = function () {       
        $scope.showhideprop = false;
    }
    $scope.viewArchEdit=function(){
        console.log("from edit button -->");

        //$rootScope.showhideprop=true;
        $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: '../components/modal/viewArchEdit.html',
            /* windowClass: 'app-modal-window-sam',*/
            controller: 'viewArchEditctrl',
            backdrop: 'static',
            resolve: {

            }
        });

    }

    $scope.toggleState = function() {
        $scope.state = !$scope.state;
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
            resolve: {

            }
        });
    }

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
    }

    $scope.viewDepl=function(){
        $location.path('/deployment');
    };


    $scope.showDiv = function () {
        $scope.showhideprop = true;
        $scope.vEdit();
    }
    // close Div
    $scope.hideDiv = function () {       
        $scope.showhideprop = false;
    }
    //-----

    $scope.currentUser11 = sharedProperties.getProperty();
    console.log('userEntered == ' + $scope.currentUser11);
    $scope.solnEntered11 = sharedProperties.getCurrentCSolName();
    console.log('solnEntered1 == ' + $scope.solnEntered11);
    $scope.newVer= sharedProperties.getVersion();
    console.log("current version ----->"+$scope.newVer);

    $http({
        method: 'POST',
        url: '/api/v2/getCanvasInfo',
        data: $.param({
            "soln_name":$scope.solnEntered11,
            "uname":$scope.currentUser11,
            "version":$scope.newVer
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
                $scope.resultCanvasDetails = data;
                console.log('resultCanvasDetails === '+JSON.stringify($scope.resultCanvasDetails));
                console.log('resultCanvasDetails.services[0] === '+JSON.stringify($scope.resultCanvasDetails.services));
                $timeout(function () {
                    var canvas;
                    // window.newAnimation = function () {
                    /*canvas = new fabric.Canvas('canvas');*/
                    canvas = new fabric.Canvas('canvas',{
                        selection: true,
                    });
                    canvas.on("object:selected", function(options) {
                        options.target.bringToFront();
                        $( "#canvas-container").draggable("enable");
                    });
                    // canvas.isDrawingMode = true;
                    /* fabric.util.addListener(document.getElementById('canvas-container'), 'scroll', function () {
                     console.log('scroll');
                     canvas.calcOffset();
                     });*/

                    //canvas resize

                    window.addEventListener("load", function()
                    {


                        var canvas = document.createElement('canvas'); document.body.appendChild(canvas);
                        var context = canvas.getContext('2d');

                        function draw()
                        {
                            context.strokeRect(0, 0, window.innerWidth, window.innerHeight);
                            canvas.calcOffset();

                        }
                        function resize()
                        {
                            canvas.width = window.innerWidth;
                            canvas.height = window.innerHeight;
                            draw();
                        }
                        window.addEventListener("resize", resize);
                        resize();
                    });
                    /*(function() {
                     console.log("from canvas resize")
                     var
                     // Obtain a reference to the canvas element
                     // using its id.
                     htmlCanvas = document.getElementById('canvas'),

                     // Obtain a graphics context on the
                     // canvas element for drawing.
                     context = htmlCanvas.getContext('2d');

                     // Start listening to resize events and
                     // draw canvas.
                     initialize();

                     function initialize() {
                     // Register an event listener to
                     // call the resizeCanvas() function each time
                     // the window is resized.
                     window.addEventListener('resize', resizeCanvas, true);

                     // Draw canvas border for the first time.
                     resizeCanvas();
                     }

                     // Display custom canvas.
                     // In this case it's a blue, 5 pixel border that
                     // resizes along with the browser window.
                     /!*function redraw() {
                     /!*context.strokeStyle = 'blue';*!/
                     /!*context.lineWidth = '5';*!/
                     context.strokeRect(0, 0, window.innerWidth, window.innerHeight);
                     }*!/

                     // Runs each time the DOM window resize event fires.
                     // Resets the canvas dimensions to match window,
                     // then draws the new borders accordingly.
                     function resizeCanvas() {
                     htmlCanvas.width = window.innerWidth;
                     htmlCanvas.height = window.innerHeight;

                     // redraw();
                     }

                     })();*/
                    /*canvas.setWidth(1192);
                     canvas.setHeight(11892);


                     fabric.util.addListener(document.getElementById('canvas-container'), 'scroll', function () {
                     console.log('scroll');
                     canvas.calcOffset();
                     });*/


                    //--------------


                    $(function() {
                        $("#canvas-container").draggable();
                    });
                    canvas.observe('mouse:down', function(){

                        var Get_obj = canvas.getActiveObject();
                        console.log("clicked on canvas---->")
                        $("#canvas-container").draggable("enable");
                    });
                   /* var imgDevice = document.getElementById("device_img");
                    var deviderImg = document.getElementById("devider_img");
                    var edgeDevice = document.getElementById("edge_device");

                    var imgInstance1 = new fabric.Image(imgDevice);
                    imgInstance1.left=400;
                    imgInstance1.top=400;
                    canvas.add(imgInstance1);
                    imgInstance1.lockMovementY = true;
                    imgInstance1.lockMovementX = true;
                    imgInstance1.hasControls=false;


                    var imgInstance2 = new fabric.Image(deviderImg);
                    imgInstance2.left=615;
                    imgInstance2.top=400;
                    canvas.add(imgInstance2);
                    imgInstance2.lockMovementY = true;
                    imgInstance2.lockMovementX = true;
                    imgInstance2.hasControls=false;

                    var imgInstance3 = new fabric.Image(edgeDevice);
                    imgInstance3.left=800;
                    imgInstance3.top=400;
                    canvas.add(imgInstance3);
                    imgInstance3.lockMovementY = true;
                    imgInstance3.lockMovementX = true;
                    imgInstance3.hasControls=false;
*/
                    // we need this here because this is when the canvas gets initialized
                    // ['object:moving', 'object:scaling'].forEach(addChildMoveLine);
                    // }

                    var canvasRenderObject=$scope.resultCanvasDetails.canvas[0];
                    console.log('canvasRenderObject===' +canvasRenderObject);
                    canvas.loadFromDatalessJSON(canvasRenderObject);
                    canvas.renderAll();

                    $scope.handleDragStart=function (e) {

                        [].forEach.call(images, function (img) {
                            img.classList.remove('img_dragging');
                        });

                        [].forEach.call(images1, function (img) {
                            img.classList.remove('img_dragging');
                        });
                        this.classList.add('img_dragging');
                    }

                    $scope.handleDragOver=function (e) {
                        if (e.preventDefault) {
                            e.preventDefault(); // Necessary. Allows us to drop.
                            $( "#canvas-container").draggable("disable");
                        }

                        e.dataTransfer.dropEffect = 'copy'; // See the section on the DataTransfer object.
                        // NOTE: comment above refers to the article (see top) -natchiketa

                        return false;
                    }

                    $scope.handleDragEnter=function (e) {
                        // this / e.target is the current hover target.
                        this.classList.add('over');
                    }

                    $scope.handleDragLeave=function (e) {
                        this.classList.remove('over'); // this / e.target is previous target element.

                    }


                    $scope.handleDrop=function (e) {
                        // this / e.target is current target element.

                        if (e.stopPropagation) {
                            e.stopPropagation(); // stops the browser from redirecting.
                            e.preventDefault();
                            $( "#canvas-container").draggable("disable");
                        }
                        if($scope.MSP===true) {
                            $scope.objCount++;
                            $scope.MSPComponentCount++;

                            var indexCount=$scope.MSPComponentCount;
                            var objectCount=indexCount-1;


                            $scope.imageSrc = $scope.icon[$scope.selectedImageIndex];
                            console.log("$scope.imageSrc===" + $scope.imageSrc);
                            var rest = $scope.imageSrc.substring(0, $scope.imageSrc.lastIndexOf("/") + 1);
                            $scope.last = $scope.imageSrc.substring($scope.imageSrc.lastIndexOf("/") + 1, $scope.imageSrc.length);
                            // $scope.imageSrcArray = $scope.imageSrc.split('newimage/');
                            // console.log("imageSrcArray===" + $scope.imageSrcArray[1]);
                            console.log('last === '+$scope.last);
                            $scope.selectedImageName = $scope.last.split('.png');
                            console.log("selectedImageName===" + $scope.selectedImageName);
                            // console.log("selected object==== " + $scope.imageSrcArray[1]);
                            console.log("selected object==== " + $scope.last);
                            console.log("selected object==== " + $scope.selectedImageName[0]);

                            $scope.valueOfSelectedImage = $scope.Title[$scope.selectedImageIndex];
                            $scope.valueOfCatalogName =$scope.catalog_name[$scope.selectedImageIndex];
                            $scope.valueOfCatalogCategory = $scope.catalog_category[$scope.selectedImageIndex];
                            var type='msp';

                            console.log('id=== ' + $scope.valueOfSelectedImage);

                            console.log('id=== ' + $scope.valueOfCatalogCategory);


                            $scope.canvasCatalogueObject = {

                                'selectedImage': $scope.last,
                                'selectedImageTitle': $scope.Title[$scope.selectedImageIndex],
                                'selectedValueCategory': $scope.catalog_category[$scope.selectedImageIndex],
                                'selectedCatalogName': $scope.catalog_name[$scope.selectedImageIndex],
                                'type': type
                            };

                            /*Manisha Integration starts*/

                            $scope.userEntered=sharedProperties.getProperty();
                            console.log('userEntered == '+$scope.userEntered);
                            // this / e.target is current target element.
                            // $scope.solnEntered=sharedProperties.getSoln();
                            $scope.solnEntered=sharedProperties.getCurrentCSolName()
                            console.log("$scope.solnEntered============" +$scope.solnEntered);
                            console.log("$scope.itemData.component_count====" +objectCount);
                            console.log("$scope.itemData.component_count====" +$scope.Title[$scope.selectedImageIndex]);
                            var user=$scope.userEntered;
                            var serviceName=$scope.catalog_name[$scope.selectedImageIndex];
                            $scope.spinsCatalogueList=false;
                            $scope.spinsCanvas=true;
                            $scope.spinsRuntimeList=false;
                            $scope.spinsServicesList=false;
                            $scope.spinsCatalogueList=false;

                            $scope.loading=true;

                            $http({
                                method  : 'PUT',
                                url     : '/api/AddComponentToCanvas',
                                data    : $.param({'uname': user, 'solnName': $scope.solnEntered, 'service_details': 'msp','service_name': serviceName,'component_cnt': objectCount}),
                                headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                                //forms user object
                            })

                                .success(function(data) {
                                    console.log("inside success function");
                                    $scope.DataResponse = data;
                                    console.log(JSON.stringify($scope.DataResponse));
                                    $scope.loading=false;
                                })

                                .error(function(data,status,header,config){
                                    $timeout(function() {

                                        console.log("header data" +header);
                                        console.log("status data" +status);
                                        console.log("config data" +config);
                                        console.log("Data:" +data);

                                    }, 2000);

                                })

                            $scope.count = 0;

                            fabric.Image.fromURL($scope.icon[$scope.selectedImageIndex], function (oImg) {
                                // scale image down, and flip it, before adding it onto canvas
                                //oImg.scale(0.5).setFlipX(true);
                                oImg.width = 80;
                                oImg.height = 80;
                                oImg.left = e.layerX;
                                oImg.top = e.layerY;
                                // canvas.add(oImg);

                                var tbText = new fabric.Text($scope.Title[$scope.selectedImageIndex], {
                                    top: e.layerY+45,
                                    left: e.layerX,
                                    fontSize:15,
                                    hasControls: true,
                                    lockScalingX:true,
                                    lockScalingY:true
                                });
                                // canvas.add(tbText);
                                var group = new fabric.Group([oImg, tbText], { left: e.layerX, top: e.layerY });
                                console.log("group object is == "+JSON.stringify(group));
                                canvas.add(group);
                            });
                        }
                        if($scope.Bluemix===true) {

                            if($scope.runtimeCatalogue === true){
                                $scope.objCount++;
                                $scope.bluemixRuntimeComponentCount++;
                                var indexRuntimeCompCount=$scope.bluemixRuntimeComponentCount;
                                var bluemixRuntimeCompCount=indexRuntimeCompCount-1;
                                $scope.bluemixRuntimeimageSrc = $scope.bluemixRuntimeIcon[$scope.selectedBluemixImageIndex];
                                console.log("$scope.imageSrc===" + $scope.bluemixRuntimeimageSrc);
                                $scope.bluemixRuntimeimageSrcArray = $scope.bluemixRuntimeimageSrc.split('MSP_Logos/');
                                console.log("imageSrcArray===" + $scope.bluemixRuntimeimageSrcArray);
                                $scope.bluemixRuntimeselectedImageName = $scope.bluemixRuntimeimageSrcArray[1].split('.png');
                                console.log("selectedImageName===" + $scope.bluemixRuntimeselectedImageName);
                                console.log("selected object==== " + $scope.bluemixRuntimeimageSrcArray[1]);
                                console.log("selected object==== " + $scope.bluemixRuntimeselectedImageName[0]);
                                var type='runtime';
                                $scope.bluemixRuntimeSelectedImage = $scope.bluemixRuntimeLabel[$scope.selectedBluemixImageIndex];
                                console.log("selected object name ==== " + $scope.bluemixRuntimeSelectedImage);

                                $scope.canvasCatalogueObject = {
                                    'selectedImage': $scope.bluemixRuntimeimageSrcArray[1],
                                    'selectedImageTitle': $scope.bluemixRuntimeSelectedImage,
                                    'type': type

                                };

                                $scope.runtimeUsername=sharedProperties.getProperty();
                                console.log('userEntered == '+$scope.runtimeUsername);
                                // this / e.target is current target element.

                                //$scope.solnRuntimeEntered=sharedProperties.getSoln();
                                $scope.solnRuntimeEntered=sharedProperties.getCurrentCSolName();
                                console.log("$scope.solnEntered============" +$scope.solnRuntimeEntered);
                                var user=$scope.runtimeUsername;
                                var serviceName=$scope.bluemixRuntimeSelectedImage;
                                console.log("runtime serviceName====" +serviceName);
                                console.log("bluemixRuntimeCompCount====" +bluemixRuntimeCompCount);
                                $scope.spinsCatalogueList=false;
                                $scope.spinsRuntimeList = false;
                                $scope.spinsServicesList = false;
                                $scope.spinsCanvas=true;
                                $scope.loading=true;
                                $http({
                                    method  : 'PUT',
                                    url     : '/api/v1/AddBMRuntimeToCanvas',
                                    data    : $.param({'uname': user, 'solnName': $scope.solnRuntimeEntered, 'service_details': 'runtime','service_name': serviceName,'component_cnt': bluemixRuntimeCompCount}),
                                    headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                                })

                                    .success(function(data) {
                                        console.log("inside bluemix runtime success function");
                                        $scope.runtimeDataResponse = data;
                                        console.log(JSON.stringify($scope.runtimeDataResponse));
                                        $scope.loading=false;
                                    }).error(function(data,status,header,config){
                                        $timeout(function() {

                                            console.log("header data" +header);
                                            console.log("status data" +status);
                                            console.log("config data" +config);
                                            console.log("Data:" +data);

                                        }, 2000);

                                    })

                                $scope.count = 0;

                                fabric.Image.fromURL($scope.bluemixRuntimeIcon[$scope.selectedBluemixImageIndex], function (oImg) {

                                    oImg.width = 80;
                                    oImg.height = 80;
                                    oImg.left = e.layerX;
                                    oImg.top = e.layerY;
                                    // canvas.add(oImg);

                                    var tbText = new fabric.Text($scope.bluemixRuntimeLabel[$scope.selectedBluemixImageIndex], {
                                        top: e.layerY+45,
                                        left: e.layerX,
                                        fontSize:15,
                                        hasControls: true,
                                        lockScalingX:true,
                                        lockScalingY:true
                                    });
                                    // canvas.add(tbText);
                                    var group = new fabric.Group([oImg, tbText], { left: e.layerX, top: e.layerY });
                                    // console.log("group object is == "+JSON.stringify(group));
                                    canvas.add(group);
                                });
                            }
                            if($scope.servicesCatalogue === true){
                                $scope.objCount++;
                                $scope.bluemixServiceComponentCount++;
                                var indexServiceCompCount=$scope.bluemixServiceComponentCount;
                                var bluemixServiceCompCount=indexServiceCompCount-1;
                                $scope.bluemixServiceimageSrc = $scope.bluemixServiceIcon[$scope.selectedServiceBluemixImageIndex];
                                console.log("$scope.imageSrc===" + $scope.bluemixServiceimageSrc);
                                $scope.bluemixServiceimageSrcArray = $scope.bluemixServiceimageSrc.split('MSP_Logos/');
                                console.log("imageSrcArray===" + $scope.bluemixServiceimageSrcArray);
                                $scope.bluemixServiceselectedImageName = $scope.bluemixServiceimageSrcArray[1].split('.png');
                                console.log("selectedImageName===" + $scope.bluemixServiceselectedImageName);
                                console.log("selected object==== " + $scope.bluemixServiceimageSrcArray[1]);
                                var type='bluemix';
                                $scope.bluemixServiceSelectedImage = $scope.bluemixServiceLabel[$scope.selectedServiceBluemixImageIndex];
                                console.log("selected object name ==== " + $scope.bluemixServiceSelectedImage);
                                $scope.canvasCatalogueObject = {
                                    'selectedImage': $scope.bluemixServiceimageSrcArray[1],
                                    'selectedImageTitle': $scope.bluemixServiceSelectedImage,
                                    'type': type
                                };
                                $scope.serviceUsername=sharedProperties.getProperty();
                                console.log('userEntered == '+$scope.serviceUsername);
                                // this / e.target is current target element.
                                $scope.solnServiceEntered=sharedProperties.getCurrentCSolName()
                                //$scope.solnServiceEntered=sharedProperties.getSoln();
                                console.log("$scope.solnEntered============" +$scope.solnServiceEntered);
                                var user=$scope.serviceUsername;
                                var serviceName=$scope.bluemixServiceSelectedImage;
                                console.log("serviceName============" +serviceName);
                                console.log("bluemixServiceCompCount============" +bluemixServiceCompCount);
                                $scope.newVer= sharedProperties.getNewersion();
                                console.log("current version ----->"+$scope.newVer)
                                $scope.spinsCatalogueList=false;
                                $scope.spinsRuntimeList = false;
                                $scope.spinsServicesList = false;
                                $scope.spinsCanvas=true;
                                $scope.loading=true;
                                $http({
                                    method  : 'PUT',
                                    url     : '/api/v2/AddBMComponentToCanvas',
                                    data    : $.param({'uname': user,
                                                        'solnName': $scope.solnServiceEntered,
                                                         'service_details': 'bluemix',
                                                          'service_name': serviceName,
                                                           'component_cnt': bluemixServiceCompCount,
                                                            'version': $scope.newVer }),
                                    headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                                }).success(function(data) {
                                    console.log("inside bluemix runtime success function");
                                    $scope.serviceDataResponse = data;
                                    console.log(JSON.stringify($scope.serviceDataResponse));
                                    $scope.loading=false;
                                }).error(function(data,status,header,config){
                                    // $timeout(function() {

                                    console.log("header data" +header);
                                    console.log("status data" +status);
                                    console.log("config data" +config);
                                    console.log("Data:" +data);



                                })

                                $scope.count = 0;

                                fabric.Image.fromURL($scope.bluemixServiceIcon[$scope.selectedServiceBluemixImageIndex], function (oImgService) {

                                    oImgService.width = 80;
                                    oImgService.height = 80;
                                    oImgService.left = e.layerX;
                                    oImgService.top = e.layerY;
                                    // canvas.add(oImg);

                                    var serviceText = new fabric.Text($scope.bluemixServiceLabel[$scope.selectedServiceBluemixImageIndex], {
                                        top: e.layerY+45,
                                        left: e.layerX,
                                        fontSize:15,
                                        hasControls: true,
                                        lockScalingX:true,
                                        lockScalingY:true
                                    });
                                    // canvas.add(tbText);
                                    var group = new fabric.Group([oImgService, serviceText], { left: e.layerX, top: e.layerY });
                                    // console.log("group object is == "+JSON.stringify(group));
                                    canvas.add(group);
                                });
                            }


                        }

                        canvas.forEachObject(function(o){  o.hasBorders = o.hasControls=true; o.lockScalingX= o.lockScalingY=true; });

                        canvas.on({
                            'mouse:down': function(e) {
                                if (e.target) {
                                    e.target.opacity = 0.5;
                                    canvas.renderAll();
                                    $( "#canvas-container").draggable("disable");
                                }
                            },
                            'mouse:up': function(e) {
                                if (e.target) {
                                    e.target.opacity = 1;
                                    canvas.renderAll();
                                }
                            },
                            'object:moved': function(e) {
                                e.target.opacity = 0.5;
                            },
                            'object:modified': function(e) {
                                e.target.opacity = 1;
                                $( "#canvas-container").draggable("enable");
                            }
                        });

                        $scope.addNewChoice($scope.canvasCatalogueObject);
                        return true;
                    }


                    $scope.handleDragEnd=function (e) {
                        // this/e.target is the source node.
                        $( "#canvas-container").draggable("disable");
                        [].forEach.call(images, function (img) {
                            img.classList.remove('img_dragging');
                            console.log (" drag end : " + img);
                        });
                        [].forEach.call(images1, function (img) {
                            img.classList.remove('img_dragging');
                            console.log (" drag end : " + img);
                        });
                    }
                    $scope.connectionInfo={
                        'connection_info':{
                            'services':[]
                        }
                    };

                    $scope.servicesObject={
                        service_name:'',
                        zone:"DMZ",
                        connect_with:[
                        ]
                    };

                    $scope.childObject={
                        service_name:'',
                        zone:"core",
                        protocol:""
                    }

                    $scope.fromObjectArray=[];
                    $scope.toObjectArray=[];

                    $scope.addInfo=0;

                    $scope.addChildLine=function (options) {
                        // console.log('options :: '+options);
                        canvas.off('object:selected', $scope.addChildLine);
                        // add the line
                        var fromObject = canvas.addChild.start;
                        console.log('from object every time:::'+JSON.stringify(fromObject));

                        if(angular.isObject(fromObject)){
                            Object.keys(fromObject).forEach(function (key) {
                                if (key === 'objects') {
                                    $scope.fromServiceObject = fromObject[key];
                                    for(var i=0;i<$scope.fromServiceObject.length;i++){
                                        $scope.fromGroupObject=$scope.fromServiceObject[i];
                                        Object.keys($scope.fromGroupObject).forEach(function (key) {
                                            // console.log("Object key fromGroupObject: " + key);
                                            if(key==='text'){
                                                console.log('from image text name === ' +$scope.fromGroupObject.text);
                                                // $scope.servicesObject.service_name=$scope.fromGroupObject.text;
                                            }

                                        })
                                    }
                                }
                            });
                        }

                        var toObject = options.target;

                        if(angular.isObject(toObject)){
                            Object.keys(toObject).forEach(function (key) {
                                //get the value of name
                                // console.log("toGroupObject key : " + key);
                                if (key === 'objects') {
                                    $scope.toServiceObject = toObject[key];
                                    for(var i=0;i<$scope.toServiceObject.length;i++){
                                        $scope.toGroupObject=$scope.toServiceObject[i];
                                        Object.keys($scope.toGroupObject).forEach(function (key) {
                                            if(key==='text'){
                                                console.log('to image text name === '+$scope.toGroupObject.text);
                                                // $scope.childObject.service_name=$scope.toGroupObject.text;

                                            }
                                        })
                                    }
                                }
                            });

                        }


                        $scope.createCanvasInfo($scope.fromGroupObject.text,$scope.toGroupObject.text);

                        var from = fromObject.getCenterPoint();
                        var to = toObject.getCenterPoint();
                        var line = new fabric.Line([from.x, from.y, to.x, to.y], {
                            fill: 'grey',
                            stroke: 'grey',
                            strokeWidth: 1,
                            selectable: false
                        });
                        //$scope.lineAdded++;
                        canvas.add(line);
                        // so that the line is behind the connected shapes
                        line.sendToBack();

                        // add a reference to the line to each object
                        fromObject.addChild = {
                            // this retains the existing arrays (if there were any)
                            from: (fromObject.addChild && fromObject.addChild.from) || [],
                            to: (fromObject.addChild && fromObject.addChild.to)
                        }
                        fromObject.addChild.from.push(line);
                        toObject.addChild = {
                            from: (toObject.addChild && toObject.addChild.from),
                            to: (toObject.addChild && toObject.addChild.to) || []
                        }
                        toObject.addChild.to.push(line);

                        // to remove line references when the line gets removed
                        line.addChildRemove = function () {
                            fromObject.addChild.from.forEach(function (e, i, arr) {

                                if (e === line) {
                                    console.log('i from object value === '+i);
                                    arr.splice(i, 1);
                                }
                            });
                            toObject.addChild.to.forEach(function (e, i, arr) {
                                //$scope.lineAdded--;
                                if (e === line) {
                                    console.log('i to object value === '+i);
                                    arr.splice(i, 1);
                                }
                            });
                            $scope.lineAdded--;
                        }

                        // undefined instead of delete since we are anyway going to do this many times
                        canvas.addChild = undefined;
                    }

                    $scope.createCanvasInfo=function(fromTextName,toTextName){
                        console.log('fromTextName === '+fromTextName);
                        console.log('toTextName === '+toTextName);
                        console.log('$scope.addInfo === '+$scope.addInfo);
                        if($scope.addInfo > 0) {
                            console.log('greater than zero');
                            $scope.newServicesObject={
                                service_name:'',
                                zone:"DMZ",
                                connect_with:[
                                ]
                            };

                            $scope.newChildObject={
                                service_name:'',
                                zone:"core",
                                protocol:""
                            }

                            // for (var i = 0; i < $scope.fromObjectArray.length; i++) {
                            if ($scope.fromObjectArray.indexOf(fromTextName) === -1) {
                                console.log('doesnt match in from array');
                                $scope.newServicesObject['service_name'] = fromTextName;
                                console.log('newServicesObject === ' + JSON.stringify($scope.newServicesObject));
                                $scope.newChildObject['service_name'] = toTextName;
                                console.log('newChildObject === ' + JSON.stringify($scope.newChildObject));
                                $scope.newServicesObject.connect_with.push($scope.newChildObject);
                                console.log('$scope.newServicesObject == ' + JSON.stringify($scope.newServicesObject));
                                $scope.connectionInfo.connection_info.services.push($scope.newServicesObject);
                                console.log('final json === ' + JSON.stringify($scope.connectionInfo));
                            }else{
                                for(var i=0;i<$scope.connectionInfo.connection_info.services.length;i++) {
                                    $scope.servicesObj=$scope.connectionInfo.connection_info.services[i];
                                    console.log('$scope.servicesObj === '+JSON.stringify($scope.servicesObj));
                                    if($scope.servicesObj.service_name===fromTextName) {
                                        console.log('from text name matches');
                                        $scope.newChildObject['service_name'] = toTextName;
                                        console.log('newChildObject === ' + JSON.stringify($scope.newChildObject));
                                        $scope.servicesObj.connect_with.push($scope.newChildObject);
                                        console.log('$scope.servicesObj == ' + JSON.stringify($scope.servicesObj));
                                        $scope.connectionInfo.connection_info.services[i]=$scope.servicesObj;
                                        // $scope.connectionInfo.connection_info.services.push($scope.servicesObj);
                                        console.log('final json === ' + JSON.stringify($scope.connectionInfo));
                                        break;
                                    }
                                }
                            }
                            // }
                        }else {
                            $scope.servicesObject['service_name'] = fromTextName;
                            console.log('servicesObject === ' + JSON.stringify($scope.servicesObject));
                            $scope.childObject['service_name'] = toTextName;
                            console.log('servicesObject === ' + JSON.stringify($scope.childObject));
                            $scope.servicesObject.connect_with.push($scope.childObject);
                            console.log('$scope.servicesObject == ' + JSON.stringify($scope.servicesObject));
                            $scope.connectionInfo.connection_info.services.push($scope.servicesObject);
                            console.log('final json === ' + JSON.stringify($scope.connectionInfo));
                        }
                        $scope.fromObjectArray.push(fromTextName);
                        $scope.toObjectArray.push(toTextName);
                        $scope.addInfo++;
                    }

                    function addChildMoveLine(event) {
                        canvas.on(event, function (options) {
                            var object = options.target;
                            var objectCenter = object.getCenterPoint();
                            // udpate lines (if any)
                            if (object.addChild) {
                                if (object.addChild.from)
                                    object.addChild.from.forEach(function (line) {
                                        line.set({ 'x1': objectCenter.x, 'y1': objectCenter.y });
                                    })
                                if (object.addChild.to)
                                    object.addChild.to.forEach(function (line) {
                                        line.set({ 'x2': objectCenter.x, 'y2': objectCenter.y });
                                    })
                            }

                            canvas.renderAll();
                        });
                    }

                    $scope.addChild = function () {
                        console.log('inside addchild');
                        $scope.lineAdded++;
                        // $scope.objCount++;
                        // console.log('inside addchild'+$scope.objCount);
                        canvas.addChild = {
                            start: canvas.getActiveObject()
                        }

                        // for when addChild is clicked twice
                        canvas.off('object:selected', $scope.addChildLine);
                        canvas.on('object:selected', $scope.addChildLine);
                    }

                    $scope.deleteObject = function (index) {

                        console.log('deleted object index == '+index);
                        var object = canvas.getActiveObject();
                        if(object === null || object === undefined){
                            /*alert("Please Select the service from canvas to be deleted");*/
                            $uibModal.open({
                                animation: $scope.animationsEnabled,
                                templateUrl: '../components/modal/DeleteCanvasService.html',
                                size: 'sm',
                                controller: 'DeleteCanvasServiceCtrl',
                                windowClass: 'app-modal-window-dc',
                                backdrop: 'static',
                                resolve: {

                                }
                            });
                        }else {
                            console.log('deleted group object === ' + object);

                            console.log('index in openpopup ====' + index);
                            console.log('choices in delete click == ' + JSON.stringify($scope.choices));

                            var nameInCanvas = '';
                            var nameInList = '';
                            nameInCanvas = $scope.choices[index].selectedImageTitle;
                            nameInList = object.objects[1].text;
                            console.log('nameInCanvas===' + nameInCanvas);
                            console.log('nameInList====' + nameInList);

                            if (nameInCanvas == nameInList) {
                                if ($scope.choices[index].type === 'msp') {
                                    // $scope.openpopupMSPCount++;
                                    console.log('inside MSP');

                                    console.log("componentName======" + $scope.choices[index].selectedImageTitle);
                                    $scope.currentUser = sharedProperties.getProperty();
                                    console.log('userEntered == ' + $scope.currentUser);
                                    // $scope.solnEntered = sharedProperties.getSoln();
                                    $scope.solnEntered=sharedProperties.getCurrentCSolName();
                                    for (var MSPIndex = 0; MSPIndex < $scope.choicesMSP.length; MSPIndex++) {
                                        if ($scope.choices[index].selectedCatalogName === $scope.choicesMSP[MSPIndex].selectedCatalogName) {
                                            $scope.actualMSPComponentIndex = MSPIndex;
                                            console.log('$scope.actualMSPComponentIndex === ' + $scope.actualMSPComponentIndex);
                                        }
                                    }
                                    var user1 = $scope.currentUser;
                                    var serviceName1 = $scope.choices[index].selectedCatalogName;
                                    console.log("serviceName ============" + serviceName1);
                                    var mspCount = $scope.openpopupMSPCount;
                                    $scope.mspCount = mspCount - 1;
                                    console.log('componentCount MSP === ' + $scope.mspCount);
                                    $http({
                                        method: 'PUT',
                                        url: '/api/removeComponentFromSolutiondb ',
                                        data: $.param({
                                            'uname': user1,
                                            'solnName': $scope.solnEntered,
                                            'service_details': 'msp',
                                            'service_name': serviceName1,
                                            'component_cnt': $scope.actualMSPComponentIndex
                                        }),
                                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                        //forms user object
                                    })
                                        .success(function (data) {
                                            console.log("inside getServiceInfo function === " + JSON.stringify(data));
                                            $scope.popupData = data;
                                            // console.log("MSP attr data == "+$scope.popupData);


                                            /*$scope.loading=false;*/
                                        }
                                    ).error(function (data, status, header, config) {
                                            console.log("header data" + header);
                                            console.log("status data" + status);
                                            console.log("config data" + config);
                                            console.log("Data:" + data);


                                        })
                                }

                                if ($scope.choices[index].type === 'runtime') {

                                    console.log("componentName======" + $scope.choices[index].selectedImageTitle);
                                    // sharedProperties.setRuntimeChoiceIndex($scope.openpopupRuntimeCount-1);
                                    $scope.currentUser = sharedProperties.getProperty();
                                    console.log('userEntered == ' + $scope.currentUser);
                                    //$scope.solnEntered = sharedProperties.getSoln();
                                    $scope.solnEntered=sharedProperties.getCurrentCSolName()
                                    var user = $scope.currentUser;
                                    var runtimeServiceName = $scope.choices[index].selectedImageTitle;
                                    console.log("serviceName ============" + runtimeServiceName);
                                    console.log('$scope.openpopupRuntimeCount count === ' + $scope.openpopupRuntimeCount);
                                    var runtimeCount = $scope.openpopupRuntimeCount;
                                    $scope.componentCount = runtimeCount - 1;
                                    console.log('componentCount runtime === ' + $scope.componentCount);

                                    for (var runtimeIndex = 0; runtimeIndex < $scope.choicesRuntime.length; runtimeIndex++) {
                                        if ($scope.choices[index].selectedImageTitle === $scope.choicesRuntime[runtimeIndex].selectedImageTitle) {
                                            $scope.actualruntimeComponentIndex = runtimeIndex;
                                            console.log('$scope.actualruntimeComponentIndex === ' + $scope.actualruntimeComponentIndex);
                                        }
                                    }
                                    $http({
                                        method: 'PUT',
                                        url: '/api/removeComponentFromSolutiondb ',
                                        data: $.param({
                                            'uname': user,
                                            'solnName': $scope.solnEntered,
                                            'service_details': 'runtime',
                                            'service_name': runtimeServiceName,
                                            'component_cnt': $scope.actualruntimeComponentIndex
                                        }),
                                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                        //forms user object
                                    })
                                        .success(function (data) {
                                            console.log("inside runtime function === " + JSON.stringify(data));
                                            $scope.runtimePopupData = data;
                                            // console.log("MSP attr data == "+$scope.popupData);

                                            /*$scope.loading=false;*/
                                        }
                                    ).error(function (data, status, header, config) {
                                            console.log("header data" + header);
                                            console.log("status data" + status);
                                            console.log("config data" + config);
                                            console.log("Data:" + data);


                                        })
                                }

                                if ($scope.choices[index].type === 'bluemix') {

                                    console.log("componentName======" + $scope.choices[index].selectedImageTitle);
                                    // sharedProperties.setServiceChoiceIndex($scope.openpopupBluemixCount);s
                                    $scope.currentUser = sharedProperties.getProperty();
                                    console.log('userEntered == ' + $scope.currentUser);
                                    //$scope.solnEntered = sharedProperties.getSoln();
                                    $scope.solnEntered=sharedProperties.getCurrentCSolName();
                                    var user = $scope.currentUser;
                                    var bluemixServiceName = $scope.choices[index].selectedImageTitle;
                                    console.log("serviceName ============" + bluemixServiceName);
                                    var bluemixCount = $scope.openpopupBluemixCount;
                                    $scope.componentServiceCount = bluemixCount - 1;
                                    console.log('componentCount Service === ' + $scope.componentServiceCount);

                                    for (var serviceIndex = 0; serviceIndex < $scope.choicesServices.length; serviceIndex++) {
                                        if ($scope.choices[index].selectedImageTitle === $scope.choicesServices[serviceIndex].selectedImageTitle) {
                                            $scope.actualServiceComponentIndex = serviceIndex;
                                            console.log('$scope.actualServiceComponentIndex === ' + $scope.actualServiceComponentIndex);
                                        }
                                    }


                                    $http({
                                        method: 'PUT',
                                        url: '/api/removeComponentFromSolutiondb ',
                                        data: $.param({
                                            'uname': user,
                                            'solnName': $scope.solnEntered,
                                            'service_details': 'bluemix',
                                            'service_name': bluemixServiceName,
                                            'component_cnt': $scope.actualServiceComponentIndex
                                        }),
                                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                        //forms user object
                                    })
                                        .success(function (data) {
                                            console.log("inside getBluemixServiceInfo function === " + JSON.stringify(data));
                                            $scope.servicePopupData = data;
                                            console.log("$scope.servicePopupData == " + JSON.stringify($scope.servicePopupData));
                                            /*$scope.loading=false;*/

                                        }
                                    ).error(function (data, status, header, config) {
                                            console.log("header data" + header);
                                            console.log("status data" + status);
                                            console.log("config data" + config);
                                            console.log("Data:" + data);


                                        })
                                }


                                if (canvas.getActiveGroup()) {
                                    canvas.getActiveGroup().forEachObject(function (o) {
                                        canvas.remove(o)
                                    });
                                    canvas.discardActiveGroup().renderAll();
                                } else {
                                    canvas.remove(canvas.getActiveObject());
                                }

                                // console.log('deleted object'+JSON.stringify(object));
                                // remove lines (if any)
                                if (object.addChild) {
                                    if (object.addChild.from)
                                    // step backwards since we are deleting
                                        for (var i = object.addChild.from.length - 1; i >= 0; i--) {
                                            var line = object.addChild.from[i];
                                            line.addChildRemove();
                                            line.remove();
                                        }
                                    if (object.addChild.to)
                                        for (var i = object.addChild.to.length - 1; i >= 0; i--) {
                                            var line = object.addChild.to[i];
                                            line.addChildRemove();
                                            line.remove();
                                        }
                                }
                                // object.remove();
                                // tbText.remove();
                                $scope.removeChoice(index);

                            }
                            else {
                                /*alert("this service has not been selected for delete.Please delete service which is selected");*/
                                $uibModal.open({
                                    animation: $scope.animationsEnabled,
                                    templateUrl: '../components/modal/SelectProperService.html',
                                    size: 'sm',
                                    controller: 'SelectProperServiceCtrl',
                                    windowClass: 'app-modal-window-selectpro',
                                    backdrop: 'static',
                                    resolve: {

                                    }
                                });
                            }
                        }
                    }

                    $scope.printCanvas = function()
                    {
                        /*console.log("created canvas== "+canvas);
                         console.log("Current canvas : " + JSON.stringify(canvas));
                         canvas.clear();*/
                        //canvas.clear();
                        //canvas.clear();
                        var imgDevice = document.getElementById("device_img");
                        var deviderImg = document.getElementById("devider_img");
                        var edgeDevice = document.getElementById("edge_device");

                        var imgInstance1 = new fabric.Image(imgDevice);
                        imgInstance1.left=509;
                        imgInstance1.top=180;
                        canvas.add(imgInstance1);
                        imgInstance1.lockMovementY = true;
                        imgInstance1.lockMovementX = true;


                        var imgInstance2 = new fabric.Image(deviderImg);
                        imgInstance2.left=615;
                        imgInstance2.top=342;
                        canvas.add(imgInstance2);
                        imgInstance2.lockMovementY = true;
                        imgInstance2.lockMovementX = true;

                        var imgInstance3 = new fabric.Image(edgeDevice);
                        imgInstance3.left=722;
                        imgInstance3.top=180;
                        canvas.add(imgInstance3);
                        imgInstance3.lockMovementY = true;
                        imgInstance3.lockMovementX = true;

                        $scope.choices = [];
                        $scope.objCount = 0;

                        /*$uibModal.open({
                         animation: $scope.animationsEnabled,
                         templateUrl: '../components/modal/newSolArchitecture.html',
                         controller: 'newsolCtrl',
                         windowClass: 'app-modal-window-nns',
                         backdrop: 'static',
                         resolve: {

                         }
                         });*/

                        $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: '../components/modal/newArchConfirmation.html',
                            controller: 'newArchConfirmCtrl',
                            windowClass: 'app-modal-window-newArch',
                            backdrop: 'static',
                            resolve: {

                            }
                        });
                    };

                    $scope.esave = function(){
                        console.log("from save----->")
                        $scope.newVer= sharedProperties.getNewersion();
                        console.log("current version ----->"+$scope.newVer)
                        /*console.log("created canvas== "+canvas);
                         console.log("Current canvas : " + JSON.stringify(canvas));*/
                        $scope.canvasCreated=JSON.stringify(canvas);
                        console.log("Current canvasCreated : " + $scope.canvasCreated);
                        var s1=canvas;
                        console.log('s1 type === '+typeof s1);
                        $scope.currentUser1 = sharedProperties.getProperty();
                        console.log('userEntered == ' + $scope.currentUser1);
                        // $scope.solnEntered1 = sharedProperties.getSoln();
                        $scope.solnEntered1=sharedProperties.getCurrentCSolName();
                        console.log('solnEntered1 == ' + $scope.solnEntered1);
                        $scope.spinsViewBoM = true;
                        $scope.spinsRuntimeList = false;
                        $scope.spinsServicesList=false;
                        $scope.spinsCanvasCatalogue = false;
                        $scope.spinsCanvas=false;
                        $scope.loading=true;

                        $http({
                            method: 'PUT',
                            url: '/api/v2/updateCanvasInfo' ,
                            data: $.param({
                                'uname':  $scope.currentUser1,
                                'solnName':  $scope.solnEntered1,
                                'canvasinfo': $scope.canvasCreated,
                                'version': $scope.newVer
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
                                $scope.spinsViewBoM = false;

                            })
                            .error(function (data, status, header, config) {
                                console.log("header data" + header);
                                console.log("status data" + status);
                                console.log("config data" + JSON.stringify(config));

                            })






                    };

                    $scope.choices = [];
                    $scope.choicesMSP = [];
                    $scope.choicesRuntime = [];
                    $scope.choicesServices = [];


                    $scope.getIndex=function (index) {
                        console.log("index====="+index);
                        $scope.selectedImageIndex=index;
                    }

                    $scope.getIndexBluemix=function (index) {
                        console.log("index====="+index);
                        $scope.selectedBluemixImageIndex=index;
                    }

                    $scope.getIndexServiceBluemix=function (index) {
                        console.log("index====="+index);
                        $scope.selectedServiceBluemixImageIndex=index;
                    }

                    $scope.addNewChoice = function(obj) {
                        console.log('Inside addnewchoice');
                        if($scope.count>0) {
                            for (var i = 0; i < choices.length; i++) {
                                if (choices[i].selectedImage === obj.selectedImage && choices[i].selectedImageTitle === obj.selectedImageTitle) {
                                    break;
                                }else{
                                    if(obj.type==='msp'){
                                        $scope.choicesMSP.push(obj);
                                    }else if(obj.type==='runtime'){
                                        $scope.choicesRuntime.push(obj);
                                    }else if(obj.type==='bluemix'){
                                        $scope.choicesRuntime.push(obj);
                                    }

                                    $scope.choices.push(obj);

                                }

                            }
                        }else{
                            if(obj.type==='msp'){
                                $scope.choicesMSP.push(obj);
                            }else if(obj.type==='runtime'){
                                $scope.choicesRuntime.push(obj);
                            }else if(obj.type==='bluemix'){
                                $scope.choicesServices.push(obj);
                            }

                            $scope.choices.push(obj);
                        }
                        // $scope.objCount++;
                        $scope.count++;


                        console.log('choicesObject == '+JSON.stringify($scope.choices));
                        console.log('choicesMSP == '+JSON.stringify($scope.choicesMSP));
                        console.log('choicesRuntime == '+JSON.stringify($scope.choicesRuntime));
                        console.log('choicesServices == '+JSON.stringify($scope.choicesServices));
                        // var newItemNo = $scope.choices.length+1;
                        // $scope.choices.push({'id':'choice'+newItemNo});
                    };

                    $scope.removeChoice = function(index) {
                        var lastItem = index;
                        $scope.choices.splice(lastItem,1);
                        $scope.objCount--;
                        // $scope.deleteObject();
                    };

                    if (Modernizr.draganddrop) {
                        // Browser supports HTML5 DnD.

                        // Bind the event listeners for the image elements
                        var images = document.querySelectorAll('#images img');

                        [].forEach.call(images, function (img) {
                            img.addEventListener('dragstart', $scope.handleDragStart, false);
                            img.addEventListener('dragend', $scope.handleDragEnd, false);
                        });

                        var images1 = document.querySelectorAll('#images1 img');

                        [].forEach.call(images1, function (img) {
                            img.addEventListener('dragstart', $scope.handleDragStart, false);
                            img.addEventListener('dragend', $scope.handleDragEnd, false);
                        });
                        // Bind the event listeners for the canvas
                        var canvasContainer = document.getElementById('canvas-container');
                        canvasContainer.addEventListener('dragenter', $scope.handleDragEnter, false);
                        canvasContainer.addEventListener('dragover', $scope.handleDragOver, false);
                        canvasContainer.addEventListener('dragleave', $scope.handleDragLeave, false);
                        canvasContainer.addEventListener('drop', $scope.handleDrop, false);
                    } else {
                        // Replace with a fallback to a library solution.
                        // alert("This browser doesn't support the HTML5 Drag and Drop API.");
                    }






                })

            }
        })
        .error(function (data, status, header, config) {
            console.log("header data" + header);
            console.log("status data" + status);
            console.log("config data" + JSON.stringify(config));
        });



    $scope.placeServiceOrder=function (index) {
        $scope.currentUser = sharedProperties.getProperty();
        console.log('userEntered == ' + $scope.currentUser);
        //console.log('user===' +user);
        console.log('$scope.solnEntered11===' +JSON.stringify($scope.solnEntered11));
        $scope.Contact = sharedProperties.getContactName();
        console.log('$scope.Contact===' +$scope.Contact);
        $scope.currentBMUser=sharedProperties.getBMuname();
        $scope.currentBMPass=sharedProperties.getBMPass();
        console.log('currentBMUser===' +JSON.stringify($scope.currentBMUser));
        console.log('currentBMPass===' +JSON.stringify($scope.currentBMPass));
      console.log('resultCanvasDetails===' +JSON.stringify($scope.resultCanvasDetails));
        $scope.newVer= sharedProperties.getVersion();
        console.log("current version ----->"+$scope.newVer);
        //var serviceName1 = $scope.choices[index].selectedCatalogName;
        if($scope.resultCanvasDetails.services.bluemix[0].services.length === 0){
            console.log('invoke place order for msp prov');
            //console.log(serviceName1=== +serviceName1);
             $http({
             method  : 'POST',
             url     : '/api/v2/placeOrder',
             data    : $.param({
                 'uname': $scope.currentUser,
                 'soln_name': $scope.solnEntered11,
                 'version':$scope.newVer,
                 'contactname':$scope.Contact,
                 'contactmail':$scope.currentUser,
             }),
             headers : {'Content-Type': 'application/x-www-form-urlencoded'}
             //forms user object
             }).success(function(data,status,header,config) {
             console.log("place order data ==="+JSON.stringify(data));

                 //alert('Order Placed Successfully');
                 $uibModal.open({
                     animation: $scope.animationsEnabled,
                     templateUrl: '../components/modal/orderSuccess.html',
                     controller: 'orderSuccessCtrl',
                     backdrop: 'static',
                     windowClass: 'app-modal-window-att-prov',
                     resolve: {

                     }
                 });
             /*$uibModalInstance.dismiss('cancel');
             $location.path('/deployment');*/
             })
        }
        else{
            console.log('inside placeorder');
            $scope.currentUser = sharedProperties.getProperty();
            console.log('userEntered == ' + $scope.currentUser);
            var user = $scope.currentUser;
            console.log("inside place order");
            console.log('$scope.solnEntered === '+$scope.solnEntered11);
            $scope.placeOrderSpins = true;
            $scope.viewCreatSol = false;
            $scope.spinsCatalogueList=false;
            $scope.spinsCanvas=false;
            $scope.spinsCatalogueList = false;
            $scope.spinsViewBoM = false;
            $scope.loading = true;

            $scope.placeOrderSpins = false;
            //modal opens
            $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '../components/modal/bluemixprovision.html',
                controller: 'provisionCtrl',
                backdrop: 'static',
                windowClass: 'app-modal-window-att-prov',
                resolve: {

                }
            });
        }

    };
})

    .service('sharedProperties', function () {
        var user='';
        var soln='';
        var MSPChoiceIndex;
        var runtimeChoiceIndex;
        var serviceChoiceIndex;
        var currentSoln;
        var version='';
        var Cn = '';
        var BMuname = '';
        var BMpass = '';
        this.setBMuname = function(BMuser) {
            console.log("BMuname==="+BMuser);
            BMuname=BMuser;
        };
        this.getBMuname=function () {
            return BMuname;
        };
        this.setBMPass = function(pass) {
            console.log("pass==="+pass);
            BMpass=pass;
        };
        this.getBMPass=function () {
            return BMpass;
        };
        this.setVersion = function(versionId) {
            console.log("VertionId==="+versionId);
            version=versionId;
        };
        this.getVersion=function () {
            return version;
        };

        this.setContactName = function(conName){
            console.log("conName===" +conName);
            Cn = conName;
        };
        this.getContactName = function(){
            return Cn;
        };

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
        };

        this.getCurrentCSolName=function(){
            return currentSoln;
        };

        this.setCanvas=function(canSol){
            console.log("current canvasName==="+canSol);
            canvasName=canSol;
        };
        this.getCanvas=function(){
            return canvasName;
        };
        this.setNewversion = function(newversionId) {
            console.log("VertionId==="+newversionId);
            newversion=newversionId;

        };
        this.getNewersion=function () {
            return newversion;
        }
    });
angular.module('portalControllers').controller('provisionCtrl', function ($scope,$uibModal,$uibModalInstance,$location,$http,sharedProperties) {
    $scope.ngShowModalprov = true;
    $scope.spinsOrgList = false;
    $scope.spinsSpaceList = false;


    $scope.dismissModal = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.getorganization = function(){
        $scope.orgDataArray = [];
        console.log(' $scope.itemData.username===' +JSON.stringify($scope.itemData.username));
        console.log(' $scope.itemData.password===' +JSON.stringify($scope.itemData.password));
        sharedProperties.setBMuname($scope.itemData.username);
        sharedProperties.setBMPass($scope.itemData.password);
        $scope.spinsOrgList=true;
        $scope.loading=true;
        $http({
            method  : 'POST',
            url     : '/api/getOrganizations',
            data    : $.param({'username': $scope.itemData.username,'password':$scope.itemData.password}),
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            //forms user object
        }).success(function(data,status,header,config)
        {
            console.log("get organization data ==="+JSON.stringify(data));
            $scope.orgData = data;
            console.log('$scope.orgData===' +$scope.orgData);
            $scope.orgList = $scope.orgData.description.entity_list[0];
            console.log('$scope.orgList===' +JSON.stringify($scope.orgList));
            for(var i=0;i<$scope.orgList.length;i++){
                console.log('$scope.orgList.length===' +$scope.orgList.length);
                $scope.orgData = $scope.orgList[i].name;
                console.log('$scope.orgData' +JSON.stringify($scope.orgData));
                $scope.orgDataArray.push($scope.orgData);
                $scope.loading=false;
            }
            console.log('$scope.orgDataArray==' +JSON.stringify($scope.orgDataArray));
            /*$uibModalInstance.dismiss('canceol');
             $location.path('/deployment');*/
        })
    };
    $scope.getSpaces = function(index){
        $scope.spaceDataArray = [];
        console.log('index==' +index);
        //alert("inside get spaces");
        var indexCourseId = _.findIndex($scope.orgList, function (data) {
            console.log('data==' +data);
            return data.name === index;
        });
        console.log('indexCourseId===' +indexCourseId);
        var spaceUrl = $scope.orgList[indexCourseId].space_url;
        console.log('spaceUrl===' +JSON.stringify(spaceUrl));
        $scope.spinsSpaceList = true;
        //alert('inside getorganization');
        $scope.spinsOrgList=false;
        $scope.loading = true;
        var org = $scope.servicedata.organization;
        console.log('org===' +JSON.stringify(org));
        console.log('$scope.itemData.username==='+JSON.stringify($scope.itemData.username));
        console.log('$scope.itemData.password==='+JSON.stringify($scope.itemData.password));
        $http({
            method  : 'POST',
            url     : '/api/getSpaces',
            data    : $.param({'uname': $scope.itemData.username,'pass':$scope.itemData.password,'orgname':org,'space_url':spaceUrl}),
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            //forms user object
        }).success(function(data,status,header,config)
        {
            /*$scope.selSpace = true;
            $scope.showSpace = true;*/
            console.log("get organization data ==="+JSON.stringify(data));
            $scope.spaceList = data;
            console.log('$scope.spaceList===' +JSON.stringify($scope.spaceList));
            for(var i=0;i<$scope.spaceList.length;i++){
                console.log('$scope.spaceList.length==' +$scope.spaceList.length);
                $scope.spaceData = $scope.spaceList[i].space_name;
                console.log('$scope.spaceData' +JSON.stringify($scope.spaceData));
                $scope.spaceDataArray.push($scope.spaceData);
                $scope.loading = false;
            }
            console.log('$scope.spaceDataArray==' +JSON.stringify($scope.spaceDataArray));
        })
    };
    $scope.proceedForOrder = function(org){
        console.log('org===' +org);
        $scope.currentUser = sharedProperties.getProperty();
        console.log('userEntered == ' + $scope.currentUser);
        $scope.solnEntered11=sharedProperties.getCurrentCSolName();
        console.log('$scope.solnEntered11===' +$scope.solnEntered11);
        $scope.newVer= sharedProperties.getVersion();
        console.log("current version ----->"+$scope.newVer);
        $scope.Contact = sharedProperties.getContactName();
        console.log('$scope.Contact===' +$scope.Contact);
        console.log('$scope.itemData.username===' +$scope.itemData.username);
        console.log('$scope.itemData.password===' +$scope.itemData.password);
        var indexCourseId = _.findIndex($scope.orgList, function (data) {
            console.log('data==' +data);
            return data.name === org;
        });
        console.log('indexCourseId===' +indexCourseId);
        var spaceUrl = $scope.orgList[indexCourseId].space_url;
        console.log('spaceUrl===' +JSON.stringify(spaceUrl));
        //var spaceUrl = $scope.orgList[indexCourseId].space_url;
        //console.log('spaceUrl===' +JSON.stringify(spaceUrl));
        $uibModalInstance.dismiss('cancel');
        $http({
            method  : 'POST',
            url     : '/api/v2/placeOrder',
            data    : $.param({
                'uname': $scope.currentUser,
                'soln_name': $scope.solnEntered11,
                'version':$scope.newVer,
                'contactname':$scope.Contact,
                'contactmail':$scope.currentUser,
                'space_guid':spaceUrl,
                'service_plan_guid':'abc',
                'bmusername':$scope.itemData.username,
                'bmpassword':$scope.itemData.password

            }),
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            //forms user object
        }).success(function(data,status,header,config) {

            console.log("place order data ==="+JSON.stringify(data));
            $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '../components/modal/orderSuccess.html',
                controller: 'orderSuccessCtrl',
                backdrop: 'static',
                windowClass: 'app-modal-window-att-prov',
                resolve: {

                }
            });
            /*$uibModalInstance.dismiss('cancel');
             $location.path('/deployment');*/
        });
        //$location.path('/deployment');
    }
});

angular.module('portalControllers').controller('orderSuccessCtrl', function ($scope,$uibModal,$uibModalInstance,$location,$http,sharedProperties) {
    $scope.ngShowModalOrderSuccess = true;
    $scope.dismissModal = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.ProceedDepl = function(){
        $uibModalInstance.dismiss('cancel');
        $location.path('/deployment');
    }
});

angular.module('portalControllers').controller('viewArchEditctrl', function ($scope,$timeout,$window,$uibModal,$uibModalInstance,$rootScope,sharedProperties,$location,$http) {
    console.log("from viewArchEdit----->");

    $scope.distext = '';
    $scope.dismissOrderViewArch = function(){

        $uibModalInstance.dismiss('cancel');

        $rootScope.showhideprop=false;
    }
    $scope.vcancle = function() {
        $rootScope.showhideprop=false;
        $uibModalInstance.dismiss('cancel');

        console.log("cancel------>")
    };
    $scope.confirms = function (textModel) {
        $scope.distext  = angular.copy(textModel);
        $scope.ver=sharedProperties.getVersion();
        $scope.loguser=sharedProperties.getProperty();
        $scope.curSolution=sharedProperties.getCurrentCSolName()
        $scope.distext  = angular.copy(textModel);


        console.log("version from viewarch-- ----------- >"+$scope.ver);
        console.log("user==================>"+ $scope.loguser);
        console.log("solution name--------------->"+$scope.curSolution)
        console.log("discription----------------"+$scope.distext)
        $http({
            method: 'POST',
            url: '/api/v2/modifysolutionversion',
            data    : $.param({'uname': $scope.loguser,
                'solnName':$scope.curSolution,
                'solnDesc':$scope.distext,
                'version':$scope.ver
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        })
            .success(function (data, status, header, config) {

                if (data.errors) {
                    // Showing errors.
                    $scope.errorName = data.errors.name;
                } else {
                    // console.log("inside success function");
                    $rootScope.showhideprop=false;
                    $scope.editCanvasDetails = data;
                    console.log('editCanvasDetails===>' + JSON.stringify($scope.editCanvasDetails));
                    $scope.newsolution=$scope.editCanvasDetails.solution_name;
                    $scope.newVersion=$scope.editCanvasDetails.version;
                    $scope.soln=$scope.newsolution;
                    $scope.vers= $scope.newVersion;
                    $scope.vers= $scope.newVersion;
                    console.log('$scope.newVersion---->>>>>'+$scope.newVersion)
                    $scope.versionnum = $scope.newVersion;
                     console.log('$scope.versionnum===' +$scope.versionnum);
                    $scope.Vertype=$scope.editCanvasDetails.type;
                    sharedProperties.setNewversion($scope.newVersion);
                    $scope.Vertype=$scope.editCanvasDetails.type;
                    //$scope.versionnum =$scope.newVersion
                    $rootScope.versionnum = $scope.newVersion;

                    $uibModalInstance.close();
                    console.log("new solution ----->"+$scope.soln);
                    console.log("new version ----->"+ $scope.vers);
                    console.log("type------------->"+$scope.Vertype)

                    $rootScope.showhideprop=true;

                    $timeout(function () {
                        var canvas;
                        // window.newAnimation = function () {
                        canvas = new fabric.Canvas('canvas');
                        canvas = new fabric.Canvas('canvas',{
                            selection: true,
                        });
                        $scope.canvasCreated=JSON.stringify(canvas);
                        console.log("Current canvasCreated : " + $scope.canvasCreated);

                        canvas.on("object:selected", function(options) {
                            options.target.bringToFront();
                            $( "#canvas-container").draggable("enable");
                        });
                        window.addEventListener("load", function()
                        {


                            var canvas = document.createElement('canvas'); document.body.appendChild(canvas);
                            var context = canvas.getContext('2d');

                            function draw()
                            {
                                context.strokeRect(0, 0, window.innerWidth, window.innerHeight);
                                canvas.calcOffset();

                            }
                            function resize()
                            {
                                canvas.width = window.innerWidth;
                                canvas.height = window.innerHeight;
                                draw();
                            }
                            window.addEventListener("resize", resize);
                            resize();
                        });
                        /*var imgDevice = document.getElementById("device_img");
                        var deviderImg = document.getElementById("devider_img");
                        var edgeDevice = document.getElementById("edge_device");

                        var imgInstance1 = new fabric.Image(imgDevice);
                        imgInstance1.left=400;
                        imgInstance1.top=400;
                        canvas.add(imgInstance1);
                        imgInstance1.lockMovementY = true;
                        imgInstance1.lockMovementX = true;
                        imgInstance1.hasControls=false;


                        var imgInstance2 = new fabric.Image(deviderImg);
                        imgInstance2.left=615;
                        imgInstance2.top=400;
                        canvas.add(imgInstance2);
                        imgInstance2.lockMovementY = true;
                        imgInstance2.lockMovementX = true;
                        imgInstance2.hasControls=false;

                        var imgInstance3 = new fabric.Image(edgeDevice);
                        imgInstance3.left=800;
                        imgInstance3.top=400;
                        canvas.add(imgInstance3);
                        imgInstance3.lockMovementY = true;
                        imgInstance3.lockMovementX = true;
                        imgInstance3.hasControls=false;*/

                        // we need this here because this is when the canvas gets initialized
                        // ['object:moving', 'object:scaling'].forEach(addChildMoveLine);
                        // }

                        var canvasRenderObject=$scope.editCanvasDetails.canvas_details[0];
                        canvas.loadFromDatalessJSON(canvasRenderObject);
                        canvas.renderAll();
                        $scope.canvasCreated=JSON.stringify(canvas);
                        console.log("Current canvasCreated : " + $scope.canvasCreated);



                    })

                }
            })
            .error(function (data, status, header, config) {
                console.log("header data" + header);
                console.log("status data" + status);
                console.log("config data" + JSON.stringify(config));

            })

    }





});