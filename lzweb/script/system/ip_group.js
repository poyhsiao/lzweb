var CurrentGroup;
var InitArr = new Array();

function check_input(tbRule)
{
	var value;
	if ( tbRule.find('td select:eq(0)').val() == vIpGroupAddrList[3] )
		value = tbRule.find('td select:eq(1) option:selected').text();
	else
		value = tbRule.find('td input:eq(0)').val();

	if( value = "" || !check_addr(tbRule.find('td select:eq(0)'), value) )
	{
		show_error(tbRule.find('td input:eq(0)'));
		return false;
	}

	return true;
}

function set_rule(tbRule, trRule)
{
	// Translate settingtb to tr
	// No input
	if ( tbRule.find('td input:eq(0)').attr('disabled') ){
		trRule.children('td:nth-child(2)').text( tbRule.find('td select:eq(0)').val() );
	}else if( tbRule.find('td select:eq(0)').val() == vIpGroupAddrList[3] ){ // FQDN
		trRule.children('td:nth-child(2)').text( tbRule.find('td select:eq(1) option:selected').text() );
	}
	else{ // IP Address/IP Range/Subnet
		trRule.children('td:nth-child(2)').text( tbRule.find('td input:eq(0)').val() );
	};
}

function load_rule(tbRule, trRule)
{
	add_input_node(tbRule.find('td:eq(1)'));
	//Edit mode, load tr settings
	if (trRule)
	{
		//IP Address
		var addrVal = trRule.find('td:eq(1)').text();
		var addrSelNode = tbRule.find('td select:eq(0)');
		var addrInputNode = tbRule.find('td input:eq(0)');
		if (addrVal.match(ipv4_addr_pattern))
		{
			addrSelNode.val( vIpGroupAddrList[0] );
			addrInputNode.removeAttr('disabled').val( addrVal ).show();
		}
		else if (addrVal.match(ipv4_range_pattern))
		{
			addrSelNode.val( vIpGroupAddrList[1] );
			addrInputNode.removeAttr('disabled').val( addrVal ).show();
		}
		else if (addrVal.match(ipv4_subnet_pattern))
		{
			addrSelNode.val( vIpGroupAddrList[2] );
			addrInputNode.removeAttr('disabled').val( addrVal ).show();
		}
		else if (addrVal.match(vIpGroupAddrList[3]))
		{
			addrSelNode.val( vIpGroupAddrList[3] );
			addrInputNode.replaceWith(gen_fqdn_sel_node(fqdn_list));
			tbRule.find('td select:eq(1)').val( addrVal );
		}
		else
		{
			addrSelNode.val( addrVal );
			addrInputNode.attr('disabled', true).val('').hide();
		}
	}
	//Add mode, initial all settings
	else
	{
		//IP Address
		tbRule.find('td select:eq(0) option').get(0).selected = true;
		enable_sibling_input(tbRule.find('td:eq(1)'), ipv4_addr_demo, true);
	}
}

function ShowIpGroupSetting( index )
{
	var groupidx = "group" + index;
	var jcfgidx = index - 1;

	oSheet = $('#oSheetTemp').clone(true);
	oSheet.attr('id', groupidx);

	oSheet.find('table.IpgroupTb').sortable({
		axis: "y",
		containment: "parent",
		items: "tr.IpAddrSettingTr"
	}).sortable('disable');

	// IP Address Rule table
	if ( ipgroup_jcfg['group'][jcfgidx] )
	{
		var label = htmlspecialchars_decode(ipgroup_jcfg['group'][jcfgidx]['label']);
		oSheet.find('input:first').val( label );
		for(var i = 0; i < ipgroup_jcfg['group'][jcfgidx]['ip'].length; i++)
		{
			var tmpTr = $('#IpAddrSetting tr').clone(true);
			var ip = ipgroup_jcfg['group'][jcfgidx]['ip'][i];
			if (ip.match(/^fqdn@[\d]/))
			{
				var idx = ip.split('@')[1];
				
				ip = GroupBTF(ip, fqdn_list[idx-1]);
			}
			else
				ip = AddressBTF(ip);
				
			tmpTr.find('td:last').text( ip );
			oSheet.find('tbody').append(tmpTr);
		}
	}
	oSheet.appendTo($(document.body));

	var sheetObj = new Array();
	sheetObj.push( oSheet );
	sheetObj.push( index );
	InitArr.push( sheetObj );
}

