define(['angular', 'angularRoute', 'uiBootstrap'], function(angular) {
    return angular.module('services.finder', ['ngRoute', 'ui.bootstrap']).factory('finder', [
        "$location", "$modal", function($location, $modal) {
            var modal = null;
            var service = {
                show: function(args) {
                    // UserFinderCtrl 应该包含用户展示、查找选择功能
                    modal = $modal.open(args);
                    // 关闭modal时处理modal的返回值, promise太棒了！
                    return this;
                },
                then: function(ok, cancel) {
                    modal.result.then(function(items) {
                        modal = null;
                        if (items) {
                            ok(items);
                        }
                    }, function(reason) {
                        cancel(reason);
                    });
                },
                ok: function(items) {
                    if (modal) {
                        modal.close(items);
                    }
                },
                cancel: function() {
                    if (modal) {
                        modal.dismiss();
                    }
                }
            };
            return service;
        }
    ]);
});