angular.module('portalControllers')
    .controller('MSPController',function($scope,$http,$location,$timeout,sharedProperties,$uibModal){
        console.log("inside MSP controller");
        //$scope.showMspCatalogueMspPage = false;
        $scope.spinsCatalogueListMsp = false;
        $scope.lineAddedMsp=0;
        $scope.spinsCanvas = false;
        $scope.spinsCanvasCatalogueMsp = false;
        $scope.objCount=0;
        $scope.MSP=true;
        $scope.MSPComponentCount=0;
        $scope.openpopupMSPCount=0;


        $scope.redirect_to_Home = function () {
            console.log("inside redirect to home");
            $location.path('/home');
        };

        $scope.editMsp = function(){
            $scope.isActiveMsp = !$scope.isActiveMsp;
        };

        $scope.editNet = function(){
            $scope.isActiveNet = !$scope.isActiveNet;
        };

        $scope.editMspMiddleware = function(){
            $scope.isActiveMspMiddleware = !$scope.isActiveMspMiddleware;
        };

        $scope.edit1 = function(){
            $scope.isActive1 = !$scope.isActive1;
        };

        $scope.edit11 = function(){
            $scope.isActive2 = !$scope.isActive2;
        };
        $scope.editMiddlewareMsp = function(){
            $scope.isActive = !$scope.isActive;
            $scope.spinsCatalogueListMsp = true;
            $scope.loadingmsp =true;

            $http.get("/api/getMspComponentlists",{ cache: true}).success(function(data){
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
                $scope.loadingmsp=false;
            })
        }
        $scope.edit2MspCanvas = function(){
            $scope.isActive2MspCanvas = !$scope.isActive2MspCanvas;
        }

        $scope.edit3 = function(){
            $scope.isActive2 = !$scope.isActive2;
        }


        $scope.openpopupMsp= function (index) {
            console.log('index in openpopup ===='+index);
            if ($scope.choices[index].type === 'msp'){
                $scope.openpopupMSPCount++;
                console.log("componentName======" + $scope.choices[index].selectedImageTitle);
                $scope.currentUser = sharedProperties.getProperty();
                console.log('userEntered == ' + $scope.currentUser);
                $scope.solnEntered = sharedProperties.getSoln();

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
                            templateUrl: '../components/modal/attributesMsp.html',
                            controller: 'AttrCtrlMsp',
                            backdrop: 'static',
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
        };

        $timeout(function () {
            var canvas;
            // window.newAnimation = function () {
           /* canvas = new fabric.Canvas('canvas');*/
            // canvas.isDrawingMode = true;
            canvas = new fabric.Canvas('canvas',{
                selection: true,
            });

            canvas.on("object:selected", function(options) {
                options.target.bringToFront();

            });
            $(function() {
                $("#canvas-container").draggable();
            });
            /*fabric.util.addListener(document.getElementById('canvas-container'), 'scroll', function () {
                console.log('scroll');
                canvas.calcOffset();
            });*/
            var imgDevice = document.getElementById("device_img");
            /*var deviderImg = document.getElementById("devider_img");
             var edgeDevice = document.getElementById("edge_device");*/

            var imgInstance1 = new fabric.Image(imgDevice);
            imgInstance1.left=400;
            imgInstance1.top=400;
            canvas.add(imgInstance1);
            imgInstance1.lockMovementY = true;
            imgInstance1.lockMovementX = true;
            // we need this here because this is when the canvas gets initialized
            ['object:moving', 'object:scaling'].forEach(addChildMoveLine);
            // }

            //canvas width
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

            //---------------------------------


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
                    console.log("inside handleDrop");
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
                    $scope.solnEntered=sharedProperties.getSoln();
                    console.log("$scope.solnEntered============" +$scope.solnEntered);
                    console.log("$scope.itemData.component_count====" +objectCount);
                    console.log("$scope.itemData.component_count====" +$scope.Title[$scope.selectedImageIndex]);
                    var user=$scope.userEntered;
                    var serviceName=$scope.catalog_name[$scope.selectedImageIndex];
                    $scope.spinsCatalogueListMsp = false;
                    $scope.spinsCanvas = true;
                    $scope.loadingmsp = true;

                    $http({
                        method  : 'PUT',
                        url     : '/api/AddComponentToCanvas',
                        data    : $.param({'uname': user, 'solnName': $scope.solnEntered, 'service_details': 'msp','service_name': serviceName,'component_cnt': objectCount}),
                        //data    : $.param({uname: '$scope.itemData.userId', solnName: '$scope.itemData.solnInput', service_details: 'msp',service_name: '$scope.valueOfSelectedImage',component_cnt: '$scope.objCount'}),
                        headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                        //forms user object
                    })
                        .success(function(data) {
                            console.log("inside success function");
                            $scope.DataResponse = data;
                            console.log(JSON.stringify($scope.DataResponse));
                            $scope.loadingmsp=false;
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
                            fontSize:10,
                            hasControls: false
                        });
                        // canvas.add(tbText);
                        var group = new fabric.Group([oImg, tbText], { left: e.layerX, top: e.layerY });
                        console.log("group object is == "+JSON.stringify(group));
                        canvas.add(group);
                    });
                }


                canvas.forEachObject(function(o){ o.hasBorders = o.hasControls = false; });

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
                /*$scope.lineAdded++;*/
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
                       /* $scope.lineAdded--;*/
                        if (e === line) {
                            console.log('i from object value === '+i);
                            arr.splice(i, 1);
                        }
                    });
                    toObject.addChild.to.forEach(function (e, i, arr) {
                        /*$scope.lineAdded--;*/
                        if (e === line) {
                            console.log('i to object value === '+i);
                            arr.splice(i, 1);
                        }
                    });
                    $scope.lineAddedMsp--;
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
                $scope.lineAddedMsp++;
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
                        windowClass: 'app-modal-window-mspdc',
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
                            $scope.solnEntered = sharedProperties.getSoln();
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
                                url: '/api/removeComponentFromSolutiondb',
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
                            windowClass: 'app-modal-window-mspsp',
                            backdrop: 'static',
                            resolve: {

                            }
                        });
                    }
                }
            }

            $scope.printCanvas = function()
            {
                canvas.clear();
                $scope.choices = [];
                $scope.objCount = 0;
                $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '../components/modal/newSolArchitecture.html',

                    controller: 'newsolCtrl',
                    windowClass: 'app-modal-window-mspnsa',
                    backdrop: 'static',
                    resolve: {

                    }
                });
            };

            $scope.viewBillMsp = function(){
                $scope.canvasCreated=JSON.stringify(canvas);
                console.log("Current canvasCreated : " + $scope.canvasCreated);
                var s1=canvas;
                console.log('s1 type === '+typeof s1);
                $scope.currentUser1 = sharedProperties.getProperty();
                console.log('userEntered == ' + $scope.currentUser1);
                $scope.solnEntered1 = sharedProperties.getSoln();
                console.log('solnEntered1 == ' + $scope.solnEntered1);

                $http({
                    method: 'PUT',
                    url: '/api/updateCanvasInfo',
                    data: $.param({
                        'uname': $scope.currentUser1,
                        'solnName': $scope.solnEntered1,
                        'canvasinfo': $scope.canvasCreated
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

                $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '../components/modal/orderBillMsp.html',
                    size: 'lg',
                    controller: 'orderBillCtrlMsp',
                    windowClass: 'app-modal-window-mspob',
                    backdrop: 'static',
                    resolve: {
                        isOrderButton:function(){
                            return 'viewBOM';
                        }
                    }
                });
            };

            $scope.choices = [];
            $scope.choicesMSP = [];
            /*$scope.choicesRuntime = [];
             $scope.choicesServices = [];
             */

            $scope.getIndex=function (index) {
                console.log("index====="+index);
                $scope.selectedImageIndex=index;
            };
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
                /*console.log('choicesRuntime == '+JSON.stringify($scope.choicesRuntime));
                 console.log('choicesServices == '+JSON.stringify($scope.choicesServices));*/
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

                var images1 = document.querySelectorAll('#images img');

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

            $scope.redirectToHome = function(){
                console.log("inside redirect");
                $location.path('/home');

                //$state.go('/home');
            };

        })


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


