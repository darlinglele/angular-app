define(['angular', './resourceFactory'], function() {
    return angular.module('resources.users', ['resourceFactory']).factory('Users', [
        '$http', 'resourceFactory', function ($http, resourceFactory) {
            return resourceFactory('users');
        }
    ]);
});