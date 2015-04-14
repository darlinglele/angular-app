define(['angular', './resourceFactory'], function () {
    return angular.module('resources.reports', ['resourceFactory']).factory('Reports', [
        '$http', 'resourceFactory', function ($http, resourceFactory) {
            return resourceFactory('reports');
        }
    ]);
});