function check_input(tbRule)
{
	var tdSel, tdInput;
	// Source
	tdSel = tbRule.find('td:eq(0) select');
	tdInput = tbRule.find('td:eq(1) input');
	if (check_error(tdSel, tdInput, "addr"))
		return false;
	// Destination
	tdSel = tbRule.find('td:eq(2) select');
	tdInput = tbRule.find('td:eq(3) input');
	if (check_error(tdSel, tdInput, "addr"))
		return false;
	// Service
	tdSel = tbRule.find('td:eq(4) select');
	tdInput = tbRule.find('td:eq(5) input');
	if (check_error(tdSel, tdInput, "service"))
		return false;
	// Conn/Sec
	tdInput = tbRule.find('td:eq(6) input');
	if (!tdInput.val().match(/^\d/))
	{
		show_error(tdInput);
		return false;
	}
	
	return true;
}

function set_rule(tbRule, trRule)
{
	// Translate settingtb to tr
	var tdNode, tdSel;

	// Source
	tdNode = trRule.children('td:nth-child(2)');
	tdSel = tbRule.find('td:eq(0) select').val();
	if ( tbRule.find('td:eq(1) input').attr('disabled') ){
		tdNode.text( tdSel );
	}else if ( tdSel == vFwSourceList[7] || tdSel == vFwSourceList[8] ){
		tdNode.text( tbRule.find('td:eq(1) select option:selected').text() );
	}else{
		tdNode.text( tbRule.find('td:eq(1) input').val() );
	}
	// Destination	
	tdNode = trRule.children('td:nth-child(3)');
	tdSel = tbRule.find('td:eq(2) select').val();
	if ( tbRule.find('td:eq(3) input').attr('disabled') ){
		tdNode.text( tdSel );
	}else if ( tdSel == vFwDestinationList[8] || tdSel == vFwDestinationList[9] ){
		tdNode.text( tbRule.find('td:eq(3) select option:selected').text() );
	}else{
		tdNode.text( tbRule.find('td:eq(3) input').val() );
	}
	// Service
	tdNode = trRule.children('td:nth-child(4)');
	tdSel = tbRule.find('td:eq(4) select').val();
	if ( tbRule.find('td:eq(5) input').attr('disabled') ){
		tdNode.text( tdSel );
	}else if ( tdSel == vServiceList[4] ){
		tdNode.text( tbRule.find('td:eq(5) select option:selected').text() );
	}else{
		var service = tbRule.find('td:eq(5) input').val();
		tdNode.text( HandleServiceBTF(service) );
	}
	// Conn/Sec
	trRule.children('td:nth-child(5)').text( tbRule.find('td:eq(6) input').val() );
	// Log
	if ( tbRule.find('td:eq(7) input:checked').val() ){
		trRule.children('td:nth-child(6)').attr('class', 'itemEnabled');
	}else{
		trRule.children('td:nth-child(6)').attr('class', 'itemDisabled');
	}
}

