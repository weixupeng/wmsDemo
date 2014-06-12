/**
 * Theme Plugins
 * @author migrsoft.com
 */
(function($){
	$.fn.extend({
		theme: function(options){
			var op = $.extend({themeBase:"themes"}, options);
			var _themeHref = op.themeBase + "/#theme#/style.css";
			return this.each(function(){
				var jThemeLi = $(this).find(">li[theme]");
				var setTheme = function(themeName){
					$("head").find("link[href$='style.css']").attr("href", _themeHref.replace("#theme#", themeName));
					jThemeLi.find(">div").removeClass("selected");
					jThemeLi.filter("[theme="+themeName+"]").find(">div").addClass("selected");
					
					if ($.isFunction($.cookie)) $.cookie("bird_theme", themeName);
				}
				
				jThemeLi.each(function(index){
					var $this = $(this);
					var themeName = $this.attr("theme");
					$this.addClass(themeName).click(function(){
						setTheme(themeName);
					});
				});
					
				if ($.isFunction($.cookie)){
					var themeName = $.cookie("bird_theme");
					if (themeName) {
						setTheme(themeName);
					}
				}
				
			});
		}
	});
})(jQuery);
