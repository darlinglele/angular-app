define(['angular', './retryQueue', 'localStorage'], function () {
    return angular.module('security.interceptor', ['security.retryQueue', 'LocalStorageModule']).factory('authInterceptorService', [
        '$injector', 'securityRetryQueue', 'localStorageService', function($injector, queue, localStorageService) {
            return {
                request: function(config) {
                    config.headers = config.headers || {};
                    var authData = localStorageService.get('authorizationData');
                    if (authData) {
                        config.headers.Authorization = 'Bearer ' + authData.token;
                    }

                    return config;
                },
                response: null,
                responseError: function(originalResponse) {
                    var promise = null;
                    if (originalResponse.status === 401) {
                        promise = queue.pushRetryFn('unauthorized-server', function retryRequest() {
                            return $injector.get('$http')(originalResponse.config);
                        });
                    }
                    if (originalResponse.status === 404) {
                        promise = queue.pushRetryFn('unauthorized-server', function retryRequest() {
                            return $injector.get('$http')(originalResponse.config);
                        });
                    }
                    return promise;
                }
            };
        }
    ]);
})