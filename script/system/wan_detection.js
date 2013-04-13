var AlwaysDetect, CurrentLink;
var InitArr = new Array();

function AutoInitVal( jcfg )
{
	if (jcfg['detection-period'] == null)
		jcfg['detection-period'] = 3;
	if (jcfg['targets-per-detection'] == null)
		jcfg['targets-per-detection'] = 0;
	if (jcfg['retries'] == null)
		jcfg['retries'] = 1;
}

function ShowWanDetSetting( index )
{
	var wanidx = "wan" + index;
	var oSheet, tmpTr;

	oSheet = $('#oSheetTemplate').clone(true);

	oSheet.find('table.icmpTb').sortable({
		axis: "y",
		containment: "parent",
		items: "tr.PrototypeTr"
	}).sortable('disable');

	oSheet.find('table.tcpTb').sortable({
		axis: "y",
		containment: "parent",
		items: "tr.PrototypeTr"
	}).sortable('disable');

	oSheet.attr('id', wanidx);
	// Auto initial value
	AutoInitVal(wandet_jcfg[wanidx]);
	oSheet.find('input:eq(0)').val( wandet_jcfg[wanidx]['detection-period'] );
	oSheet.find('input:eq(1)').val( wandet_jcfg[wanidx]['targets-per-detection'] );
	oSheet.find('input:eq(2)').val( wandet_jcfg[wanidx]['retries'] );


	// Initial tcp table
	if (wandet_jcfg[wanidx]['tcp-target'])
	{
		var TcpTbody = oSheet.find('tbody[name="TcpTbody"]');
		for(var i = 0; i < wandet_jcfg[wanidx]['tcp-target'].length; i++)
		{
			tmpTr = $('#PrototypeSetting tr').clone(true);
			tmpTr.find('input:first').val( wandet_jcfg[wanidx]['tcp-target'][i]['ip'] );
			tmpTr.find('input:last:').val( wandet_jcfg[wanidx]['tcp-target'][i]['port'] );
			tmpTr.appendTo(TcpTbody);
		}
	}
	// Initial icmp table
	if (wandet_jcfg[wanidx]['icmp-target'])
	{
		var IcmpTbody = oSheet.find('tbody[name="IcmpTbody"]');
		for(var i = 0; i < wandet_jcfg[wanidx]['icmp-target'].length; i++)
		{
			tmpTr = $('#PrototypeSetting tr').clone(true);
			tmpTr.find('input:first').val( wandet_jcfg[wanidx]['icmp-target'][i]['ip'] );
			tmpTr.find('input:last:').val( wandet_jcfg[wanidx]['icmp-target'][i]['hops'] );
			tmpTr.appendTo(IcmpTbody);
		}
	}
	
	if (wandet_jcfg[wanidx]['detection-protocol'] == "tcp")
	{
		oSheet.find('select.sel_protocol').val(1);
		oSheet.find('div#icmp_div').hide();
		oSheet.find('div#tcp_div').show();
	}
	else
	{
		oSheet.find('select.sel_protocol').val(0);
		oSheet.find('div#icmp_div').show();
		oSheet.find('div#tcp_div').hide();
	}
	oSheet.appendTo($(document.body));

	var sheetObj = new Array();
	sheetObj.push( oSheet );
	sheetObj.push( index );
	InitArr.push( sheetObj );
}

