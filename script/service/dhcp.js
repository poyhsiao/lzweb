function Apply()
{
	var dhcp_data = {};
	dhcp_data['dns-server-1'] = $('#dns_server_1').val();
	dhcp_data['dns-server-2'] = $('#dns_server_2').val();
	dhcp_data['gateway'] = $('#gateway').val();
	dhcp_data['mask'] = $('#mask').val();
	dhcp_data['dynamic-range'] = new Array();
	for (var i = 0; i < $('#DhcpRangeTbody tr').size(); i++)
	{
		var tmpTr = $('#DhcpRangeTbody tr').eq(i);
		var range_start = tmpTr.children('td:nth-child(2)').children('input').val();
		var range_end = tmpTr.children('td:nth-child(3)').children('input').val();
		dhcp_data['dynamic-range'][i] = range_start + "-" + range_end;
	}
	dhcp_data['static-mapping'] = new Array();
	for (var i = 0; i < $('#StaticMappingTbody tr').size(); i++)
	{
		var tmpTr = $('#StaticMappingTbody tr').eq(i);
		dhcp_data['static-mapping'][i] = {};
		dhcp_data['static-mapping'][i]['mac'] = tmpTr.children('td:nth-child(2)').children('input').val();
		dhcp_data['static-mapping'][i]['ip'] = tmpTr.children('td:nth-child(3)').children('input').val();
	}

	$('[name="DhcpSetting"]').val( JSON.stringify(dhcp_data) );
}

$(function(){
	$('#addDhcpRange').click(function(){
		$('#PrototypeSetting tr').clone(true).prependTo('#DhcpRangeTbody');
	});

	$('#addStaticMapping').click(function(){
		$('#PrototypeSetting tr').clone(true).prependTo('#StaticMappingTbody');
	});

	$('img.btnAdd').click(function(){
		$('#PrototypeSetting tr').clone(true).insertAfter($(this).closest('tr'));
	});

	$('img.btnDelete').click(function(){
		$(this).closest('tr').detach();
	});

	// Initial Dhcp Range table
	if (dhcp_range_list)
	{
		for(var i = 0; i < dhcp_range_list.length; i++)
		{
			var tmpTr = $('#PrototypeSetting tr').clone(true);
			var range_array = dhcp_range_list[i].split("-");
			tmpTr.children('td:nth-child(2)').children('input').val( range_array[0] );
			tmpTr.children('td:nth-child(3)').children('input').val( range_array[1] );
			tmpTr.appendTo('#DhcpRangeTbody');
		}
	}

	// Initial Static Mappging table
	if (static_mapping_list)
	{
		for(var i = 0; i < static_mapping_list.length; i++)
		{
			var tmpTr = $('#PrototypeSetting tr').clone(true);
			tmpTr.children('td:nth-child(2)').children('input')
				.val( static_mapping_list[i]['mac']);
			tmpTr.children('td:nth-child(3)').children('input')
				.val( static_mapping_list[i]['ip'] );
			tmpTr.appendTo('#StaticMappingTbody');
		}
	}

	NotifyUser();

	button_enable(window);
});
