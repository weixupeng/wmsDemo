/**
 * @author migrsoft.com
 * 
 * @update 2011-12-15 by lzy@bjsxsoft.com
 * 一、lookup支持两种输入框的双击
 * 	 1、将lookupBtn上的所有属性copy到input:text上
 * 	 2、，在lookupBtn上增加属性dblLookupText表示需要双击打开的input，例：dblLookupText="input[name='purchorder.supplierName']"
 * 一、lookup对多窗口的支持：
 *   1、如果需要多窗口支持需要在所有的打开lookup的按钮上加上mul="true"属性，包括第一个按钮，如在purch_input.vm里面的open按钮标记mul="true"，
 *   	purch_list.vm页面的供应商LookupBtn按钮上增加 mul="true"属性
 *   2、在choose页面里调用$.bringBack(args,close,dialogId)方法的地方增加为3个参数,第一个不变为args传递回的内容，第二个为true|false表示是否关闭窗口
 *   	第三个参数为本lookupDialog的id也就是打开本lookup的按钮上的rel值
 *   3、多选$.callbackBringBack(args,dialogId),增加为2个参数，第一个参数为选中的值，第二个为本lookup的diaogId也就是打开按钮上的rel
 *   
 *   警告：如果是用了多窗口支持，在lookup的按钮上加上mul="true"属性，必须在调用bringBack和callbackBringBack时传递dialogId参数
 *			如果dialogId错误则无法回调绑定的函数。
 */
