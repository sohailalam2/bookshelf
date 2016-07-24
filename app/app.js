(function () {
    'use strict';

    angular.module('myApp', [
        'ngRoute',
        'myApp.bookshelf'
    ]).
    config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $routeProvider.otherwise({redirectTo: '/bookshelf'});
    }]);
})();
