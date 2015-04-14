define(['angular', './users/admin-users', './reports/admin-reports'], function(angular) {
    return angular.module('app.admin', ['app.admin.users', 'app.admin.reports']);
})