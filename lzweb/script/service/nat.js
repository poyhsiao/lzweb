var CurrentLink;
var InitArr = new Array();

function HandleTranslateBTF( val )
{
	if (val == "none")
		return vNatTranslateList[2];
	else
		return val;
}

function TranslateFTB( value )
{
	return (value == vNatTranslateList[2])? "none" : value;
}

function check_input(tbRule)
{
	var tdSel, node, value;
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
	//Translate
	tdSel = tbRule.find('td:eq(6) select');
	tdInput = tbRule.find('td:eq(7) input');
	if (!tdInput.attr('disabled'))
	{
		if ( !((tdSel.val() == vNatTranslateList[0] && tdInput.val().match(ipv4_addr_pattern)) ||
			(tdSel.val() == vNatTranslateList[1] && tdInput.val().match(ipv4_range_pattern)) ||
			tdInput.val() == '') )
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
	var tdNode, tdSel;

	// Source
	tdNode = trRule.children('td:nth-child(2)');
	tdSel = tbRule.find('td:eq(0) select').val();
	if ( tbRule.find('td:eq(1) input').attr('disabled') ){
		tdNode.text( tdSel );
	}else if ( tdSel == vNatSourceList[2] || tdSel == vNatSourceList[3] ){
		tdNode.text( tbRule.find('td:eq(1) select option:selected').text() );
	}else{
		tdNode.text( tbRule.find('td:eq(1) input').val() );
	};
	// Destination
	tdNode = trRule.children('td:nth-child(3)');
	tdSel = tbRule.find('td:eq(2) select').val();
	if ( tbRule.find('td:eq(3) input').attr('disabled') ){
		tdNode.text( tdSel );
	}else if ( tdSel == vNatSourceList[2] || tdSel == vNatSourceList[3] ){
		tdNode.text( tbRule.find('td:eq(3) select option:selected').text() );
	}else{
		tdNode.text( tbRule.find('td:eq(3) input').val() );
	};
	// Service
	tdNode = trRule.children('td:nth-child(4)');
	tdSel = tbRule.find('td:eq(4) select').val();
	if ( tbRule.find('td:eq(5) input').attr('disabled') ){
		tdNode.text( tdSel );
	}else if ( tdSel ==  vServiceList[4] ){
		tdNode.text( tbRule.find('td:eq(5) select option:selected').text() );
	}else{
		var service = tbRule.find('td:eq(5) input').val();
		tdNode.text( HandleServiceBTF(service) );
	};
	// Translate
	tdNode = trRule.children('td:nth-child(5)');
	tdSel = tbRule.find('td:eq(6) select').val();
	if ( tbRule.find('td:eq(7) input').attr('disabled') ){ //No NAT
		tdNode.text( tdSel );
	}else{
		tdNode.text( tbRule.find('td:eq(7) input').val() );
	};
	// Log
	tdNode = trRule.children('td:nth-child(6)');
	if ( tbRule.find('td input:last:checked').val() ){
		tdNode.attr('class', 'itemEnabled');
	}else{
		tdNode.attr('class', 'itemDisabled');
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
		var srcSel = tbRule.find('td:eq(0) select');
		var srcInputNode = tbRule.find('td:eq(1) input');
		if (srcVal.match(ipv4_addr_pattern))
		{
			srcSel.val( vNatSourceList[0] );
			srcInputNode.removeAttr('disabled').val( srcVal ).show();
		}
		else if (srcVal.match(ipv4_range_pattern))
		{
			srcSel.val( vNatSourceList[1] );
			srcInputNode.removeAttr('disabled').val( srcVal ).show();
		}
		else if (srcVal.match(vNatSourceList[2])) //group@
		{
			srcSel.val( vNatSourceList[2] );
			srcInputNode.replaceWith(gen_ipgroup_sel_node(ipgroup_list));
			tbRule.find('td:eq(1) select').val( srcVal );
		}
		else if (srcVal.match(vNatSourceList[3])) //fqdn@
		{
			srcSel.val( vNatSourceList[3] );
			srcInputNode.replaceWith(gen_fqdn_sel_node(fqdn_list));
			tbRule.find('td:eq(1) select').val( srcVal );
		}
		else
		{
			srcSel.val( srcVal );
			srcInputNode.attr('disabled', true).val('').hide();
		}
		// Destination
		var dstVal= trRule.find('td:eq(2)').text();
		var dstSel = tbRule.find('td:eq(2) select');
		var dstInputNode = tbRule.find('td:eq(3) input');
		if (dstVal.match(ipv4_addr_pattern))
		{
			dstSel.val( vNatSourceList[0] );
			dstInputNode.removeAttr('disabled').val( dstVal ).show();
		}
		else if (dstVal.match(ipv4_range_pattern))
		{
			dstSel.val( vNatSourceList[1] );
			dstInputNode.removeAttr('disabled').val( dstVal ).show();
		}
		else if (dstVal.match(vNatSourceList[2])) //group@
		{
			dstSel.val( vNatSourceList[2] );
			dstInputNode.replaceWith(gen_ipgroup_sel_node(ipgroup_list));
			tbRule.find('td:eq(3) select').val( dstVal );
		}
		else if (dstVal.match(vNatSourceList[3])) //fqdn@
		{
			dstSel.val( vNatSourceList[3] );
			dstInputNode.replaceWith(gen_fqdn_sel_node(fqdn_list));
			tbRule.find('td:eq(3) select').val( dstVal );
		}
		else
		{
			dstSel.val( dstVal );
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
				srvSel.val( vServiceList[0] )
				srvInputNode.attr('disabled', true).val('').hide();
			}
		}
		
		// Translate
		var transVal = trRule.find('td:eq(4)').text();
		var transSel = tbRule.find('td:eq(6) select');
		var transInputNode = tbRule.find('td:eq(7) input');
		if (transVal.match(ipv4_addr_pattern))
		{
			transSel.val( vNatTranslateList[0] );
			transInputNode.removeAttr('disabled').val( transVal ).show();
		}
		else if (transVal.match(ipv4_range_pattern))
		{
			transSel.val( vNatTranslateList[1] );
			transInputNode.removeAttr('disabled').val( transVal ).show();
		}
		else //No NAT
		{
			transSel.val( vNatTranslateList[2] )
			transInputNode.attr('disabled', true).val('').hide();
		}
		// Log
		tbRule.find('td:eq(8) input').attr('checked', trRule.find('td:eq(5)').hasClass('itemEnabled')? true : false);
	}
	//Add mode, initial all settings
	else
	{
		// Source
		tbRule.find('td select:eq(0) option').get(0).selected = true;
		enable_sibling_input(tbRule.find('td:eq(1)'), ipv4_addr_demo, true);
		// Destination
		tbRule.find('td select:eq(1) option').get(0).selected = true;
		enable_sibling_input(tbRule.find('td:eq(2)'), ipv4_addr_demo, true);
		// Service
		tbRule.find('td select:eq(2) option').get(0).selected = true;
		tbRule.find('td input:eq(2)').attr('disabled', true).val('').hide();
		// Translate
		tbRule.find('td select:eq(3) option').get(2).selected = true;
		tbRule.find('td input:eq(3)').attr('disabled', true).val('').hide();
		// Log
		tbRule.find('td input:last').attr('checked', false);
	}
}

