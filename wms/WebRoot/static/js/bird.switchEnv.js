/**
 * @author migrsoft.com
 */
(function($){
	$.fn.navMenu = function(){
		return this.each(function(){
			var $box = $(this);
			$box.find("li>a").click(function(){
				var $a = $(this);
				$.ajax({
					type: 'POST',
					url: $a.attr("href"),
					success: function(html){
						var json = Bird.jsonEval(html);
						Bird.debug("statusCode:"+json.statusCode);
						if (json.statusCode==Bird.statusCode.timeout){
							alertMsg.error(json.message || Bird.msg("sessionTimout"), {okCall:function(){
								Bird.loadLogin();
							}});
						} else if (json.statusCode==Bird.statusCode.error || json.statusCode == Bird.statusCode.noAuth){
							if (alertMsg && json.message) alertMsg.error(json.message);
						} else {
							$("#sidebar").find(".accordion").remove().end().append(html).initUI();
							$box.find("li").removeClass("selected");
							$a.parent().addClass("selected");
						}
					},
					error: Bird.ajaxError
				});
				return false;
			});
		});
	}
	
	$.fn.switchEnv = function(){
		var op = {cities$:">ul>li", boxTitle$:">a>span"};
		return this.each(function(){
			var $this = $(this);
			$this.click(function(){
				if ($this.hasClass("selected")){
					_hide($this);
				} else {
					_show($this);
				}
				return false;
			});
			
			$this.find(op.cities$).click(function(){
				var $li = $(this);

				$.post($li.find(">a").attr("href"), {}, function(html){
					_hide($this);
					$this.find(op.boxTitle$).html($li.find(">a").html());
					navTab.closeAllTab();
					$("#sidebar").find(".accordion").remove().end().append(html).initUI();
				});
				return false;
			});
		});
	}
	
	function _show($box){
		$box.addClass("selected");
		$(document).bind("click",{box:$box}, _handler);
	}
	function _hide($box){
		$box.removeClass("selected");
		$(document).unbind("click", _handler);
	}
	
	function _handler(event){
		_hide(event.data.box);
	}
})(jQuery);