(function($){
	//TODO warn：最后两个参数是为了不关闭窗口刷新父页面而设定，因为父页面刷新时target将失效，所以缓存data,data中包含了相应的数据如dialogId和url
	//				只能用于不关闭窗口刷新，且只支持$.bringBack方法，且可能出现bug
	var _lookup = {currentGroup:"", suffix:"", $target:null, pk:"id",box:null,$targetMap:[]};
	var _util = {
		_lookupPrefix: function(key){
			var strDot = _lookup.currentGroup ? "." : "";
			return _lookup.currentGroup + strDot + key + _lookup.suffix;
		},
		lookupPk: function(key){
			return this._lookupPrefix(key);
		},
		lookupField: function(key){
			return "bird." + this.lookupPk(key);
		}
	};  
	
	$.extend({
		bringBackSuggest: function(args,dialogId){
			var lookupBtn = _lookup['$target'];//或者_lookup.$target
			var $box = lookupBtn.parents(".unitBox:first");
			var valBox = $box;
//			if(valBox.html() == null && dialogId){
//				lookupBtn = _lookup['$targetMap'][dialogId];
//				valBox = lookupBtn.parents(".unitBox:first");
//			}
			var $inputs = valBox.find(":input");
			$inputs.each(function(){
				var $input = $(this), inputName = $input.attr("id");  
				
				for (var key in args) {
					var name = (_lookup.pk == key) ? _util.lookupPk(key) : _util.lookupField(key);

					if (name == inputName) {
						$input.val(args[key]);
						break;
					}
				}
			});
		},
		bringBack: function(obj,args,close,dialogId){
			var $choosePage = $(obj).parents(".unitBox:first");
			var lookupBtn = _lookup['$target'];//或者_lookup.$target
			var $box = lookupBtn.parents(".unitBox:first");
//			if($box.html() == null && dialogId){
//				lookupBtn = _lookup['$targetMap'][dialogId];
//			}
			dialogId = dialogId || $("#dialogId",$choosePage).val();
			var beforInputCall = lookupBtn.attr('beforInputCall');
			if(beforInputCall){
				if (! $.isFunction(beforInputCall)) beforInputCall = eval('(' + beforInputCall + ')');
				
				if(!beforInputCall(args,$box,lookupBtn)){//兼容性的增加了两个参数dialogId和url
					return;
				}
			}
			
			$.bringBackSuggest(args,dialogId);
			
			if(close == undefined || close==true){
				if(dialogId){
					var dialog = $("body").data(dialogId);
					$.pdialog.close(dialog);
				}else{
					$.pdialog.closeCurrent();
				}
				_lookup['$targetMap'].pop();
				_lookup['$target']=_lookup['$targetMap'].pop();
				_lookup['$targetMap'].push(_lookup['$target']);
			}
			
			
			var callback = lookupBtn.attr('callback');
			if(callback){
				if (! $.isFunction(callback)) callback = eval('(' + callback + ')');
				
				if($box.html() == null){
					$box = _lookup['$box'];
				}
				if(($box == null || $box.html()==null) && dialogId){
					$box = _lookup['$targetMap'][dialogId].parents(".unitBox:first");
					if(close == undefined || close==true){
						_lookup['$targetMap'][dialogId] = undefined;
					}
				}
				callback(args,$box,lookupBtn);//兼容性的增加了两个参数dialogId和url
			}
		},//TODO 增加支持callback的选择带回,args为带回的值，rel为打开此lookup按钮上的rel属性值
		callbackBringBack:function(args,dialogId){
			var lookupBtn = _lookup['$target'];//或者_lookup.$target
			var $box = lookupBtn.parents(".unitBox:first");
			var valBox = $box;
			
//			if(valBox.html() == null && dialogId){
//				lookupBtn = _lookup['$targetMap'][dialogId];
//				valBox = lookupBtn.parents(".unitBox:first");
//			}
			
			var beforInputCall = lookupBtn.attr('beforInputCall');
			if(beforInputCall){
				if (! $.isFunction(beforInputCall)) beforInputCall = eval('(' + beforInputCall + ')');
				
				if(!beforInputCall(args,$box,lookupBtn)){//兼容性的增加了两个参数dialogId和url
					return;
				}
			}
			
			valBox.find(":input").each(function(){
				var $input = $(this), inputName = $input.attr("id");  
				
				for (var key in args) {
					var name = (_lookup.pk == key) ? _util.lookupPk(key) : _util.lookupField(key);

					if (name == inputName) {
						$input.val(args[key]);
						break;
					}
				}
			});
			
			$.pdialog.closeCurrent();
			
			var callback = lookupBtn.attr('callback');
			if(callback){
				if (! $.isFunction(callback)) callback = eval('(' + callback + ')');
				if($box.html() == null){
					$box = _lookup['$box'];
				}
				if(($box == null || $box.html()==null) && dialogId){
					$box = _lookup['$targetMap'][dialogId].parents(".unitBox:first");
					if(close == undefined || close==true){
						_lookup['$targetMap'][dialogId] = undefined;
					}
				}
				callback(args,$box,lookupBtn);
			}
		},
		//FIXME 注意：如果需要不关闭窗口增加明细时，需要调用这个方法，具体参杂migr.lzy.js 第40~45行
		setLookupBox:function(box){
			_lookup['$box'] = box;
		}
	});
	
	
	
	$.fn.extend({
		lookup: function(type){
			return this.each(function(){
				var $this = $(this), options = {mask:true, 
					width:$this.attr('width')||820, height:$this.attr('height')||400,
					maxable:eval($this.attr("maxable") || "false"),
					resizable:eval($this.attr("resizable") || "true")
				};
				//如果是input:text或者textarea则使用双击时才进行打开
				if(type){
					$this.dblclick(function(event){
						var beforeCall = $this.attr("beforeCall");
						if(beforeCall){
							if (! $.isFunction(beforeCall)) beforeCall = eval('(' + beforeCall + ')');
							if(!beforeCall(this)){
								return false;
							}
						}
						_lookup = $.extend(_lookup, {
							currentGroup: $this.attr("lookupGroup") || "",
							suffix: $this.attr("suffix") || "",
							$target: $this,
							pk: $this.attr("lookupPk") || "id"
						});
						//对于多lookup的支持
						_lookup['$targetMap'].push($this);
						
						var url = unescape($this.attr("href")).replaceTmById($(event.target).parents(".unitBox:first"));
						if (!url.isFinishedTm()) {
							alertMsg.error($this.attr("warn") || Bird.msg("alertSelectMsg"));
							return false;
						}
						
						$.pdialog.open(url, $this.attr("rel") || "_blank", $this.attr("title") || $this.text(), options);
						return false;
					});
				}else{
					var dblLookupText = $this.attr("dblLookupText");
					if(dblLookupText){
						var $p = $this.parents(".unitBox:first");
						$(dblLookupText,$p).dblclick(function(){
							$this.trigger("click");
							return false;
						});
					}
					$this.click(function(event){
						var beforeCall = $this.attr("beforeCall");
						if(beforeCall){
							if (! $.isFunction(beforeCall)) beforeCall = eval('(' + beforeCall + ')');
							if(!beforeCall(this)){
								return false;
							}
						}
						_lookup = $.extend(_lookup, {
							currentGroup: $this.attr("lookupGroup") || "",
							suffix: $this.attr("suffix") || "",
							$target: $this,
							pk: $this.attr("lookupPk") || "id"
						});
						//对于多lookup的支持
						_lookup['$targetMap'].push($this);
						
						var url = unescape($this.attr("href")).replaceTmById($(event.target).parents(".unitBox:first"));
						if (!url.isFinishedTm()) {
							alertMsg.error($this.attr("warn") || Bird.msg("alertSelectMsg"));
							return false;
						}
						
						$.pdialog.open(url, $this.attr("rel") || "_blank", $this.attr("title") || $this.text(), options);
						return false;
					});
				}
			});
		},
		multLookup: function(){
			return this.each(function(){
				var $this = $(this), args={};
				$this.click(function(event){
					var $unitBox = $this.parents(".unitBox:first");
					$unitBox.find("[name='"+$this.attr("multLookup")+"']").filter(":checked").each(function(){
						var _args = Bird.jsonEval($(this).val());
						for (var key in _args) {
							var value = args[key] ? args[key]+"," : "";
							args[key] = value + _args[key];
						}
					});

					if ($.isEmptyObject(args)) {
						alertMsg.error($this.attr("warn") || Bird.msg("alertSelectMsg"));
						return false;
					}
					$.bringBack(args);
				});
			});
		},
		callbackMultLookup: function(){
			return this.each(function(){
				var $this = $(this), args={};
				$this.click(function(event){
					var $unitBox = $this.parents(".unitBox:first");
					$unitBox.find("[name='"+$this.attr("callbackMultLookup")+"']").filter(":checked").each(function(){
						var _args = Bird.jsonEval($(this).val());
						for (var key in _args) {
							var value = args[key] ? args[key]+"," : "";
							args[key] = value + _args[key];
						}
					});
					if ($.isEmptyObject(args)) {
						alertMsg.error($this.attr("warn") || Bird.msg("alertSelectMsg"));
						return false;
					}
					$.callbackBringBack(args);
				});
			});
		},
		suggest: function(){
			var op = {suggest$:"#suggest", suggestShadow$: "#suggestShadow"};
			var selectedIndex = -1;
			return this.each(function(){
				var $input = $(this).attr('autocomplete', 'off').keydown(function(event){
					if (event.keyCode == Bird.keyCode.ENTER) return false; //屏蔽回车提交
				});
				
				var suggestFields=$input.attr('suggestFields').split(",");
				
				function _show(event){
					var offset = $input.offset();
					var iTop = offset.top+this.offsetHeight;
					var $suggest = $(op.suggest$);
					if ($suggest.size() == 0) $suggest = $('<div id="suggest"></div>').appendTo($('body'));

					$suggest.css({
						left:offset.left+'px',
						top:iTop+'px'
					}).show();
					
					_lookup = $.extend(_lookup, {
						currentGroup: $input.attr("lookupGroup") || "",
						suffix: $input.attr("suffix") || "",
						$target: $input,
						pk: $input.attr("lookupPk") || "id"
					});

					var url = unescape($input.attr("suggestUrl")).replaceTmById($(event.target).parents(".unitBox:first"));
					if (!url.isFinishedTm()) {
						alertMsg.error($input.attr("warn") || Bird.msg("alertSelectMsg"));
						return false;
					}
			
					$.ajax({
						type:'POST', dataType:"json", url:url, cache: false,
						data:{inputValue:$input.val()},
						success: function(response){
							if (!response) return;
							var html = '';

							$.each(response, function(i){
								var liAttr = '', liLabel = '';
								
								for (var i=0; i<suggestFields.length; i++){
									var str = this[suggestFields[i]];
									if (str) {
										if (liLabel) liLabel += '-';
										liLabel += str;
										if (liAttr) liAttr += ',';
										liAttr += suggestFields[i]+":'"+str+"'";
									}
								}
								html += '<li lookupId="'+this["id"]+'" lookupAttrs="'+liAttr+'">' + liLabel + '</li>';
							});
							$suggest.html('<ul>'+html+'</ul>').find("li").hoverClass("selected").click(function(){
								_select($(this));
							});
						},
						error: function(){
							$suggest.html('');
						}
					});

					$(document).bind("click", _close);
					return false;
				}
				function _select($item){
					var jsonStr = "{id:'"+$item.attr('lookupId')+"'," + $item.attr('lookupAttrs') +"}";
					$.bringBackSuggest(Bird.jsonEval(jsonStr));
				}
				function _close(){
					$(op.suggest$).html('').hide();
					selectedIndex = -1;
					$(document).unbind("click", _close);
				}
				
				$input.focus(_show).click(false).keyup(function(event){
					var $items = $(op.suggest$).find("li");
					switch(event.keyCode){
						case Bird.keyCode.ESC:
						case Bird.keyCode.TAB:
						case Bird.keyCode.SHIFT:
						case Bird.keyCode.HOME:
						case Bird.keyCode.END:
						case Bird.keyCode.LEFT:
						case Bird.keyCode.RIGHT:
							break;
						case Bird.keyCode.ENTER:
							_close();
							break;
						case Bird.keyCode.DOWN:
							if (selectedIndex >= $items.size()-1) selectedIndex = -1;
							else selectedIndex++;
							break;
						case Bird.keyCode.UP:
							if (selectedIndex < 0) selectedIndex = $items.size()-1;
							else selectedIndex--;
							break;
						default:
							_show(event);
					}
					$items.removeClass("selected");
					if (selectedIndex>=0) {
						var $item = $items.eq(selectedIndex).addClass("selected");
						_select($item);
					}
				});
			});
		},
		
		itemDetail: function(){
			return this.each(function(){
				var $table = $(this).css("clear","both"), $tbody = $table.find("tbody");
				var fields=[];

				$table.find("tr:first th[type]").each(function(){
					var $th = $(this);
					var field = {
						type: $th.attr("type") || "text",
						patternDate: $th.attr("format") || "yyyy-MM-dd",
						name: $th.attr("name") || "",
						size: $th.attr("size") || "12",
						enumUrl: $th.attr("enumUrl") || "",
						lookupGroup: $th.attr("lookupGroup") || "",
						lookupUrl: $th.attr("lookupUrl") || "",
						suggestUrl: $th.attr("suggestUrl"),
						suggestFields: $th.attr("suggestFields"),
						fieldClass: $th.attr("fieldClass") || ""
					};
					fields.push(field);
				});
				
				$tbody.find("a.btnDel").click(function(){
					var $btnDel = $(this);
					function delDbData(){
						$.ajax({
							type:'POST', dataType:"json", url:$btnDel.attr('href'), cache: false,
							success: function(){
								$btnDel.parents("tr:first").remove();
								initSuffix($tbody);
							},
							error: Bird.ajaxError
						});
					}
					
					if ($btnDel.attr("title")){
						alertMsg.confirm($btnDel.attr("title"), {okCall: delDbData});
					} else {
						delDbData();
					}
					
					return false;
				});

				var addButTxt = $table.attr('addButton') || "Add New";
				if (addButTxt) {
					var $addBut = $('<div class="button"><div class="buttonContent"><button type="button">'+addButTxt+'</button></div></div>').insertBefore($table).find("button");
					var $rowNum = $('<input type="text" name="bird_rowNum" class="textInput" style="margin:2px;" value="1" size="2"/>').insertBefore($table);
					
					var trTm = "";
					$addBut.click(function(){
						if (! trTm) trTm = trHtml(fields);
						var rowNum = 1;
						try{rowNum = parseInt($rowNum.val())} catch(e){}

						for (var i=0; i<rowNum; i++){
							var $tr = $(trTm);
							$tr.appendTo($tbody).initUI().find("a.btnDel").click(function(){
								$(this).parents("tr:first").remove();
								initSuffix($tbody);
								return false;
							});
						}
						initSuffix($tbody);
					});
				}
			});
			
			/**
			 * 删除时重新初始化下标
			 */
			function initSuffix($tbody) {
				$tbody.find('>tr').each(function(i){
					$(':input, a.btnLook', this).each(function(){
						var $this = $(this);

						$this.attr('name', $this.attr('name').replaceSuffix(i));
						
						var lookupGroup = $this.attr('lookupGroup');
						if (lookupGroup) {$this.attr('lookupGroup', lookupGroup.replaceSuffix(i));}
						
						var suffix = $this.attr("suffix");
						if (suffix) {$this.attr('suffix', suffix.replaceSuffix(i));}
						
					});
				});
			}
			
			function tdHtml(field){
				var html = '', suffix = '';
				
				if (field.name.endsWith("[#index#]")) suffix = "[#index#]";
				else if (field.name.endsWith("[]")) suffix = "[]";
				
				var suffixFrag = suffix ? ' suffix="' + suffix + '" ' : '';
			
				switch(field.type){
					case 'del':
						html = '<a href="javascript:void(0)" class="btnDel '+ field.fieldClass + '">删除</a>';
						break;
					case 'lookup':
						var suggestFrag = '';
						if (field.suggestFields) {
							suggestFrag = 'autocomplete="off" lookupGroup="'+field.lookupGroup+'"'+suffixFrag+' suggestUrl="'+field.suggestUrl+'" suggestFields="'+field.suggestFields+'"';
						}

						html = '<input type="hidden" name="'+field.lookupGroup+'.id'+suffix+'"/>'
							+ '<input type="text" name="'+field.name+'"'+suggestFrag+' size="'+field.size+'" class="'+field.fieldClass+'"/>'
							+ '<a class="btnLook" href="'+field.lookupUrl+'" lookupGroup="'+field.lookupGroup+'" '+suggestFrag+' title="查找带回">查找带回</a>';
						break;
					case 'attach':
						html = '<input type="hidden" name="'+field.lookupGroup+'.id'+suffix+'"/>'
							+ '<input type="text" name="'+field.name+'" size="'+field.size+'" readonly="readonly" class="'+field.fieldClass+'"/>'
							+ '<a class="btnAttach" href="'+field.lookupUrl+'" lookupGroup="'+field.lookupGroup+'" '+suggestFrag+' width="560" height="300" title="查找带回">查找带回</a>';
						break;
					case 'enum':
						$.ajax({
							type:"POST", dataType:"html", async: false,
							url:field.enumUrl, 
							data:{inputName:field.name}, 
							success:function(response){
								html = response;
							}
						});
						break;
					case 'date':
						html = '<input type="text" name="'+field.name+'" class="date '+field.fieldClass+'" format="'+field.patternDate+'" size="'+field.size+'"/>'
							+'<a class="inputDateButton" href="javascript:void(0)">选择</a>';
						break;
					default:
						html = '<input type="text" name="'+field.name+'" size="'+field.size+'" class="'+field.fieldClass+'"/>';
						break;
				}
				return '<td>'+html+'</td>';
			}
			function trHtml(fields){
				var html = '';
				$(fields).each(function(){
					html += tdHtml(this);
				});
				return '<tr class="unitBox">'+html+'</tr>';
			}
		},
		
		selectedTodo: function(){
			
			function _getIds(selectedIds, targetType,$p){
				var ids = "";
				var dialogId = $("#dialogId",$p).val();
				var $box = targetType == "dialog" ? $("body").data(dialogId)||$.pdialog.getCurrent() : navTab.getCurrentPanel();
				$box.find("input:checked").filter("[name='"+selectedIds+"']").each(function(i){
					var val = $(this).val();
					ids += i==0 ? val : ","+val;
				});
				return ids;
			}
			return this.each(function(){
				var $this = $(this);
				var $p = $this.parents(".unitBox:first");
				var selectedIds = $this.attr("rel") || "ids";
				var postType = $this.attr("postType") || "map";
				//TODO 增加callback
				var callback = $this.attr("callback") || navTabAjaxDone;
				if (! $.isFunction(callback)) callback = eval('(' + callback + ')');
				$this.click(function(){
					var ids = _getIds(selectedIds, $this.attr("targetType"),$p);
					if (!ids) {
						alertMsg.error($this.attr("warn") || Bird.msg("alertSelectMsg"));
						return false;
					}
					function _doPost(){
						$.ajax({
							type:'POST', url:$this.attr('href'), dataType:'json', cache: false,
							data: function(){
								if (postType == 'map'){
									return $.map(ids.split(','), function(val, i) {
										return {name: selectedIds, value: val};
									})
								} else {
									var _data = {};
									_data[selectedIds] = ids;
									return _data;
								}
							}(),
							success: function(data){
								callback(data,$this.get());
							},
							error: Bird.ajaxError
						});
					}
					var title = $this.attr("title");
					if (title) {
						alertMsg.confirm(title, {okCall: _doPost});
					} else {
						_doPost();
					}
					return false;
				});
				
			});
		}
	});
})(jQuery);

