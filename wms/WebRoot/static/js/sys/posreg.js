$().ready( function() {		
	   $.regSubmit=function(){
		   $.ajax({
				type:"POST",
				url: $("#regSubmit").attr("url"),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				alertMsg.correct(data.message);
	    			}
				}
			});
	   };
	   Bird.init("bird.frag.xml",{homePath:$("#homePath").val()});
})
