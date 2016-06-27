/**
 * Created by Swati on 4/27/2016.
 */
angular.module('portalControllers').controller('viewDeploymentArchCtrl', function ($scope,$timeout,$window,$uibModal,$rootScope,sharedProperties,$location,$http) {
    console.log('inside viewDeploymentArchCtrl');
    //--------------
    //edit page start here

    // edit Div
    
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

    $http({
        method: 'POST',
        url: 'http://cbicportal.mybluemix.net/api/getCanvasInfo',
        data: $.param({
            "soln_name":$scope.solnEntered11
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
                $timeout(function () {
                    var canvas;
                    // window.newAnimation = function () {
                    canvas = new fabric.Canvas('canvas');
                    // canvas.isDrawingMode = true;
                    fabric.util.addListener(document.getElementById('canvas-container'), 'scroll', function () {
                        console.log('scroll');
                        canvas.calcOffset();
                    });

                    /*canvas.on("object:selected", function(options) {
                        options.target.bringToFront();
                        $( "#canvas-container").draggable("enable");
                    });*/
                    //full canvas 
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
                    
                    //----------------
                    
                    
                    var imgDevice = document.getElementById("device_img");
                    var deviderImg = document.getElementById("devider_img");
                    var edgeDevice = document.getElementById("edge_device");

                    var imgInstance1 = new fabric.Image(imgDevice);
                    imgInstance1.left=109;
                    imgInstance1.top=80;
                    canvas.add(imgInstance1);
                    imgInstance1.lockMovementY = true;
                    imgInstance1.lockMovementX = true;
                    imgInstance1.hasControls=false;


                    var imgInstance2 = new fabric.Image(deviderImg);
                    imgInstance2.left=415;
                    imgInstance2.top=242;
                    canvas.add(imgInstance2);
                    imgInstance2.lockMovementY = true;
                    imgInstance2.lockMovementX = true;
                    imgInstance2.hasControls=false;

                    var imgInstance3 = new fabric.Image(edgeDevice);
                    imgInstance3.left=622;
                    imgInstance3.top=80;
                    canvas.add(imgInstance3);
                    imgInstance3.lockMovementY = true;
                    imgInstance3.lockMovementX = true;
                    imgInstance3.hasControls=false;

                    // we need this here because this is when the canvas gets initialized
                    // ['object:moving', 'object:scaling'].forEach(addChildMoveLine);
                    // }

                    // var canvas = window._canvas = new fabric.Canvas('c');

                    var canvasRenderObject=$scope.resultCanvasDetails[0];
                    canvas.loadFromDatalessJSON(canvasRenderObject);
                    canvas.renderAll();

                    $scope.vEdit = function () {
                        console.log("form Vedit")
                        /*canvas.loadFromJSON(canvasRenderObject,canvas.renderAll.bind(canvas),function (o,object) {
                         fabric.log(o,object);*/
                        //})


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
                         }

                         canvas.forEachObject(function(o){ o.hasBorders = o.hasControls = false; });

                         canvas.on({
                         'mouse:down': function(e) {
                         if (e.target) {
                         e.target.opacity = 0.5;
                         canvas.renderAll();
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
                         }
                         });

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


                         $scope.addChildLine=function (options) {
                         // console.log('options :: '+options);
                         canvas.off('object:selected', $scope.addChildLine);
                         // add the line
                         var fromObject = canvas.addChild.start;
                         var toObject = options.target;

                         var from = fromObject.getCenterPoint();
                         var to = toObject.getCenterPoint();
                         var line = new fabric.Line([from.x, from.y, to.x, to.y], {
                         fill: 'grey',
                         stroke: 'grey',
                         strokeWidth: 1,
                         selectable: false
                         });
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
                         if (e === line)
                         arr.splice(i, 1);
                         });
                         toObject.addChild.to.forEach(function (e, i, arr) {
                         if (e === line)
                         arr.splice(i, 1);
                         });
                         }

                         // undefined instead of delete since we are anyway going to do this many times
                         canvas.addChild = undefined;
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
                         console.log('deleted group object === '+object);
                         console.log('deleted group object string === '+canvas.getActiveObject().get('type'));

                         console.log('index in openpopup ===='+index);
                         console.log('choices in delete click == '+JSON.stringify($scope.choices));

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
                    }

                })

            }
        })
        .error(function (data, status, header, config) {
            console.log("header data" + header);
            console.log("status data" + status);
            console.log("config data" + JSON.stringify(config));

        })
});