function Apply()
{
	var wandet_data = {};
	var oSheet;
	wandet_data['ignore-inbound-traffic'] = AlwaysDetect;
	var wan_index = $('#sel_wan option').size();
	for(var i = 1; i <= wan_index; i++)
	{
		var wanidx = "wan" + i;
		wandet_data[wanidx] = {};
		var has = 1;
		for(var j = 0; j < InitArr.length; j++)
		{
			if( i == InitArr[j][1] )
			{
				oSheet = InitArr[j][0];
				wandet_data[wanidx]['detection-protocol'] = (oSheet.find('select.sel_protocol').val() == "0")? "icmp" : "tcp";
				wandet_data[wanidx]['detection-period'] = oSheet.find('input:eq(0)').val();
				wandet_data[wanidx]['targets-per-detection'] = oSheet.find('input:eq(1)').val();
				wandet_data[wanidx]['retries'] = oSheet.find('input:eq(2)').val();

				var tcpTbody = oSheet.find('tbody[name="TcpTbody"] tr');
				if( tcpTbody.size() )
				{
					wandet_data[wanidx]['tcp-target'] = new Array();
					for(var k = 0; k < tcpTbody.size(); k++)
					{
						wandet_data[wanidx]['tcp-target'][k] = {};
						wandet_data[wanidx]['tcp-target'][k]['ip'] = tcpTbody.eq(k).find('input:first').val();
						wandet_data[wanidx]['tcp-target'][k]['port'] = tcpTbody.eq(k).find('input:last').val();
					}
				}
				var icmpTbody = oSheet.find('tbody[name="IcmpTbody"] tr');
				if( icmpTbody.size() )
				{
					wandet_data[wanidx]['icmp-target'] = new Array();
					for(var k = 0; k < icmpTbody.size(); k++)
					{
						wandet_data[wanidx]['icmp-target'][k] = {};
						wandet_data[wanidx]['icmp-target'][k]['ip'] = icmpTbody.eq(k).find('input:first').val();
						wandet_data[wanidx]['icmp-target'][k]['hops'] = icmpTbody.eq(k).find('input:last').val();
					}
				}
				has = 0;
				break;
			}
		}
		if (has) //not show in UI, but has in cfg
		{
			AutoInitVal(wandet_jcfg[wanidx]);
			wandet_data[wanidx]['detection-period'] = wandet_jcfg[wanidx]['detection-period'];
			wandet_data[wanidx]['targets-per-detection'] = wandet_jcfg[wanidx]['targets-per-detection'];
			wandet_data[wanidx]['retries'] = wandet_jcfg[wanidx]['retries'];
			if (wandet_jcfg[wanidx]['detection-protocol'] == null)
				wandet_data[wanidx]['detection-protocol'] = "icmp";
			else
				wandet_data[wanidx]['detection-protocol'] = wandet_jcfg[wanidx]['detection-protocol'];
				
			wandet_data[wanidx]['tcp-target'] = wandet_jcfg[wanidx]['tcp-target'];
			wandet_data[wanidx]['icmp-target'] = wandet_jcfg[wanidx]['icmp-target'];
		}
	}
	$('[name="WanDetSetting"]').val( JSON.stringify(wandet_data) );
}

$(function(){
	CurrentLink = 1;
	AlwaysDetect = wandet_jcfg['ignore-inbound-traffic'];

	$('#oAlways').click(function(){
		ToggleEnable($(this), AlwaysDetect);
		if( $(this).hasClass('itemEnabled') )
		{
			 AlwaysDetect = 1;
		}
		else
		{
			AlwaysDetect = 0;
		}
	});

	$('th.addTcpList').click(function(){
		var TcpTbody = $(this).closest('thead').siblings('tbody');
		$('#PrototypeSetting tr').clone(true).prependTo(TcpTbody);
	});

	$('th.addIcmpList').click(function(){
		var IcmpTbody = $(this).closest('thead').siblings('tbody');
		$('#PrototypeSetting tr').clone(true).prependTo(IcmpTbody);	
	});

	$('img.btnAdd').click(function(){
		$('#PrototypeSetting tr').clone(true).insertAfter($(this).closest('tr'));
	});

	$('img.btnDelete').click(function(){
		$(this).closest('tr').detach();
	});

	$('.checkDragDrop').click(function(){
		sort_setting($(this), $(this).closest('div.table_div').find('table'));
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
		ShowWanDetSetting( $(this).val() );
		InitArr[InitArr.length-1][0].show();
		CurrentLink = InitArr[InitArr.length-1][1];
	});

	$('select.sel_protocol').change(function(){
		if( $(this).val() == "0") //icmp
		{
			for( var i=0; i < InitArr.length; i++ )
			{
				if( CurrentLink == InitArr[i][1] )
				{
					InitArr[i][0].find('div#icmp_div').show();
					InitArr[i][0].find('div#tcp_div').hide();
					return;
				}
			}
		}
		else //tcp
		{
			for( var i=0; i < InitArr.length; i++ )
			{
				if( CurrentLink == InitArr[i][1] )
				{
					InitArr[i][0].find('div#icmp_div').hide();
					InitArr[i][0].find('div#tcp_div').show();
					return;
				}
			}
		}
	});
	
	// Initial
	if (AlwaysDetect){
		$('#oAlways').addClass("itemEnabled");
	}else{
		$('#oAlways').addClass("itemDisabled");
	}
	$('#sel_wan').val( CurrentLink );

	ShowWanDetSetting( CurrentLink );

	NotifyUser();

	button_enable(window);
});
