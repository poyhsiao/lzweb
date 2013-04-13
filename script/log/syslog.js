vFacilityList = Array(
	"Local0",
	"Local1",
	"Local2",
	"Local3",
	"Local4",
	"Local5",
	"Local6",
	"Local7"
);

function FacilityBTF( fac )
{
	return fac.replace("l", "L");
}

function FacilityFTB ( fac )
{
	return fac.replace("L", "l");
}

function Apply()
{
	var syslog_data = {};
	syslog_data['server'] = $('#server_ip').val();
	syslog_data['facility'] = FacilityFTB( $('#sel_fac').val() );
	$('[name="SyslogSetting"]').val( JSON.stringify(syslog_data) );
}

$(function(){
	InitSelection($('#sel_fac'), vFacilityList);

	$('#sel_fac').val( FacilityBTF(facility) );

	NotifyUser();

	button_enable(window);
});
