$().ready( function() {
	
	$("form.validateBranchIframe").validate({
		errorClass: "validateError",
		ignore: ".ignoreValidate",
		invalidHandler: function(form, validator) {
			$.each(validator.invalid, function(key, value){
				alert(value);
				$('[name='+key+']').focus();
				return false;
			});
		},
		errorPlacement:function(error, element) {},
		submitHandler: function(form) {
			$.ajax({
				type:'POST',
				url: $(form).attr("action"),
				data: $(form).serialize(),
				dataType: 'json',
				async: false,
				beforeSend: function(data) {
					$(form).find(":submit").attr("disabled", true);
				},
				success: function(data) {
					alert(data.message);
					if (data.status == "success") {
						parent.listFrame.reload();
					}
				}
			});
		}
	});
	
	$.closeIframeShowWindow = function(){
		if(parent.reload != undefined){
			parent.reload();
		}
	}
	
	
	$("form.brancharea").validate({
		errorClass: "validateError",
		ignore: ".ignoreValidate",
		invalidHandler: function(form, validator){
			$.each(validator.invalid, function(key, value){
				alert(value);
				$('[name='+key+']').focus();
				return false;
			});
		},
		errorPlacement:function(error, element) {},
		submitHandler: function(form) {
			$name=$("#name");
			$confirmUrl=$name.attr("url");
			$.ajax({
				type:'POST',
				url: $confirmUrl,
				data: $(form).serialize(),
				dataType: 'json',
				async: false,
				beforeSend: function(data) {
					$(form).find(":submit").attr("disabled", true);
				},
				success: function(data) {
					if (data.status == "error") {
						if (confirm(data.message) == true){
							$.ajax({
								type:'POST',
								url: $(form).attr("action"),
								data: $(form).serialize(),
								dataType: 'json',
								async: false,
								beforeSend: function(data) {
								},
								success: function(data) {
									if (data.status == "success") {
										alert(data.message);
										if($("#id").val() == ''){
											form.reset();
										}
										$(form).find(":submit").attr("disabled", false);
									}
								}
							});
						}else{
							$(form).find(":submit").attr("disabled", false);
						}
					}else{
						$.ajax({
							type:'POST',
							url: $(form).attr("action"),
							data: $(form).serialize(),
							dataType: 'json',
							async: false,
							beforeSend: function(data) {
							},
							success: function(data) {
								if (data.status == "success") {
									alert(data.message);
									if($("#id").val() == ''){
										form.reset();
									}
									$(form).find(":submit").attr("disabled", false);
								}
							}
						});
					}
				}
			});
		}
	});
})