angular.module('portalControllers').controller('solCtrlMsp', function ($scope,$uibModal,$uibModalInstance,$location) {
    // alert("inside solution  ctrl");
    $scope.ngShowModalMsp = true;
    $scope.createItemMsp = function(){
        $uibModalInstance.dismiss('cancel');

        $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: '../components/modal/solutionPopupMsp.html',
            controller: 'solutionCtrlMsp',
            windowClass: 'app-modal-window-mspspop',
            backdrop: 'static',
            resolve: {

            }
        });
    }
    $scope.openItem = function(){
        $uibModalInstance.dismiss('cancel');
        $location.path('/deployment');
    }

    $scope.dismissModalSolArch = function () {
        $uibModalInstance.dismiss('cancel');
        $location.path('/home');
    };

});


angular.module('portalControllers').controller('solutionCtrlMsp', function ($scope,$uibModal,$uibModalInstance,$location,$http,sharedProperties,$rootScope) {
        // alert("inside solution2  ctrl");
        $scope.ngShowModal2Msp = true;
        $scope.dismissModal = function () {
            $uibModalInstance.dismiss('cancel');
            $location.path('/home');
        };
        $scope.createCanvas = function(){
            $rootScope.solnName = $scope.itemData.solnInput;
            console.log("$scope.solnName === " +$rootScope.solnName);
            var solnDesc = $scope.itemData.solDesc;
            console.log("$scope.solnName === " +solnDesc);
            sharedProperties.setSoln($rootScope.solnName);


            var uid = sharedProperties.getProperty();
            console.log("user name in solution ctrl === "+uid);
            // sharedProperties.setSoln(solnName);

            console.log('inside canvas creation');

            $http({
                method  : 'POST',
                url     : '/api/v1/creatMpsSolution',
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
                        $location.path('/MSP');
                        $uibModalInstance.dismiss('cancel');
                    }

                })
                .error(function(data,status,header,config){
                    console.log("header data" +header);
                    console.log("status data" +status);
                    console.log("config data" +JSON.stringify(config));
                })
        }

    });


