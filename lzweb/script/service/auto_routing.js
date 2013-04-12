var wan_num = all_wans.length;

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
	var i, tdNode, tdSel;

	// Source
	tdNode = trRule.children('td:nth-child(2)');
	tdSel = tbRule.find('td:eq(0) select').val();
	if ( tbRule.find('td:eq(1) input').attr('disabled') ){
		tdNode.text( tdSel );
	}else if ( tdSel == vArSourceList[7] || tdSel == vArSourceList[8] ){
		tdNode.text( tbRule.find('td:eq(1) select option:selected').text() );
	}else{
		tdNode.text( tbRule.find('td:eq(1) input').val() );
	}
	// Destination	
	tdNode = trRule.children('td:nth-child(3)');
	tdSel = tbRule.find('td:eq(2) select').val();
	if ( tbRule.find('td:eq(3) input').attr('disabled') ){
		tdNode.text( tdSel );
	}else if ( tdSel == vArDestinationList[4] || tdSel == vArDestinationList[5] ){
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
	// WAN
	for (i = 0; i < wan_num; i++)
	{
		if ( tbRule.find('td').eq(i+6).find('input:checked').val() ){
			trRule.children('td').eq(i+4).attr('class', 'itemEnabled');
		}else{
			trRule.children('td').eq(i+4).attr('class', 'itemDisabled');
		}
	}
	// Failover
	if ( tbRule.find('td').eq(wan_num+6).find('input:checked').val() ){
		trRule.children('td').eq(wan_num+4).attr('class', 'itemEnabled');
	}else{
		trRule.children('td').eq(wan_num+4).attr('class', 'itemDisabled');
	}
	// Persistent
	if ( tbRule.find('td').eq(wan_num+7).find('input:checked').val() ){
		trRule.children('td').eq(wan_num+5).attr('class', 'itemEnabled');
	}else{
		trRule.children('td').eq(wan_num+5).attr('class', 'itemDisabled');
	}
	// Log
	if ( tbRule.find('td').eq(wan_num+8).find('input:checked').val() ){
		trRule.children('td').eq(wan_num+6).attr('class', 'itemEnabled');
	}else{
		trRule.children('td').eq(wan_num+6).attr('class', 'itemDisabled');
	}
}

function load_rule(tbRule, trRule)
{
	var i;

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
			srcSelNode.val( vArSourceList[0] );
			srcInputNode.removeAttr('disabled').val( srcVal ).show();
		}
		else if (srcVal.match(ipv4_range_pattern))
		{
			srcSelNode.val( vArSourceList[1] );
			srcInputNode.removeAttr('disabled').val( srcVal ).show();
		}
		else if (srcVal.match(ipv4_subnet_pattern))
		{
			srcSelNode.val( vArSourceList[2] );
			srcInputNode.removeAttr('disabled').val( srcVal ).show();
		}
		else if (srcVal.match(vArSourceList[7])) //group@
		{
			srcSelNode.val( vArSourceList[7] );
			srcInputNode.replaceWith(gen_ipgroup_sel_node(ipgroup_list));
			tbRule.find('td:eq(1) select').val( srcVal );
		}
		else if (srcVal.match(vArSourceList[8])) //fqdn@
		{
			srcSelNode.val( vArSourceList[8] );
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
			dstSelNode.val( vArDestinationList[0] );
			dstInputNode.removeAttr('disabled').val( dstVal ).show();
		}
		else if (dstVal.match(ipv4_range_pattern))
		{
			dstSelNode.val( vArDestinationList[1] );
			dstInputNode.removeAttr('disabled').val( dstVal ).show();
		}
		else if (dstVal.match(ipv4_subnet_pattern))
		{
			dstSelNode.val( vArDestinationList[2] );
			dstInputNode.removeAttr('disabled').val( dstVal ).show();
		}
		else if (dstVal.match(vArDestinationList[4])) //group@
		{
			dstSelNode.val( vArDestinationList[4] );
			dstInputNode.replaceWith(gen_ipgroup_sel_node(ipgroup_list));
			tbRule.find('td:eq(3) select').val( dstVal );
		}
		else if (dstVal.match(vArDestinationList[5])) //fqdn@
		{
			dstSelNode.val( vArDestinationList[5] );
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
		
		// WAN
		for (i = 0; i < wan_num; i++)
		{
			tbRule.find('td').eq(i+6).find('input').attr('checked', trRule.find('td').eq(i+4).hasClass('itemEnabled')? true : false);
		}
		// Failover
		tbRule.find('td').eq(wan_num+6).find('input').attr('checked', trRule.find('td').eq(wan_num+4).hasClass('itemEnabled')? true : false);
		// Persistent
		tbRule.find('td').eq(wan_num+7).find('input').attr('checked', trRule.find('td').eq(wan_num+5).hasClass('itemEnabled')? true : false);
		// Log
		tbRule.find('td').eq(wan_num+8).find('input').attr('checked', trRule.find('td').eq(wan_num+6).hasClass('itemEnabled')? true : false);
	}
	//Add mode, initial all settings
	else
	{
		// Source
		tbRule.find('td select:eq(0) option').get(6).selected = true; //Any
		tbRule.find('td:eq(1) input').attr('disabled', true).val('').hide();
		// Destination
		tbRule.find('td select:eq(1) option').get(3).selected = true; //WAN
		tbRule.find('td:eq(3) input').attr('disabled', true).val('').hide();
		// Service
		tbRule.find('td select:eq(2) option').get(0).selected = true;
		tbRule.find('td:eq(5) input').attr('disabled', true).val('').hide();
		// WAN
		for (i = 0; i < wan_num; i++)
		{
			tbRule.find('td').eq(i+6).find('input').attr('checked', true);
		}
		// Failover
		tbRule.find('td').eq(wan_num+6).find('input').attr('checked', true);
		// Persistent
		tbRule.find('td').eq(wan_num+7).find('input').attr('checked', true);
		// Log
		tbRule.find('td').eq(wan_num+8).find('input').attr('checked', false);
	}
}

