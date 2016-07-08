'use strict';
/* App Module */
angular.module('portalApp', [
		'ngRoute',
	'ui.bootstrap',
	'angularUtils.directives.dirPagination',
	'portalControllers'
	])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.
			when('/', {
				templateUrl: '/app/Login/loginPage.html',
				controller: 'mainController'
			}).
			when('/canvas', {
				templateUrl: 'app/Hybrid/canvasScreen.html',
				controller: 'canvasController'
			}).
			when('/home', {
				templateUrl: '/app/Home/home.html',
				controller: 'mainController'
			}).
			when('/MSP', {
				templateUrl: 'app/MSP/MSP.html',
				controller: 'MSPController'
			}).
			when('/catalog', {
				templateUrl: '../components/modal/catalog.html',
				controller: 'sampleController'
			}).
			when('/orderBill', {
				templateUrl: '../components/modal/viewOrderBill.html',
				controller: 'sampleController'
			}).
			when('/orderSummary', {
				templateUrl: '../components/modal/orderSummary.html',
				controller: 'sampleController'
			}).
			when('/deployment', {
				templateUrl: 'app/DeplArch//deplArchitecture.html',
				controller: 'deplCtrl'
			}).

			when('/viewArchietecture',{
				templateUrl: '/app/ViewArch/viewArchietecture.html',
				controller: 'viewDeploymentArchCtrl'
			}).

			otherwise({
				redirectTo: '/sample'
			});
		}]);