function ShowNatSetting( index )
{
	var wanidx = "wan" + index;
	var oSheet, tmpTr;

	oSheet = $('#oSheetTemplate').clone(true);
	oSheet.attr('id', wanidx);

	oSheet.find('table.NatRuleTb').sortable({
		axis: "y",
		containment: "parent",
		items: "tr.NatRuleSettingTr"
	}).sortable('disable');

	if ( nat_jcfg[wanidx]['enable'] )
	{
		oSheet.find('td.EnableWan').removeClass('itemDisabled').addClass('itemEnabled');
		oSheet.find('div#NatRule').show();
	}
	else
	{
		oSheet.find('td.EnableWan').removeClass('itemEnabled').addClass('itemDisabled');
		oSheet.find('div#NatRule').hide();
	}

	var NatTbody = oSheet.find('tbody[name="NatTbody"]');
	if ( nat_jcfg[wanidx]['rule'] )
	{
		var val;
		for(var i = 0; i < nat_jcfg[wanidx]['rule'].length; i++)
		{
			tmpTr = $('#NatRuleSetting tr').clone(true);
			// Source
			val = nat_jcfg[wanidx]['rule'][i]['source'];
			tmpTr.find('td:eq(1)').text( HandleAddressBTF(val, ipgroup_list, fqdn_list) );
			// Destination
			val = nat_jcfg[wanidx]['rule'][i]['destination'];
			tmpTr.find('td:eq(2)').text( HandleAddressBTF(val, ipgroup_list, fqdn_list) );
			// Service
			val = nat_jcfg[wanidx]['rule'][i]['service'];
			tmpTr.find('td:eq(3)').text( HandleServiceBTF(val, servicegroup_list) );
			// Translate
			val = nat_jcfg[wanidx]['rule'][i]['translate'];
			tmpTr.find('td:eq(4)').text( HandleTranslateBTF(val) );
			// Log
			nat_jcfg[wanidx]['rule'][i]['log']?
				tmpTr.find('td:eq(5)').attr('class', 'itemEnabled') :
				tmpTr.find('td:eq(5)').attr('class', 'itemDisabled');

			tmpTr.appendTo(NatTbody);
		}
	}
	// Add default rule
	if (summary_jcfg[wanidx]['ip'] && summary_jcfg[wanidx]['ip'] != "Unknown")
	{
		tmpTr = $('#NatRuleSetting tr').clone(true).removeClass('NatRuleSettingTr').addClass('DefaultRule');
		tmpTr.find('td').css('background-color', '#D3D3D3');
		// Image
		tmpTr.find('td:eq(0) img').empty();
		tmpTr.find('td:eq(0)').html('<img class="btnStyle" src="/image/node.gif">');
		// Source
		tmpTr.find('td:eq(1)').text( vFwSourceList[6] );
		// Destination
		tmpTr.find('td:eq(2)').text( vFwSourceList[6] );
		// Service
		tmpTr.find('td:eq(3)').text( vServiceList[0] );
		// Translate
		tmpTr.find('td:eq(4)').text( summary_jcfg[wanidx]['ip'] );
		// Log
		tmpTr.find('td:eq(5)').attr('class', 'itemDisabled');

		tmpTr.appendTo(NatTbody);
	}

	oSheet.appendTo($(document.body));

	var sheetObj = new Array();
	sheetObj.push( oSheet );
	sheetObj.push( index );
	InitArr.push( sheetObj );
}

