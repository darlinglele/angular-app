define(['angular'], function(angular) { 
    return angular.module("directives", []).directive('layoutmanager', [
        function() {
            return {
                link: function(scope, element, attrs) {
                    var layoutManager = $(element).layout({
                        spacing_open: 1,
                        spacing_closed: 0,
                        minSize: 333,
                        cursor: 'col-resize',
                        west: {
                            initClosed: false
                        },
                        east: {
                            initClosed: true
                        }

                    });
                }
            };
        }
    ]).directive('jstree', function() {
        return {
            link: function(scope, element, attrs) {
                scope.$watch("jstreeObject", function() {
                    if (scope.jstreeObject && scope.jstreeObject.isReady) {
                        new scope.jstreeObject.browser({ 'container': $(element), "actions": getDefaultIfNull(scope.jstreeObject.actions, {}), "contextMenu": scope.jstreeObject.contextMenu, 'selectedId': scope.jstreeObject.defaultItem, 'data': scope.jstreeObject.data });
                    }
                });
            }
        };
    }).directive('awesometable', [
        '$timeout', function($timeout) {
            return {
                link: function(scope, element) {
                    $(element).hide();
                    // 需要一点时间来等待数据行render到DOM
                    $timeout(function() {
                        var table = $(element).DataTable({});
                        $(element).show();
                    }, 300);
                }
            };
        }
    ]).directive('remove', function() {
        return function(scope, element, attrs) {
            element.click(function() {
                console.log(attrs.remove);
                element.parent().parent().remove();
            });
        };
    }).directive('breadcrumb', function() {
        return {
            template: '<li ng-repeat="item in breadcrumb.items" class=""><a>{{item.Name}}</a></li>',
            link: function(scope, element, attrs) {
                scope.$watch("breadcrumb.isReady", function() {
                    console.log(scope.breadcrumb.isReady);
                    if (scope.breadcrumb.isReady) {
                    }
                });
            }
        };
    }).directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    }).directive('routeLoadingIndicator', function($rootScope) {
        return {
            restrict: 'AEC',
            template: "<a ng-if='isRouteLoading'>正在加载... <i class='fa fa-cog fa-spin'></i></a>",
            link: function(scope, elem, attrs) {
                scope.isRouteLoading = false;

                $rootScope.$on('$routeChangeStart', function() {
                    scope.isRouteLoading = true;
                });

                $rootScope.$on('$routeChangeSuccess', function() {
                    scope.isRouteLoading = false;
                });
            }
        };
    }).directive('activeLink', ['$location', function (location) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, controller) {
                var clazz = attrs.activeLink;
                var path = attrs.href;
                path = path.substring(0); 
                scope.location = location;
                scope.$watch('location.path()', function (newPath) {
                    if (newPath.indexOf(path)==0) {
                        element.addClass(clazz);
                    } else {
                        element.removeClass(clazz);
                    }
                });
            }
        };
    }]);       
});