define(['angular'], function(angular) {
    return angular.module('services.service', []).factory('userFactory', [
        '$http', function($http) {
            var user = {
                get: function(id) {
                    return $http.get(AppConfig.api.users + id).then(
                        function(result) {
                            return result.data;
                        });
                },
                getAll: function() {
                    return $http.get(AppConfig.api.users).then(
                        function(result) {
                            return result.data;
                        });
                },
                update: function(id, user) {
                    return $http.put(AppConfig.api.users + id, user);
                },

                setUserDefaultReport: function (userId, reportId) {
                    return $.ajax({
                        url: AppConfig.api.userreport + userId,
                        type: 'put',
                        data: "=" + reportId
                    });
                },
                getReports: function(id) {
                    return $http.get(AppConfig.api.userreport + id).then(
                        function(result) {
                            return result.data;
                        });
                }
            };
            return user;
        }
    ]).factory('reportFactory', [
        '$http', function($http) {
            var user = {
                get: function(id) {
                    return $http.get(AppConfig.api.reports + id).then(
                        function(result) {
                            return result.data;
                        });
                },
                getAll: function() {
                    return $http.get(AppConfig.api.reports).then(
                        function(result) {
                            var reports = JSON.parse(result.data);
 		            var root =$.grep(reports,function(item){return item.ParentId==''})[0];
                            root.ParentId = '#';
                            return reports;
                        });
                },
                update: function (id,report) {
                    if (report) {
                        return $http.put(AppConfig.api.reports +id, report);
                    } else {
                        return $q.when(-1);
                    }
                },
                setUserDefaultReport: function(userId, reportId) {
                    return $.ajax({
                        url: AppConfig.api.userreport + userId,
                        type: 'put',
                        data: "=" + reportId
                    });
                },
                getReports: function(id) {
                    return $http.get(AppConfig.api.userreport + id).then(
                        function(result) {
                            return result.data;
                        });
                }
            };
            return user;
        }
    ]).factory('reportUsersFactory', [
        '$http', function($http) {
            var user = {
                get: function(reportId) {
                    return $http.get(AppConfig.api.reportuser + reportId).then(function(result) { return result.data; });
                },
                disable: function(reportUserId) {
                    return $http.delete(AppConfig.api.reportuser + reportUserId);
                }
            };
            return user;
        }
    ]).factory('userReportsFactory', [
        '$http', function($http) {
            var user = {
                get: function(userId) {
                    return $http.get(AppConfig.api.userreport + userId).then(function(result) { return result.data; });
                }
            };
            return user;
        }
    ]).factory('AvailableReportUser', [
        '$http', function($http) {
            var reportUser = {
                get: function(id) {
                    return $http.get(AppConfig.api.availablereportuser + id);
                },
                put: function(reportId, userIds) {
                    return $http.put(
                        AppConfig.api.availablereportuser + reportId,
                        JSON.stringify(userIds),
                        {
                            headers: {
                                contentType: "application/json"
                            }
                        });
                }
            };
            return reportUser;
        }
    ]);
});