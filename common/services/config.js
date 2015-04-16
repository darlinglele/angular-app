//config module
define(['angular'], function (angular) {
    return angular.module("config", [])
        .value("DTYPES", ['customerSource', 'identityType', 'corporationKind',
            'degreeType', 'dutyType', 'education', 'employeeCount',
            'jobType', 'marriageInfo', 'nationality', 'politicalStatus',
            'professionalType', 'resideType'])
        .value("MAXLENTH", 500)
        .value('DATATABLE_LAN_CONFIG', {
            "sEmptyTable": "没有数据",
            "sInfo": "显示 _START_~_END_ 共 _TOTAL_ 记录",
            "sInfoEmpty": "显示 0 ~ 0 共 0 记录",
            "sInfoFiltered": "(filtered from _MAX_ total entries)",
            "sInfoPostFix": "",
            "sInfoThousands": ",",
            "sLengthMenu": "每页 _MENU_ 条记录",
            "sLoadingRecords": "加载中...",
            "sProcessing": "查询中...",
            "sSearch": "Search:",
            "sZeroRecords": "没有符合条件的记录",
            "oPaginate": {
                "sFirst": "首页",
                "sLast": "末页",
                "sNext": "下一页",
                "sPrevious": "上一页"
            },
            "oAria": {
                "sSortAscending": ": activate to sort column ascending",
                "sSortDescending": ": activate to sort column descending"
            }
        })
});
