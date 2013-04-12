var current_cmd;

function print_ping_result()
{
	$.getJSON('poll_ping_result', '',
		function(data) {
			if (!data[0]){
				window.setTimeout("print_ping_result();", 1000);
			}
			else { //finish
				$('button[id != "stop"]').removeAttr('disabled');
				$('#stop').attr('disabled', true);
				current_cmd = "";
			}
			$('#textarea').val( data[1].join('') );
		}
	);
}

function print_traceroute_result()
{
	$.getJSON('poll_traceroute_result', '',
		function(data) {
			if (!data[0]){
				window.setTimeout("print_traceroute_result();", 1000);
			}
			else { //finish
				$('button[id != "stop"]').removeAttr('disabled');
				$('#stop').attr('disabled', true);
				current_cmd = "";
			}
			$('#textarea').val( data[1].join('') );
		}
	);
}

$(function(){
	$('#arp_enforce').click(function(){
		if (window.confirm(confirm_msg))
		{
			$('button').attr('disabled', true);
			//do ajax
			$.post('enforce',
				'',
				function(data) {
					alert(data);
					$('button[id != "stop"]').removeAttr('disabled');
				}
			);
		}
	});

	$('#ip_conflict_test').click(function(){
		if (window.confirm(confirm_msg))
		{
			$('button').attr('disabled', true);
			//do ajax
			$.post('conflict_test',
				'',
				function(data) {
					alert(data);
					$('button[id != "stop"]').removeAttr('disabled');
				}
			);
		}
	});

	$('#ping').click(function(){
		var target_ip = $('#target_ip').val();
		if ( target_ip )
		{
			$('button').attr('disabled', true);
			$('#stop').removeAttr('disabled');
			$('#textarea').val( "" );
			current_cmd = "ping";
			//do ajax
			$.post('ping',
				{target: target_ip, pos: InterfaceFTB($('#sel_Interface').val()) },
				function(data) {
					if (data){
						alert(data);
						$('button[id != "stop"]').removeAttr('disabled');
						$('#stop').attr('disabled', true);
					}
					else
					{
						window.setTimeout("print_ping_result();", 1000);
					}
					
				}
			);
		}
		else
		{
			alert(target_warning_msg);
		}
	});

	$('#traceroute').click(function(){
		var target_ip = $('#target_ip').val();
		if ( target_ip )
		{
			$('button').attr('disabled', true);
			$('#stop').removeAttr('disabled');
			$('#textarea').val( "" );
			current_cmd = "traceroute";
			//do ajax
			$.post('traceroute',
				{target: target_ip, pos: InterfaceFTB($('#sel_Interface').val()) },
				function(data) {
					if (data){
						alert(data);
						$('button[id != "stop"]').removeAttr('disabled');
						$('#stop').attr('disabled', true);
					}
					else
					{
						window.setTimeout("print_traceroute_result();", 1000);
					}
					
				}
			);
		}
		else
		{
			alert(target_warning_msg);
		}
	});

	$('#stop').click(function(){
		if (current_cmd == "ping")
		{
			$.post('kill_ping',
				'',
				function(data) {
					if (data[0]) {
						alert(stop_cmd[0]);
						print_ping_result();
					}
					else {
						alert(data[1]);
					}
				}
			);
		}
		else if (current_cmd == "traceroute")
		{
			$.post('kill_traceroute',
				'',
				function(data) {
					if (data[0]) {
						alert(stop_cmd[1]);
						print_traceroute_result();
					}
					else {
						alert(data[1]);
					}
				}
			);
		}
	});

	InitSelection($('#sel_Interface'), vInterfaceList);

	$('button[id != "stop"]').removeAttr('disabled');
	$('#stop').attr('disabled', true);

	NotifyUser();
});
