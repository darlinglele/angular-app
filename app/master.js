define(['angular', 'angularRoute'], function(angular) {
    return angular.module('app.master', ['ngRoute', 'services', 'security', 'directives']).controller("IndexPageCtrl", [
        "$scope", "userReportsFactory", "$location", "$route", "security", function($scope, userReportsFactory, $location, $route, security) {
            $scope.account = null;
            $scope.reports = null;
            $scope.pageName = null;
            $scope.jstreeObject = null;
            $scope.breadcrumbObject = null;
        }
    ]).controller('HeaderCtrl', [
        '$scope', '$location', '$route', 'security',
        function($scope, $location, $route, security) {
            $scope.location = $location;
            $scope.isAuthenticated = security.isAuthenticated;
            $scope.isAdmin = security.isAdmin;
            $scope.currentUser = security.currentUser;
            $scope.logout = function() {
                security.logout();
                location.reload();
            };
            $scope.login = function() {
                security.showLogin();
            };
        }
    ]).controller('ToolbarCtrl', [
        '$scope', '$state', 'breadcrumbObject',
        function($scope, $state, breadcrumbObject) {
            $scope.breadcrumbObject = breadcrumbObject;
            $scope.refresh = function() {
            };
            $scope.toggleLeftSidebar = function() {
                $('#workspace').layout().toggle("west");
                $('#toggleLeftSidebar').parent().toggleClass('active');
            };
            $scope.toggleHeader = function(obj) {
                $('#nav').toggle();
                $('#toggleHeader').parent().toggleClass('active');
            };
        }
    ]).controller('LoginFormController', [
        '$scope', 'security', function($scope, security) {
            $scope.user = {};
            $scope.authError = null;
            $scope.welcome = AppConfig.welcome;
            $scope.authReason = null;
            if (security.getLoginReason()) {
                $scope.authReason = (security.isAuthenticated()) ?
                    AppConfig.unauthored : AppConfig.unauthed;
            }

            $scope.login = function() {
                $scope.authError = null;

                security.login($scope.user.email, $scope.user.password).then(function(loggedIn) {
                    if (!loggedIn) {
                        $scope.authError = AppConfig.authError;
                    }
                }, function(x) {
                    $scope.authError = AppConfig.serverError;
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