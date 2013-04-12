function ShowStatDhcp()
{
	var i, TmpTr;
	$('#StatTbody').empty();

	for (ip in stat_dhcp_jcfg)
	{
		TmpTr = $('#stat_dhcp_detail tr').clone(true);

		TmpTr.find('td').eq(0).text( ip );
		TmpTr.find('td').eq(1).text( stat_dhcp_jcfg[ip]['mac'] );
		TmpTr.find('td').eq(2).text( stat_dhcp_jcfg[ip]['client'] );
		TmpTr.find('td').eq(3).text( stat_dhcp_jcfg[ip]['lend'] );

		TmpTr.appendTo('#StatTbody');
		$('#StatTbody tr:odd').css('background-color', '#EBEBEC');
		$('#StatTbody tr:even').css('background-color', '#C8C8C8');
	}
}

function Refresh()
{
	$('[name="time"]').val( $('#sel_period').val() );
	document.forms["fmResult"].submit();
}

$(function(){
	$('#sel_period').change(function(){
		if ($(this).val()){
			window.setTimeout( "Refresh();", $(this).val()*1000 );
		}
	});

	$('#sel_period').val( refresh_time );

	if (refresh_time > 0)
	{
		window.setTimeout( "Refresh();", refresh_time*1000 );
	}

	ShowStatDhcp();

	NotifyUser();
});
