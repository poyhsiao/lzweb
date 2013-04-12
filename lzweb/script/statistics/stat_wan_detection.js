function ShowStatWanDetection( index )
{
	var i, j ,TmpTr, oStatInfo;
	var wanidx = "wan" + index;
	$('#StatTbody').empty();

	for (i = 0; i < stat_wan_det_jcfg[wanidx].length; i++)
	{
		TmpTr = $('#wan_detection_detail tr').clone(true);
		oStatInfo = stat_wan_det_jcfg[wanidx][i].split("\t");
		for (j = 0; j < 4; j++)
		{
			TmpTr.find('td').eq(j).text( oStatInfo[j] );
		}
		TmpTr.appendTo('#StatTbody');
		$('#StatTbody tr:odd').css('background-color', '#EBEBEC');
		$('#StatTbody tr:even').css('background-color', '#C8C8C8');
	}
}

function Refresh()
{
	$('[name="wan_index"]').val( $('#sel_wan').val() );
	$('[name="time"]').val( $('#sel_period').val() );
	document.forms["fmResult"].submit();
}

$(function(){
	$('#sel_wan').change(function(){
		ShowStatWanDetection( $(this).val() );
	});

	$('#sel_period').change(function(){
		if ($(this).val()){
			window.setTimeout( "Refresh();", $(this).val()*1000 );
		}
	});

	$('#sel_wan').val( current_wan );
	$('#sel_period').val( refresh_time );

	if (refresh_time > 0)
	{
		window.setTimeout( "Refresh();", refresh_time*1000 );
	}

	ShowStatWanDetection( current_wan );

	NotifyUser();
});