function Apply()
{
	var ipgroup_data = {};
	var group_size = $('#sel_group option').size();
	var oSheet;
	ipgroup_data['group'] = new Array();
	for (var i = 0; i < group_size; i++)
	{
		var has = 1;
		var group_idx = i+1;
		ipgroup_data['group'][i] = {};
		for(var j = 0; j < InitArr.length; j++)
		{
			if( group_idx == InitArr[j][1] )
			{
				oSheet = InitArr[j][0];
				ipgroup_data['group'][i]['label'] = oSheet.find('td input:eq(0)').val();
				ipgroup_data['group'][i]['ip'] = new Array();
				var IpTbody = oSheet.find('tbody tr');
				if (IpTbody.size())
				{
					for (var k = 0; k < IpTbody.size(); k++)
					{
						var TdVal = IpTbody.eq(k).find('td:last').text();
						ipgroup_data['group'][i]['ip'][k] = AddressFTB( TdVal );
					}
				}
				has = 0;
				break;
			}
		}
		if (has) //not show in UI, but has in cfg
		{
			if (ipgroup_jcfg['group'][i] != null)
			{
				ipgroup_data['group'][i]['label'] = ipgroup_jcfg['group'][i]['label'];
				ipgroup_data['group'][i]['ip'] = ipgroup_jcfg['group'][i]['ip'];
			}
		}
	}
	$('[name="IpgroupSetting"]').val( JSON.stringify(ipgroup_data) );
}

$(function(){
	CurrentGroup = 1;

	$('#IpAddrRule').dialog({
		autoOpen: false,
		width: 550,
	});

	$('.checkDragDrop').click(function(){
		sort_setting($(this), $(this).closest('div.table_div').find('table.IpgroupTb'));
	});

	$('th.addIpGroup').click(function(){
		var Tbody = $(this).closest('thead').siblings('tbody');
		tbIpAddrRule = $('#IpAddrRule').clone(true);
		if (tbIpAddrRule.dialog('isOpen'))
			tbIpAddrRule.dialog('close');

		tbIpAddrRule.dialog({
			open: function(){
				load_rule($(this));
				$(this).find('tr:last').hide();
			},
			close: function(){
				$(this).find('td:eq(1)').empty();
			},
			title: vSettingTbTitle[0],
			buttons: [{
				text: vSettingTbButton[0],
				click: function() {
					if (check_input($(this)))
					{
						var IpAddrSettingTr = $('#IpAddrSetting tr').clone(true);
						set_rule($(this), IpAddrSettingTr);
						IpAddrSettingTr.prependTo(Tbody);
						$(this).dialog('close');
					}
					else
					{
						$(this).find('tr:last').show()
							.find('td').text(invalid_msg[0]);
					}
				}
			},
			{
				text: vSettingTbButton[1],
				click: function() {
					$(this).dialog('close');
				}
			}]
		})
		.dialog('open');
	});

	$('img.btnDelete').click(function(){
		$(this).closest('tr').detach();
	});

	$('img.btnEdit').click(function(){
		var trNode = $(this).parent().parent();
		tbIpAddrRule = $('#IpAddrRule').clone(true);
		if (tbIpAddrRule.dialog('isOpen'))
			tbIpAddrRule.dialog('close');

		tbIpAddrRule.dialog({
			open: function(){
				load_rule($(this), trNode);
				$(this).find('tr:last').hide();
			},
			close: function(){
				$(this).find('td:eq(1)').empty();
			},
			title: vSettingTbTitle[1],
			buttons: [{
				text: vSettingTbButton[0],
				click: function(){
					if (check_input($(this)))
					{
						set_rule($(this), trNode);
						$(this).dialog("close");
					}
					else
					{
						$(this).find('tr:last').show()
							.find('td').text(invalid_msg[0]);
					}
				}
			},
			{
				text: vSettingTbButton[1],
				click: function() {
					$(this).dialog('close');
				}
			}]
		}).dialog('open');
	});

	InitSelection($('#sel_addr'), vIpGroupAddrList);
	if (!fqdn_list.length)
	{
		$('#sel_addr option:last').attr('disabled', 'disabled');
	}

	$('#sel_addr').change(function(){
		$(this).parent().parent().siblings('tr:last').hide();
		var addrVal = $(this).val();
		add_input_node($(this));
		switch(addrVal)
		{
			case vIpGroupAddrList[0]:  //IP Address
				enable_sibling_input($(this), ipv4_addr_demo, true);
				break;
			case vIpGroupAddrList[1]:  //IP Range
				enable_sibling_input($(this), ipv4_range_demo, true);
				break;
			case vIpGroupAddrList[2]:  //Subnet
				enable_sibling_input($(this), ipv4_subnet_demo, true);
				break;
			case vIpGroupAddrList[3]:  //FQDN
				var node = $(this).closest('tr').find('td input');
				node.replaceWith(gen_fqdn_sel_node(fqdn_list));
				break;
		}
	});

	$('#sel_group').change(function(){
		for( var i = 0; i < InitArr.length; i++ )
		{
			InitArr[i][0].hide();
		}
		for( var i=0; i < InitArr.length; i++ )
		{
			if( $(this).val() == InitArr[i][1] )
			{
				InitArr[i][0].show();
				CurrentGroup = InitArr[i][1];
				return;
			}
		}
		ShowIpGroupSetting( $(this).val() );
		InitArr[InitArr.length-1][0].show();
		CurrentGroup = InitArr[InitArr.length-1][1];
	}).val( CurrentGroup );

	// Initial IP Group Setting
	ShowIpGroupSetting( CurrentGroup );	

	NotifyUser();

	button_enable(window);
});
