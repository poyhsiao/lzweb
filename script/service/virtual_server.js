var wan_num = all_wans.length;

function check_input(tbRule)
{
	var i, j, tdSel, tdInput;
	// Virtual Server: WAN
	for (i = 0; i < wan_num; i++)
	{
		j = i*2;
		tdSel = tbRule.find('td').eq(j).find('select');
		tdInput = tbRule.find('td').eq(j+1).find('input');
		if ( tdSel.val() == vVsWanList[2] && !check_ipaddr(tdInput) )
			return false;
	}

	// Virtual Server: Service
	tdSel = tbRule.find('select#sel_Service');
	tdInput = tbRule.find('td').eq(wan_num*2+1).find('input');
	if (check_error(tdSel, tdInput, "service"))
		return false;

	// Real Server: IP
	tdInput = tbRule.find('input#real_ip');
	if (!check_ipaddr(tdInput))
		return false;

	// Real Server: Port Mapping
	tdSel = tbRule.find('select#sel_Service');
	tdInput = tbRule.find('tr#port_mapping input');
	if (isTcpOrUdpPrefix(tdSel.val()))
	{
		if ( !tdInput.val().match(/^\d{1,5}/) )
		{
			show_error(tdInput);
			return false;
		}
	}
	
	return true;
}

function set_rule(tbRule, trRule)
{
	// Translate settingtb to tr
	var i, j, tdNode, tdSel;

	// Virtual Server: WAN
	for (i = 0; i < wan_num; i++)
	{
		j = i*2;
		tdNode = trRule.children('td').eq(i+1);
		if ( tbRule.find('td').eq(j+1).find('input').attr('disabled') ){
			tdNode.text( tbRule.find('td').eq(j).find('select').val() );
		}
		else{
			tdNode.text( tbRule.find('td').eq(j+1).find('input').val() );
		}
	}
	// Virtual Server: Service
	tdNode = trRule.children('td').eq(wan_num+1);
	tdSel = tbRule.find('select#sel_Service').val();
	if ( tbRule.find('td').eq(wan_num*2+1).find('input').attr('disabled') ){	//any
		tdNode.text( tdSel );
	}else if ( tdSel == vServiceList[4] ){ //group
		tdNode.text( tbRule.find('select').eq(wan_num+1).find('option:selected').text() );
	}else{
		var service = tbRule.find('td').eq(wan_num*2+1).find('input').val();
		tdNode.text( HandleServiceBTF(service) );
	}
	// Real Server: IP
	trRule.children('td').eq(wan_num+2).text( tbRule.find('input#real_ip').val() );
	// Real Server: Port Mapping
	tdNode = trRule.children('td').eq(wan_num+3);
	tdSel = tbRule.find('select#sel_Service').val(); //service
	if ( isTcpOrUdpPrefix(tdSel) )
	{
		tdNode.text( tbRule.find('tr#port_mapping input').val() );
	}
	else
	{
		tdNode.text( vVsWanList[0] );
	}
	// Log
	if ( tbRule.find('tr#log input:checked').val() ){
		trRule.children('td').eq(wan_num+4).attr('class', 'itemEnabled');
	}else{
		trRule.children('td').eq(wan_num+4).attr('class', 'itemDisabled');
	}
}

function load_wan_rule(val, selNode, inputNode)
{
	if ( val == vVsWanList[0] || val == vVsWanList[1] )
	{
		selNode.val( val );
		inputNode.attr('disabled', true).val('').hide();
	}
	else
	{
		selNode.val( vVsWanList[2] );
		inputNode.removeAttr('disabled').val( val ).show();
	}
}

