/**
 * ztree树插件，reload参数parent=****，默认参数的key必须使用parentCode
 * @auth lzy@bjsxsoft.com
 */
(function($){
	$.fn.extend({
		/**
		 * ztree树插件，
		 * @returns
		 */
		mztree:function($p){
			return this.each(function(){
				var $this = $(this);
				var idKey = $this.attr("idKey")||"code";
				
				var callback = $this.attr("callback");
				callback = callback || function(event, treeId, treeNode, clickFlag){
					var reloadAct = $this.attr("reloadAct") || "navTab";//reload类型，dialog/navTab
					var reloadUrl = $this.attr("reloadUrl");//reload的url
					var reloadParamName = $this.attr("reloadParamName") || $this.attr("pName") || "parentCode";
					var reloadDialogId = $this.attr("reloadDialogId");//reload的dialogId/navTabId
					var data = {};
					data[reloadParamName] = treeNode[idKey];
					//刷新本navTab
					if("dialog" == reloadAct){
						jQuery.pdialog.reload(reloadUrl,{dialogId:reloadDialogId,data:data});
					}else{
						navTab.reload(reloadUrl, {navTabId:reloadDialogId,fresh:true, data:data});
					}
				};
				if (! $.isFunction(callback)) callback = eval('(' + callback + ')');
				var op = {
					id:$this.attr("id"),//tree的Id
					idKey:idKey,//数据的id唯一字段
					pIdKey: $this.attr("pIdKey")||"parent",//数据的父节点Id字段
					rootPId: $this.attr("rootPId")||"0",//跟节点
					data:Bird.jsonEval($($this.attr("dataInput") || "#treeString",$p).text()),//数据
					selectNode:$this.attr("selectNode"),//要选择 的节点
					callback:callback,//回调方法
					dblClickExpand:$this.attr("dblClickExpand")||false,//是否双击打开，默认false
					selectedMulti: $this.attr("selectedMulti")||false,//可否多选
					kName:$this.attr("kName")||"name",//节点展示的字段名称
					kTitle:$this.attr("kTitle")||"name"//节点展示的title
				};
				var setting = {
					view: {dblClickExpand:op.dblClickExpand,selectedMulti: op.selectedMulti},
					data: {
						key: {name: op.kName,title:op.kTitle},
						simpleData: {enable: true,idKey: op.idKey,pIdKey: op.pIdKey,rootPId: op.rootPId}
					},
					callback: {
						beforeAsync: function(treeId, treeNode) {
			    			return treeNode ? treeNode.level < 1 : true;
			    		},onClick: op.callback
					}
				};
				//初始化树
				$.fn.zTree.init($this, setting,op.data);
				//选中上次选择的节点
				var zTree = $.fn.zTree.getZTreeObj(op.id);
				if(op.selectNode){
					var sNode = zTree.getNodeByParam(op.idKey,op.selectNode);
					if(sNode){
						zTree.selectNode(sNode);
						//展开子节点
						if(!sNode.open){
							zTree.expandNode(sNode);
						}
					}
				}
			});
		}
	});
})(jQuery);