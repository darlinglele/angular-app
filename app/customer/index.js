/**
 * Created by zhixiong on 4/15/15.
 */
define(['angular', './controllers'], function (angular) {
    return angular.module('app.customer', ['ui.router', 'services', 'security', 'app.customer.controllers']).config([
        '$stateProvider', function ($stateProvider) {
            $stateProvider.state('customer.create', {
                url: 'customer/create',
                views: {
                    'content@': {
                        templateUrl: 'app/customer/customer-create.tpl.html',
                        controller: "CustomerCreateCtrl",
                        resolve: {
                            mock: function ($q) {
                                console.log('create resolved');
                                return $q.when({ud: 1});
                            }
                        }
                    }
                }
            }).state('customer.query', {
                url: 'customer/query',
                views: {
                    'content@': {
                        templateUrl: 'app/customer/customer-query.tpl.html',
                        controller:'CustomerQueryCtrl',
                        resolve: {
                            mock: function ($q) {
                                console.log('query resolved');
                                return $q.when({ud: 1});
                            }
                        }
                    }
                }
            });
        }]);
});