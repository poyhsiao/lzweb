$(function(){
	var i;
	var wan_num = all_wans.length;

	//Port Information
	for (i = 0; i < wan_num; i++)
	{
		$('#ddns td').eq(i).text( summary_jcfg[all_wans[i]]['ddns'] );
	}
	$('#ddns td').eq(wan_num).text( summary_jcfg['lan']['ddns'] );
	$('#ddns td').eq(wan_num+1).text( summary_jcfg['dmz']['ddns'] );
	// IPv4 Address
	for (i = 0; i < wan_num; i++)
	{
		$('#ipv4 td').eq(i).text( summary_jcfg[all_wans[i]]['ip'] );
	}
	$('#ipv4 td').eq(wan_num).text( summary_jcfg['lan']['ip'] );
	$('#ipv4 td').eq(wan_num+1).text( summary_jcfg['dmz']['ip'] );

	// Status
	for (i = 0; i < wan_num; i++)
	{
		$('#status td').eq(i).text( summary_jcfg[all_wans[i]]['status'] );
	}
	$('#status td').eq(wan_num).text( summary_jcfg['lan']['status'] );
	$('#status td').eq(wan_num+1).text( summary_jcfg['dmz']['status'] );

	// Rx (Kbps)
	for (i = 0; i < wan_num; i++)
	{
		$('#rx td').eq(i).text( summary_jcfg[all_wans[i]]['rx'] );
	}
	$('#rx td').eq(wan_num).text( summary_jcfg['lan']['rx'] );
	$('#rx td').eq(wan_num+1).text( summary_jcfg['dmz']['rx'] );

	// Tx (Kbps)
	for (i = 0; i < wan_num; i++)
	{
		$('#tx td').eq(i).text( summary_jcfg[all_wans[i]]['tx'] );
	}
	$('#tx td').eq(wan_num).text( summary_jcfg['lan']['tx'] );
	$('#tx td').eq(wan_num+1).text( summary_jcfg['dmz']['tx'] );

	// Detection
	for (i = 0; i < wan_num; i++)
	{
		if (summary_jcfg[all_wans[i]]['detection'] == "good")
		{
			$('#detection td').eq(i).html('<img src="/image/state-alive.gif">');
		}
		else
		{
			$('#detection td').eq(i).html('<img src="/image/state-dead.gif">');
		}
	}
	$('#detection td').eq(wan_num).text( summary_jcfg['lan']['detection'] );
	$('#detection td').eq(wan_num+1).text( summary_jcfg['dmz']['detection'] );
	
	// Connection Time
	for (i = 0; i < wan_num; i++)
	{
		$('#connection_time td').eq(i).text( summary_jcfg[all_wans[i]]['connection-time'] );
	}
	$('#connection_time td').eq(wan_num).text( summary_jcfg['lan']['connection-time'] );
	$('#connection_time td').eq(wan_num+1).text( summary_jcfg['dmz']['connection-time'] );
	
	// Label
	for (i = 0; i < wan_num; i++)
	{
		$('#label td').eq(i).text( summary_jcfg[all_wans[i]]['label'] );
	}
	$('#label td').eq(wan_num).text( summary_jcfg['lan']['label'] );
	$('#label td').eq(wan_num+1).text( summary_jcfg['dmz']['label'] );

	// Reconnect
	$('button').each(function(){
		$(this).click(function(){
			$('[name="position"]').val( this.name );
			document.forms["fmResult"].submit();
		});
	});
	if (login_group == "monitor")
	{
		$('button').attr('disabled', true);
	}

	NotifyUser();
});
