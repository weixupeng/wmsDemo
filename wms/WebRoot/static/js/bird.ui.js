function initEnv() {
	$("body").append(Bird.frag["birdFrag"]);
	
	if ( $.browser.msie && /6.0/.test(navigator.userAgent) ) {
		try {
			document.execCommand("BackgroundImageCache", false, true);
		}catch(e){}
	}
	//清理浏览器内存,只对IE起效
	if ($.browser.msie) {
		window.setInterval("CollectGarbage();", 10000);
	}

	$(window).resize(function(){
		initLayout();
		$(this).trigger("resizeGrid");
	});

	var ajaxbg = $("#background,#progressBar");
	ajaxbg.hide();
	$(document).ajaxStart(function(){
		ajaxbg.show();
	}).ajaxComplete(function(){
		ajaxbg.hide();
	}).ajaxStop(function(){
		ajaxbg.hide();
	});
	
	$("#leftside").jBar({minW:150, maxW:700});
	
	if ($.taskBar) $.taskBar.init();
	navTab.init();
	if ($.fn.switchEnv) $("#switchEnvBox").switchEnv();
	if ($.fn.navMenu) $("#navMenu").navMenu();
		
	setTimeout(function(){
		initLayout();
		initUI();
		
		// navTab styles
		var jTabsPH = $("div.tabsPageHeader");
		jTabsPH.find(".tabsLeft").hoverClass("tabsLeftHover");
		jTabsPH.find(".tabsRight").hoverClass("tabsRightHover");
		jTabsPH.find(".tabsMore").hoverClass("tabsMoreHover");
	
	}, 10);

}
function initLayout(){
	var iContentW = $(window).width() - (Bird.ui.sbar ? $("#sidebar").width() + 10 : 34) - 5;
	var iContentH = $(window).height() - $("#header").height() - 34;

	$("#container").width(iContentW);
	$("#container .tabsPageContent").height(iContentH - 34).find("[layoutH]").layoutH();
	$("#sidebar, #sidebar_s .collapse, #splitBar, #splitBarProxy").height(iContentH - 5);
	$("#taskbar").css({top: iContentH + $("#header").height() + 5, width:$(window).width()});
}

