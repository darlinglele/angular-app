define(['angular', 'angularRoute', 'uiRouter', 'common/index', './master', './basic/home', './admin/index'], function(angular) {
    return angular.module('app', ['ngRoute', 'ui.router', 'services', 'security', 'directives', 'app.master', 'app.home', 'app.admin']).config([
        '$locationProvider', '$routeProvider', 'securityAuthorizationProvider', function($locationProvider, $routeProvider, securityAuthorizationProvider) {
            $locationProvider.html5Mode(true);
        }
    ]).config(function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    }).config([
        '$httpProvider', function($httpProvider) {
            if (!$httpProvider.defaults.headers.get) {
                $httpProvider.defaults.headers.get = {};
            }
            $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
            $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
            $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        }
    ]).run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
});