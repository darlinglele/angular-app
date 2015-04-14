define(['angular', 'uiBootstrap', 'angularRoute', 'uiRouter'], function(angular) {
    return angular.module('app.admin.reports', ['ngRoute', 'ui.router', 'services', 'security', 'ui.bootstrap']).config([
        '$locationProvider', '$stateProvider', '$routeProvider', 'securityAuthorizationProvider', function($locationProvider, $stateProvider, $routeProvider, securityAuthorizationProvider) {
            $stateProvider.state('reports', {
                url: '/admin/reports',
                views: {
                    'toolbar': {
                        templateUrl: '/app/toolbar.tpl.html',
                        controller: 'ToolbarCtrl',
                        resolve: {
                            breadcrumbObject: function($q) {
                                return $q.when({ 'items': [], 'name': '报表管理' });
                            }
                        }
                    },
                    'west': {
                        templateUrl: 'app/west.tpl.html',
                        controller: 'ReportsCtrl',
                        resolve: {
                            adminUser: securityAuthorizationProvider.requireAdminUser,
                            reports: ['reportFactory', function (reportFactory) {
                                return reportFactory.getAll();
                            }]
                        }
                    },
                    'center': {
                        template: 'nothing'
                    },
                }
            });

            $stateProvider.state('reports.detail', {
                url: '/:id',
                views: {
                    'center@': {
                        adminUser: securityAuthorizationProvider.requireAdminUser,
                        templateUrl: 'app/admin/reports/report-edit.tpl.html',
                        controller: 'ReportDetailCtrl',
                        resolve: {
                            adminUser: securityAuthorizationProvider.requireAdminUser,
                            report: ['Reports','$stateParams',function(reports, $stateParams) {
                                return reports.get($stateParams.id);
                            }],
                            reportUsers: function(reportUsersFactory, $stateParams) {
                                return reportUsersFactory.get($stateParams.id);
                            }
                        }
                    }
                }
            });
        }
    ]).controller("ReportsCtrl", [
        "$scope", "$rootScope", "$stateParams", "reports", "contextMenu", "itemAction",
        function($scope, $rootScope, $stateParams, reports, contextMenu, itemAction) {
            $scope.name = "报表管理";
            $scope.jstreeObject = {
                data: reports,
                contextMenu: contextMenu.admin_report,
                defaultItem: 1,
                browser: ReportBrowser,
                actions: itemAction.admin_report,
                isReady: true
            };
        }
    ]).controller("ReportDetailCtrl", [
        "$scope", "$rootScope", "$state", "$stateParams", "report", "reportUsers", "reportFactory", "reportUsersFactory", "AvailableReportUser", "finder", "contextMenu", "itemAction",
        function($scope, $rootScope, $state, $stateParams, report, reportUsers, reportFactory, reportUsersFactory, availableReportUser, finder, contextMenu, itemAction) {

            $scope.report = report;
            $scope.reportUsers = reportUsers;

            $scope.disable = function(reportUserId) {
                reportUsersFactory.disable(reportUserId).success(function(data) {
                    if (data == 1) {
                        $state.go($state.current, {}, { reload: true });
                    }
                });
            };

            $scope.updateReport = function() {
                console.log($scope.report);
                reportFactory.update($stateParams.id, $scope.report).then(function(response) {
                    alert(response.data == 1 ? "更新成功" : "更新失败");
                });
            };

            $scope.addUser = function() {
                finder.show({ templateUrl: 'app/admin/reports/user-list-finder.tpl.html', controller: 'UserFinderCtrl' }).then(function(userIds) {
                    availableReportUser.put($stateParams.id, userIds).then(function(result) {
                        $state.go($state.current, {}, { reload: true });
                    });
                }, function(reason) {
                    console.log(reason);
                });
            };
        }
    ]).controller('UserFinderCtrl', [
        '$scope', '$route', '$stateParams', 'AvailableReportUser', 'finder', function($scope, $route, $stateParams, AvailableReportUser, finder) {
            $scope.users = [];
            $scope.id = $stateParams.id;
            AvailableReportUser.get($scope.id).success(function(data) {
                for (var i = 0; i < data.length; i++) {
                    data[i]['checked'] = false;
                };
                $scope.users = data;
            });

            $scope.ok = function() {
                    var userIds = [];
                    for (var i = 0; i < $scope.users.length; i++) {
                        if ($scope.users[i].checked) {
                            userIds.push($scope.users[i].Id);
                        }
                    }
                    finder.ok(userIds);
                },
                $scope.cancel = function() {
                    finder.cancel();
                };
        }
    ]);
})