function load_rule(tbRule, trRule)
{
	var i, j;

	add_input_node(tbRule.find('td').eq(wan_num*2+1));
	//Edit mode, load tr settings
	if (trRule)
	{
		var Val, SelNode, InputNode, ServiceType;
		// Virtual Server: WAN
		for (i = 0; i < wan_num; i++)
		{
			j = i*2;
			Val = trRule.find('td').eq(i+1).text();
			SelNode = tbRule.find('td').eq(j).find('select');
			InputNode = tbRule.find('td').eq(j+1).find('input');
			load_wan_rule(Val, SelNode, InputNode);
		}

		// Virtual Server: Service
		Val = trRule.find('td').eq(wan_num+1).text();
		SelNode = tbRule.find('select#sel_Service');
		InputNode = tbRule.find('td').eq(wan_num*2+1).find('input');
		
		// Translate to the backend form in order to deal with well known services
		var backendService = ServiceFTB(Val);
		if (backendService in vKnownServices)
		{
			SelNode.val( backendService );
			InputNode.removeAttr('disabled').val( backendService ).show();
		}
		else
		{
			ServiceType = Val.split("@")[0] + "@";
			if (ServiceType == vServiceList[1]) //protocal
			{
				SelNode.val( vServiceList[1] );
				InputNode.removeAttr('disabled').val( Val ).show();
			}
			else if (ServiceType == vServiceList[2]) //tcp
			{
				SelNode.val( vServiceList[2] );
				InputNode.removeAttr('disabled').val( Val ).show();
			}
			else if (ServiceType == vServiceList[3]) //udp
			{
				SelNode.val( vServiceList[3] );
				InputNode.removeAttr('disabled').val( Val ).show();
			}
			else if (Val.match(vServiceList[4])) //group@
			{
				SelNode.val( vServiceList[4] );
				InputNode.replaceWith(gen_srvgroup_sel_node(servicegroup_list));
				tbRule.find('select').eq(wan_num+1).val( Val );
			}
			else //Any
			{
				SelNode.val( vServiceList[0] );
				InputNode.attr('disabled', true).val('').hide();
			}
		}

		// Real Server: IP
		Val = trRule.find('td').eq(wan_num+2).text();
		InputNode = tbRule.find('input#real_ip');
		InputNode.val( Val );
	
		// Real Server: Port Mapping
		Val = trRule.find('td').eq(wan_num+3).text();
		if ( Val == vVsWanList[0] ) //none
		{
			tbRule.find('tr#port_mapping').hide();
			tbRule.find('tr#port_mapping input').val('');
		}
		else
		{
			tbRule.find('tr#port_mapping').show();
			tbRule.find('tr#port_mapping input').val( Val );
		}

		// Log
		tbRule.find('tr#log input').attr('checked', trRule.find('td').eq(wan_num+4).hasClass('itemEnabled')? true : false);
	}
	//Add mode, initial all settings
	else
	{
		// Virtual Server: WAN
		for (i = 0; i < wan_num; i++)
		{
			j = i*2;
			tbRule.find('td').eq(j).find('select option').get(0).selected = true;
			tbRule.find('td').eq(j+1).find('input').attr('disabled', true).val('').hide();
		} 
		// Virtual Server: Service
		tbRule.find('select#sel_Service option').get(0).selected = true;
		tbRule.find('td').eq(wan_num*2+1).find('input').attr('disabled', true).val('').hide();
		// Real Server: IP
		tbRule.find('input#real_ip').val( ipv4_addr_demo );
		// Real Server: Port Mapping
		tbRule.find('tr#port_mapping').hide();
		// Log
		tbRule.find('tr#log input').attr('checked', false);
	}
}

function Apply()
{
	var i, j;
	var vs_data = {};
	vs_data['rule'] = new Array();
	for (i = 0; i < $('#RuleTbody tr').size(); i++)
	{
		var tmpTr = $('#RuleTbody tr').eq(i);
		vs_data['rule'][i] = {};
		for (j = 0; j < wan_num; j++)
		{
			vs_data['rule'][i][all_wans[j]] = VsWanFTB( tmpTr.children('td').eq(j+1).text() );
		}
		vs_data['rule'][i]['service'] = ServiceFTB( tmpTr.children('td').eq(wan_num+1).text() );
		vs_data['rule'][i]['ip'] = tmpTr.children('td').eq(wan_num+2).text();
		
		if (tmpTr.children('td').eq(wan_num+3).text()==vVsWanList[0]){ //none
			vs_data['rule'][i]['port-mapping'] == "";
		}else{
			vs_data['rule'][i]['port-mapping'] = tmpTr.children('td').eq(wan_num+3).text();
		}
		
		vs_data['rule'][i]['log'] = tmpTr.children('td').eq(wan_num+4).hasClass('itemEnabled')? 1:0;
	}
	$('[name="VirtualserverSetting"]').val( JSON.stringify(vs_data) );
}

