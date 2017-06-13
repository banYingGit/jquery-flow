+(function ($) {
	
    function WorkFlowCheck(element, options) {

        this.$element = $(element);

        this.options = $.extend({}, {}, options);

        // 方法绑定
        // _buildEvent.call(this);

    }

    /*function _buildEvent() {

        var $this = this;

        this.$element

            .on('click', '#checkBtn', function () {
            	//var str = '{"title":"rrrr","nodes":{"demo_node_1":{"name":"node_1","left":79,"top":142,"type":"start round","width":50,"height":50,"alt":true},"demo_node_2":{"name":"node_2","left":222,"top":166,"type":"mutiselect","width":160,"height":50,"alt":true},"demo_node_8":{"name":"node_2","left":222,"top":166,"type":"mutiselect","width":160,"height":50,"alt":true},"demo_node_7":{"name":"node_2","left":222,"top":166,"type":"mutiselect","width":160,"height":50,"alt":true},"demo_node_3":{"name":"node_3","left":586,"top":191,"type":"end round","width":50,"height":50,"alt":true}},"lines":{"demo_line_4":{"type":"sl","from":"demo_node_1","to":"demo_node_2","name":"","alt":true},"demo_line_5":{"type":"sl","from":"demo_node_2","to":"demo_node_3","name":"","alt":true}},"areas":{},"initNum":6}';
            	//var str = '{"title":"rrrr","nodes":{"demo_node_1":{"name":"node_1","left":79,"top":142,"type":"start round","width":50,"height":50,"alt":true},"demo_node_2":{"name":"node_2","left":222,"top":166,"type":"mutiselect","width":160,"height":50,"alt":true},"demo_node_3":{"name":"node_3","left":586,"top":191,"type":"end round","width":50,"height":50,"alt":true},"demo_node_7":{"name":"node_2","left":222,"top":166,"type":"mutiselect","width":160,"height":50,"alt":true},"demo_node_8":{"name":"node_2","left":222,"top":166,"type":"mutiselect","width":160,"height":50,"alt":true}},"lines":{"demo_line_4":{"type":"sl","from":"demo_node_1","to":"demo_node_2","name":"","alt":true},"demo_line_5":{"type":"sl","from":"demo_node_2","to":"demo_node_3","name":"","alt":true},"demo_line_9":{"type":"sl","from":"demo_node_2","to":"demo_node_7","name":"","alt":true},"demo_line_10":{"type":"sl","from":"demo_node_7","to":"demo_node_8","name":"","alt":true}},"areas":{},"initNum":6}';
            	var str = '';
            	_check(str);
            })

    }*/
    
    WorkFlowCheck.prototype.check = function (str){
    	
    	var workFlow = JSON.parse(str);
    	var nodes = workFlow.nodes;
    	var arr = [];
    	// 开始节点
    	var startNode;
    	// 结束节点
    	var endNode;
    	// 中间任务节点
    	var taskNodes = [];
    	
    	// 获取节点类型
    	$.each(nodes, function(key, value){
    		arr.push(value.type);
    		
    		if(value.type == "start round"){
    			startNode = key;
    		}
    		if(value.type == "end round"){
    			endNode = key;
    		}
    		if(value.type == "mutiselect"){
    			taskNodes.push(key);
    		}
    	})
    	
    	// 判断开始节点
    	var startCount = 0;
    	for(var i=0;i<arr.length;i++){
    		 if(arr[i] == "start round"){
    			 startCount++;
    		 }
    	}
    	// 有且只能有一个开始节点
    	if(startCount != 1){
    		alertxx("工作流定义时，有且只能有一个开始节点，请修改后重新保存！");
    		return false;
    	}
    	
    	// 判断结束节点
    	var endCount = 0;
    	for(var i=0;i<arr.length;i++){
    		 if(arr[i] == "end round"){
    			 endCount++;
    		 }
    	}
    	// 有且只能有一个结束节点
    	if(endCount != 1){
    		alertx("工作流定义时，有且只能有一个结束节点，请修改后重新保存！");
    		return false;
    	}
    	
    	// 判断是否含有工作流节点
    	var indexEnd = $.inArray("mutiselect", arr);
    	if(indexEnd == -1){
    		alertx("工作流定义时，开始节点和结束节点中至少有一个任务节点，请修改后重新保存！");
    		return false;
    	}
    	
    	var lines = workFlow.lines;
    	var formNodes = [];
    	var toNodes = [];
    	// 获取连线
    	$.each(lines, function(key, value){
    		formNodes.push(value.from);
    		toNodes.push(value.to);
    	})
    	
    	// 开始节点连线
    	var hasStartCount = 0;
    	for(var i=0;i<formNodes.length;i++){
    		 if(formNodes[i] == startNode){
    			 hasStartCount++;
    		 }
    	}
    	if(hasStartCount != 1){
    		alertx("工作流定义时，从开始节点开始的任务数有且只有一个，请修改后重新保存！");
    		return false;
    	}
    	
    	// 结束节点连线
    	var hasEndCount = 0;
    	for(var i=0;i<toNodes.length;i++){
    		 if(toNodes[i] == endNode){
    			 hasEndCount++;
    		 }
    	}
    	if(hasEndCount != 1){
    		alertx("工作流定义时，以结束节点结束的任务数有且只有一个，请修改后重新保存！");
    		return false;
    	}
    	
		// 判断中间节点是否连线
    	for(var i=0;i<taskNodes.length;i++){

        	var taskStart = $.inArray(taskNodes[i], formNodes);
        	if(taskStart == -1 || taskEnd == -1){
        		alertx("工作流定义时，除去开始和结束节点，其他的任务节点均应该有来源和去向，请修改后重新保存！");
        		return false;
        	}
        	var taskEnd = $.inArray(taskNodes[i], toNodes);
        	if(taskEnd == -1){
        		alertx("工作流定义时，除去开始和结束节点，其他的任务节点均应该有来源和去向，请修改后重新保存！");
        		return false;
        	}
    	}
    	
    	return true;
    }
    
    function Plugin(option) {

        var args = Array.prototype.slice.call(arguments, 1)

        return this.each(function () {
            var $this = $(this);
            var data = $this.data('dcapp.workFlowCheck')
            var options = typeof option == 'object' && option

            if (!data) {
                $this.data('dcapp.workFlowCheck', (data = new WorkFlowCheck(this, options)))
            }

            if (typeof option == 'string') {

                data[option].apply(data, args)
            }
        })
    }

    var old = $.fn.workFlowCheck;

    $.fn.workFlowCheck = Plugin;
    $.fn.workFlowCheck.Constructor = WorkFlowCheck;
    
    $.fn.workFlowCheck.noConflict = function () {
        $.fn.workFlowCheck = old;
        return this
    }
})(jQuery);

/*$(function () {

	$('#workflowCheck').workFlowCheck({});
	
})*/