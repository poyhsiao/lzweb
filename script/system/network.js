var CurrentWan;
var InitArr = new Array();

function ShowWanType( node )
{
	if (node.val() == vWanTypeList[0]) //Static
	{
		node.closest('div.wan_basic_subnet').siblings('div.static').show();
		node.closest('div.wan_basic_subnet').siblings('div.pppoe').hide();
		node.closest('div.wan_basic_subnet').siblings('br:eq(1)').show();
		//public ip passthrough
		node.closest('div.wan_basic_subnet').siblings('div.public_ip_passthrough').find('tr:first').hide();
	}
	else if(node.val() == vWanTypeList[1]) //PPPoE
	{
		node.closest('div.wan_basic_subnet').siblings('div.static').hide();
		node.closest('div.wan_basic_subnet').siblings('div.pppoe').show();
		node.closest('div.wan_basic_subnet').siblings('br:eq(1)').show();
		//public ip passthrough
		node.closest('div.wan_basic_subnet').siblings('div.public_ip_passthrough').find('tr:first').show();
	}
	else //DHCP
	{
		node.closest('div.wan_basic_subnet').siblings('div.static').hide();
		node.closest('div.wan_basic_subnet').siblings('div.pppoe').hide();
		node.closest('div.wan_basic_subnet').siblings('br:eq(1)').hide();
		//public ip passthrough
		node.closest('div.wan_basic_subnet').siblings('div.public_ip_passthrough').find('tr:first').hide();
	}
}

function ShowWanSetting( index )
{
	var wanidx = "wan" + index;
	var wan_jcfg = network_jcfg[wanidx];
	var oSheet, i, tmpTr;

	oSheet = $('#oSheetTemplate').clone(true);
	oSheet.attr('id', wanidx);

	oSheet.find('table.wan_static_settings').sortable({
		axis: "y",
		containment: "parent",
		items: "tr.WanPrototypeTr"
	}).sortable('disable');
	
	oSheet.find('table.public_ip_passthrough_settings').sortable({
		axis: "y",
		containment: "parent",
		items: "tr.WanPrototypeTr"
	}).sortable('disable');

	//WAN Ethernet
	// Clone MAC	
	oSheet.find('div.ethernet input:first').val( wan_jcfg['ethernet']['clone-mac'] );
	// MTU
	if ( wan_jcfg['ethernet']['mtu'] >= 0 )
		oSheet.find('div.ethernet input:eq(1)').val( wan_jcfg['ethernet']['mtu'] );
	else
		oSheet.find('div.ethernet input:eq(1)').val( 1500 );
	// Speed/Duplex
		oSheet.find('div.ethernet select:first').val( SpeedDuplexBTF(wan_jcfg['ethernet']['speed-duplex']) );

	//Basic Subnet
	// Enable
	if ( wan_jcfg['enable'] )
		oSheet.find('td.toggle_enable').addClass('itemEnabled');
	else
		oSheet.find('td.toggle_enable').addClass('itemDisabled');
	// Lable
	oSheet.find('div.wan_basic_subnet input:first').val( wan_jcfg['label'] );
	// Type
	oSheet.find('div.wan_basic_subnet select:first').val( WanTypeBTF(wan_jcfg['type']) );
	ShowWanType( oSheet.find('div.wan_basic_subnet select:first') );
	// Downstream
	oSheet.find('div.wan_basic_subnet input:eq(1)').val( wan_jcfg['downstream'] );
	// Upstream
	oSheet.find('div.wan_basic_subnet input:eq(2)').val( wan_jcfg['upstream'] );

	//Static
	if (wan_jcfg['static-mode'])
	{
		// Gateway
		oSheet.find('div.static input:first').val( wan_jcfg['static-mode']['gateway'] );
		// Netmask
		oSheet.find('div.static input:eq(1)').val( wan_jcfg['static-mode']['mask'] );
		// IP Address/Range
		if (wan_jcfg['static-mode']['ip'])
		{
			var Tbody = oSheet.find('tbody[name="WanStaticTbody"]');
			for (i = 0; i < wan_jcfg['static-mode']['ip'].length; i++)
			{
				tmpTr = $('#WanPrototypeSetting tr:first').clone(true);
				tmpTr.find('input:first').val( wan_jcfg['static-mode']['ip'][i]);
				tmpTr.appendTo(Tbody);
			}
		}
	}
	// PPPoE
	if (wan_jcfg['pppoe-mode'])
	{
		oSheet.find('div.pppoe input:first').val( wan_jcfg['pppoe-mode']['username'] );
		oSheet.find('div.pppoe input:eq(1)').val( wan_jcfg['pppoe-mode']['password'] );
		oSheet.find('div.pppoe input:eq(2)').val( wan_jcfg['pppoe-mode']['service-name'] );
		oSheet.find('div.pppoe input:eq(3)').val( wan_jcfg['pppoe-mode']['ip'] );
		oSheet.find('div.pppoe input:eq(4)').val( wan_jcfg['pppoe-mode']['daily-redial'] );
	}

	//Public IP Passthrough
	if (wan_jcfg['public-ip-passthrough'])
	{
		oSheet.find('div.public_ip_passthrough input:first').val( wan_jcfg['public-ip-passthrough']['mask'] );
		var Tbody = oSheet.find('tbody[name="PublicIPPassthroughTbody"]');
		if (wan_jcfg['public-ip-passthrough']['ip'])
		{
			for (i = 0; i < wan_jcfg['public-ip-passthrough']['ip'].length; i++)
			{
				tmpTr = $('#WanPrototypeSetting tr:first').clone(true);
				tmpTr.find('input:first').val( wan_jcfg['public-ip-passthrough']['ip'][i]);
				tmpTr.appendTo(Tbody);
			}
		}
	}
	
	oSheet.appendTo($('div#WanSheet'));

	var sheetObj = new Array();
	sheetObj.push( oSheet );
	sheetObj.push( index );
	InitArr.push( sheetObj );
}