function load_rule(tbRule, trRule)
{
	add_input_node(tbRule.find('td:eq(1)'));
	add_input_node(tbRule.find('td:eq(3)'));
	add_input_node(tbRule.find('td:eq(5)'));
	//Edit mode, load tr settings
	if (trRule)
	{
		// Source
		var srcVal = trRule.find('td:eq(1)').text();
		var srcSelNode = tbRule.find('td:eq(0) select');
		var srcInputNode = tbRule.find('td:eq(1) input');
		if (srcVal.match(ipv4_addr_pattern))
		{
			srcSelNode.val( vFwSourceList[0] );
			srcInputNode.removeAttr('disabled').val( srcVal ).show();
		}
		else if (srcVal.match(ipv4_range_pattern))
		{
			srcSelNode.val( vFwSourceList[1] );
			srcInputNode.removeAttr('disabled').val( srcVal ).show();
		}
		else if (srcVal.match(ipv4_subnet_pattern))
		{
			srcSelNode.val( vFwSourceList[2] );
			srcInputNode.removeAttr('disabled').val( srcVal ).show();
		}
		else if (srcVal.match(vFwSourceList[7])) //group@
		{
			srcSelNode.val( vFwSourceList[7] );
			srcInputNode.replaceWith(gen_ipgroup_sel_node(ipgroup_list));
			tbRule.find('td:eq(1) select').val( srcVal );
		}
		else if (srcVal.match(vFwSourceList[8])) //fqdn@
		{
			srcSelNode.val( vFwSourceList[8] );
			srcInputNode.replaceWith(gen_fqdn_sel_node(fqdn_list));
			tbRule.find('td:eq(1) select').val( srcVal );
		}
		else
		{
			srcSelNode.val( srcVal );
			srcInputNode.attr('disabled', true).val('').hide();
		}
		// Destination
		var dstVal = trRule.find('td:eq(2)').text();
		var dstSelNode = tbRule.find('td:eq(2) select');
		var dstInputNode = tbRule.find('td:eq(3) input');
		if (dstVal.match(ipv4_addr_pattern))
		{
			dstSelNode.val( vFwDestinationList[0] );
			dstInputNode.removeAttr('disabled').val( dstVal ).show();
		}
		else if (dstVal.match(ipv4_range_pattern))
		{
			dstSelNode.val( vFwDestinationList[1] );
			dstInputNode.removeAttr('disabled').val( dstVal ).show();
		}
		else if (dstVal.match(ipv4_subnet_pattern))
		{
			dstSelNode.val( vFwDestinationList[2] );
			dstInputNode.removeAttr('disabled').val( dstVal ).show();
		}
		else if (dstVal.match(vFwDestinationList[8])) //group@
		{
			dstSelNode.val( vFwDestinationList[8] );
			dstInputNode.replaceWith(gen_ipgroup_sel_node(ipgroup_list));
			tbRule.find('td:eq(3) select').val( dstVal );
		}
		else if (dstVal.match(vFwDestinationList[9])) //fqdn@
		{
			dstSelNode.val( vFwDestinationList[9] );
			dstInputNode.replaceWith(gen_fqdn_sel_node(fqdn_list));
			tbRule.find('td:eq(3) select').val( dstVal );
		}
		else
		{
			dstSelNode.val( dstVal );
			dstInputNode.attr('disabled', true).val('').hide();
		}
		
		// Service
		var srvVal = trRule.find('td:eq(3)').text();
		var srvSel = tbRule.find('td:eq(4) select');
		var srvInputNode = tbRule.find('td:eq(5) input');

		var backendService = ServiceFTB(srvVal);
		if (backendService in vKnownServices)
		{
			srvSel.val( backendService );
			srvInputNode.removeAttr('disabled').val( backendService ).show();
		}
		else
		{
			var srvType = srvVal.split("@")[0] + "@";
			if (srvType == vServiceList[1]) //protocal
			{
				srvSel.val( vServiceList[1] );
				srvInputNode.removeAttr('disabled').val( srvVal ).show();
			}
			else if (srvType == vServiceList[2]) //tcp
			{
				srvSel.val( vServiceList[2] );
				srvInputNode.removeAttr('disabled').val( srvVal ).show();
			}
			else if (srvType == vServiceList[3]) //udp
			{
				srvSel.val( vServiceList[3] );
				srvInputNode.removeAttr('disabled').val( srvVal ).show();
			}
			else if (srvVal.match(vServiceList[4])) //group@
			{
				srvSel.val( vServiceList[4] );
				srvInputNode.replaceWith(gen_srvgroup_sel_node(servicegroup_list));
				tbRule.find('td:eq(5) select').val( srvVal );
			}
			else //Any
			{
				srvSel.val( vServiceList[0] );
				srvInputNode.attr('disabled', true).val('').hide();
			}
		}
		// Conn/Sec
		tbRule.find('td:eq(6) input').val( trRule.find('td:eq(4)').text() );
		// Log
		tbRule.find('td:eq(7) input').attr('checked', trRule.find('td:eq(5)').hasClass('itemEnabled')? true : false);
	}
	//Add mode, initial all settings
	else
	{
		// Source
		tbRule.find('td select:eq(0) option').get(6).selected = true;
		tbRule.find('td:eq(1) input').attr('disabled', true).val('').hide();
		// Destination
		tbRule.find('td select:eq(1) option').get(7).selected = true;
		tbRule.find('td:eq(3) input').attr('disabled', true).val('').hide();
		// Service
		tbRule.find('td select:eq(2) option').get(0).selected = true;
		tbRule.find('td:eq(5) input').attr('disabled', true).val('').hide();
		// Conn/Sec
		tbRule.find('td:eq(6) input').val( 100 );
		// Log
		tbRule.find('td:eq(7) input').attr('checked', false);
	}
}

function Apply()
{
	var connlimit_data = {};
	connlimit_data['rule'] = new Array();
	for (var i = 0; i < $('#RuleTbody tr').size(); i++)
	{
		var tmpTr = $('#RuleTbody tr').eq(i);
		connlimit_data['rule'][i] = {};
		connlimit_data['rule'][i]['source'] = AddressFTB( tmpTr.children('td:nth-child(2)').text() );
		connlimit_data['rule'][i]['destination'] = AddressFTB( tmpTr.children('td:nth-child(3)').text() );
		connlimit_data['rule'][i]['service'] = ServiceFTB( tmpTr.children('td:nth-child(4)').text() );
		connlimit_data['rule'][i]['rate'] = tmpTr.children('td:nth-child(5)').text();
		connlimit_data['rule'][i]['log'] = tmpTr.children('td:nth-child(6)').hasClass('itemEnabled')? 1:0;
	}
	$('[name="ConnlimitSetting"]').val( JSON.stringify(connlimit_data) );
}

