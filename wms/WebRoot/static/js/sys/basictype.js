$().ready( function() {
	
	   $.loginSubmit=function(){
		   $username=$("#Text1");
		   $password=$("#Text2");
		   if($username.val()=='')
			   {
			   		alert("用户名不能为空");
			   		$username.focus();
			   		return false;
			   }
		   if($password.val()=='')
			   {
				   	alert("用户名不能为空");
				   	$password.focus();
			   		return false;
			  }
		   $form=$("#loginForm");
		   alert($form.attr("action"));
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
					alert(data.status);
					if(data.status=="error"){
						alert(data.message);
						return ;
					}else{
						alert($form.attr("action"));
						$form.submit();
					}
				}
			});
	   }
})
