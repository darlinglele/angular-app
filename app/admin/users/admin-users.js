define(['angular', 'uiRouter'], function(angular) {
    return angular.module('app.admin.users', ['ngRoute', 'ui.router', 'services', 'security', 'resources']).config([
        '$locationProvider', '$stateProvider', '$routeProvider', 'securityAuthorizationProvider', function($locationProvider, $stateProvider, $routeProvider, securityAuthorizationProvider) {

            $stateProvider.state('users', {
                url: '/admin/users',
                views: {
                    'toolbar': {
                        templateUrl: '/app/toolbar.tpl.html',
                        controller: 'ToolbarCtrl',
                        resolve: {
                            breadcrumbObject: function($q) {
                                return $q.when({ 'items': [], 'name': '用户管理' });
                            }
                        }
                    },
                    'west': {
                        templateUrl: '/app/west.tpl.html',
                        controller: 'users',
                        resolve: {
                            adminUser: securityAuthorizationProvider.requireAdminUser,
                            users: function(Users, $stateParams) {
                                return Users.query();
                            }
                        }
                    },
                    'center': {
                        template: 'nothing'
                    },
                }
            });
            $stateProvider.state('users.detail', {
                url: '/:id',
                views: {
                    'center@': {
                        templateUrl: 'app/admin/users/user-edit.tpl.html',
                        controller: 'detail',
                        resolve: {
                            adminUser: securityAuthorizationProvider.requireAdminUser,
                            user: [
                                'Users', '$stateParams', function(users, $stateParams) {
                                    console.log($stateParams);
                                    return users.get($stateParams.id);
                                }
                            ],
                            userReports: function(userFactory, $stateParams) {
                                return userFactory.getReports($stateParams.id);
                            }
                        }
                    }
                }
            });
        }
    ]).controller('detail', [
        '$scope', '$stateParams', 'user', 'userReports', 'contextMenu', 'itemAction', 'userFactory', function($scope, $stateParams, user, userReports, contextMenu, itemAction, userFactory) {
            console.log($stateParams.id);

            $scope.user = user;
            console.log(userReports);
            $scope.jstreeObject = {
                data: getJstreeData(userReports),
                contextMenu: contextMenu.admin_userReports,
                defaultItem: getJstreeDefaultItem(userReports),
                browser: ReportBrowser,
                actions: itemAction.admin_userReports,
                isReady: true
            };

            $scope.updateUser = function(user) {
                userFactory.update(user.Id, user).then(function(result) {
                    if (result.data == 1) {
                        alert("更新成功！");
                    } else {
                        alert("更新失败！");
                    }
                });
            };
        }
    ]).controller('users', [
        '$scope', '$stateParams', 'users', 'contextMenu', 'itemAction', function($scope, $stateParams, users, contextMenu, itemAction) {
            $scope.name = '用户管理';
            var data = $.map(users, function(item) {
                return { "Id": item.USERID, "Account": item.LOGINNAME, "Email": item.EMAILADDRESS, "DisplayName": item.DISPLAYNAME, "Name": item.DISPLAYNAME, "ParentId": 0, "IsFolder": false, "RoleId": item.ROLEID };
            });
            var root = { "Id": 0, "Name": "所有用户", "ParentId": '#', "IsFolder": true };
            data.push(root);

            console.log(data);

            $scope.jstreeObject = {
                data: data,
                contextMenu: contextMenu.admin_user,
                defaultItem: 1,
                browser: UserBrowser,
                actions: itemAction.admin_user,
                isReady: true
            };
        }
    ]).controller('UserDetailFinderCtrl', [
        '$scope', '$route', '$routeParams', 'finder', function($scope, $route, $routeParams, finder) {
            $scope.name = "";
            $scope.found = false;
            $scope.find = function() {
                $.ajax(AppConfig.api.auth + $scope.name).done(function(user) {
                    if (user != null) {
                        $scope.found = true;
                        user.RoleId = 4;
                        $scope.user = user;
                    } else {
                        $scope.found = false;
                    }
                });
            };

            $scope.ok = function() {
                    if ($scope.user) {
                        finder.ok($scope.user);
                    }
                },
                $scope.cancel = function() {
                    finder.cancel("give up");
                };
        }
    ]);;
});