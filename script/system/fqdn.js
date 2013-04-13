var CurrentNo;

function Apply()
{
	var fqdn_data = {};
	fqdn_data['fqdn'] = new Array();
	for (var i = 0; i < $('#fqdnTbody tr').size(); i++)
	{
		var tmpTr = $('#fqdnTbody tr').eq(i);
		fqdn_data['fqdn'][i] = tmpTr.find('input:first').val();
	}
	$('[name="FqdnSetting"]').val( JSON.stringify(fqdn_data) );
}

$(function(){
	CurrentNo = 0; // Initial Number

	$('#addFqdn').click(function(){
		CurrentNo++;
		var tmpTr = $('<tr><th></th><td><input type="text"></td></tr>');
		tmpTr.find('th:first').text( CurrentNo );
		tmpTr.appendTo($('#fqdnTbody'));
	});

	$('#deleteFqdn').click(function(){
		if (CurrentNo)
		{
			$('#fqdnTbody tr:last').detach();
			CurrentNo--;
		}
		else
		{
			alert("Can't delete anymore!");
		}
	});
	
	// Initial fqdn table
	if (fqdn_jcfg['fqdn'])
	{
		for(var i = 0; i < fqdn_jcfg['fqdn'].length; i++)
		{
			var tmpTr = $('<tr><th></th><td><input type="text"></td></tr>');
			tmpTr.find('th:first').text(i+1);
			tmpTr.find('input:first').val( htmlspecialchars_decode(fqdn_jcfg['fqdn'][i]) );
			tmpTr.appendTo($('#fqdnTbody'));
		}
		CurrentNo = fqdn_jcfg['fqdn'].length;
	}

	NotifyUser();

	button_enable(window);
});
