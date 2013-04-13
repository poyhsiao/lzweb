function get_date_time()
{
	var date = $('#date').val().split("/");
	var time = $('#time').val().split(":");
	return date.concat(time);
}

function Apply()
{
	var date, time;
	var time_jcfg = {};
	time_jcfg['time-zone'] = $('#time_zone').val();
	time_jcfg['time-server'] = $('#time_server').val();
	time_jcfg['date'] = get_date_time();
	$('[name="TimeSetting"]').val( JSON.stringify(time_jcfg) );
}

$(function(){
	var date, time

	$('#btnSetTime').click(function(){
		//do ajax
		$.post('set_date_time',
			{date_time: JSON.stringify(get_date_time())},
			function(data){
				alert(data);
			}
		);
	});

	if (login_group == "monitor")
	{
		$('#btnSetTime').attr('disabled', true);
	}

	if (time_jcfg['date'])
	{
		date = time_jcfg['date'][0] + "/" + time_jcfg['date'][1] +
			"/" + time_jcfg['date'][2];
		time = time_jcfg['date'][3] + ":" + time_jcfg['date'][4] +
			":" + time_jcfg['date'][5];
	}
	$('#time_zone').val( time_jcfg['time-zone'] );
	$('#time_server').val( time_jcfg['time-server'] );
	$('#date').datepicker({dateFormat: 'yy/mm/dd'}).val( date );
	$('#time').val( time );

	NotifyUser();

	button_enable(window);
});