function Apply()
{
	var nat_data = {};
	var oSheet;
	var wan_index = $('#sel_wan option').size();
	for(var i = 1; i <= wan_index; i++)
	{
		var wanidx = "wan" + i;
		nat_data[wanidx] = {};
		var has = 1;
		for(var j = 0; j < InitArr.length; j++)
		{
			if( i == InitArr[j][1] )
			{
				oSheet = InitArr[j][0];
				nat_data[wanidx]['enable'] = oSheet.find('td.EnableWan').hasClass('itemEnabled')? 1 : 0;
	
				var natTbody = oSheet.find('tbody[name="NatTbody"] tr');
				if( natTbody.size() )
				{
					nat_data[wanidx]['rule'] = new Array();
					for(var k = 0; k < natTbody.size(); k++)
					{
						var tmpTr = natTbody.eq(k);
						if (!tmpTr.hasClass('DefaultRule'))
						{
							nat_data[wanidx]['rule'][k] = {};
							nat_data[wanidx]['rule'][k]['source'] = AddressFTB( tmpTr.children('td:eq(1)').text() );
							nat_data[wanidx]['rule'][k]['destination'] = AddressFTB( tmpTr.children('td:eq(2)').text() );
							nat_data[wanidx]['rule'][k]['service'] = ServiceFTB( tmpTr.children('td:eq(3)').text() );
							nat_data[wanidx]['rule'][k]['translate'] = TranslateFTB( tmpTr.children('td:eq(4)').text() );
							nat_data[wanidx]['rule'][k]['log'] = tmpTr.children('td:eq(5)').hasClass('itemEnabled')? 1 : 0;
						}
					}
				}
				has = 0;
				break;
			}
		}
		if (has) //not show in UI, but has in cfg
		{
			nat_data[wanidx]['enable'] = nat_jcfg[wanidx]['enable'];
			nat_data[wanidx]['rule'] = nat_jcfg[wanidx]['rule'];
		}
	}
	$('[name="NatSetting"]').val( JSON.stringify(nat_data) );
}

