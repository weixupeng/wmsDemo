$().ready( function() {
	$("#flag").change(function(){
		$flag=$("#flag");
		$storeDeliverTitle=$("#storeDeliverTitle");
		$storeDeliver=$("#storeDeliver");
		$storeNoDeliver=$("#storeNoDeliver");
		if($flag.val()=='0'){
			$storeDeliverTitle.css("display","none");
			$storeDeliver.css("display","none");
			$storeNoDeliver.css("display","block");
		}else{
			$storeDeliverTitle.css("display","block");
			$storeDeliver.css("display","block");
			$storeNoDeliver.css("display","none");
		}
	})
})
