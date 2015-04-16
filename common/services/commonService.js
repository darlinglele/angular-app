define(['angular'], function (angular) {
    return angular.module("commonService", [])
        //地区service
        .factory('areaService', ['$http', '$q', function ($http, $q) {
            return {
                query: function () {
                    var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
                    $http({
                        method: 'GET',
                        url: ctx + "api/area.json"
                    }).
                        success(function (data, status, headers, config) {
                            deferred.resolve(data); // 声明执行成功，即http请求数据成功，可以返回数据了
                        }).
                        error(function (data, status, headers, config) {
                            deferred.reject(data); // 声明执行失败，即服务器返回错误
                        });
                    return deferred.promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
                }
            };
        }])
        //员工查询 service
        .factory('empService', ['$http', '$q', function ($http, $q) {
            return {
                query: function (name) {
                    var deferred = $q.defer();
                    $http({
                        method: 'GET',
                        url: ctx + '/customer/employee/search',
                        params: {name_contains: name}
                    }).
                        success(function (data, status, headers, config) {
                            deferred.resolve(data.result);
                        }).
                        error(function (data, status, headers, config) {
                            deferred.reject(data);
                        });
                    return deferred.promise;
                }
            };
        }])
        //员工所在部门 service
        .factory('empdepService', ['$http', '$q', function ($http, $q) {
            return {
                query: function (employeeId) {
                    var deferred = $q.defer();
                    $http({
                        method: 'GET',
                        url: ctx + '/api/v1/department/getemployeedepartments',
                        params: {employeeId: employeeId}
                    }).
                        success(function (data, status, headers, config) {
                            deferred.resolve(data.result);
                        }).
                        error(function (data, status, headers, config) {
                            deferred.reject(data);
                        });
                    return deferred.promise;
                }
            };
        }])
        //行业service
        .factory('induService', ['$http', '$q', function ($http, $q) {
            return {
                query: function (name) {
                    var deferred = $q.defer();
                    $http({
                        method: 'GET',
                        url: ctx + '/api/v1/industry/common',
                        params: {name_startsWith: name}
                    }).
                        success(function (data, status, headers, config) {
                            deferred.resolve(data.result);
                        }).
                        error(function (data, status, headers, config) {
                            deferred.reject(data);
                        });
                    return deferred.promise;
                }
            };
        }])
//码表service
        .factory('calssficationService', ['$http', '$q', function ($http, $q) {
            return {
                query: function (DTYPES) {
                    var deferred = $q.defer();
                    $http({
                        method: 'GET',
                        url: ctx + 'api/classification.json',
                        params: {dtype: DTYPES}
                    }).
                        success(function (data, status, headers, config) {
                            deferred.resolve(data.result);
                        }).
                        error(function (data, status, headers, config) {
                            deferred.reject(data);
                        });
                    return deferred.promise;
                }
            };
        }])
});




