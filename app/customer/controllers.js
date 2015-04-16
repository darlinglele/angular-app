/**
 * Created by zhixiong on 4/15/15.
 */
define(['angular'], function (angular) {
    return angular.module('app.customer.controllers', ['config', 'commonService', 'customerService', 'ngSanitize', 'ui.select', 'datatables', 'ngResource', 'ui.date', 'ngRoute', 'ui.bootstrap'])
        .controller('CustomerCreateCtrl',
        function ($scope, $filter, $http, $location, $resource, indiCuService, areaService, induService, empdepService, empService, calssficationService, DTOptionsBuilder, DTColumnDefBuilder, DTYPES, $routeParams) {
            $scope.alerts = [];
            //添加警告
            $scope.addAlert = function (obj) {
                $scope.alerts.push(obj);
            };
            //警告关闭按钮
            $scope.closeAlert = function (index) {
                $scope.alerts.splice(index, 1);
            };

            //页面地区信息变动时，缓存地区信息，分级保存
            $scope.areaInfoCache = {};
            //地区数据赋值处理
            $scope.areaDataFormat = function () {
                var idPath = $scope.customer && $scope.customer.identityArea && $scope.customer.identityArea.fullIdPath;
                if (!idPath) return;
                var areaArr = idPath.split("/");
                attrs = ["selectedProvince", "selectedCity", "selectedCounty"];
                $.each(areaArr, function (i, v) {
                    $scope[attrs[i]] = v;
                });

            };
            //地区选择更新modal
            $scope.dataFormat = function () {
                var areaInfoCache = $scope.areaInfoCache;
                $scope.customer.identityArea = {
                    id: areaInfoCache.selectedCounty || areaInfoCache.selectedCity || areaInfoCache.selectedProvince
                };
            };

            //读取地区JSON数据并给地区赋值，之后添加地区联动事件
            areaService.query().then(function (data) {
                $scope.areas = data;
                //设置provinceArr
                $scope.provinceArr = getAearArr(true, null);
                $scope.areaDataFormat();

                //地区联动事件
                $scope.$watch("selectedProvince", function (province) {
                    $scope.areaInfoCache.selectedProvince = province;
                    $scope.areaInfoCache.selectedCity = "";
                    $scope.areaInfoCache.selectedCounty = "";

                    $scope.dataFormat();
                    //更新各级地区列表
                    $scope.cityArr = [];
                    $scope.countyArr = [];
                    $scope.cityArr = getAearArr(false, province);
                });
                $scope.$watch("selectedCity", function (city) {
                    $scope.areaInfoCache.selectedCity = city;
                    $scope.areaInfoCache.selectedCounty = "";

                    $scope.dataFormat();
                    $scope.countyArr = [];
                    //更新各级地区列表
                    $scope.countyArr = getAearArr(false, city);

                });
                $scope.$watch("selectedCounty", function (county) {
                    $scope.areaInfoCache.selectedCounty = county;
                    $scope.dataFormat();
                });
            });

            //获取级联数据
            function getAearArr(isTop, parentId) {
                var result = [];
                if (isTop) {
                    $.each($scope.areas, function () {
                        if (this.level === 0) {
                            result.push(this);
                        }
                    });
                } else if (!isTop && parentId) {
                    $.each($scope.areas, function () {
                        if (this.parentId === parentId) {
                            result.push(this);
                        }
                    });
                }
                return result;
            }

            //出生日期
//    $scope.dateOptions = {
//            changeYear: true,
//            changeMonth: true,
//            yearRange: '1900:-0'
//        };
            $scope.dateOptions = {
                formatYear: 'yyyy',
                startingDay: 1,
            };
            $scope.open2 = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opened2 = true;
            };
            //禁选周末
            $scope.disabledTime = function (date, mode) {
                return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            };
            //行业检索
            $scope.refreshIndustry = function (name) {
                if (!name) return [];
                return induService.query(name).then(function (data) {
                    $scope.industries = data;
                });
            };

            //加载码表
            calssficationService.query(DTYPES).then(function (data) {
                $.each(data, function (key, value) {
                    $scope[key] = value;
                });
            });

            //枚举类型
            $scope.childrenInfo = enumObject.getDropdownListOpt("childrenInfo");
            $scope.fendByCount = enumObject.getDropdownListOpt("fendByCount");

            //客户所在部门
            empdepService.query($scope.employeeId).then(function (data) {
                $scope.departments = data;
            });

            //共享客户列表
            $scope.showShareInfo = function () {
                var flag = false;
                if ($scope.customer && $scope.customer.id) {
                    flag = true;
                }
                return flag;
            };
            $scope.btn_confirm_flag = true;
            $scope.btn_save_flag = false;

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDOM('').withLanguage({
                "sEmptyTable": "没有数据"
            });
            $scope.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).notVisible(),
                DTColumnDefBuilder.newColumnDef(1),
                DTColumnDefBuilder.newColumnDef(2),
                DTColumnDefBuilder.newColumnDef(3).notSortable()
            ];

            //表格按钮事件
            $scope.openWin = openWin;//打开窗口
            $scope.editRow = editRow; //编辑 -- 行内
            $scope.delRow = delRow;//删除 -- 行内
            $scope.addRow = addRow; //确定 -- 窗口
            $scope.editSave = editSave; //保存 -- 窗口

            function openWin(row) {
                $scope.newRowData = {};
                $scope.em_departments = [];
                $scope.btn_confirm_flag = true;
                $scope.btn_save_flag = false;
                $('#myModal').modal('show');
            }

            function addRow() {
                if (!$scope.newRowData.shareManager || !$scope.newRowData.shareManager.employeeName) {
                    alert("请选择要共享的项目经理");
                    return;
                }
                if (!$scope.newRowData.department || !$scope.newRowData.department.id) {
                    alert("请选择部门");
                    return;
                }
                //获得信贷经理名称
                $scope.newRowData.department.name = $('#dep_emp option[selected=selected]').text();
                $scope.newRowData.customer = {id: $scope.customer.id};
                $scope.customer.customerShareInfos.push($scope.newRowData);
                $('#myModal').modal('hide');
            }

            function editSave() {
                $scope.customer.customerShareInfos[$scope.index] = $scope.newRowData;
                $('#myModal').modal('hide');
            }

            function editRow(index) {
                $scope.index = index;
                $scope.newRowData = angular.copy($scope.customer.customerShareInfos[index]);
                $scope._employeeName = $scope.newRowData.shareManager.employeeName;
                $scope.btn_confirm_flag = false;
                $scope.btn_save_flag = true;
                $('#myModal').modal('show');
            }

            function delRow(index) {
                $scope.customer.customerShareInfos.splice(index, 1);
            }


            //员工下拉框搜索
            $scope.refreshEmployee = function (name) {
                if (!name) return [];
                return empService.query(name).then(function (data) {
                    $scope.employees = data;
                });
            };
            //员工与部门联动
            $scope.$watch("newRowData.shareManager.id", function (employee) {
                if (!employee) return;
                $scope.newRowData.shareManager.employeeName = $('#share_empName .ng-binding.ng-scope').text();
                empdepService.query(employee).then(function (data) {
                    $scope.em_departments = data;
                });
            });
            //员工部门控件disabled判断
            $scope.disEmpDep = function () {
                var flag = true;
                if ($scope.em_departments && $scope.em_departments.length > 0) {
                    flag = false;
                }
                return flag;
            };

            $scope.btn_save_disabled = false;
            $scope.btn_save_lable = function () {
                return $scope.btn_save_disabled ? "处理中..." : "保存草稿";
            };
            //页面保存 -- 保存草稿
            $scope.save = function () {
                $scope.btn_save_disabled = true;
                var customerId = $scope.customer.id != null ? $scope.customer.id : "", docId = "";
                if (customerId) {
                    url = ctx + "/customer/individual/edit";
                } else {
                    url = ctx + "/customer/individual/create?customerId=" + customerId + "&docId=" + docId;
                }
                var _customer = angular.copy($scope.customer);
                _customer.birthday = $filter('date')(_customer.birthday, 'yyyy-MM-dd 00:00:00');
                var parms = {
                    isDraft: 0,
                    json: JSON.stringify(_customer)
                };
                indiCuService.save(url, parms).then(function (data) {
                    if (data.status == "200") {
                        alert("保存成功");
                        $location.path("/customer/edit/" + data.result);
                        $scope.customer.id = data.result;
                    } else {
                        $scope.addAlert({type: 'danger', msg: '操作失败！'});
                    }
                    $scope.btn_save_disabled = true;
                });
            };
            //页面保存 -- 提交
            $scope.submit = function () {
                //TODO
                if (confirm("您确定要提交吗？")) {
                    alert(JSON.stringify($scope.customer));
                }
            };
            $scope.cancle = function () {
                //TODO
                if (confirm("确定要放弃客户信息修改吗？")) {
                    window.location.href = ctx;
                }
            };

            //获取客户信息
            var customerJson = {};
            if ($routeParams.id) {
                indiCuService.query($routeParams.id).then(function (data) {
                    customerJson = data.result;
                    delete customerJson.jId;
                    delete customerJson.uId;

                    $scope.originIndustryName = customerJson.industry && customerJson.industry.name;

                    //模型中的码表数据只留下id
                    $.each(customerJson, function (key, value) {
                        if (key != "identityArea" && $.isPlainObject(value)) {
                            $.each(value, function (_key, _value) {
                                if (_key != "id") {
                                    delete    value[_key];
                                }
                            });
                        }
                    });
                    if (customerJson.birthday) {
                        customerJson.birthday = customerJson.birthday.substr(0, 10);
                    }
                    $scope.customer = customerJson;
                });

            } else {
                $scope.customer = {};
            }

        }
    ).controller('CustomerQueryCtrl', function ($scope, $compile, $filter, $http, $resource,
                                                induService, calssficationService,
                                                DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, DTInstances, DATATABLE_LAN_CONFIG) {
            //初始化查询条件 -- fix ui-select bug
            $scope.condition = {};
            $scope.alerts = [];
            //添加警告
            $scope.addAlert = function (obj) {
                $scope.alerts.push(obj);
            };
            //警告关闭按钮
            $scope.closeAlert = function (index) {
                $scope.alerts.splice(index, 1);
            };
            //行业
            $scope.refreshIndustry = function (name) {
                if (!name) return [];
                return induService.query(name).then(function (data) {
                    $scope.industries = data;
                });
            };
            //码表
            var DTYPES = ['customerSource', 'identityType'];
            calssficationService.query(DTYPES).then(function (data) {
                $.each(data, function (key, value) {
                    $scope[key] = value;
                });
            });
            //枚举类型
            $scope.customerType = enumObject.getDropdownListOpt("customerType");
            $scope.customerStatus = enumObject.getDropdownListOpt("customerStatus");


            //客户列表
            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('ajax', {
                    url: ctx + "/api/customers.json",
                    type: 'GET',
                    data: conditions()
                })
                .withDataProp('data')
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('serverSide', true)
                .withPaginationType('full_numbers')
                .withOption('createdRow', createdRow)//以非angular方式加载数据，但想在datatable中使用 angular directive: ng-click
                .withLanguage(DATATABLE_LAN_CONFIG);

            //定义列
            $scope.dtColumns = [
                DTColumnBuilder.newColumn('id').withTitle('ID').notVisible(),
                DTColumnBuilder.newColumn('customerNo').withTitle('客户编号').withOption('width', '75px'),
                DTColumnBuilder.newColumn('name').withTitle('客户名称').withOption('width', '100px'),
                DTColumnBuilder.newColumn('customerType').withTitle('客户类型').withOption('width', '40px')
                    .renderWith(function (data, type, full) {
                        return enumObject.getEnumNam(data, 'customerType');
                    }),
                DTColumnBuilder.newColumn('identityType.nameChs').withTitle('证件类型').withOption('width', '40px').withOption('defaultContent', '——'),
                DTColumnBuilder.newColumn('identityNumber').withTitle('证件号码').withOption('width', '75px'),
                DTColumnBuilder.newColumn('industry.name').withTitle('行业类别').withOption('width', '75px').withOption('defaultContent', '——'),
                DTColumnBuilder.newColumn('customerSource.nameChs').withTitle('客户来源').withOption('width', '40px').withOption('defaultContent', '——'),
                DTColumnBuilder.newColumn('creditManager.employeeName').withTitle('信贷经理').withOption('width', '75px').withOption('defaultContent', '——'),
                DTColumnBuilder.newColumn('lastModifiedDate').withTitle('更新时间').withOption('width', '70px')
                    .renderWith(function (data, type, full) {
                        return $filter('date')(data.millis, "yyyy-MM-dd");
                    }),
                DTColumnBuilder.newColumn('createdDate').withTitle('创建时间').withOption('width', '70px')
                    .renderWith(function (data, type, full) {
                        return $filter('date')(data.millis, "yyyy-MM-dd");
                    }),
                DTColumnBuilder.newColumn('isDraft').withTitle('状态').renderWith(function (data, type, full) {
                    return enumObject.getEnumNam(data.toString(), 'customerStatus');
                }),
                DTColumnBuilder.newColumn('').withTitle('操作').withOption('width', '80px').withClass('text-center')
                    .notSortable()
                    .renderWith(function (data, type, full) {
                        return ' <button type="button" ng-click="view(\'' + full.id + '\')" class="hspace-4 btn btn-success btn-xs">阅</button>' +
                            '<button type="button" ng-click="edit(\'' + full.id + '\')" class="hspace-4 btn btn-success btn-xs">维</button>' +
                            '<button type="button" ng-click="report(\'' + full.id + '\')" class="hspace-4 btn btn-success btn-xs">报</button>';
                    }),
            ];
            DTInstances.getLast().then(function (dtInstance) {
                $scope.dtInstance = dtInstance;
            });

            function createdRow(row, data, dataIndex) {
                $compile(angular.element(row).contents())($scope);
            }

            //查看客户详情
            $scope.view = function (id) {
                //TODO
            };
            //编辑客户
            $scope.edit = function (id) {
                window.open(ctx + '/demo/customer/individual/edit?customerId=' + id);
            };
            //上报项目
            $scope.report = function (id) {
                //TODO
            };

            //查询按钮
            $scope.query = function (data) {
                $scope.dtOptions.ajax = {
                    url: ctx + "/api/customers.json",
                    type: 'GET',
                    data: conditions()
                };
            };
            //重置
            $scope.reset = function () {
                $scope.condition = {};
            };
            //获取查询条件
            function conditions() {
                var entity = $scope.condition,
                    obj = {};
                var cg = ConditionGroup.createNew(ConditionGroup.GroupTypeAnd);
                if (entity) {
                    //客户编号
                    if (entity.customerNo) {
                        cg.appendCondition(Condition.createNew('customerNo', entity.customerNo, Condition.ConditionType.String, Condition.Operator.Contains));
                    }

                    //客户名称
                    if (entity.name) {
                        cg.appendCondition(Condition.createNew('name', entity.name, Condition.ConditionType.String, Condition.Operator.Contains));
                    }

                    //证件号码
                    if (entity.identityNumber) {
                        cg.appendCondition(Condition.createNew('identityNumber', entity.identityNumber, Condition.ConditionType.String, Condition.Operator.Contains));
                    }

                    //信贷经理
                    if (entity.creditManager) {
                        cg.appendCondition(Condition.createNew('creditManager.employeeName', entity.creditManager, Condition.ConditionType.String, Condition.Operator.Contains));
                    }

                    //营业执照
                    if (entity.businessCode) {
                        cg.appendCondition(Condition.createNew('businessCode', entity.businessCode, Condition.ConditionType.String, Condition.Operator.Contains));
                    }

                    //部门ID
                    if (entity.departmentId) {
                        cg.appendCondition(Condition.createNew('department.id', entity.departmentId, Condition.ConditionType.String, Condition.Operator.Contains));
                    }

                    //行业类别
                    var industryId = entity.industry && entity.industry.id;
                    if (industryId) {
                        cg.appendCondition(Condition.createNew('industry.fullIdPath', industryId, Condition.ConditionType.String, Condition.Operator.Contains));
                    }

                    //客户类型
                    if (entity.customerType) {
                        cg.appendCondition(Condition.createNew('customerType', entity.customerType, Condition.ConditionType.ENUM, Condition.Operator.IsEqualTo));
                    }

                    //证件类型
                    if (entity.identityType) {
                        cg.appendCondition(Condition.createNew('identityType.id', entity.identityType, Condition.ConditionType.String, Condition.Operator.IsEqualTo));
                    }

                    //客户来源
                    if (entity.customerSource) {
                        cg.appendCondition(Condition.createNew('customerSource.id', entity.customerSource, Condition.ConditionType.String, Condition.Operator.IsEqualTo));
                    }

                    //状态
                    if (entity.status) {
                        var status = entity.status === "true" ? true : false;
                        cg.appendCondition(Condition.createNew('isDraft', status, Condition.ConditionType.Boolean, Condition.Operator.IsEqualTo));
                    }

                    //是否是关联客户
                    if (entity.isRelatedCustomer) {
                        var isRelatedCustomer = entity.isRelatedCustomer === "true" ? true : false;
                        cg.appendCondition(Condition.createNew('isRelatedCustomer', isRelatedCustomer,
                            Condition.ConditionType.Boolean, Condition.Operator.IsEqualTo));
                    }
                }

                obj.conditionGroup = cg.toJson();
                return obj;
            }

        });

});
