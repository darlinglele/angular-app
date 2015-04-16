
var ctx ='';
/**
 *@author:douhongliang
 * */
var enumObject = {
    /**
     * get the 'displayName' of enumObject by the value
     * eg:getEnumNam("borrower",'projectRelatedCustomerType')
     * */
    getEnumNam : function(key, objectName) {
        var obj = this[objectName];
        if (obj) {
            return obj[key] ? obj[key] : '';
        }else{
            $.error("Can't find the enumObject by the objectName!");
        }

    },
    /**
     * get dropDownList option by objectName
     * eg:getDropdownListOpt('projectRelatedCustomerType');
     * */
    getDropdownListOpt:function(objectName){
        var obj = this[objectName];
        var source = [];
        var valueMember = 'value';
        var displayMember = 'label';
        if(obj){
            $.each(obj,function(key,value){
                var item = {};
                item[valueMember] = key;
                item[displayMember] = value;
                source.push(item);
            });
            return source;
        }else{
            $.error("Can't find the enumObject by the objectName!");
        }
    },

    //子女情况
    childrenInfo:{
        have: '有',
        none: '无'
    },
    //家庭人数
    fendByCount:{
        N0:0,
        N1:1,
        N2:2,
        N3:3,
        N4:4,
        N5:5,
        N6:6,
        N7:7,
        N8:8,
        N9:9,
        N10:10
    },
    //客户类型
    customerType:{
        individual:'个人客户',
        houseHold:'个体工商户',
        corporation:'企业客户'

    },
    //客户状态（是否草稿）
    customerStatus:{
        'true':'草稿',
        'false':'已提交'
    }

};
