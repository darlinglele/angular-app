

window.name = "NG_DEFER_BOOTSTRAP!";
require.config({
    paths: {
        angular: '/bower_components/angular/angular.min',
        angularRoute: '/bower_components/angular-route/angular-route.min',
        uiRouter: '/bower_components/angular-ui-router/release/angular-ui-router.min',
        uiBootstrap: '/bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        localStorage: '/bower_components/angular-local-storage/dist/angular-local-storage.min',
        angularResource: '/bower_components/angular-resource/angular-resource.min',
        jsTree: '/bower_components/jstree/dist/jstree.min.js',
        dataTables: '/bower_components/DataTables/media/js/jquery.dataTables.js'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        angularRoute: ['angular'],
        angularResource: ['angular'],
        uiBootstrap: ['angular'],
        uiRouter:['angular'],
        localStorage: ['angular']
    },
    priority: [
        "angular"
    ]
});


require(['angular', 'app/app'], function(angular, app) {

    $(document).ready(function() {
        $('body').show();
        angular.bootstrap(document, [app.name]);
    });

});


// bad smell, should move to correct place

function setAsDefault(userId, reportId) {
    return $http.put(AppConfig.api.userreport + userId, reportId);
}

function getReportPath(id, reports, path) {
    var report = $.grep(reports, function(item) {
        return item.Id == id;
    });
    if (report.length > 0) {
        report = report[0];
        path.push(report);
        if (report.ParentId != '#') {
            path = getReportPath(report.ParentId, reports, path);
        }
    }
    return path;
}

function getDefaultReport(result) {
    var href = location.href;

    if (href.match(/#\/report\/.+/)) {
        return href.substring(href.lastIndexOf('/') + 1);
    }
    if (result.ReportList.length == 0) {
        return 0;
    }
    //没有默认报表时，设列表中第一个报表为默认。
    if (result.DefaultReport == null) {
        var files = $.grep(result.ReportList, function(item) {
            return item.IsFolder == false;
        });
        if (files.length > 0) {
            result.DefaultReport = files[0];
        }
    }
    //默认报表是一个目录，设默认目录下的第一个文件为默认报表。
    if (result.DefaultReport.IsFolder) {
        var findReport = function(report) {
            if (!report.IsFolder) {
                return report;
            } else {
                var children = $.grep(result.ReportList, function(item) {
                    return item.ParentId == report.Id;
                });
                for (var i = 0; i < children.length; i++) {
                    var result1 = findReport(children[i]);
                    if (result1 != null) {
                        return result1;
                    }
                }
            }
        };
        result.DefaultReport = findReport(result.DefaultReport);

    }
    return result.DefaultReport.Id;
}

var getJstreeData = function (data) {
    if (data.ReportList.length == 0) {
        data.ReportList.push({
            Id: '0',
            ParentId: '#',
            Name: '所有报表',
            IsFolder: 'True'
        });
    } else {
        data.ReportList[0].ParentId = '#';
    }

    if (data.DefaultReport) {
        var defaultReport = $.grep(data.ReportList, function (item) { return item.Id == data.DefaultReport.Id; })[0];
        defaultReport.Name += " (默认)";

    }

    return data.ReportList;

};
var getJstreeDefaultItem = function (data) {
    return data.DefaultReport == null ? 0 : data.DefaultReport.Id;
};


var jstreeObject = {};
var breadcrumbObject = {};
var routeChanged = true;