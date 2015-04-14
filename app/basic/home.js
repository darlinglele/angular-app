define(['angular'], function(angular) {
    return angular.module('app.home', ['ui.router', 'services', 'security', 'app.master']).config([
        '$stateProvider', 'securityAuthorizationProvider', function($stateProvider, securityAuthorizationProvider) {
            $stateProvider.state('home', {
                url: '/',
                views: {
                    'toolbar': {
                        templateUrl: '/app/toolbar.tpl.html',
                        controller: 'ToolbarCtrl',
                        resolve: {
                            breadcrumbObject: function($q) {
                                return $q.when({ 'items': [], 'name': '首页' });
                            }
                        }
                    },
                    'west': {
                        templateUrl: '/app/west.tpl.html',
                        controller: 'HomeCtrl',
                        resolve: {
                            adminUser: securityAuthorizationProvider.requireAdminUser,
                            userReports: function(userFactory, security) {
                                return userFactory.getReports(security.currentUser().id);
                            }
                        }
                    },
                    'center': {
                        template: 'nothing'
                    },
                }
            });

            $stateProvider.state('home.detail', {
                url: 'reports/:id',
                views: {
                    'center@': {
                        templateUrl: 'app/basic/report-view.tpl.html',
                        controller: 'HomeDetailCtrl'
                    }
                }
            });

        }
    ]).controller('HomeCtrl', [
            '$scope', 'userReports', 'itemAction', 'contextMenu', function($scope, userReports, itemAction, contextMenu) {
                $scope.name = "我的报表";
                $scope.jstreeObject = {
                    data: getJstreeData(userReports),
                    contextMenu: contextMenu.admin_userReports,
                    defaultItem: getJstreeDefaultItem(userReports),
                    browser: ReportBrowser,
                    actions: itemAction.home,
                    isReady: true
                };
            }
        ]
    ).controller('HomeDetailCtrl', [
        '$scope', '$stateParams', 'security', function($scope, $stateParams, security) {
            $scope.currentReportUrl = "reportviewer.aspx?reportId=" + $stateParams.id + '&access_token=' + security.currentUser().token;
        }
    ]);
});