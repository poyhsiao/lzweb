var CurrentGroup;
var InitArr = new Array();

function check_input(tbRule)
{
	var value = tbRule.find('td input:eq(0)').val();
	if( value = "" || !check_service(tbRule.find('td select:eq(0)'), value) )
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
	}else{ // Service
		var service = tbRule.find('td input:eq(0)').val();
		trRule.children('td:nth-child(2)').text( HandleServiceBTF(service) );
	}
}

function load_rule(tbRule, trRule)
{
	//Edit mode, load tr settings
	if (trRule)
	{
		//Service
		var serviceVal = ServiceFTB(trRule.find('td:eq(1)').text());
		var serviceSelNode = tbRule.find('td select:eq(0)');
		var serviceInputNode = tbRule.find('td input:eq(0)');
		
		
		if (serviceVal in vKnownServices)
		{
			serviceSelNode.val( serviceVal );
			serviceInputNode.removeAttr('disabled').val( serviceVal ).show();
		}
		else
		{
			var serviceType = serviceVal.split("@")[0] + "@";
			if (serviceType == vServiceGroupList[0])
			{
				serviceSelNode.val( vServiceGroupList[0] );
				serviceInputNode.removeAttr('disabled').val( serviceVal ).show();
			}
			else if (serviceType == vServiceGroupList[1])
			{
				serviceSelNode.val( vServiceGroupList[1] );
				serviceInputNode.removeAttr('disabled').val( serviceVal ).show();
			}
			else if (serviceType == vServiceGroupList[2])
			{
				serviceSelNode.val( vServiceGroupList[2] );
				serviceInputNode.removeAttr('disabled').val( serviceVal ).show();
			}
			else
			{
				serviceSelNode.val( addrVal );
				serviceInputNode.attr('disabled', true).val('').hide();
			}
		}
		
	}
	//Add mode, initial all settings
	else
	{
		//Service
		tbRule.find('td select:eq(0) option').get(0).selected = true;
		enable_sibling_input(tbRule.find('td:eq(1)'), vServiceGroupList[0], true);
	}
}

function ShowServiceGroupSetting( index )
{
	var groupidx = "group" + index;
	var jcfgidx = index - 1;

	oSheet = $('#oSheetTemp').clone(true);
	oSheet.attr('id', groupidx);

	oSheet.find('table.ServicegroupTb').sortable({
		axis: "y",
		containment: "parent",
		items: "tr.ServiceSettingTr"
	}).sortable('disable');

	// Service Rule table
	if ( servicegroup_jcfg['group'][jcfgidx] )
	{
		var label = htmlspecialchars_decode(servicegroup_jcfg['group'][jcfgidx]['label']);
		oSheet.find('input:first').val( label );
		for(var i = 0; i < servicegroup_jcfg['group'][jcfgidx]['service'].length; i++)
		{
			var tmpTr = $('#ServiceSetting tr').clone(true);
			var service = servicegroup_jcfg['group'][jcfgidx]['service'][i];
			tmpTr.find('td:last').text( HandleServiceBTF(service) );
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
	var servicegroup_data = {};
	var group_size = $('#sel_group option').size();
	var oSheet;
	servicegroup_data['group'] = new Array();
	for (var i = 0; i < group_size; i++)
	{
		var has = 1;
		var group_idx = i+1;
		servicegroup_data['group'][i] = {};
		for(var j = 0; j < InitArr.length; j++)
		{
			if( group_idx == InitArr[j][1] )
			{
				oSheet = InitArr[j][0];
				servicegroup_data['group'][i]['label'] = oSheet.find('td input:eq(0)').val();
				servicegroup_data['group'][i]['service'] = new Array();
				var ServiceTbody = oSheet.find('tbody tr');
				if (ServiceTbody.size())
				{
					for (var k = 0; k < ServiceTbody.size(); k++)
					{
						var TdVal = ServiceTbody.eq(k).find('td:last').text();
						servicegroup_data['group'][i]['service'][k] = ServiceFTB( TdVal );
					}
				}
				has = 0;
				break;
			}
		}
		if (has) //not show in UI, but has in cfg
		{
			if (servicegroup_jcfg['group'][i] != null)
			{
				servicegroup_data['group'][i]['label'] = servicegroup_jcfg['group'][i]['label'];
				servicegroup_data['group'][i]['service'] = servicegroup_jcfg['group'][i]['service'];
			}
		}
	}
	$('[name="ServicegroupSetting"]').val( JSON.stringify(servicegroup_data) );
}

$(function(){
	CurrentGroup = 1;

	$('#ServiceRule').dialog({
		autoOpen: false,
		width: 455,
	});

	$('.checkDragDrop').click(function(){
		sort_setting($(this), $(this).closest('div.table_div').find('table.ServicegroupTb'));
	});

	$('th.addServiceGroup').click(function(){
		var Tbody = $(this).closest('thead').siblings('tbody');
		tbServiceRule = $('#ServiceRule').clone(true);
		if (tbServiceRule.dialog('isOpen'))
			tbServiceRule.dialog('close');

		tbServiceRule.dialog({
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
						var ServiceSettingTr = $('#ServiceSetting tr').clone(true);
						set_rule($(this), ServiceSettingTr);
						ServiceSettingTr.prependTo(Tbody);
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
		}).dialog('open');;
	});

	$('img.btnDelete').click(function(){
		$(this).closest('tr').detach();
	});

	$('img.btnEdit').click(function(){
		var trNode = $(this).parent().parent();
		tbServiceRule = $('#ServiceRule').clone(true);
		if (tbServiceRule.dialog('isOpen'))
			tbServiceRule.dialog('close');

		tbServiceRule.dialog({
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

	InitServiceSelection($('#sel_service'), vServiceGroupList);

	$('#sel_service').change(function(){
		$this = $(this); 
		$this.parent().parent().siblings('tr:last').hide();
		enable_sibling_input($this, $this.val(), true);
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
		ShowServiceGroupSetting( $(this).val() );
		InitArr[InitArr.length-1][0].show();
		CurrentGroup = InitArr[InitArr.length-1][1];
	}).val( CurrentGroup );

	// Initial Service Group Setting
	ShowServiceGroupSetting( CurrentGroup );

	NotifyUser();

	button_enable(window);
});