function Show3GSetting( index )
{
	var oSheet;
	var wanidx = "wan" + index;
	var wan_jcfg = network_jcfg[wanidx];
	var wusb_jcfg = usb_jcfg[wanidx];
	
	oSheet = $('#o3GTemplate').clone(true);
	oSheet.attr('id', wanidx);
	
	// 3G status
	var quality = wusb_jcfg['quailty'];
	oSheet.find('div.3g_status td:first').text( wusb_jcfg['status'] );
	oSheet.find('div.3g_status td:eq(1)').text( wusb_jcfg['brandmodel'] );
	oSheet.find('div.3g_status td:eq(2)').text( wusb_jcfg['operator'] );
	oSheet.find('div.3g_status td:eq(3)').text( wusb_jcfg['mode'] );
	if (quality){
		if( quality <= 1 )
			oSheet.find('div.3g_status td:eq(4)').html('<img class="btnStyle" src="/image/signal-0.gif">');
		else if ( 2 <= quality && quality <= 3 )
			oSheet.find('div.3g_status td:eq(4)').html('<img class="btnStyle" src="/image/signal-1.gif">');
		else if ( 4 <= quality && quality <= 8 )
			oSheet.find('div.3g_status td:eq(4)').html('<img class="btnStyle" src="/image/signal-2.gif">');
		else if ( 9 <= quality && quality <= 14 )
			oSheet.find('div.3g_status td:eq(4)').html('<img class="btnStyle" src="/image/signal-3.gif">');
		else if ( 15 <= quality ) 
			oSheet.find('div.3g_status td:eq(4)').html('<img class="btnStyle" src="/image/signal-4.gif">');
	}
	
	// Enable	
	if ( wan_jcfg['enable'] )
		oSheet.find('td.toggle_enable').addClass('itemEnabled');
	else
		oSheet.find('td.toggle_enable').addClass('itemDisabled');
	// Lable
	oSheet.find('div.wan_basic_subnet input:first').val( wan_jcfg['label'] );
	// Downstream
	oSheet.find('div.wan_basic_subnet input:eq(1)').val( wan_jcfg['downstream'] );
	// Upstream
	oSheet.find('div.wan_basic_subnet input:eq(2)').val( wan_jcfg['upstream'] );
	
	// PIN
	oSheet.find('div.usb input:first').val( wan_jcfg['pin'] );
	// APN
	oSheet.find('div.usb input:eq(1)').val( wan_jcfg['apn'] );
	// Dial Number
	oSheet.find('div.usb input:eq(2)').val( wan_jcfg['dial'] );
	// User Name
	oSheet.find('div.usb input:eq(3)').val( wan_jcfg['username'] );
	// Password
	oSheet.find('div.usb input:eq(4)').val( wan_jcfg['password'] );
	// MTU
	if ( wan_jcfg['mtu'] >= 0 )
		oSheet.find('div.usb input:eq(5)').val( wan_jcfg['mtu'] );
	else
		oSheet.find('div.usb input:eq(5)').val( 1500 );
	
	oSheet.appendTo($('div#WanSheet'));
	
	var sheetObj = new Array();
	sheetObj.push( oSheet );
	sheetObj.push( index );
	InitArr.push( sheetObj );
}