$(function(){
	var tbNatRule;
	CurrentLink = 1;

	$('#NatRuleDetail').dialog({
		autoOpen: false,
		width: 600,
	});

	$('.checkDragDrop').click(function(){
		sort_setting($(this), $(this).closest('div.table_div').find('table.NatRuleTb'));
	});

	$('.EnableWan').addClass("itemDisabled")
		.bind('click', function(event){
			ToggleEnable($(this));
			$(this).closest('div').siblings('div#NatRule').toggle('slow');
		});

	$('th.addNatRule').attr('title', NatBtnTitle[0])
		.click(function(){
			var Tbody = $(this).closest('thead').siblings('tbody');
			tbNatRule = $('#NatRuleDetail').clone(true);
			if (tbNatRule.dialog('isOpen'))
				tbNatRule.dialog('close');

			tbNatRule.dialog({
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
							var NatRuleSettingTr = $('#NatRuleSetting tr').clone(true);
							set_rule($(this), NatRuleSettingTr);
							NatRuleSettingTr.prependTo(Tbody);
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

	$('img.btnDelete').attr('title', NatBtnTitle[2])
		.click(function(){
			$(this).closest('tr').detach();
		});

	$('img.btnEdit').attr('title', NatBtnTitle[1])
		.click(function(){
			var trNode = $(this).parent().parent();
			tbNatRule = $('#NatRuleDetail').clone(true);
			if (tbNatRule.dialog('isOpen'))
				tbNatRule.dialog('close');

			tbNatRule.dialog({
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
			}).dialog('open');
		});

	InitSelection($('#sel_Source'), vNatSourceList);
	InitSelection($('#sel_Destination'), vNatSourceList);
	InitSelection($('#sel_Translate'), vNatTranslateList);
	InitServiceSelection($('#sel_Service'), vServiceList);

	if (!fqdn_list.length)
	{
		$('#sel_Source option:last').attr('disabled', 'disabled');
		$('#sel_Destination option:last').attr('disabled', 'disabled');
	}

	if (!ipgroup_list.length)
	{
		$('#sel_Source option:eq(2)').attr('disabled', 'disabled');
		$('#sel_Destination option:eq(2)').attr('disabled', 'disabled');
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
			case vNatSourceList[0]:	//IP Address
				enable_sibling_input($(this), ipv4_addr_demo, true);
				break;
			case vNatSourceList[1]:	//IP Range
				enable_sibling_input($(this), ipv4_range_demo, true);
				break;
			case vNatSourceList[2]:	//group@
				node.replaceWith(gen_ipgroup_sel_node(ipgroup_list));
				break;
			case vNatSourceList[3]:	//fqdn@
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
		if( serviceVal == vServiceList[0] ) //Any
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

	$('#sel_Translate').change(function(){
		$(this).parent().parent().siblings('tr:last').hide();
		var translateVal = $(this).val();
		switch(translateVal)
		{
			case vNatTranslateList[0]: //IP Address
				enable_sibling_input($(this), ipv4_addr_demo, true);
				break;
			case vNatTranslateList[1]: //IP Range
				enable_sibling_input($(this), ipv4_range_demo, true);
				break;
			default:
				disable_sibling_input($(this), '');
				break;
		}
	});

	$('#sel_wan').change(function(){
		for( var i = 0; i < InitArr.length; i++ )
		{
			InitArr[i][0].hide();
		}
		for( var i=0; i < InitArr.length; i++ )
		{
			if( $(this).val() == InitArr[i][1] )
			{
				InitArr[i][0].show();
				CurrentLink = InitArr[i][1];
				return;
			}
		}
		ShowNatSetting( $(this).val() );
		InitArr[InitArr.length-1][0].show();
		CurrentLink = InitArr[InitArr.length-1][1];
	});

	// Initial
	$('#sel_wan').val( CurrentLink );
	
	ShowNatSetting( CurrentLink );

	NotifyUser();

	button_enable(window);
});
