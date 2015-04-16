/**
 * Created by zhixiong on 4/15/15.
 */
define(['angular', 'vendor/index','common/index', './customer/index'], function (angular) {
    return angular.module('app.index', ['ui.router', 'services', 'security', 'ui.bootstrap', 'app.customer']).config([
        '$stateProvider', function ($stateProvider) {
            $stateProvider.state('customer', {
                url: '/',
                views: {
                    'sidebar': {
                        templateUrl: '/app/sidebar.tpl.html',
                        controller: 'SidebarCtrl'
                    },
                    'content': {
                        templateUrl: 'app/content.tpl.html',
                        controller: 'ContentCtrl'
                    }
                }
            });
        }]).controller('SidebarCtrl', function () {

    }).controller('ContentCtrl', function () {

    });
});