function set_content()
{
	$('#WanSheet').show();
	$('#DmzSheet').hide();
	$('#LanSheet').hide();
}

function Apply()
{
	var network_data = {};
	var i, j, k;
	//------------------------------WAN------------------------------
	var oSheet, Tbody;
	var wan_index = $('#sel_wan option').size();
	for(i = 1; i <= wan_index; i++)
	{
		var wanidx = "wan" + i;
		network_data[wanidx] = {};
		var has = 1;
		for(j = 0; j < InitArr.length; j++)
		{
			// for normal WAN
			if( i == InitArr[j][1] && i <= wan_num )
			{
				oSheet = InitArr[j][0];
				//Ethernet
				network_data[wanidx]['ethernet'] = {};
				network_data[wanidx]['ethernet']['clone-mac'] = oSheet.find('div.ethernet input:first').val();
				network_data[wanidx]['ethernet']['mtu'] = oSheet.find('div.ethernet input:eq(1)').val();
				network_data[wanidx]['ethernet']['speed-duplex'] = SpeedDuplexFTB(oSheet.find('div.ethernet select:first').val());
	
				//Basic Subnet
				network_data[wanidx]['enable'] = oSheet.find('div.wan_basic_subnet td:first').hasClass('itemEnabled')? 1 : 0;
				network_data[wanidx]['label'] = oSheet.find('div.wan_basic_subnet input:first').val();
				network_data[wanidx]['type'] = WanTypeFTB(oSheet.find('div.wan_basic_subnet select.wan_type').val());
				network_data[wanidx]['downstream'] = oSheet.find('div.wan_basic_subnet input:eq(1)').val();
				network_data[wanidx]['upstream'] = oSheet.find('div.wan_basic_subnet input:eq(2)').val();

				//Static Type
				network_data[wanidx]['static-mode'] = {};
				network_data[wanidx]['static-mode']['gateway'] = oSheet.find('div.static input:first').val();
				network_data[wanidx]['static-mode']['mask'] = oSheet.find('div.static input:eq(1)').val();
				Tbody = oSheet.find('tbody[name="WanStaticTbody"] tr');
				if( Tbody.size() )
				{
					network_data[wanidx]['static-mode']['ip'] = new Array();
					for(k = 0; k < Tbody.size(); k++)
					{
						network_data[wanidx]['static-mode']['ip'][k] = Tbody.eq(k).find('input:first').val();
					}
				}

				//PPPoE Type
				network_data[wanidx]['pppoe-mode'] = {};
				network_data[wanidx]['pppoe-mode']['username'] = oSheet.find('div.pppoe input:first').val();
				network_data[wanidx]['pppoe-mode']['password'] = oSheet.find('div.pppoe input:eq(1)').val();
				network_data[wanidx]['pppoe-mode']['service-name'] = oSheet.find('div.pppoe input:eq(2)').val();
				network_data[wanidx]['pppoe-mode']['ip'] = oSheet.find('div.pppoe input:eq(3)').val();
				network_data[wanidx]['pppoe-mode']['daily-redial'] = oSheet.find('div.pppoe input:eq(4)').val();

				//Public IP Passthrough
				network_data[wanidx]['public-ip-passthrough'] = {};
				network_data[wanidx]['public-ip-passthrough']['mask'] = oSheet.find('div.public_ip_passthrough input:first').val(); 
				Tbody = oSheet.find('tbody[name="PublicIPPassthroughTbody"] tr');
				if( Tbody.size() )
				{
					network_data[wanidx]['public-ip-passthrough']['ip'] = new Array();
					for(k = 0; k < Tbody.size(); k++)
					{
						network_data[wanidx]['public-ip-passthrough']['ip'][k] = Tbody.eq(k).find('input:first').val();
					}
				}
				has = 0;
				break;
			}
			// for USB WAN
			if( i == InitArr[j][1] && i > wan_num && i <= wan_num+usb_num )
			{
				oSheet = InitArr[j][0];
				//Basic Settings
				network_data[wanidx]['enable'] = oSheet.find('div.wan_basic_subnet td:first').hasClass('itemEnabled')? 1 : 0;
				network_data[wanidx]['label'] = oSheet.find('div.wan_basic_subnet input:first').val();
				network_data[wanidx]['downstream'] = oSheet.find('div.wan_basic_subnet input:eq(1)').val();
				network_data[wanidx]['upstream'] = oSheet.find('div.wan_basic_subnet input:eq(2)').val();
				// Modem Settings
				network_data[wanidx]['pin'] = oSheet.find('div.usb input:first').val();
				network_data[wanidx]['apn'] = oSheet.find('div.usb input:eq(1)').val();
				network_data[wanidx]['dial'] = oSheet.find('div.usb input:eq(2)').val();
				network_data[wanidx]['username'] = oSheet.find('div.usb input:eq(3)').val();
				network_data[wanidx]['password'] = oSheet.find('div.usb input:eq(4)').val();
				network_data[wanidx]['mtu'] = oSheet.find('div.usb input:eq(5)').val();
				has = 0;
				break;
			}
		}
		if (has) //not show in UI, but has in cfg
		{
			network_data[wanidx] = network_jcfg[wanidx];
		}
	}
	//------------------------------DMZ------------------------------
	//Ethernet
	network_data['dmz'] = {};
	network_data['dmz']['ethernet'] = {};
	network_data['dmz']['ethernet']['clone-mac'] = $('#DmzSheet div.ethernet input:first').val();
	network_data['dmz']['ethernet']['mtu'] = $('#DmzSheet div.ethernet input:eq(1)').val();
	network_data['dmz']['ethernet']['speed-duplex'] = SpeedDuplexFTB($('#DmzSheet div.ethernet select:first').val());

	//Basic Subnet
	Tbody = $('#DmzSheet tbody[name="BasicSubnetTbody"] tr');
	if( Tbody.size() )
	{
		network_data['dmz']['basic-subnet'] = new Array();
		for(k = 0; k < Tbody.size(); k++)
		{
			network_data['dmz']['basic-subnet'][k] = {};
			network_data['dmz']['basic-subnet'][k]['ip'] = Tbody.eq(k).find('input:first').val();
			network_data['dmz']['basic-subnet'][k]['mask'] = Tbody.eq(k).find('input:eq(1)').val();
		}
	}

	//Static Routing Subnet
	Tbody = $('#DmzSheet tbody[name="StaticRoutingSubnetTbody"] tr');
	if( Tbody.size() )
	{
		network_data['dmz']['static-route'] = new Array();
		for(k = 0; k < Tbody.size(); k++)
		{
			network_data['dmz']['static-route'][k] = {};
			network_data['dmz']['static-route'][k]['subnet'] = Tbody.eq(k).find('input:first').val();
			network_data['dmz']['static-route'][k]['gateway'] = Tbody.eq(k).find('input:eq(1)').val();
		}
	}
	//------------------------------LAN------------------------------
	//Ethernet
	network_data['lan'] = {};
	network_data['lan']['ethernet'] = {};
	network_data['lan']['ethernet']['clone-mac'] = $('#LanSheet div.ethernet input:first').val();
	network_data['lan']['ethernet']['mtu'] = $('#LanSheet div.ethernet input:eq(1)').val();
	network_data['lan']['ethernet']['speed-duplex'] = SpeedDuplexFTB($('#LanSheet div.ethernet select:first').val());

	//Basic Subnet
	Tbody = $('#LanSheet tbody[name="BasicSubnetTbody"] tr');
	if( Tbody.size() )
	{
		network_data['lan']['basic-subnet'] = new Array();
		for(k = 0; k < Tbody.size(); k++)
		{
			network_data['lan']['basic-subnet'][k] = {};
			network_data['lan']['basic-subnet'][k]['ip'] = Tbody.eq(k).find('input:first').val();
			network_data['lan']['basic-subnet'][k]['mask'] = Tbody.eq(k).find('input:eq(1)').val();
		}
	}

	//Static Routing Subnet
	Tbody = $('#LanSheet tbody[name="StaticRoutingSubnetTbody"] tr');
	if( Tbody.size() )
	{
		network_data['lan']['static-route'] = new Array();
		for(k = 0; k < Tbody.size(); k++)
		{
			network_data['lan']['static-route'][k] = {};
			network_data['lan']['static-route'][k]['subnet'] = Tbody.eq(k).find('input:first').val();
			network_data['lan']['static-route'][k]['gateway'] = Tbody.eq(k).find('input:eq(1)').val();
		}
	}

	$('[name="NetworkSetting"]').val( JSON.stringify(network_data) );
}

