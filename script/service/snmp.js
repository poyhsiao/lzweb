function Apply()                                                        
{                                                                       
	var snmp_data = {};
	snmp_data['enable'] = EnableSNMP;
	snmp_data['community'] = $('#CommunityID').val();
	snmp_data['system-name'] = $('#SysNameID').val();
	snmp_data['system-contact'] = $('#SysContactID').val();
	snmp_data['system-location'] = $('#SysLocationID').val();
	$('[name="SnmpSetting"]').val( JSON.stringify(snmp_data) );
}

$(function(){
	$('#idEnableSNMP').bind('click', function(event){
		ToggleEnable($(this));
		if( $(this).hasClass('itemEnabled') )
		{
			EnableSNMP = 1;
	  	}
	  	else
	  	{
	  		EnableSNMP = 0;
	  	}
	});

	if (EnableSNMP)
		$('#idEnableSNMP').addClass("itemEnabled");
	else
		$('#idEnableSNMP').addClass("itemDisabled");

	NotifyUser();

	button_enable(window);
});