angular.module('portalControllers').controller('AttrCtrlMsp', function ($scope,parentDivCall,countComp,serviceType,$uibModal,$uibModalInstance,sharedProperties,$http) {
    $scope.showMSPAttributes=false;
    $scope.showRuntimeAttributes=false;
    $scope.showServiceAttributes=false;
    if(serviceType==='msp') {
        console.log("inside msp portal ctrl");
        $scope.username = sharedProperties.getProperty();
        $scope.solnName = sharedProperties.getSoln();
        $scope.ngShowModalMsp = true;
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

        $scope.dismissModal = function () {
            $uibModalInstance.dismiss('cancel');
            $location.path('/home');
        };


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
                    /*if (key === 'IIB Server') {
                     $scope.patternObjectIIB_Server = $scope.patternObject["IIB Server"];

                     } else if (key === 'DATAPOWER Server') {
                     $scope.patternObjectIIB_Server = $scope.patternObject["DATAPOWER Server"];

                     } else if (key === 'MYSQL Server') {
                     $scope.patternObjectIIB_Server = $scope.patternObject["MYSQL Server"];
                     }*/
                    $scope.patternObjectIIB_Server = $scope.patternObject[key];
                    console.log("$scope.patternObjectIIB_Server == "+JSON.stringify($scope.patternObjectIIB_Server));
                })
            }

        })

        $scope.changedValueSaveMsp = function () {

            console.log('updated object values ==== ' + JSON.stringify($scope.patternObjectIIB_Server));
            /*$scope.popupData1["Pattern"]=$scope.patternObjectIIB_Server;*/
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

        $scope.saveDataMsp = function () {
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

})
.directive('loadingmsp', function () {
    return {
        restrict: 'E',
        replace:true,
        template: '<span class="loading"><img src="images/ajax-loader.gif" width="20" height="20" /></span>',
        link: function (scope, element, attr) {
            scope.$watch('loadingmsp', function (val) {
                if (val)
                    $(element).show();
                else
                    $(element).hide();
            });
        }
    }
});
angular.module('portalControllers').controller('orderBillCtrlMsp', function ($scope,$uibModal,$uibModalInstance,sharedProperties,$http,$location) {
    // alert("inside order bill ctrl");
    $scope.ngShowModal4Msp = true;
    $scope.quantityValueArray=[];
    $scope.serialNumber=0;
    $scope.dismissOrder = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.viewBillOfOrderArray=[];
    $scope.patternObjectIIB_Server={};
    $scope.solnEntered=sharedProperties.getSoln();
    console.log('$scope.solnEntered == '+$scope.solnEntered);
    $scope.spinsCatalogueList=false;
    $scope.spinsCanvas=false;
    $scope.spinsCatalogueList = false;
    $scope.spinsViewBoM = true;
    $scope.loading = true;

    $http.get("/api/v1/viewMspBillofMaterial?solnName="+$scope.solnEntered)
        .success(function(data){
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


    $scope.placeOrderMsp=function () {
        $scope.currentUser = sharedProperties.getProperty();
        console.log('userEntered == ' + $scope.currentUser);
        var user = $scope.currentUser;
        console.log("inside place order");
        console.log('$scope.solnEntered === '+$scope.solnEntered);
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
    }
});


