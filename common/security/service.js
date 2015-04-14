define(['angular', 'localStorage', 'uiBootstrap','./login/login'], function(angular) {
    return angular.module('security.service', ['ui.bootstrap', 'LocalStorageModule','security.login']).factory('security', [
        '$http', '$compile', '$modal', 'localStorageService', '$location', '$route', '$q', 'securityRetryQueue', function($http, $compile, $modal, localStorageService, $location, $route, $q, queue) {
            
            var loginModal = null;

            function openLoginDialog() {
                if (loginModal) {
                    console.log('Trying to open a dialog that is already open!');
                    return;
                }

                loginModal = $modal.open({templateUrl: 'common/security/login/login.tpl.html', controller: 'LoginFormController' });
                loginModal.result.then(function(success) {
                    loginModal = null;
                    console.log(success);
                    setTimeout(function() {
                        queue.retryAll();
                    }, 1000);
                }, function(resonse) {
                    //if cancle the login
                    console.log(resonse);
                    loginModal = null;
//                    queue.retryAll();
                });
            };

            // Register a handler for when an item is added to the retry queue
            queue.onItemAddedCallbacks.push(function(retryItem) {
                if (queue.hasMore()) {
                    service.showLogin();                  
                }
            });

            var service = {
                // Get the first reason for needing a login
                getLoginReason: function() {
                    return queue.retryReason();
                },

                // Show the modal login dialog
                showLogin: function() {
                    openLoginDialog();
                },
                currentUser: function() {
                    var authorData = localStorageService.get('authorizationData');
                    if (authorData) {
                        return { id: authorData.userId, account: authorData.userName, displayName: authorData.displayName, admin: authorData.admin,token:authorData.token };
                    } else {
                        return null;
                    }
                },
                // Is the current user authenticated?
                isAuthenticated: function() {
                    return !!localStorageService.get('authorizationData');
                },

                // Is the current user an adminstrator?
                isAdmin: function() {
                    return !!(service.currentUser() && service.currentUser().admin == 'True');
                },
     

                login: function(account, password) {
                    var request = $http.post(AppConfig.api.token, $.param({
                        username: account,
                        password: password,
                        grant_type: 'password'
                    }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
                    return request.then(function(response) {
                        if (response) {
                            response = response.data;
                            localStorageService.set('authorizationData', { token: response.access_token, userId: response.userId, userName: response.userName, refreshToken: "", useRefreshTokens: false, admin: response.admin, displayName: response.displayName });
                            loginModal.close(service.isAuthenticated());
                            return true;
                        } else {                        
                            return false;
                        }

                    }, function(response) {
                         loginModal.close(false);
                    });
                },

                // Logout the current user and redirect
                logout: function(redirectTo) {
                    localStorageService.set('authorizationData', null);
                },

                cancelLogin: function() {
                    if (loginModal) {
                        loginModal.dismiss("user cancel");
                    }
                }
            };
            return service;
        }
    ]);
});