function initUI(_box){
	var $p = $(_box || document);
	
	//tables
	$("table.table", $p).jTable();
	
	// css tables
	$('table.list', $p).cssTable();

	
	//tables
	$("table.jTreeGrid", $p).jTreeGrid();
	
	// css tables
	$('table.cssTreeTable', $p).cssTreeTable();
	
	//auto bind tabs
	$("div.tabs", $p).each(function(){
		var $this = $(this);
		var options = {};
		options.currentIndex = $this.attr("currentIndex") || 0;
		options.eventType = $this.attr("eventType") || "click";
		$this.tabs(options);
	});

	$("ul.tree", $p).jTree();
	$('div.accordion', $p).each(function(){
		var $this = $(this);
		var active = $.cookie("ActiveAccordion") || "0";
		try{
			active = parseInt(active);
		}catch(e){
			active = 0;
		}
		$this.accordion({fillSpace:$this.attr("fillSpace"),alwaysOpen:true,active:active});
	});

	$(":button.checkboxCtrl, :checkbox.checkboxCtrl", $p).checkboxCtrl($p);
	
	if ($.fn.combox) $("select.combox",$p).combox();
	
	if ($.fn.xheditor) {
		$("textarea.editor", $p).each(function(){
			var $this = $(this);
			var op = {html5Upload:false, skin: 'vista',tools: $this.attr("tools") || 'full'};
			var upAttrs = [
				["upLinkUrl","upLinkExt","zip,rar,txt"],
				["upImgUrl","upImgExt","jpg,jpeg,gif,png"],
				["upFlashUrl","upFlashExt","swf"],
				["upMediaUrl","upMediaExt","avi"]
			];
			
			$(upAttrs).each(function(i){
				var urlAttr = upAttrs[i][0];
				var extAttr = upAttrs[i][1];
				
				if ($this.attr(urlAttr)) {
					op[urlAttr] = $this.attr(urlAttr);
					op[extAttr] = $this.attr(extAttr) || upAttrs[i][2];
				}
			});
			
			$this.xheditor(op);
		});
	}
	
	if ($.fn.uploadify) {
		$(":file[uploader]", $p).each(function(){
			var $this = $(this);
			var options = {
				uploader: $this.attr("uploader"),
				script: $this.attr("script"),
				cancelImg: $this.attr("cancelImg"),
				queueID: $this.attr("fileQueue") || "fileQueue",
				fileDesc: $this.attr("fileDesc") || "*.jpg;*.jpeg;*.gif;*.png;*.pdf",
				fileExt : $this.attr("fileExt") || "*.jpg;*.jpeg;*.gif;*.png;*.pdf",
				folder	: $this.attr("folder") || "/upload",
				auto: $this.attr("auto") || true,
				multi: $this.attr("multi") || true,
				buttonImg:Bird.homePath+'/images/select_file.jpg',
				fileDataName: $this.attr("fileDataName") || $this.attr("name"),
				onError:uploadifyError,
				removeCompleted:true,
				onComplete: uploadifyComplete,
				onAllComplete: uploadifyAllComplete
			};
			if ($this.attr("onComplete")) {
				options.onComplete = Bird.jsonEval($this.attr("onComplete"));
			}
			if ($this.attr("onAllComplete")) {
				options.onAllComplete = Bird.jsonEval($this.attr("onAllComplete"));
			}
			if ($this.attr("scriptData")) {
				options.scriptData = Bird.jsonEval($this.attr("scriptData"));
			}
			$this.uploadify(options);
		});
		$(":file[uploaderImage]", $p).each(function(){
			var $this = $(this);
			var options = {
				uploader: $this.attr("uploaderImage"),
				script: $this.attr("script"),
				cancelImg: $this.attr("cancelImg"),
				queueID: $this.attr("fileQueue") || "fileQueue",
				fileDesc: $this.attr("fileDesc") || "*.jpg;*.jpeg;*.gif;*.png;*.pdf",
				fileExt : $this.attr("fileExt") || "*.jpg;*.jpeg;*.gif;*.png;*.pdf",
				folder	: $this.attr("folder") || "/upload",
				auto: $this.attr("auto") || true,
				multi: $this.attr("multi") || true,
				buttonImg:Bird.homePath+'/images/mshop/uploader_image.jpg',
				fileDataName: $this.attr("fileDataName") || $this.attr("name"),
				onError:uploadifyError,
				removeCompleted:true,
				onComplete: $this.attr("onComplete") || migr.uploadifyImageComplete,
				onAllComplete: $this.attr("onAllComplete") || uploadifyAllComplete
			};
			if ($this.attr("onComplete")) {
				options.onComplete = Bird.jsonEval($this.attr("onComplete"));
			}
			if ($this.attr("onAllComplete")) {
				options.onAllComplete = Bird.jsonEval($this.attr("onAllComplete"));
			}
			if ($this.attr("scriptData")) {
				options.scriptData = Bird.jsonEval($this.attr("scriptData"));
			}
			$this.uploadify(options);
		});
		$(":file[uploaderDeliveryImage]", $p).each(function(){
			var $this = $(this);
			var options = {
				uploader: $this.attr("uploaderDeliveryImage"),
				script: $this.attr("script"),
				cancelImg: $this.attr("cancelImg"),
				queueID: $this.attr("fileQueue") || "fileQueue",
				fileDesc: $this.attr("fileDesc") || "*.jpg;*.jpeg;*.gif;*.png;*.pdf",
				fileExt : $this.attr("fileExt") || "*.jpg;*.jpeg;*.gif;*.png;*.pdf",
				folder	: $this.attr("folder") || "/upload",
				auto: $this.attr("auto") || true,
				multi: $this.attr("multi") || true,
				buttonImg:Bird.homePath+'/images/mshop/uploader_image.jpg',
				fileDataName: $this.attr("fileDataName") || $this.attr("name"),
				onError:uploadifyError,
				removeCompleted:true,
				onComplete: migr.uploadifyDeliveryImageComplete,
				onAllComplete: uploadifyAllComplete
			};
			if ($this.attr("onComplete")) {
				options.onComplete = Bird.jsonEval($this.attr("onComplete"));
			}
			if ($this.attr("onAllComplete")) {
				options.onAllComplete = Bird.jsonEval($this.attr("onAllComplete"));
			}
			if ($this.attr("scriptData")) {
				options.scriptData = Bird.jsonEval($this.attr("scriptData"));
			}
			$this.uploadify(options);
		});
		$(":file[uploaderFile]", $p).each(function(){
			var $this = $(this);
			var options = {
				uploader: $this.attr("uploaderFile"),
				script: $this.attr("script"),
				cancelImg: $this.attr("cancelImg"),
				queueID: $this.attr("fileQueue") || "fileQueue",
				fileDesc: $this.attr("fileDesc") || "*.xls;*.word;*.txt;*.jar;*.zip",
				fileExt : $this.attr("fileExt") || "*.xls;*.word;*.txt;*.jar;*.zip",
				folder	: $this.attr("folder") || "/upload",
				auto: $this.attr("auto") || true,
				multi: $this.attr("multi") || true,
				buttonImg:Bird.homePath+'/images/mshop/uploader_file.jpg',
				fileDataName: $this.attr("fileDataName") || $this.attr("name"),
				onError:uploadifyError,
				removeCompleted:true,
				onComplete: migr.uploadifyFileComplete,
				onAllComplete: uploadifyAllComplete
			};
			if ($this.attr("onComplete")) {
				options.onComplete = Bird.jsonEval($this.attr("onComplete"));
			}
			if ($this.attr("onAllComplete")) {
				options.onAllComplete = Bird.jsonEval($this.attr("onAllComplete"));
			}
			if ($this.attr("scriptData")) {
				options.scriptData = Bird.jsonEval($this.attr("scriptData"));
			}
			$this.uploadify(options);
		});
		$(":file[uploadervideo]", $p).each(function(){
			var $this = $(this);
			var options = {
				uploader: $this.attr("uploadervideo"),
				script: $this.attr("script"),
				cancelImg: $this.attr("cancelImg"),
				queueID: $this.attr("fileQueue") || "fileQueue",
				fileDesc: $this.attr("fileDesc") || "*.xls;",
				fileExt : $this.attr("fileExt") || "*.xls;",
				folder	: $this.attr("folder") || "/upload",
				auto: $this.attr("auto") || true,
				multi: $this.attr("multi") || true,
				buttonImg:Bird.homePath+'/images/mshop/uploader_file.jpg',
				fileDataName: $this.attr("fileDataName") || $this.attr("name"),
				onError:uploadifyError,
				removeCompleted:true,
				onComplete:uploadifyComplete,
				onAllComplete: uploadifyAllComplete
			};
			if ($this.attr("onOpen")) {
				options.onOpen = Bird.jsonEval($this.attr("onOpen"));
			}
			if ($this.attr("onComplete")) {
				options.onComplete = Bird.jsonEval($this.attr("onComplete"));
			}
			if ($this.attr("onAllComplete")) {
				options.onAllComplete = Bird.jsonEval($this.attr("onAllComplete"));
			}
			if ($this.attr("scriptData")) {
				options.scriptData = Bird.jsonEval($this.attr("scriptData"));
			}
			$this.uploadify(options);
		});
		$(":file[excelimport]", $p).each(function(){
			var $this = $(this);
			var options = {
				uploader: $this.attr("excelimport"),
				script: $this.attr("script"),
				cancelImg: $this.attr("cancelImg"),
				queueID: $this.attr("fileQueue") || "fileQueue",
				fileDesc: $this.attr("fileDesc") || "*.xls;",
				fileExt : $this.attr("fileExt") || "*.xls;",
				folder	: $this.attr("folder") || "/upload",
				auto: $this.attr("auto") || true,
				multi: $this.attr("multi") || true,
				buttonImg:Bird.homePath+'/images/mshop/uploader_excelinput.jpg',
				fileDataName: $this.attr("fileDataName") || $this.attr("name"),
				onError:uploadifyError,
				removeCompleted:true,
				onComplete: migr.uploadifyFileComplete,
				onAllComplete: uploadifyAllComplete
			};
			if ($this.attr("onComplete")) {
				options.onComplete = Bird.jsonEval($this.attr("onComplete"));
			}
			if ($this.attr("onAllComplete")) {
				options.onAllComplete = Bird.jsonEval($this.attr("onAllComplete"));
			}
			if ($this.attr("scriptData")) {
				options.scriptData = Bird.jsonEval($this.attr("scriptData"));
			}
			$this.uploadify(options);
		});
	}
	
	// init styles
	$("input[type=text], input[type=password], textarea", $p).addClass("textInput").focusClass("focus");

	$("input[readonly], textarea[readonly]", $p).addClass("readonly");
	$("input[disabled=true], textarea[disabled=true]", $p).addClass("disabled");

	$("input[type=text]", $p).not("div.tabs input[type=text]", $p).filter("[alt]").inputAlert();

	//Grid ToolBar
	$("div.panelBar li, div.panelBar", $p).hoverClass("hover");

	//Button
	$("div.button", $p).hoverClass("buttonHover");
	$("div.buttonActive", $p).hoverClass("buttonActiveHover");
	
	//tabsPageHeader
	$("div.tabsHeader li, div.tabsPageHeader li, div.accordionHeader, div.accordion", $p).hoverClass("hover");
	
	$("div.panel", $p).jPanel();

	//validate form
	$("form.required-validate", $p).each(function(){
		$(this).validate({
			focusInvalid: false,
			focusCleanup: true,
			errorElement: "span",
			errorPlacement: function(error, element) {
				var messagePosition = element.metadata().messagePosition;
				if("undefined" != typeof messagePosition && messagePosition != "") {
					var $messagePosition = $(messagePosition);
					if ($messagePosition.size() > 0) {
						error.insertAfter($messagePosition).fadeOut(300).fadeIn(300);
					} else {
						error.insertAfter(element).fadeOut(300).fadeIn(300);
					}
				} else {
					error.insertAfter(element).fadeOut(300).fadeIn(300);
				}
			},
			ignore:".ignore",
			invalidHandler: function(form, validator) {
				var errors = validator.numberOfInvalids();
				if (errors) {
					var message = Bird.msg("validateFormError",[errors]);
					alertMsg.error(message);
				} 
			}
		});
	});
	$("form.noshow-validate", $p).each(function(){
		$(this).validate({
			focusInvalid: false,
			focusCleanup: true,
			errorElement: "span",
			ignore:".ignore",
			errorPlacement:function(error, element) {},
			invalidHandler: function(form, validator) {
				$.each(validator.invalid, function(key, value){
					alertMsg.error(value);
					$('[name='+key+']',$p).focus();
					return false;
				});
			}
		});
	});

	if ($.fn.datepicker){
		$('input.date', $p).each(function(){
			var $this = $(this);
			var opts = {};
			if ($this.attr("format")) opts.pattern = $this.attr("format");
			if ($this.attr("yearstart")) opts.yearstart = $this.attr("yearstart");
			if ($this.attr("yearend")) opts.yearend = $this.attr("yearend");
			$this.datepicker(opts);
		});
	}
	// navTab
	$("a[target=navTab],button[target=navTab]", $p).each(function(){
		$(this).click(function(event){
			var $this = $(this);
			var title = $this.attr("title") || $this.text();
			var tabid = $this.attr("rel") || "_blank";
			var fresh = eval($this.attr("fresh") || "true");
			var external = eval($this.attr("external") || "false");
			var url = unescape($this.attr("href")).replaceTmById($(event.target).parents(".unitBox:first"));
			Bird.debug(url);
			if (!url.isFinishedTm()) {
				alertMsg.error($this.attr("warn") || Bird.msg("alertSelectMsg"));
				return false;
			}
			navTab.openTab(tabid, url,{title:title, fresh:fresh, external:external});

			event.preventDefault();
		});
	});
	//dialogs
	$("a[target=dialog],button[target=dialog]", $p).each(function(){
		$(this).click(function(event){
			var $this = $(this);
			var callback = $this.attr("callback");
			if(callback){
				if (! $.isFunction(callback)) callback = eval('(' + callback + ')');
				var bool = callback($this);
				if(bool == false){
					return false;
				}
			}
			var title = $this.attr("title") || $this.text();
			var rel = $this.attr("rel") || "_blank";
			var options = {};
			var w = $this.attr("width");
			var h = $this.attr("height");
			if (w) options.width = w;
			if (h) options.height = h;
			options.max = eval($this.attr("max") || "false");
			options.mask = eval($this.attr("mask") || "true");
			options.maxable = eval($this.attr("maxable") || "false");
			options.minable = eval($this.attr("minable") || "false");
			options.fresh = eval($this.attr("fresh") || "true");
			options.resizable = eval($this.attr("resizable") || "true");
			options.drawable = eval($this.attr("drawable") || "true");
			options.close = eval($this.attr("close") || "");
			options.param = $this.attr("param") || "";
			options.restore = eval($this.attr("restore") || "false");
			var url = unescape($this.attr("href")).replaceTmById($(event.target).parents(".unitBox:first"));
			Bird.debug(url);
			if (!url.isFinishedTm()) {
				alertMsg.error($this.attr("warn") || Bird.msg("alertSelectMsg"));
				return false;
			}
			$.pdialog.open(url, rel, title, options);
			
			return false;
		});
	});
	//tr双击弹出navTab
	$("tr[dblTarget=navTab]", $p).each(function(){
		$(this).dblclick(function(event){
			var $this = $(this);
			var callback = $this.attr("callback");
			if(callback){
				if (! $.isFunction(callback)) callback = eval('(' + callback + ')');
				var bool = callback($this);
				if(bool == false){
					return false;
				}
			}
			var title = $this.attr("title") || $this.text();
			var tabid = $this.attr("dialogId") || $this.attr("rel") || "_blank";
			var fresh = eval($this.attr("fresh") || "true");
			var external = eval($this.attr("external") || "false");
			var url = unescape($this.attr("url")).replaceTmById($(event.target).parents(".unitBox:first"));
			Bird.debug(url);
			if (!url.isFinishedTm()) {
				alertMsg.error($this.attr("warn") || Bird.msg("alertSelectMsg"));
				return false;
			}
			navTab.openTab(tabid, url,{title:title, fresh:fresh, external:external});

			event.preventDefault();
		});
	});
	//tr双击弹出dialogs
	$("tr[dblTarget=dialog]", $p).each(function(){
		$(this).dblclick(function(event){
			var $this = $(this);
			var callback = $this.attr("callback");
			if(callback){
				if (! $.isFunction(callback)) callback = eval('(' + callback + ')');
				var bool = callback($this);
				if(bool == false){
					return false;
				}
			}
			var title = $this.attr("title") || $this.text();
			var rel = $this.attr("dialogId") || $this.attr("rel") || "_blank";
			var options = {};
			var w = $this.attr("dWidth");
			var h = $this.attr("dHeight");
			if (w) options.width = w;
			if (h) options.height = h;
			options.max = eval($this.attr("max") || "false");
			options.mask = eval($this.attr("mask") || "true");
			options.maxable = eval($this.attr("maxable") || "false");
			options.minable = eval($this.attr("minable") || "false");
			options.fresh = eval($this.attr("fresh") || "true");
			options.resizable = eval($this.attr("resizable") || "true");
			options.drawable = eval($this.attr("drawable") || "true");
			options.close = eval($this.attr("close") || "");
			options.param = $this.attr("param") || "";
			options.restore = eval($this.attr("restore") || "false");
			var url = unescape($this.attr("url")).replaceTmById($(event.target).parents(".unitBox:first"));
			Bird.debug(url);
			if (!url.isFinishedTm()) {
				alertMsg.error($this.attr("warn") || Bird.msg("alertSelectMsg"));
				return false;
			}
			$.pdialog.open(url, rel, title, options);
			
			return false;
		});
	});
	$("a[target=ajax]", $p).each(function(){
		$(this).click(function(event){
			var $this = $(this);
			var callback = $this.attr("callback");
			if(callback){
				if (! $.isFunction(callback)) callback = eval('(' + callback + ')');
				var bool = callback($this);
				if(bool == false){
					return false;
				}
			}
			
			var rel = $this.attr("rel");
			if (rel) {
				var $rel = $("#"+rel);
				$rel.loadUrl($this.attr("href"), {}, function(){
					$rel.find("[layoutH]").layoutH();
				});
			}

			event.preventDefault();
		});
	});
	
	$("div.pagination", $p).each(function(){
		var $this = $(this);
		$this.pagination({
			targetType:$this.attr("targetType"),
			rel:$this.attr("rel"),
			totalCount:$this.attr("totalCount"),
			numPerPage:$this.attr("numPerPage"),
			pageNumShown:$this.attr("pageNumShown"),
			currentPage:$this.attr("currentPage")
		},$p);
	});
	
	// bird.ajax.js
	if ($.fn.ajaxTodo) $("a[target=ajaxTodo]", $p).ajaxTodo();
	if ($.fn.birdExport) $("a[target=birdExport]", $p).birdExport();

	if ($.fn.lookup) $("a[lookupGroup],input:button[lookupGroup]", $p).lookup();
	if ($.fn.lookup) $("input:text[lookupGroup],textarea[lookupGroup]", $p).lookup('text');
	
	if ($.fn.multLookup) $("[multLookup]:button", $p).multLookup();
	if ($.fn.suggest) $("input[suggestFields]", $p).suggest();
	if ($.fn.itemDetail) $("table.itemDetail", $p).itemDetail();
	if ($.fn.selectedTodo) $("a[target=selectedTodo]", $p).selectedTodo();
	if ($.fn.pagerForm) $("form[rel=pagerForm]", $p).pagerForm({parentBox:$p});
	// 这里放其他第三方jQuery插件...
	//$.itemDetails.init($("table.itemDetail", $p));
	if ($.fn.callbackMultLookup) $("[callbackMultLookup]:button", $p).callbackMultLookup();
	if($.fn.dynamicTable) $("table.dynamicTable",$p).dynamicTable();
	/* @Deprecated 已经废弃，格式化已经在后台的vmTool中完成。 将input上标记scale="true"的标签精确到2为小数点
	$("input[scale='true']",$p).each(function(){
		$thisInput = $(this);
		var value = $thisInput.val().trim();
		if(!value.isNumber()){
			value = 0;
		}
		$thisInput.val(setScale(value,2,"roundhalfup"));
	});
	//将td上标记scale="true"的标签精确到2为小数点
	$("td[scale='true']",$p).each(function(){
		$thisText = $(this);
		var value = $thisText.text().trim();
		if(!value.isNumber()){
			value = 0;
		}
		$thisText.text(setScale(value,2, "roundhalfup"));
	});*/
	//审批
	if($.fn.checkDialog){
		$("[target='checkDialog']", $p).checkDialog();
	}
	
	if($.fn.dblCheckDialog){
		$("[target='dblCheckDialog']", $p).dblCheckDialog();
	}
	
	//readonly插件
	if($.fn.readonlyAll){
		$(".readonlyAll", $p).each(function(){
			var $this = $(this);
			$this.readonlyAll();
		});
	}
	//ztree插件
	if($.fn.zTree && $.fn.mztree){
		$(".ztree", $p).mztree($p);
	}
	//审核水印插件
	if($.fn.checkWaterMaker){
		$(".checkWaterMaker",$p).each(function(){
			var $this = $(this);
			var option = {
				width:150,height:150,top:-20,left:100,imgUrl:Bird.homePath+'/images/approve.png'
			};
			var top = $this.attr("top");
			if(top && top.isNumber()){
				option.top = parseInt(top);
			}
			var left = $this.attr("left");
			if(left && left.isNumber()){
				option.left = parseInt(left);
			}
			var target = $this.attr("target");
			var $target = $this;
			if(target){//有目标就使用目标
				$target = $(target);
				if($target.size() == 0){
					$target = $this;
				}
			}
			option.top  += $target.offset().top;
			option.left += $target.offset().left+$target.width();
			$this.checkWaterMaker(option);
		});
	}
	//进入页面默认focus插件，在目标input加上class="focus"
	$(".focus",$p).each(function(){
		var $this = $(this);
		$this.bind("focus",function(){
			this.select();
		});
		$this.focus();
	});
	//查询高亮显示，在关键字的input上加上class="highlightText"，在高亮区域加上class="highlightArea"
	$(".highlightText",$p).each(function(){
		var text = $(this).val();
		var $highlightArea = $(".highlightArea",$p);
		if(text && text.trim() != ''){
			$highlightArea.highlight(text);
		}
	});
	//点击输入框后选择文本
	/*$("input[type=text],input[type=password]",$p).each(function(){
		$(this).click(function(){
			this.select();
		});
	});*/
	
	/*图片渐进，鼠标滑动时的渐入和渐出
	$("img",$p).each(function(){
		var $this = $(this);
		$this.fadeTo("slow", 0.6); // This sets the opacity of the thumbs to fade down to 60% when the page loads
		$this.hover(function(){
	        $(this).fadeTo("slow", 1.0); // This should set the opacity to 100% on hover
	    },function(){
	        $(this).fadeTo("slow", 0.6); // This should set the opacity back to 60% on mouseout
	    });
	});*/
	
	//禁用form的回车提交
	$("form[enterSubmit=false]",$p).each(function(){
		$(this).keypress(function(e){
			alert(e.which);
			if (e.which == 13) {
				return false;
			}
		});
	});
	
	var commHandler = function($this,event,type,otherHandler){
		var target = $this.attr(type+"Target");
		var callback = $this.attr("on"+type);
		
		if(target){//有则跳到下一个
			$(target,$p).focus();
		}else if(callback){
			//有回调函数时，焦点不跳转
		}else{//没有目的地，则采用其他handler
			if(otherHandler){
				otherHandler($this,event);
			}else{//什么都没有时出发一下TAB
				event.keyCode = Bird.keyCode.TAB;
				return true;
			}
		}
		//回调
		if(callback){
			callback = "(function(obj){"+callback+"})($this)";
			eval(callback);
		}
		return false;
	};
	//keybord键盘快捷键
	var enterHandler = function($this,event){
		return commHandler($this,event,"enter",rightHandler);
	};
	var leftHandler =function($this,event){
		return commHandler($this,event,"left");
	};
	var rightHandler = function($this,event){
		return commHandler($this,event,"right");
	};
	var upHandler = function($this,event){
		return commHandler($this,event,"up",leftHandler);
	};
	var downHandler = function($this,event){
		return commHandler($this,event,"down",rightHandler);
	};
	var deleteHandler = function($this,event){
		
	};
	var escHandler = function($this,event){
		
	};
	//1、事件绑定
	$("[onenter],[onleft],[onright],[onup],[ondown],[ondelete],[onesc],[enterTarget],[leftTarget],[rightTarget],[upTarget],[downTarget]",$p).keydown(function(event){
		var $this = $(this);
		if(event.keyCode == Bird.keyCode.ENTER){
			return enterHandler($this,event);
		}else if(event.keyCode == Bird.keyCode.LEFT){
			return leftHandler($this,event);
		}else if(event.keyCode == Bird.keyCode.RIGHT){
			return rightHandler($this,event);
		}else if(event.keyCode == Bird.keyCode.UP){
			return upHandler($this,event);
		}else if(event.keyCode == Bird.keyCode.DOWN){
			return downHandler($this,event);
		}else if(event.keyCode == Bird.keyCode.DELETE){
			return deleteHandler($this,event);
		}else if(event.keyCode == Bird.keyCode.ESC){
			return escHandler($this,event);
		}
	});
	
	//默认加载页面
	var objUrl=$("#headUrl",$p).val();
	var $headDiv = $("#headDiv",$p);
	var $pagerForm = $("#pagerForm",$p);
	if(objUrl && $headDiv.size() > 0 && $pagerForm.size() > 0){
		$headDiv.loadUrl(objUrl,$pagerForm.serialize());
	}
	
	//商品属性编辑类型插件
	if($.fn.productAttributeTypeSelect) $(".productAttributeTypeSelect",$p).productAttributeTypeSelect($p);
	//商品属性添加
	if($.fn.productTypeSelect) $(".productTypeSelect",$p).productTypeSelect($p);
	//商品图片管理插件
	if($.fn.productImage) $(".productImage",$p).productImage($p);
	//lSelect组件
	if($.fn.lSelect){
		var $lSelect = $("input:text.lSelect",$p);
		$lSelect.lSelect({
			url: $lSelect.attr("reomoteUrl")// AJAX数据获取url
		});
	}
	/**
	 * 权限控件
	 * 注意：这个控件要放在最后面，否则可能失效
	 */
	$("[noAuth]", $p).authority();
	
	//物流单据打印
	$("a.deliveryPrint",$p).click(function(){
		//查找物流公司
		var $this = $(this);
		var deliveryCorp = $this.parents("td:first").find(".deliveryCorp").val();
		if(!deliveryCorp){
			alertMsg.error("请选择物流公司！");
			return false;
		}
		var url = $this.attr("isPrintsettedUrl");
		var h = $this.attr("href");
		$.ajax({
			type:"POST",
			url: url,
			data:{"id":deliveryCorp},
			dataType:"json",
			success: function(data) {
				if(data.statusCode == 200){
					//将选择的数据赋给链接并打开链接
					open(h+"&deliveryCorpId="+deliveryCorp,"_blank");
				}else{
					alertMsg.error(data.message);
				}
			}
		});
		return false;
	});
}


