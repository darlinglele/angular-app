define(['angular'], function(angular) {
    return angular.module('services.itemAction', ['ngRoute']).factory('itemAction', [
        "$location", function($location) {
            var service = {
                home: {
                    select: function(obj) {
                        if (obj.node.type == 'file') {
                            $location.path("/reports/" + obj.node.id);
                            angular.element(document).scope().$apply();
                        }
                    }
                },
                admin_report:
                {
                    select: function(obj) {
                        $location.path("/admin/reports/" + obj.node.id);
                        angular.element(document).scope().$apply();
                    }
                },
                admin_user: {
                    select: function(obj) {
                        if (obj.node.id == 0) {
                            return;
                        }
                        $location.path("/admin/users/" + obj.node.id);
                        angular.element(document).scope().$apply();
                    }
                }
            };
            return service;
        }
    ]);
});