function Apply()
{
	var ar_data = {};
	ar_data['method'] = ($('#sel_method').val() == "0")? "weight" : "traffic";
	ar_data['parameter'] = $('#input_param').val();
	ar_data['aging'] = $('#input_aging').val();

	ar_data['rule'] = new Array();
	for (var i = 0; i < $('#RuleTbody tr').size(); i++)
	{
		var tmpTr = $('#RuleTbody tr').eq(i);
		if (!tmpTr.hasClass('DefaultRule'))
		{
			ar_data['rule'][i] = {};
			ar_data['rule'][i]['source'] = AddressFTB( tmpTr.children('td:eq(1)').text() );
			ar_data['rule'][i]['destination'] = AddressFTB( tmpTr.children('td:eq(2)').text() );
			ar_data['rule'][i]['service'] = ServiceFTB( tmpTr.children('td:eq(3)').text() );
			for (var j = 0; j < wan_num; j++)
			{
				ar_data['rule'][i][all_wans[j]] = tmpTr.children('td').eq(j+4).hasClass('itemEnabled')? 1:0;
			}
			ar_data['rule'][i]['failover'] = tmpTr.children('td').eq(wan_num+4).hasClass('itemEnabled')? 1:0;
			ar_data['rule'][i]['persistent'] = tmpTr.children('td').eq(wan_num+5).hasClass('itemEnabled')? 1:0;
			ar_data['rule'][i]['log'] = tmpTr.children('td').eq(wan_num+6).hasClass('itemEnabled')? 1:0;
		}
	}
	$('[name="AutoroutingSetting"]').val( JSON.stringify(ar_data) );
}

