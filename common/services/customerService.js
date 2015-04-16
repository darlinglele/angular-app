define(['angular'], function (angular) {
    return angular.module("customerService", ["config"])
        //客户 service
        .factory('indiCuService', ['$http', '$q', function ($http, $q) {
            return {
                get: function (id) {

                },
                query: function (id) {
                    var deferred = $q.defer();
                    $http({
                        method: 'GET',
                        url: '/customer/detail?id=' + id,
                    }).
                        success(function (data, status, headers, config) {
                            deferred.resolve(data);
                        }).
                        error(function (data, status, headers, config) {
                            deferred.reject(data);
                        });
                    return deferred.promise;
                },
                save: function (url, params) {
                    var deferred = $q.defer();
                    $http({
                        method: 'POST',
                        url: url,
                        data: params
                    }).
                        success(function (data, status, headers, config) {
                            deferred.resolve(data);
                        }).
                        error(function (data, status, headers, config) {
                            deferred.reject(data);
                        });
                    return deferred.promise;
                },
                remove: function (id) {

                },

            };
        }]);
});
