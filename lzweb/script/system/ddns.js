var CurrentWan;
var InitArr = new Array();

function Apply()
{
	var ddns_data = {};
	var i, j;
	var oSheet;
	var wan_index = $('#sel_wan option').size();
	for(i = 1; i <= wan_index; i++)
	{
		var wanidx = "wan" + i;
		ddns_data[wanidx] = {};
		var has = 1;
		for(j = 0; j < InitArr.length; j++)
		{
			if( i == InitArr[j][1] )
			{
				oSheet = InitArr[j][0];
				ddns_data[wanidx]['enable'] = oSheet.find('div.ddns_setting td:first').hasClass('itemEnabled')? 1 : 0;
				ddns_data[wanidx]['provider'] = oSheet.find('div.ddns_setting select:first').val();
				ddns_data[wanidx]['domain-name'] = oSheet.find('div.ddns_setting input:eq(0)').val();
				ddns_data[wanidx]['username'] = oSheet.find('div.ddns_setting input:eq(1)').val();
				ddns_data[wanidx]['password'] = oSheet.find('div.ddns_setting input:eq(2)').val();
				has = 0;
				break;
			}
		}
		if (has) //not show in UI, but has in cfg
		{
			ddns_data[wanidx] = ddns_jcfg[wanidx];
		}		
	}

	$('[name="DDnsSetting"]').val( JSON.stringify(ddns_data) );
}

function ShowWanSetting( index )
{
	var wanidx = "wan" + index;
	var wan_jcfg = ddns_jcfg[wanidx];
	var oSheet, i, tmpTr;
	
	oSheet = $('#oSheetTemplate').clone(true);
	oSheet.attr('id', wanidx);
	
	//Enable
	if ( wan_jcfg['enable'] )
		oSheet.find('td.toggle_enable').addClass('itemEnabled');
	else
		oSheet.find('td.toggle_enable').addClass('itemDisabled');
	
	//Provider	
	oSheet.find('div.ddns_setting select:first').val( wan_jcfg['provider'] );
	
	//Domain name
	oSheet.find('div.ddns_setting input:eq(0)').val( wan_jcfg['domain-name']);
	
	//User name
	oSheet.find('div.ddns_setting input:eq(1)').val( wan_jcfg['username'] );
	
	//Password
	oSheet.find('div.ddns_setting input:eq(2)').val( wan_jcfg['password'] );
	
	oSheet.appendTo($('div#WanSheet'));
	
	var sheetObj = new Array();
	sheetObj.push( oSheet );
	sheetObj.push( index );
	InitArr.push( sheetObj );
}
$(function(){
	var i, tmpTr;
	CurrentWan = 1;
	
	$('#WanSheet').show();
	
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
		
		ShowWanSetting( $(this).val() );

		InitArr[InitArr.length-1][0].show();
		CurrentLink = InitArr[InitArr.length-1][1];
	});
	
	$('.toggle_enable').click(function(){
		ToggleEnable($(this));
	});
	
	ShowWanSetting( CurrentWan );
	
	NotifyUser();

	button_enable(window);
});
