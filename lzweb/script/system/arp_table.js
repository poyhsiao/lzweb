function check_input(tbRule)
{
	var tdInput, macArray;
	//IP Address
	tdInput = tbRule.find('td:eq(1) input');
	if (!check_ipaddr(tdInput))
		return false;

	//MAC Address
	tdInput = tbRule.find('td:eq(2) input');
	macArray = tdInput.val().split(":");
	if (macArray.length != 6)
	{
		show_error(tdInput);
		return false;
	}
	for (var i=0; i<macArray.length; i++)
	{
		if (!macArray[i].match(/^[a-fA-F0-9]{2}/))
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
	// Interface
	trRule.children('td:eq(1)').text( tbRule.find('td:eq(0) select').val() );
	// IP Address
	trRule.children('td:eq(2)').text( tbRule.find('td:eq(1) input').val() );
	// MAC Address
	trRule.children('td:eq(3)').text( tbRule.find('td:eq(2) input').val() );
}

function load_rule(tbRule, trRule)
{
	//Edit mode, load tr settings
	if (trRule)
	{
		//Interface
		tbRule.find('td:eq(0) select').val( trRule.find('td:eq(1)').text() );
		//IP Address
		tbRule.find('td:eq(1) input').val( trRule.find('td:eq(2)').text() );
		//MAC Address
		tbRule.find('td:eq(2) input').val( trRule.find('td:eq(3)').text() );
	}
	//Add mode, initial all settings
	else
	{
		//Interface
		tbRule.find('td:eq(0) select option').get(0).selected = true;
		//IP Address
		tbRule.find('td:eq(1) input').val( ipv4_addr_demo );
		//MAC Address
		tbRule.find('td:eq(2) input').val( '' );
	}
}

function Apply()
{
	var i, j, tmpTr, arp_table_data = {};
	arp_table_data['fixed-entry'] = new Array();
	//Fixed Entries
	for (i = 0; i < $('#FixedTbody tr').size(); i++)
	{
		tmpTr = $('#FixedTbody tr').eq(i);
		arp_table_data['fixed-entry'][i] = {};
		arp_table_data['fixed-entry'][i]['interface'] = InterfaceFTB(tmpTr.children('td:eq(1)').text());
		arp_table_data['fixed-entry'][i]['ip'] = tmpTr.children('td:eq(2)').text();
		arp_table_data['fixed-entry'][i]['mac'] = tmpTr.children('td:eq(3)').text();
	}
	//Dynamic Entries
	for (j = 0; j < $('#DynamicTbody tr').size(); j++)
	{
		tmpTr = $('#DynamicTbody tr').eq(j);
		if (tmpTr.children('td:eq(3)').hasClass('itemEnabled'))
		{
			arp_table_data['fixed-entry'][i] = {};
			arp_table_data['fixed-entry'][i]['interface'] = InterfaceFTB(tmpTr.children('td:eq(0)').text());
			arp_table_data['fixed-entry'][i]['ip'] = tmpTr.children('td:eq(1)').text();
			arp_table_data['fixed-entry'][i]['mac'] = tmpTr.children('td:eq(2)').text();
			i++;
		}
	}
	$('[name="ArptableSetting"]').val( JSON.stringify(arp_table_data) );
}

$(function(){
	var tbFixedRule;

	$('#FixedRule').dialog({
		autoOpen: false,
		width: 400,
	});

	$('.checkDragDrop').click(function(){
		sort_setting($(this), $(this).closest('div.table_div').find('table#FixedTb'));
	});

	$('th.addFixed').click(function(){
		var Tbody = $(this).closest('thead').siblings('tbody');
		tbFixedRule = $('#FixedRule').clone(true);
		if (tbFixedRule.dialog('isOpen'))
			tbFixedRule.dialog('close');

		tbFixedRule.dialog({
			open: function(){
				load_rule($(this));
				$(this).find('tr:last').hide();
			},
			title: vArpSettingTbTitle[0],
			buttons: [{
				text: vSettingTbButton[0],
				click: function(){
					if (check_input($(this)))
					{
						var FixedSettingTr = $('#FixedSetting tr').clone(true);
						set_rule($(this), FixedSettingTr);
						FixedSettingTr.prependTo(Tbody);
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
				click: function(){
					$(this).dialog('close');
				}
			}]
		}).dialog('open');
	});

	$('img.btnDelete').click(function(){
		$(this).closest('tr').detach();
	});

	$('img.btnEdit').click(function(){
		var trNode = $(this).parent().parent();
		tbFixedRule = $('#FixedRule').clone(true);
		if (tbFixedRule.dialog('isOpen'))
			tbFixedRule.dialog('close');

		tbFixedRule.dialog({
			open: function(){
				load_rule($(this), trNode);
				$(this).find('tr:last').hide();
			},
			title: vArpSettingTbTitle[1],
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
				click: function(){
					$(this).dialog('close');
				}
			}]
		}).dialog('open');
	});

	InitSelection($('#sel_Interface'), vInterfaceList);

	$('#FixedTb').sortable({
		axis: "y",
		containment: "parent",
		items: "tr.FixedSettingTr"
	}).sortable('disable');

	//Initial fixed entries arp table
	var val, i, tmpTr;
	if (arp_table_jcfg['fixed-entry'])
	{
		for(i = 0; i < arp_table_jcfg['fixed-entry'].length; i++)
		{
			tmpTr = $('#FixedSetting tr').clone(true);
			//Interface
			val = arp_table_jcfg['fixed-entry'][i]['interface'];
			tmpTr.children('td:eq(1)').text( InterfaceBTF(val) );
			//IP Address
			val = arp_table_jcfg['fixed-entry'][i]['ip'];
			tmpTr.children('td:eq(2)').text( val );
			//MAC Address
			val = arp_table_jcfg['fixed-entry'][i]['mac'];
			tmpTr.children('td:eq(3)').text( val );

			tmpTr.appendTo($('#FixedTbody'));
		}
	}
	//Initial dynamic entries arp table
	if (arp_table_jcfg['dynamic-entry'])
	{
		for(i = 0; i < arp_table_jcfg['dynamic-entry'].length; i++)
		{
			tmpTr = $('#FixedSetting tr').clone(true);
			//Interface
			val = arp_table_jcfg['dynamic-entry'][i]['interface'];
			tmpTr.children('td:eq(0)').empty().text( InterfaceBTF(val) );
			//IP Address
			val = arp_table_jcfg['dynamic-entry'][i]['ip'];
			tmpTr.children('td:eq(1)').text( val );
			//MAC Address
			val = arp_table_jcfg['dynamic-entry'][i]['mac'];
			tmpTr.children('td:eq(2)').text( val );
			//Fix
			tmpTr.children('td:eq(3)').addClass('set_fix itemDisabled')
				.click(function(){ ToggleEnable($(this)) });

			tmpTr.appendTo($('#DynamicTbody'));
		}
	}

	NotifyUser();

	button_enable(window);
});
