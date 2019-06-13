jQuery(window).on('load', function() {
	$('#criyptoList').hide();
	$('#forex1List').hide();
	$('#forex2List').hide();
	$('#stockList').hide();
	$('#marketRadio').change(function(){
		if($('#commodityRadio').is(':checked')){
			$('#commodityList').show();
			$('#criyptoList').hide();
			$('#forex1List').hide();
			$('#forex2List').hide();
			$('#stockList').hide();
		}else if($('#cryptoRadio').is(':checked')){
			$('#commodityList').hide();
			$('#criyptoList').show();
			$('#forex1List').hide();
			$('#forex2List').hide();
			$('#stockList').hide();
		}else if($('#forexRadio').is(':checked')){
			$('#commodityList').hide();
			$('#criyptoList').hide();
			$('#forex1List').show();
			$('#forex2List').show();
			$('#stockList').hide();
		}else if($('#stockRadio').is(':checked')){
			$('#commodityList').hide();
			$('#criyptoList').hide();
			$('#forex1List').hide();
			$('#forex2List').hide();
			$('#stockList').show();
		}else {
			$('#commodityList').hide();
			$('#criyptoList').hide();
			$('#forex1List').hide();
			$('#forex2List').hide();
			$('#stockList').hide();
		}
	});
});