$().ready( function() {
		var $username=$("#Text1");
		var $password=$("#Text2");
		
		$username.focus();
		
		$("#Text1,#Text2").keydown(function(event){
			if(event.keyCode == 13){
				$.loginSubmit();
			}
		});
		
	   $.loginSubmit=function(){
		   if($username.val()=='')
			   {
			   		alertMsg.error("用户名不能为空");
			   		$username.focus();
			   		return false;
			   }
		   if($password.val()=='')
			   {
			   		alertMsg.error("密码不能为空");
			   		$password.focus();
			   		return false;
			  }
		   $form=$("#loginForm");
		   $.ajax({
				type:"POST",
				url: $("#loginSubmit").attr("url"),
				data: $form.serialize(),
				dataType: "json",
				async: false,
				beforeSend: function(data) {
					$("#loginSubmit").attr("disabled", true)
				},
				success: function(data) {
					if(data.status=="error"){
						alertMsg.error(data.message);
						$username.focus();
						$("#loginSubmit").attr("disabled", false)
						return ;
					}else{
						$form.submit();
					}
				}
			});
	   };
	   Bird.init("bird.frag.xml",{homePath:$("#homePath").val()});
	   /*右键菜单*/
	   $(document).contextMenu('loginCM',{
		   bindings:{
			   index:function(){
		            try{
		            	document.body.style.behavior='url(#default#homepage)';
			        	document.body.setHomePage(window.location.href);
			        } catch(e){
		                if(window.netscape) {
		                        try {
		                                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
		                        }
		                        catch (e) {
		                                alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");
		                        }
		                        var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
		                        prefs.setCharPref('browser.startup.homepage',window.location.href);
		                 }else{
		                	 alert("您的浏览器不支持设置首页，请使用浏览器菜单手动设置.");  
		                 }
			        }
			   },
			   favorites:function(){
				   try { //IE
				        window.external.addFavorite(window.location.href, '迁徙专卖系统');
				    } catch (e) {
				        try { //Firefox
				        	window.sidebar.addPanel('迁徙专卖系统', window.location.href, "");
				        } catch (e) {
							 alert("您的浏览器不支持自动加入收藏，请使用浏览器菜单手动设置.");  
				        }
				    }
			   },
			   about:function(){
				   window.open("http://www.migrsoft.com",'_blank');
			   },
			   version:function(){
				   alertMsg.info('迁徙软件专卖系统 Version 2012 ');
			   }
		   }
	   });
})
