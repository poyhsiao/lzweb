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
	// Action
	trRule.children('td:nth-child(5)').text( tbRule.find('td:eq(6) select').val() );
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

		// Action
		tbRule.find('td:eq(6) select').val( trRule.find('td:eq(4)').text() );
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
		// Action
		tbRule.find('td:eq(6) select option').get(0).selected = true;
		// Log
		tbRule.find('td:eq(7) input').attr('checked', false);
	}
}

function Apply()
{
	var fw_data = {};
	fw_data['rule'] = new Array();
	for (var i = 0; i < $('#RuleTbody tr').size(); i++)
	{
		var tmpTr = $('#RuleTbody tr').eq(i);
		if (!tmpTr.hasClass('DefaultRule'))
		{
			fw_data['rule'][i] = {};
			fw_data['rule'][i]['source'] = AddressFTB( tmpTr.children('td:nth-child(2)').text() );
			fw_data['rule'][i]['destination'] = AddressFTB( tmpTr.children('td:nth-child(3)').text() );
			fw_data['rule'][i]['service'] = ServiceFTB( tmpTr.children('td:nth-child(4)').text() );
			fw_data['rule'][i]['action'] = ActionFTB( tmpTr.children('td:nth-child(5)').text() );
			fw_data['rule'][i]['log'] = tmpTr.children('td:nth-child(6)').hasClass('itemEnabled')? 1:0;
		}
	}
	$('[name="FirewallSetting"]').val( JSON.stringify(fw_data) );
}

$(function(){
	var tbFwRule;

	$('#FwRuleDetail').dialog({
		autoOpen: false,
		width: 600,
	});

	$('.checkDragDrop').click(function(){
		sort_setting($(this), $('#FwRuleTable'));
	});

	$('#addRule').attr('title', FwBtnTitle[0])
		.click(function(){
			tbFwRule = $('#FwRuleDetail').clone(true);
			if (tbFwRule.dialog('isOpen'))
				tbFwRule.dialog('close');	

			tbFwRule.dialog({
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
							var FwRuleSetting = $('#FwRuleSetting tr').clone(true);
							set_rule($(this), FwRuleSetting);
							FwRuleSetting.prependTo($('#RuleTbody'));
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

	$('img.btnDelete').attr('title', FwBtnTitle[2])
		.click(function(){
			$(this).closest('tr').detach();
		});

	$('img.btnEdit').attr('title', FwBtnTitle[1])
		.click(function(){
			var trNode = $(this).parent().parent();
			tbFwRule = $('#FwRuleDetail').clone(true);
			if (tbFwRule.dialog('isOpen'))
				tbFwRule.dialog('close');

			tbFwRule.dialog({
				open: function(){
					load_rule($(this), trNode);
					$(this).find('tr:last').hide();
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
			})
			.dialog('open');
		});

	InitSelection($('#sel_Source'), vFwSourceList);
	InitSelection($('#sel_Destination'), vFwDestinationList);
	InitSelection($('#sel_Action'), vActionList);
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

	$('#FwRuleTable').sortable({
		axis: "y",
		containment: "parent",
		items: "tr.FwSetting"
	}).sortable('disable');
	
	//Initial firewall rule table
	var val, tmpTr, i;
	if (fw_jcfg['rule'])
	{
		for(i = 0; i < fw_jcfg['rule'].length; i++)
		{
			tmpTr = $('#FwRuleSetting tr').clone(true);
			// Source
			val = fw_jcfg['rule'][i]['source'];
			tmpTr.children('td:eq(1)').text( HandleAddressBTF(val, ipgroup_list, fqdn_list) );
			// Destination
			val = fw_jcfg['rule'][i]['destination'];
			tmpTr.children('td:eq(2)').text( HandleAddressBTF(val, ipgroup_list, fqdn_list) );
			// Service
			val = fw_jcfg['rule'][i]['service'];
			tmpTr.children('td:eq(3)').text( HandleServiceBTF(val, servicegroup_list) );
			// Action
			tmpTr.children('td:eq(4)').text( ActionBTF(fw_jcfg['rule'][i]['action']) );
			// Log
			fw_jcfg['rule'][i]['log']?
				tmpTr.children('td:eq(5)').attr('class', 'itemEnabled') :
				tmpTr.children('td:eq(5)').attr('class', 'itemDisabled');
	
			tmpTr.appendTo($('#RuleTbody'));
		}
	}
	// Add default rule
	tmpTr = $('#FwRuleSetting tr').clone(true).removeClass('FwSetting').addClass('DefaultRule');
	tmpTr.find('td').css('background-color', '#D3D3D3');
	// Image
	tmpTr.find('td:eq(0) img').empty();
	tmpTr.find('td:eq(0)').html('<img class="btnStyle" src="/image/node.gif">');
	// Source
	tmpTr.children('td:eq(1)').text( vFwSourceList[6] );
	// Destination
	tmpTr.children('td:eq(2)').text( vFwDestinationList[7] );
	// Service
	tmpTr.children('td:eq(3)').text( vServiceList[0] );
	// Action
	tmpTr.children('td:eq(4)').text( vActionList[0] );
	// Log
	tmpTr.children('td:eq(5)').attr('class', 'itemDisabled');

	tmpTr.appendTo($('#RuleTbody'));

	NotifyUser();

	button_enable(window);
});
