jQuery().ready(
	function(){
    	$("#selectlang").change(
    		function(){
				$("#langauge").val(jQuery(this).val());
				reload();
    		}
    	);
    	jQuery(".needChange").change(
        		function(){
    				var value = $(this).val();
    				var tel = /^[1-9]\d*$/;
    				if($(this).attr("msg") != undefined && !tel.test(value)){
    					alert($(this).attr("msg"));
    					$(this).val($(this).attr("orvalue"));
    					return ;
    				}else{
    					$th = $(this);
    					var url=$("#url").val();
    					$id = $(".selectRow input[name='ids']:checked");
    					$.ajax({
    						type:"POST",
    						url: url,
    						data:"sysTablemx.id="+$id.val()+"&sysTablemx."+$(this).attr("name")+"="+$(this).val(),
    						dataType: "json",
    						async: false,
    						success: function(data) {
    							if(data.status=="error"){
    								alert(data.message);
    								if($th.attr("msg") != undefined){
    									$th.val($th.attr("orvalue"));
    								}
    								return ;
    							}else{
    								alert(data.message);
    								if($th.attr("orvalue") != undefined){
    									$th.attr("orvalue",value);
    								}
    							}
    						}
    					});
    				}
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
					var url=$("#url").val();
					$id = $(".selectRow input[name='ids']:checked");
					$.ajax({
						type:"POST",
						url: url,
						data:"sysTablemx.id="+$id.val()+"&sysTablemx."+$(this).attr("name")+"="+check,
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
	}
);