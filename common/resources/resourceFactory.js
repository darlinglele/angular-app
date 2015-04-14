define(['angular'], function() {
    return angular.module('resourceFactory', []).factory('resourceFactory', [
        '$http', function($http) {
            return function(resourceName) {
                var resourceUrl = AppConfig.api[resourceName];
                var Resource = function() {

                };
                Resource.query = function() {
                    return $http.get(resourceUrl).then(
                        function(result) {
                            return result.data;
                        });
                };

                Resource.get = function(id) {
                    return $http.get(resourceUrl + id).then(
                        function(result) {
                            return result.data;
                        });;
                };
                return Resource;
            };
        }
    ]);
});