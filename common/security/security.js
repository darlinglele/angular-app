define(['./authorization', './interceptor', './retryQueue', './service','./login/login'], function () {
    angular.module('security', ['security.service', 'security.interceptor', 'security.authorization']);
});