$(function(){
	var tbArRule, i, j;

	$('#ArRuleDetail').dialog({
		autoOpen: false,
		width: 600,
	});

	$('.checkDragDrop').click(function(){
		sort_setting($(this), $('#ArRuleTable'));
	});

	$('#addRule').attr('title', ArBtnTitle[0])
		.click(function(){
			tbArRule = $('#ArRuleDetail').clone(true);
			if (tbArRule.dialog('isOpen'))
				tbArRule.dialog('close');	

			tbArRule.dialog({
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
							var ArRuleSetting = $('#ArRuleSetting tr').clone(true);
							set_rule($(this), ArRuleSetting);
							ArRuleSetting.prependTo($('#RuleTbody'));
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

	$('img.btnDelete').attr('title', ArBtnTitle[2])
		.click(function(){
			$(this).closest('tr').detach();
		});

	$('img.btnEdit').attr('title', ArBtnTitle[1])
		.click(function(){
			var trNode = $(this).parent().parent();
			tbArRule = $('#ArRuleDetail').clone(true);
			if (tbArRule.dialog('isOpen'))
				tbArRule.dialog('close');

			tbArRule.dialog({
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

	InitSelection($('#sel_Source'), vArSourceList);
	InitSelection($('#sel_Destination'), vArDestinationList);
	InitServiceSelection($('#sel_Service'), vServiceList);

	if (!fqdn_list.length)
	{
		$('#sel_Source option:last').attr('disabled', 'disabled');
		$('#sel_Destination option:last').attr('disabled', 'disabled');
	}

	if (!ipgroup_list.length)
	{
		$('#sel_Source option:eq(7)').attr('disabled', 'disabled');
		$('#sel_Destination option:eq(4)').attr('disabled', 'disabled');
	}

	if (!servicegroup_list.length)
	{
		$('#sel_Service option:eq(4)').attr('disabled', 'disabled');
	}

	$('#sel_method').change(function(){
		if ($(this).val() == "0") //weight
		{
			$('#input_param').attr('disabled', false).css('color', '#000000');
			$('#ParamTr').show();
		}
		else //traffic
		{
			$('#input_param').attr('disabled', true).css('color', '#A9A9A9');
			$('#ParamTr').hide();
		}
	});

	$('#sel_Source').change(function(){
		$(this).parent().parent().siblings('tr:last').hide();
		var srcVal = $(this).val();
		add_input_node($(this));
		var node = $(this).closest('tr').find('td input');
		switch(srcVal)
		{
			case vArSourceList[0]:  //IP Address
				enable_sibling_input($(this), ipv4_addr_demo, true);
				break;
			case vArSourceList[1]:  //IP Range
				enable_sibling_input($(this), ipv4_range_demo, true);
				break;
			case vArSourceList[2]:  //Subnet
				enable_sibling_input($(this), ipv4_subnet_demo, true);
				break;
			case vArSourceList[7]: //group@
				node.replaceWith(gen_ipgroup_sel_node(ipgroup_list));
				break;
			case vArSourceList[8]: //fqdn@
				node.replaceWith(gen_fqdn_sel_node(fqdn_list));
				break;
			default:
				disable_sibling_input($(this), '');
				break;
		}
	});

	$('#sel_Destination').change(function(){
		$(this).parent().parent().siblings('tr:last').hide();
		var dstVal = $(this).val();
		add_input_node($(this));
		var node = $(this).closest('tr').find('td input');
		switch(dstVal)
		{
			case vArDestinationList[0]:  //IP Address
				enable_sibling_input($(this), ipv4_addr_demo, true);
				break;
			case vArDestinationList[1]:  //IP Range
				enable_sibling_input($(this), ipv4_range_demo, true);
				break;
			case vArDestinationList[2]:  //Subnet
				enable_sibling_input($(this), ipv4_subnet_demo, true);
				break;
			case vArDestinationList[4]: //group@
				node.replaceWith(gen_ipgroup_sel_node(ipgroup_list));
				break;
			case vArDestinationList[5]: //fqdn@
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

	$('#ArRuleTable').sortable({
		axis: "y",
		containment: "parent",
		items: "tr.ArSetting"
	}).sortable('disable');

	//Initial auto routing setting
	if (ar_jcfg['method'] == "weight")
	{
		$('#sel_method').val(0);
		$('#input_param').attr('disabled', false).css('color', '#000000');
		$('#ParamTr').show();
	}
	else
	{
		$('#sel_method').val(1);
		$('#input_param').attr('disabled', true).css('color', '#A9A9A9');
		$('#ParamTr').hide();
	}

	//Initial auto routing rule table
	var tmpTr;
	if (ar_jcfg['rule'])
	{
		for(i = 0; i < ar_jcfg['rule'].length; i++)
		{
			tmpTr = $('#ArRuleSetting tr').clone(true);
			// Source
			val = ar_jcfg['rule'][i]['source'];
			tmpTr.children('td:eq(1)').text( HandleAddressBTF(val, ipgroup_list, fqdn_list) );
			// Destination
			val = ar_jcfg['rule'][i]['destination'];
			tmpTr.children('td:eq(2)').text( HandleAddressBTF(val, ipgroup_list, fqdn_list) );
			// Service
			val = ar_jcfg['rule'][i]['service'];
			tmpTr.children('td:eq(3)').text( HandleServiceBTF(val, servicegroup_list) );
			// WAN
			for (j = 0; j < wan_num; j++)
			{
				ar_jcfg['rule'][i][all_wans[j]]?
					tmpTr.children('td').eq(j+4).attr('class', 'itemEnabled') :
					tmpTr.children('td').eq(j+4).attr('class', 'itemDisabled');
			}
			// Failover
			ar_jcfg['rule'][i]['failover']?
				tmpTr.children('td').eq(wan_num+4).attr('class', 'itemEnabled') :
				tmpTr.children('td').eq(wan_num+4).attr('class', 'itemDisabled');
			// Persistent
			ar_jcfg['rule'][i]['persistent']?
				tmpTr.children('td').eq(wan_num+5).attr('class', 'itemEnabled') :
				tmpTr.children('td').eq(wan_num+5).attr('class', 'itemDisabled');
			// Log
			ar_jcfg['rule'][i]['log']?
				tmpTr.children('td').eq(wan_num+6).attr('class', 'itemEnabled') :
				tmpTr.children('td').eq(wan_num+6).attr('class', 'itemDisabled');

			tmpTr.appendTo($('#RuleTbody'));
		}
	}
	// Add default rule
	tmpTr = $('#ArRuleSetting tr').clone(true).removeClass('ArSetting').addClass('DefaultRule');
	tmpTr.find('td').css('background-color', '#D3D3D3');
	// Image
	tmpTr.find('td:eq(0) img').empty();
	tmpTr.find('td:eq(0)').html('<img class="btnStyle" src="/image/node.gif">');
	// Source
	tmpTr.children('td:eq(1)').text( vArSourceList[6] );
	// Destination
	tmpTr.children('td:eq(2)').text( vArDestinationList[3] );
	// Service
	tmpTr.children('td:eq(3)').text( vServiceList[0] );
	// WAN
	for (i = 0; i < wan_num; i++)
	{
		tmpTr.children('td').eq(i+4).attr('class', 'itemEnabled');
	}
	// Failover
	tmpTr.children('td').eq(wan_num+4).attr('class', 'itemDisabled');
	// Persistent
	tmpTr.children('td').eq(wan_num+5).attr('class', 'itemDisabled');
	// Log
	tmpTr.children('td').eq(wan_num+6).attr('class', 'itemDisabled');

	tmpTr.appendTo($('#RuleTbody'));

	NotifyUser();

	button_enable(window);
});
