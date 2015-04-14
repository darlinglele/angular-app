define(['angular','./security'], function(angular) {
    return angular.module('security.authorization', ['security.service']).provider('securityAuthorization', {
        requireAdminUser: [
            'securityAuthorization', function(securityAuthorization) {
                return securityAuthorization.requireAdminUser();
            }
        ],

        requireAuthenticatedUser: [
            'securityAuthorization', function(securityAuthorization) {
                return securityAuthorization.requireAuthenticatedUser();
            }
        ],

        $get: [
            'security', 'securityRetryQueue', '$q', function(security, queue, $q) {
                var service = {

                    // Require that there is an authenticated user
                    // (use this in a route resolve to prevent non-authenticated users from entering that route)
                    requireAuthenticatedUser: function () {
                        if (security.isAuthenticated()) {
                            return $q.when(security.currentUser());
                        } else {
                            return queue.pushRetryFn('unauthorized-client', service.requireAuthenticatedUser);
                        }
                    },

                    // Require that there is an administrator logged in
                    // (use this in a route resolve to prevent non-administrators from entering that route)
                    requireAdminUser: function() {
                        if (security.isAdmin()) {
                            return $q.when(security.currentUser());
                        } else {
                            return queue.pushRetryFn('unauthorized-admin', service.requireAdminUser);
                        }
                    }

                };

                return service;
            }
        ]
    });
});