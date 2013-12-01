$().ready( function() {
		var $username=$("#Text1");
		var $password=$("#Text2");
		
		$username.focus();
		
		$username.keydown(function(event){
			if(event.keyCode == 13){
				if($username.val()!=''){
					$password.select();
				}else{
					$.loginSubmit();
				}
			}
			if(event.keyCode == 40){
				$password.select();
			}
		});
		$password.keydown(function(event){
			if(event.keyCode == 13){
				$.loginSubmit();
			}
			if(event.keyCode == 38){
				$username.select();
			}
		});
		
	   $.loginSubmit=function(){
		   if($username.val()==''){
		   		alertMsg.error("用户名不能为空");
		   		$username.select();
		   		return false;
		   }
		   if($password.val()==''){
		   		alertMsg.error("密码不能为空");
		   		$password.select();
		   		return false;
		   }
		   var $form=$("#loginForm");
		   //查询该账户是否已经登录 给予提醒
		   var url=$("#hadLoginUrl").val();
		   var b=false;
		   /*$.ajax({
				type:"POST",
				url: url,
				data: $form.serialize(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.statusCode=="300"){
						//此帐户已登录
						b=true;
					}
				}
		   });*/
		   //若是已登录 提醒是否继续
		   if(b==true){
			   alertMsg.confirm("此帐户已登录,继续将踢出已登录帐户,是否继续登录？", {
				    okCall: function(){
						$.ajax({
							type:"POST",
							url: $("#loginSubmit").attr("url"),
							data: $form.serialize(),
							dataType: "json",
							async: false,
							beforeSend: function(data) {
								//$("#loginSubmit").attr("disabled", true);
							},
							success: function(data) {
								if(data.status=="error"){
									alertMsg.error(data.message);
									$username.focus();
									//$("#loginSubmit").attr("disabled", false);
									return ;
								}else{
									$form.submit();
								}
							}
						});
					},
					cancelCall:function(){
						return false;
					}
				});
		   }else{
			   $.ajax({
					type:"POST",
					url: $("#loginSubmit").attr("url"),
					data: $form.serialize(),
					dataType: "json",
					async: false,
					beforeSend: function(data) {
						//$("#loginSubmit").attr("disabled", true);
					},
					success: function(data) {
						if(data.status=="error"){
							alertMsg.error(data.message);
							$username.focus();
							//$("#loginSubmit").attr("disabled", false);
							return ;
						}else{
							//$form.submit();
							window.location.href = $form.attr("action");
						}
					}
				});
		   }
	   };
	   Bird.init("static/js/bird.frag.xml",{homePath:$("#homePath").val()});
})
