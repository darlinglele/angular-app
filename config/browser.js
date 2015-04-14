
var Browser = (function() {
    function Browser() {
    }

    Browser.prototype = {
        select: function(id) {
            if (id != undefined) {
                this.container.jstree(true).select_node(id);
            }
        },
        init: function(args) {

            if (args == undefined) {
                return;
            }

            this.options = args;

            this.selectedId = args.selectedId;
            this.data = args.data;

            this.Select = args.actions['select'];
            this.Rename = args.actions['rename'];
            this.Create = args.actions['create'];
            this.Delete = args.actions['delete'];
            this.contextMenu = args.contextMenu;
            this.container = args.container;
            var browser = this;

            var reporttree = this.container;


            var getType = function(item) {
                return item.Id == 0 ? 'root' : item.IsFolder == 'False' || item.IsFolder == false ? 'file' : 'folder';
            };

            var data = $.map(this.data, function(item) {
                return { 'id': item.Id, 'parent': item.ParentId == '' ? 0 : item.ParentId, 'text': item.Name, 'type': getType(item) };
            });
            reporttree.jstree("destroy");
            var tree = reporttree.jstree({
                'core': {
                    "animation": 0,
                    "check_callback": true,
                    "themes": { "stripes": true },
                    "multiple": false,
                    'data': data
                },
                "types": {
                    "#": {
                        "max_children": 1,
                        "max_depth": 4,
                        "valid_children": ["root"]
                    },
                    "root": {
                        "icon": browser.rootIcon,
                        "valid_children": ["default"]
                    },
                    "default": {
                        "icon": browser.folderIcon,
                        "valid_children": ["default", "file"]
                    },
                    "file": {
                        "icon": browser.fileIcon,
                        "valid_children": []
                    }
                },
                "plugins": [
                    "contextmenu", "dnd", "search",
                    "types", "wholerow", "ui"
                ],
                "ui": {
                    'select_multiple_modifier': 'on',
                    'selected_parent_open': true,
                    'initially_select': ['root']
                },
                "contextmenu": browser.contextMenu,
            });

            tree.on('loaded.jstree', function() {
                $(this).jstree('open_all');
//                browser.select(browser.selectedId);
            }).on('select_node.jstree', function(e, obj) {
                    return browser.Select ? browser.Select(obj) : false;
                }
            ).on('create_node.jstree', function(e, obj) {
//                console.log(obj);
//                return browser.Create ? browser.Create(obj) : false;
            }).on('delete_node.jstree', function(e, obj) {
                return browser.Delete ? browser.Delete(obj) : false;
            });
        }
    };
    return Browser;
})();


Browser.visable = function() {
    return $('#left').css('display') != 'none';
};
Browser.hide = function() {
    $('#left').hide();
    if (Filter.visable()) {
        $('#mid').css('width', '84%');
    } else {
        $('#mid').css('width', '100%');
    }
};
Browser.show = function() {
    $('#left').show();
    if (Filter.visable()) {
        $('#mid').css('width', '68%');
    } else {
        $('#mid').css('width', '84%');
    }
};


var AdminReportBrowser = (function() {
    var AdminReportBrowser = function() {

    };
    AdminReportBrowser.prototype = new Browser();
    AdminReportBrowser.constructor = AdminReportBrowser;
    return AdminReportBrowser;
})();

var UserBrowser = (function() {
    var UserBrowser = function(args) {
        this.fileIcon = "fa fa-user";
        this.rootIcon = "fa fa-users";
        this.folderIcon = "fa fa-users";
        this.init(args);
    };
    UserBrowser.prototype = new Browser();
    UserBrowser.constructor = UserBrowser;
    return UserBrowser;
})();

var ReportBrowser = (function() {
    var ReportBrowser = function(args) {
        this.fileIcon = "fa fa-file";
        this.rootIcon = "fa fa-folder";
        this.folderIcon = "fa fa-folder";
        this.init(args);
    };
    ReportBrowser.prototype = new Browser();
    ReportBrowser.constructor = ReportBrowser;
    return ReportBrowser;
})();