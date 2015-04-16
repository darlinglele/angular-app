/**
 * JSON mapping of com.hanhua.vap.dao.condition.ConditionGroup
 *
 * Example:
 * $("#Search").jqxButton({ width: '120px', height: '35px', theme: theme })
 *      .on('click', function() {
 *          var cg = ConditionGroup.createNew(ConditionGroup.GroupTypeAnd);
 *          cg.appendCondition(Condition.createNew('auditCompany', "p", 
 *                  Condition.ConditionType.String, Condition.Operator.Contains));
 *          
 *          alert(cg.toJson());
 *          
 *          $.getJSON(ctx + "/CorporationCustomer/search?conditionGroup=" + cg.toJson(), function(json){
 *              alert("JSON Data: " + json);
 *          });
 *      });
 * @author lixiaokai
 * @since  2013/4/17
 */
var ConditionGroup = {
    GroupTypeAnd : "And",
    GroupTypeOr : "Or",
    
    /**
     * Create a new ConditionGroup
     * @param groupType, should be And or Or
     * @returns new ConditoinGroup object
     */
    createNew: function(groupType){
        var conditionGroup = {};
        conditionGroup.condtions = [];
        conditionGroup.subGroups = [];
        // default is And
        conditionGroup.groupType = groupType ? groupType : ConditionGroup.GroupTypeAnd;
        conditionGroup.isDistinct = false;
        
        conditionGroup.appendCondition = function(condition) {
            this.condtions.push(condition);
        };
        
        conditionGroup.appendSubGroups = function(conditionGroup) {
            this.subGroups.push(conditionGroup);
        };
        
        conditionGroup.toJson = function() {
            return JSON.stringify(this);
        };
        
        return conditionGroup;
    }
};

/**
 * JSON mapping for com.hanhua.vap.dao.condition.Condition
 */
var Condition = {
    // Logic Operator
    Operator: {
        IsLessThan : "IsLessThan",
        IsLessThanOrEqualTo : "IsLessThanOrEqualTo",
        IsEqualTo : "IsEqualTo",
        IsNotEqualTo : "IsNotEqualTo",
        IsGreaterThanOrEqualTo : "IsGreaterThanOrEqualTo",
        IsGreaterThan : "IsGreaterThan",
        StartsWith : "StartsWith",
        EndsWith : "EndsWith",
        Contains : "Contains",
        ContainsIn : "ContainsIn",
        In : "In",
        IsNull : "IsNull",
        IsNotNull : "IsNotNull",
        IsEmpty : "IsEmpty", // only used for set
        IsNotEmpty : "IsNotEmpty"// only used for set
    },
    
    // Data Type
    ConditionType : {
        String : "String",
        Number : "Number",
        Date : "Date",
        Boolean : "Boolean",
        UUID : "UUID",
        ENUM : "ENUM"
    },
    
    /**
     * Create new Condition Object
     * @param name - filed name
     * @param value - filed value
     * @param type - filed data type
     * @param operator - logic operator
     * @returns New Condition object.
     */
    createNew: function(name , value , type , operator) {
        var condition = {};
        
        condition.name = name;
        condition.value = value;
        condition.type = type;
        condition.operator = operator;
        
        return condition;
    }
};