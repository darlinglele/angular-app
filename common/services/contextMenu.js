define(['angular', './finder', './../security/security'], function(angular) {
    return angular.module('services.contextMenu', ['ngRoute', 'services.finder', 'security']).factory('contextMenu', [
        "$http", "$route", "$location", "$routeParams", "security", "finder",function($http, $route, $location, $routeParams, security,finder) {

            function create(report) {
                return $http.post(AppConfig.api.reports, report);
            }

            var service = {
                home: {
                    'items': function(node) {
                        var tmp = $.jstree.defaults.contextmenu.items();
                        delete tmp.create.action;
                        tmp.remove.label = "设为默认";
                        tmp.remove.action = function(data) {
                            var inst = $.jstree.reference(data.reference);
                            var obj = inst.get_node(data.reference);
                            $http.put(AppConfig.api.userreport + security.currentUser().id, obj.id).then(function(result) {
                                if (result.data == 1) {
                                    alert("设置成功！");
                                    inst.rename_node(obj, obj.text + " (默认)");
                                    $route.reload();
                                }
                            });
                        };
                        if (node.type != 'file') {
                            delete tmp.remove;
                        }
                        delete tmp.ccp;
                        delete tmp.rename;
                        delete tmp.create;
                        return tmp;
                    }
                },
                admin_report: {
                    'items': function(node) {
                        var tmp = $.jstree.defaults.contextmenu.items();
                        delete tmp.create.action;
                        tmp.create.label = "创建";
                        tmp.remove.label = "删除";

                        tmp.remove.action = function(data) {
                            var inst = $.jstree.reference(data.reference),
                                obj = inst.get_node(data.reference);

                            var answer = window.confirm("你确定要删除这个报表吗？");

                            if (answer == false) {
                                return;
                            }
                            var report = { id: obj.id };
                            $http.delete(AppConfig.api.reports + report.id).then(function(result) {
                                if (result.data == '1') {
                                    alert($Language.successDeleteText);
                                    inst.delete_node(obj);
                                } else {
                                    alert($Language.failDeleteText);
                                }
                            }, function() {
                                alert($Language.failDeleteText + "请检查网络");
                            });

                        };
                        tmp.create.submenu = {
                            "create_folder": {
                                "separator_after": true,
                                "label": "文件夹",
                                "action": function(data) {
                                    var inst = $.jstree.reference(data.reference),
                                        obj = inst.get_node(data.reference);

                                    var report = { ParentId: obj.id, Name: "新建文件夹", Config: "", IsFolder: true };
                                    create(report).then(function (result) {
                                        var reportId = result.data;
                                        if (reportId > 0) {

                                            var id = inst.create_node(obj, { type: "default", id: reportId, text: report.Name }, "last", function(new_node) {
                                                console.log("creating folder...");
                                            });
                                            report.Id = reportId;
                                            alert($Language.successCreateText);
                                        } else {
                                            alert($Language.failCreateText);
                                        }
                                    });

                                }
                            },
                            "create_file": {
                                "label": "文件",
                                "action": function(data) {
                                    var inst = $.jstree.reference(data.reference),
                                        obj = inst.get_node(data.reference);
                                    var report = { ParentId: obj.id, Name: "新建报表", Config: "", IsFolder: false };
                                    create(report).then(function (result) {
                                        var reportId = result.data;
                                        if (reportId > 0) {
                                            var id = inst.create_node(obj, { type: "file", id: reportId, text: report.Name }, "last", function(new_node) {
                                                console.log("creating node...");
                                            });
                                            report.Id = reportId;
                                            alert($Language.successCreateText);
                                        } else {
                                            alert($Language.failCreateText);
                                        }
                                    });
                                }
                            }
                        };
                        if (this.get_type(node) === "file") {
                            delete tmp.create;
                        }
                        delete tmp.ccp;
                        delete tmp.rename;
                        return tmp;
                    }
                },
                admin_user: {
                    'items': function(node) {
                        var tmp = $.jstree.defaults.contextmenu.items();
                        delete tmp.create.action;
                        tmp.create.label = "创建";
                        tmp.remove.label = "删除";
                        tmp.remove.action = function(data) {
                            var inst = $.jstree.reference(data.reference),
                                obj = inst.get_node(data.reference);
                            var answer = window.confirm("你确定要删除该用户吗？");
                            if (answer) {
                                $http.delete(AppConfig.api.users + obj.id).then(function(result) {
                                    if (result.data == 1) {
                                        alert("删除成功！");
                                        inst.remove(obj);
                                    }
                                });
                            }
                        };
                        tmp.create.submenu = {
                            "create_folder": {
                                "separator_after": true,
                                "label": "用户组（暂不可用）",
                                "action": function(data) {
                                    var inst = $.jstree.reference(data.reference),
                                        obj = inst.get_node(data.reference);
                                }
                            },
                            "create_file": {
                                "label": "用户",
                                "action": function(data) {
                                    var inst = $.jstree.reference(data.reference),
                                        obj = inst.get_node(data.reference);
                                    finder.show({ templateUrl: 'app/admin/users/user-detail-finder.tpl.html', controller: 'UserDetailFinderCtrl' }).then(function (user) {
                                        $http.post(AppConfig.api.users, user).then(function(result) {
                                            result = result.data;
                                            if (result == 1) {
                                                alert("创建成功！");
                                            } else if (result == 0) {
                                                alert('重复添加！');
                                            } else {
                                                alert("创建失败！");
                                            }
                                        });
                                    }, function() {
                                        //cancel
                                    });
                                }
                            }
                        };
                        if (this.get_type(node) === "file") {
                            delete tmp.create;
                        }
                        delete tmp.ccp;
                        delete tmp.rename;
                        if (node.id == 0) {
                            delete tmp.remove;
                        }
                        return tmp;
                    }
                },
                admin_userReports: {
                    'items': function(node) {
                        var tmp = $.jstree.defaults.contextmenu.items();
                        delete tmp.create.action;
                        tmp.remove.label = "设为默认";
                        tmp.remove.action = function(data) {
                            var inst = $.jstree.reference(data.reference),
                                obj = inst.get_node(data.reference);
                            $http.put(AppConfig.api.userreport + $routeParams.id, obj.id).then(function(result) {
                                if (result.data == 1) {
                                    alert("设置成功！");
                                    inst.rename_node(obj, obj.text + " (默认)");
                                    $route.reload();
                                }
                            });
                        };
                        if (node.type != 'file') {
                            delete tmp.remove;
                        }
                        delete tmp.ccp;
                        delete tmp.rename;
                        delete tmp.create;
                        return tmp;
                    }
                }
            };
            return service;
        }
    ]);
});