$(function(){
	var tbConnlimitRule;

	$('#ConnlimitRuleDetail').dialog({
		autoOpen: false,
		width: 600,
	});

	$('.checkDragDrop').click(function(){
		sort_setting($(this), $('#ConnlimitRuleTable'));
	});

	$('#addRule').attr('title', ClBtnTitle[0])
		.click(function(){
			tbConnlimitRule = $('#ConnlimitRuleDetail').clone(true);
			if (tbConnlimitRule.dialog('isOpen'))
				tbConnlimitRule.dialog('close');	

			tbConnlimitRule.dialog({
				open: function(){
					load_rule($(this));
					$(this).find('tr:last').hide();
				},
				title: vSettingTbTitle[0],
				buttons: [{
					text: vSettingTbButton[0],
					click: function() {
						if (check_input($(this)))
						{
							var ConnlimitRuleSetting = $('#ConnlimitRuleSetting tr').clone(true);
							set_rule($(this), ConnlimitRuleSetting);
							ConnlimitRuleSetting.prependTo($('#RuleTbody'));
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
			})
			.dialog('open');
		});

	$('img.btnDelete').attr('title', ClBtnTitle[2])
		.click(function(){
			$(this).closest('tr').detach();
		});

	$('img.btnEdit').attr('title', ClBtnTitle[1])
		.click(function(){
			var trNode = $(this).parent().parent();
			tbConnlimitRule = $('#ConnlimitRuleDetail').clone(true);
			if (tbConnlimitRule.dialog('isOpen'))
				tbConnlimitRule.dialog('close');

			tbConnlimitRule.dialog({
				open: function(){
					load_rule($(this), trNode);
					$(this).find('tr:last').hide();
				},
				title: vSettingTbTitle[0],
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
			})
			.dialog('open');
		});

	InitSelection($('#sel_Source'), vFwSourceList);
	InitSelection($('#sel_Destination'), vFwDestinationList);
	InitServiceSelection($('#sel_Service'), vServiceList);

	if (!fqdn_list.length)
	{
		$('#sel_Source option:last').attr('disabled', 'disabled');
		$('#sel_Destination option:last').attr('disabled', 'disabled');
	}

	if (!ipgroup_list.length)
	{
		$('#sel_Source option:eq(7)').attr('disabled', 'disabled');
		$('#sel_Destination option:eq(8)').attr('disabled', 'disabled');
	}

	if (!servicegroup_list.length)
	{
		$('#sel_Service option:eq(4)').attr('disabled', 'disabled');
	}

	$('#sel_Source, #sel_Destination').change(function(){
		$(this).parent().parent().siblings('tr:last').hide();
		var srcVal = $(this).val();
		add_input_node($(this));
		var node = $(this).closest('tr').find('td input');
		switch(srcVal)
		{
			case vFwSourceList[0]:  //IP Address
				enable_sibling_input($(this), ipv4_addr_demo, true);
				break;
			case vFwSourceList[1]:  //IP Range
				enable_sibling_input($(this), ipv4_range_demo, true);
				break;
			case vFwSourceList[2]:  //Subnet
				enable_sibling_input($(this), ipv4_subnet_demo, true);
				break;
			case vFwSourceList[7]: //group@
				node.replaceWith(gen_ipgroup_sel_node(ipgroup_list));
				break;
			case vFwSourceList[8]: //fqdn@
				node.replaceWith(gen_fqdn_sel_node(fqdn_list));
				break;
			default:
				disable_sibling_input($(this), '');
				break;
		}
	});

	$('#sel_Service').change(function(){
		$(this).parent().parent().siblings('tr:last').hide();
		var serviceVal = $(this).val();
		add_input_node($(this));
		var node = $(this).closest('tr').find('td input');
		if( serviceVal == vServiceList[0] ) // Any
		{
			disable_sibling_input($(this), '');
		}
		else if ( serviceVal == vServiceList[4] ) //group@
		{
			node.replaceWith(gen_srvgroup_sel_node(servicegroup_list));
		}
		else
		{
			enable_sibling_input($(this), serviceVal, false);
		}
	});

	$('#ConnlimitRuleTable').sortable({
		axis: "y",
		containment: "parent",
		items: "tr.ConnlimitSetting"
	}).sortable('disable');
	
	//Initial connetcion limit rule table
	if (connlimit_jcfg['rule'])
	{
		for(var i = 0; i < connlimit_jcfg['rule'].length; i++)
		{
			var tmpTr = $('#ConnlimitRuleSetting tr').clone(true);
			// Source
			val = connlimit_jcfg['rule'][i]['source'];
			tmpTr.children('td:eq(1)').text( HandleAddressBTF(val, ipgroup_list, fqdn_list) );
			// Destination
			val = connlimit_jcfg['rule'][i]['destination'];
			tmpTr.children('td:eq(2)').text( HandleAddressBTF(val, ipgroup_list, fqdn_list) );
			// Service
			val = connlimit_jcfg['rule'][i]['service'];
			tmpTr.children('td:eq(3)').text( HandleServiceBTF(val, servicegroup_list) );
			// Conn/Sec
			tmpTr.children('td:eq(4)').text( connlimit_jcfg['rule'][i]['rate'] );
			// Log
			connlimit_jcfg['rule'][i]['log']?
				tmpTr.children('td:eq(5)').attr('class', 'itemEnabled') :
				tmpTr.children('td:eq(5)').attr('class', 'itemDisabled');

			tmpTr.appendTo($('#RuleTbody'));
		}
	}

	NotifyUser();

	button_enable(window);
});