$(function(){
	var i, tmpTr;
	CurrentWan = 1;

	InitSelection($('.speed_duplex'), vSpeedDuplexList);
	InitSelection($('.wan_type'), vWanTypeList);

	// WAN
	$('.checkDragDrop2').click(function(){
		sort_setting($(this), $(this).closest('table'));
	});

	// DMZ/LAN
	$('.checkDragDrop').click(function(){
		sort_setting($(this), $(this).closest('div.table_div').find('table'));
	});

	//------------------------------WAN------------------------------
	$('#sel_wan').change(function(){
		for ( var i = 0; i < InitArr.length; i++ )
		{
			InitArr[i][0].hide();
		}
		for ( var i=0; i < InitArr.length; i++ )
		{
			if( $(this).val() == InitArr[i][1] )
			{
				InitArr[i][0].show();
				CurrentWan = InitArr[i][1];
				return;
			}
		}

		if ( $(this).val() > wan_num){
			Show3GSetting( $(this).val() );
		}else{
			ShowWanSetting( $(this).val() );
		}
		
		InitArr[InitArr.length-1][0].show();
		CurrentLink = InitArr[InitArr.length-1][1];
	});

	$('.toggle_enable').click(function(){
		ToggleEnable($(this));
	});

	$('.wan_type').change(function(){
		ShowWanType($(this));
	});

	$('.addWanStaticIP').click(function(){
		var Tbody = $(this).closest('thead').siblings('tbody');
		$('#WanPrototypeSetting tr:first').clone(true).prependTo(Tbody);
	});

	$('th.addPublicIpPassthrough').click(function(){
		var Tbody = $(this).closest('thead').siblings('tbody');
		$('#WanPrototypeSetting tr:first').clone(true).prependTo(Tbody);
	});

	$('img.btnWanAdd').click(function(){
		$('#WanPrototypeSetting tr:first').clone(true).insertAfter($(this).closest('tr'));
	});

	$('img.btnDelete').click(function(){
		$(this).closest('tr').detach();
	});

	//Initial WAN Settings
	ShowWanSetting( CurrentWan );

	//------------------------------DMZ------------------------------
	$('#DmzSheet div.basic_subnet table').sortable({
		axis: "y",
		containment: "parent",
		items: "tr.PrototypeTr"
	}).sortable('disable');
	
	$('#DmzSheet div.static_routing_subnet table').sortable({
		axis: "y",
		containment: "parent",
		items: "tr.PrototypeTr"
	}).sortable('disable');

	$('th.addBasicSubnet, th.addStaticRoutingSubnet').click(function(){
		var Tbody = $(this).closest('thead').siblings('tbody');
		$('#PrototypeSetting tr').clone(true).prependTo(Tbody);
	});

	$('img.btnAdd').click(function(){
		$('#PrototypeSetting tr').clone(true).insertAfter($(this).closest('tr'));;
	})

	//Initial DMZ Settings
	var dmz_jcfg = network_jcfg['dmz'];
	//DMZ Ethernet
	// Clone MAC
	$('#DmzSheet div.ethernet input:first').val( dmz_jcfg['ethernet']['clone-mac'] );
	// MTU
	if ( dmz_jcfg['ethernet']['mtu'] >= 0 )
		$('#DmzSheet div.ethernet input:eq(1)').val( dmz_jcfg['ethernet']['mtu'] );
	else
		$('#DmzSheet div.ethernet input:eq(1)').val( 1500 );
	// Speed/Duplex
		$('#DmzSheet div.ethernet select:first').val( SpeedDuplexBTF(dmz_jcfg['ethernet']['speed-duplex']) );

	//DMZ Basic Subnet
	if (dmz_jcfg['basic-subnet'])
	{
		var Tbody = $('#DmzSheet tbody[name="BasicSubnetTbody"]');
		for (i = 0; i < dmz_jcfg['basic-subnet'].length; i++)
		{
			tmpTr = $('#PrototypeSetting tr').clone(true);
			tmpTr.find('input:first').val( dmz_jcfg['basic-subnet'][i]['ip'] );
			tmpTr.find('input:eq(1)').val( dmz_jcfg['basic-subnet'][i]['mask'] );
			tmpTr.appendTo(Tbody);
		}
	}

	//DMZ Static Routing Subnet
	if (dmz_jcfg['static-route'])
	{
		var Tbody = $('#DmzSheet tbody[name="StaticRoutingSubnetTbody"]');
		for (i = 0; i < dmz_jcfg['static-route'].length; i++)
		{
			tmpTr = $('#PrototypeSetting tr').clone(true);
			tmpTr.find('input:first').val( dmz_jcfg['static-route'][i]['subnet'] );
			tmpTr.find('input:eq(1)').val( dmz_jcfg['static-route'][i]['gateway'] );
			tmpTr.appendTo(Tbody);
		}
	}
	//------------------------------LAN------------------------------
	$('#LanSheet div.basic_subnet table').sortable({
		axis: "y",
		containment: "parent",
		items: "tr.PrototypeTr"
	}).sortable('disable');
	
	$('#LanSheet div.static_routing_subnet table').sortable({
		axis: "y",
		containment: "parent",
		items: "tr.PrototypeTr"
	}).sortable('disable');

	//Initial LAN Settings
	var lan_jcfg = network_jcfg['lan']
	//LAN Ethernet
	// Clone MAC
	$('#LanSheet div.ethernet input:first').val( lan_jcfg['ethernet']['clone-mac'] );
	// MTU
	if ( lan_jcfg['ethernet']['mtu'] >= 0 )
		$('#LanSheet div.ethernet input:eq(1)').val( lan_jcfg['ethernet']['mtu'] );
	else
		$('#LanSheet div.ethernet input:eq(1)').val( 1500 );
	// Speed/Duplex
		$('#LanSheet div.ethernet select:first').val( SpeedDuplexBTF(lan_jcfg['ethernet']['speed-duplex']) );

	//LAN Basic Subnet
	if (lan_jcfg['basic-subnet'])
	{
		var Tbody = $('#LanSheet tbody[name="BasicSubnetTbody"]');
		for (i = 0; i < lan_jcfg['basic-subnet'].length; i++)
		{
			tmpTr = $('#PrototypeSetting tr').clone(true);
			tmpTr.find('input:first').val( lan_jcfg['basic-subnet'][i]['ip'] );
			tmpTr.find('input:eq(1)').val( lan_jcfg['basic-subnet'][i]['mask'] );
			tmpTr.appendTo(Tbody);
		}
	}

	//LAN Static Routing Subnet
	if (lan_jcfg['static-route'])
	{
		var Tbody = $('#LanSheet tbody[name="StaticRoutingSubnetTbody"]');
		for (i = 0; i < lan_jcfg['static-route'].length; i++)
		{
			tmpTr = $('#PrototypeSetting tr').clone(true);
			tmpTr.find('input:first').val( lan_jcfg['static-route'][i]['subnet'] );
			tmpTr.find('input:eq(1)').val( lan_jcfg['static-route'][i]['gateway'] );
			tmpTr.appendTo(Tbody);
		}
	}

	set_content();

	//For reload, set tabs
	setTimeout('parent.document.getElementById("HeaderFrame").contentWindow.set_tabs(0)', 200);

	NotifyUser();

	button_enable(window);
});