$(function(){
	var tbVsRule;

	$('#VsRuleDetail').dialog({
		autoOpen: false,
		width: 500,
	});

	$('.checkDragDrop').click(function(){
		sort_setting($(this), $('#VsRuleTable'));
	});

	$('#addRule').attr('title', VsBtnTitle[0])
		.click(function(){
			tbVsRule = $('#VsRuleDetail').clone(true);
			if (tbVsRule.dialog('isOpen'))
				tbVsRule.dialog('close');	

			tbVsRule.dialog({
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
							var VsRuleSetting = $('#VsRuleSetting tr').clone(true);
							set_rule($(this), VsRuleSetting);
							VsRuleSetting.prependTo($('#RuleTbody'));
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

	$('img.btnDelete').attr('title', VsBtnTitle[2])
		.click(function(){
			$(this).closest('tr').detach();
		});

	$('img.btnEdit').attr('title', VsBtnTitle[1])
		.click(function(){
			var trNode = $(this).parent().parent();
			tbVsRule = $('#VsRuleDetail').clone(true);
			if (tbVsRule.dialog('isOpen'))
				tbVsRule.dialog('close');

			tbVsRule.dialog({
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

	InitServiceSelection($('#sel_Service'), vServiceList);
	InitSelection($('.sel_Wan'), vVsWanList);

	if (!servicegroup_list.length)
	{
		$('#sel_Service option:eq(4)').attr('disabled', 'disabled');
	}

	$('#sel_Service').change(function(){
		$(this).parent().parent().siblings('tr:last').hide();
		var serviceVal = $(this).val();
		add_input_node($(this));
		var node = $(this).closest('tr').find('td input');
		if( serviceVal == vServiceList[0] ) // Any
		{
			disable_sibling_input($(this), '');
			$('#port_mapping').hide();
		}
		else if ( serviceVal == vServiceList[1] ) //proto@
		{
			enable_sibling_input($(this), serviceVal, false);
			$('#port_mapping').hide();
		}
		else if ( serviceVal == vServiceList[4] ) //group@
		{
			node.replaceWith(gen_srvgroup_sel_node(servicegroup_list));
			$('#port_mapping').hide();
		}
		else
		{
			enable_sibling_input($(this), serviceVal, false);
			$('#port_mapping').show().find('input').val('');
		}
	});

	$('.sel_Wan').change(function(){
		$(this).parent().parent().siblings('tr:last').hide();
		if ( $(this).val() == vVsWanList[0] || $(this).val() == vVsWanList[1] ) //none or auto
		{	
			disable_sibling_input($(this), '');
		}
		else //IP Address
		{
			enable_sibling_input($(this), ipv4_addr_demo, true);
		}
	});

	$('#VsRuleTable').sortable({
		axis: "y",
		containment: "parent",
		items: "tr.VsSetting"
	}).sortable('disable');
	
	//Initial virtual server rule table
	var val;
	if (vs_jcfg['rule'])
	{
		for(var i = 0; i < vs_jcfg['rule'].length; i++)
		{
			var tmpTr = $('#VsRuleSetting tr').clone(true);
			// Virtual Server: WAN
			for (var j = 0; j < wan_num; j++)
			{
				tmpTr.children('td').eq(j+1).text( VsWanBTF(vs_jcfg['rule'][i][all_wans[j]]) );
			}
			// Virtual Server: Service
			val = vs_jcfg['rule'][i]['service'];
			tmpTr.children('td').eq(wan_num+1).text( HandleServiceBTF(val, servicegroup_list) );
			// Real Server: IP
			val = vs_jcfg['rule'][i]['ip'];
			tmpTr.children('td').eq(wan_num+2).text( val );
			// Real Server: Port Mapping
			if (vs_jcfg['rule'][i]['port-mapping'])
				tmpTr.children('td').eq(wan_num+3).text( vs_jcfg['rule'][i]['port-mapping'] );
			else
				tmpTr.children('td').eq(wan_num+3).text( vVsWanList[0] );
			// Log
			vs_jcfg['rule'][i]['log']?
				tmpTr.children('td').eq(wan_num+4).attr('class', 'itemEnabled') :
				tmpTr.children('td').eq(wan_num+4).attr('class', 'itemDisabled');

			tmpTr.appendTo($('#RuleTbody'));
		}
	}

	NotifyUser();

	button_enable(window);
});
