define(['angular', './../service'], function (angular) {
    angular.module('security.login',['security']).controller('LoginFormController', [
        '$scope', 'security', function($scope, security) {
            // The model for this form 
            $scope.user = {};

            // Any error message from failing to login
            $scope.authError = null;

            // The reason that we are being asked to login - for instance because we tried to access something to which we are not authorized
            // We could do something diffent for each reason here but to keep it simple...
            $scope.authReason = null;
            if (security.getLoginReason()) {
                $scope.authReason = (security.isAuthenticated()) ?
                    '未授权的访问！' : '需要身份认证！';
            }

            // Attempt to authenticate the user specified in the form's model
            $scope.login = function() {
                // Clear any previous security errors
                $scope.authError = null;

                // Try to login
                security.login($scope.user.email, $scope.user.password).then(function(loggedIn) {
                    if (!loggedIn) {
                        // If we get here then the login failed due to bad credentials
                        $scope.authError = '账号或密码有误！';
                    }
                }, function(x) {
                    // If we get here then there was a problem with the login request to the server
                    $scope.authError = '服务器发生错误';
                });
            };

            $scope.clearForm = function() {
                $scope.user = {};
            };

            $scope.cancelLogin = function() {
                security.cancelLogin();
            };
        }
    ]);
});
  