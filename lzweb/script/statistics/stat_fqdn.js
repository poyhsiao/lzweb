function ShowStatFqdn()
{
	var i, TmpTr;
	$('#StatTbody').empty();

	for (i = 0; i < stat_fqdn_jcfg.length; i++)
	{
		TmpTr = $('#stat_fqdn_detail tr').clone(true);

		TmpTr.find('td').eq(0).text( i+1 );
		TmpTr.find('td').eq(1).text( stat_fqdn_jcfg[i][0] );
		TmpTr.find('td').eq(2).text( stat_fqdn_jcfg[i][1] );
		TmpTr.find('td').eq(3).text( stat_fqdn_jcfg[i][2] );
		TmpTr.find('td').eq(4).text( stat_fqdn_jcfg[i][3] );
		TmpTr.find('td').eq(5).text( stat_fqdn_jcfg[i][4] );

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

	ShowStatFqdn();

	NotifyUser();
});
