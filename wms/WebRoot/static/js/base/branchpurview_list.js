$().ready( function() {
	$(".pshowWindow").click (function(){
		if($("#branchId").val()!=""){
			$updateBtn=$(".pshowWindow");
			$.showFunction($updateBtn);
		}else{
			alert("请先选择分店!");
			return;
		}
		
	})
	jQuery(".needChange").change(
        		function(){
					$th = $(this);
					var url=$("#updateUrl").val();
					$id = $(".selectRow input[name='ids']:checked");
//					alert($id.val()+"--"+$th.val());
					$.ajax({
						type:"POST",
						url: url,
						data:"branchpurview.id="+$id.val()+"&branchpurview."+$(this).attr("name")+"="+$th.val(),
						dataType: "json",
						async: false,
						success: function(data) {
							if(data.status=="error"){
								alert(data.message);
								return ;
							}else{
								alert(data.message);
							}
						}
					});
    			
        		}
        	);
	jQuery(".needOnclick").click(
    		function(event){
    			$("tr.selectRow").each(function(){
    				var srTdIndex = 0;
    				$(this).children().each(function(){
    					if(0 == srTdIndex++){
    						$(this).find("input:checkbox").attr("checked",false);
    						$(this).css({"color":"#000000","font-weight":"normal"});
    					}else{
    						$(this).css("background","#FFFFFF");
    					}
    				});
    			});
    			
				var tdIndex = 0;
				$(this).parent().parent().children().each(function(){
					if(0 == tdIndex++){
						$(this).css({"color":"#FF0000","font-weight":"bold"});
						var checkBox = $(this).find("input:checkbox");
						checkBox.attr("checked",true);
					}else{
						$(this).css("background","#316AC5");
					}
				});
    			event.stopPropagation();
    			
    			var check;
    			if($(this).attr("checked")){
    				check=1;
    			}else{
    				check=0;
    			}
    			if($(this).attr("flag")=="select"){
    				check=$(this).val();
    			}
				var url=$("#updateUrl").val();
				$id = $(".selectRow input[name='ids']:checked");
//				alert(check+"---"+$id.val());
				$.ajax({
					type:"POST",
					url: url,
					data:"branchpurview.id="+$id.val()+"&branchpurview."+$(this).attr("name")+"="+check,
					dataType: "json",
					async: false,
					success: function(data) {
						if(data.status=="error"){
							alert(data.message);
							return ;
						}else{
							alert(data.message);
						}
					}
				});
    		}
    	);
	
})