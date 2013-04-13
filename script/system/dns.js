function Apply()
{
	var dns_data = {};
	dns_data['hostname'] = $('#host_name').val();
	dns_data['domain-name'] = $('#domain_name').val();
	dns_data['dns-server-1'] = $('#dns_server_1').val();
	dns_data['dns-server-2'] = $('#dns_server_2').val();
	$('[name="DnsSetting"]').val( JSON.stringify(dns_data) );
}

$(function(){
	NotifyUser();
	button_enable(window);
});
