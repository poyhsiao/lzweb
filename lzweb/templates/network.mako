##index.html
<%inherit file="base.mako"/>

<%!
	import json
	import const
%>

<%block name="header">
	<link rel="stylesheet" href="/css/system/network.css" type="text/css">
	<%include file="service_header.mako"/>
	<script type="text/javascript">
	var network_jcfg = ${json.dumps(network_args)};
	var usb_jcfg = ${json.dumps(usb_args)};
	var wan_num = ${len(const.ALL_NICS)};
	var usb_num = ${len(const.ALL_USBS)};
	</script>
	<script src="/script/system/network.js"></script>
</%block>

<body>
<form name="fmResult" action="networkHandler" method="post" onsubmit="Apply();">
	<input type="hidden" name="no_submit" value="no">
	<input type="hidden" name="NetworkSetting">
</form>

<div id="WanSheet">
	<div class="table_div">
		<table id="SelWanTb" class="table_main">
			<tr>
				<th>${_('WAN')}</th>
				<td><select id="sel_wan">
				% for index in range(len(const.ALL_WANS)):
					<option value=${index+1}>${index+1}</option>
				% endfor
				</select></td>
			</tr>
		</table>
	</div>
	<br>
	<div id="o3GTemplate">
		<div class="table_div 3g_status">
			<table class="table_main">
				<caption class="Nobr caption_out">${_('USB Modem Status')}</caption>
				<tr>
					<th>${_('Status')}</th>
					<td></td>
				</tr>
				<tr>
					<th>${_('Brand')}/${_('model')}</th>
					<td></td>
				</tr>
				<tr>
					<th>${_('Operator')}</th>
					<td></td>
				</tr>
				<tr>
					<th>${_('Mode')}</th>
					<td></td>
				</tr>
				<tr>
					<th>${_('Quality')}</th>
					<td></td>
				</tr>
			</table>
		</div>
		<br>
		<div class="table_div wan_basic_subnet">
			<table class="table_main">
				<caption class="Nobr caption_out">${_('Basic Setting')}</caption>
				<tr>
					<th>${_('Enable')}</th>
					<td class="toggle_enable"></td>
				</tr>
				<tr>
					<th>${_('Label')}</th>
					<td><input type="text"></td>
				</tr>
				<tr>
					<th>${_('Downstream')}</th>
					<td>
						<input type="text">
						<span>Kbps</span>
					</td>
				</tr>
				<tr>
					<th>${_('Upstream')}</th>
					<td>
						<input type="text">
						<span>Kbps</span>
					</td>
				</tr>
			</table>
		</div>	
		<br>
		<div class="table_div usb">
			<table class="table_main">
				<caption class="Nobr caption_out">${_('3G/3.5G Dial-up Setting')}</caption>
					<tr>
						<th>${_('PIN')}</th>
						<td><input type="text"></td>
					</tr>
					<tr>
						<th>${_('APN')}</th>
						<td><input type="text"></td>
					</tr>
					<tr>
						<th>${_('Dial number')}</th>
						<td><input type="text"></td>
					</tr>
					<tr>
						<th>${_('User Name')}</th>
						<td><input type="text"></td>
					</tr>
					<tr>
						<th>${_('Password')}</th>
						<td><input type="password"></td>
					</tr>
					<tr>
						<th>${_('MTU')}</th>
						<td><input type="text"></td>
					</tr>
			</table>
		</div>
	</div>	
	<div id="oSheetTemplate">
	<%def name="ethernet()">
		<div class="table_div ethernet">
			<table class="table_main">
				<caption class="Nobr caption_out">${_('Ethernet')}</caption>
				<tr>
					<th>${_('Clone MAC')}</th>
					<td><input type="text"></td>
				</tr>
				<tr>
					<th>${_('MTU')}</th>
					<td><input type="text"></td>
				</tr>
 				<tr>
					<th>${_('Speed/Duplex')}</th>
					<td><select class="speed_duplex">
					</select></td>
				</tr>
			</table>
		</div>
	</%def>
	${ethernet()}
	<br>
	<div class="table_div wan_basic_subnet">
		<table class="table_main">
			<caption class="Nobr caption_out">${_('Basic Setting')}</caption>
			<tr>
				<th>${_('Enable')}</th>
				<td class="toggle_enable"></td>
			</tr>
			<tr>
				<th>${_('Label')}</th>
				<td><input type="text"></td>
			</tr>
			<tr>
				<th>${_('WAN Type')}</th>
				<td><select class="wan_type">
				</select></td>
			</tr>
			<tr>
				<th>${_('Downstream')}</th>
				<td>
					<input type="text">
					<span>Kbps</span>
				</td>
			</tr>
			<tr>
				<th>${_('Upstream')}</th>
				<td>
					<input type="text">
					<span>Kbps</span>
				</td>
			</tr>
		</table>
	</div>
	<br>
	<div class="table_div static">
		<table class="table_main">
			<caption class="Nobr caption_out">${_('IPv4 Static Type')}</caption>
			<tbody>
			<tr>
				<th>${_('Gateway')}</th>
				<td colspan="2"><input type="text"></td>
			</tr>
			<tr>
				<th>${_('Netmask')}</th>
				<td colspan="2"><input type="text"></td>
			</tr>
			<tr>
				<th>${_('IP Address/Range')}</th>
				<td>
				<table class="wan_static_settings">
					<thead>
					<tr>
						<th class="Action addWanStaticIP">
						<img class="btnStyle" src="/image/plus.gif">
						</th>
						<td class="ToggleSort2"><span class="itemDisabled checkDragDrop2">&nbsp;</span>${_('Drag and Drop')}</td>
					</tr>
					</thead>
					<tbody name="WanStaticTbody">
					</tbody>
				</table>
				</td>
			</tr>
			</tbody>
		</table>
	</div>
	<div class="table_div pppoe">
		<table class="table_main">
			<caption class="Nobr caption_out">${_('PPPoE Type')}</caption>
			<tr>
				<th>${_('User Name')}</th>
				<td><input type="text"></td>
			</tr>
			<tr>
				<th>${_('Password')}</th>
				<td><input type="password"></td>
			</tr>
			<tr>
				<th>${_('Service Name')}</th>
				<td><input type="text"></td>
			</tr>
			<tr>
				<th>${_('IPv4 Address')}</th>
				<td><input type="text"></td>
			</tr>
			<tr>
				<th>${_('Daily Redial')}</th>
				<td><input type="text"></td>
			</tr>
		</table>
	</div>
	<br>
	<div class="table_div public_ip_passthrough">
		<table class="table_main">
			<caption class="Nobr caption_out">${_('IPv4 Public IP Passthrough')}</caption>
			<tr>
				<th>${_('Netmask')}</th>
				<td><input type="text"></td>
			</tr>
			<tr>
				<th>${_('IP Address/Range')}</th>
				<td>
				<table class="public_ip_passthrough_settings">
					<thead>
					<tr>
						<th class="Action addPublicIpPassthrough">
						<img class="btnStyle" src="/image/plus.gif">
						</th>
						<td class="ToggleSort2"><span class="itemDisabled checkDragDrop2">&nbsp;</span>${_('Drag and Drop')}</td>
					</tr>
					</thead>
					<tbody name="PublicIPPassthroughTbody">
					</tbody>
				</table>
				</td>
			</tr>
		</table>
	</div>
	</div>
	<div id="WanPrototypeSetting" class="settingtb">
		<table>
			<tr class="WanPrototypeTr">
				<td class="Action"><img class="btnStyle btnWanAdd" src="/image/plus.gif">
				<img class="btnStyle btnDelete" src="/image/minus.gif">
				</td>
				<td><input type="text"></td>
			</tr>
		</table>
	</div>
</div>
<div id="DmzSheet">
	${ethernet()}
	<br>
	<%def name="basic_subnet()">	
		<div class="table_div basic_subnet">
			<div class="ToggleSort">
				<span class="itemDisabled checkDragDrop">&nbsp;</span>${_('Drag and Drop')}
			</div>
			<table class="table_main">
				<caption class="Nobr caption_out">${_('IPv4 Basic Subnet')}</caption>
				<thead>
				<tr>
					<th class="Action addBasicSubnet">
					<img class="btnStyle" src="/image/plus.gif">
					</th>
					<th>${_('IP Address/Range')}</th>
					<th>${_('Netmask')}</th>
				</tr>
				</thead>
				<tbody name="BasicSubnetTbody">
				</tbody>
			</table>
		</div>
	</%def>
	${basic_subnet()}
	<br>
	<%def name="static_routing_subnet()">
		<div class="table_div static_routing_subnet">
			<div class="ToggleSort">
				<span class="itemDisabled checkDragDrop">&nbsp;</span>${_('Drag and Drop')}
			</div>
			<table class="table_main">
				<caption class="Nobr caption_out">${_('IPv4 Static Routing Subnet')}</caption>
				<thead>
				<tr>
					<th class="Action addStaticRoutingSubnet">
					<img class="btnStyle" src="/image/plus.gif">
					</th>
					<th>${_('Subnet/Mask')}</th>
					<th>${_('Gateway')}</th>
				</tr>
				</thead>
				<tbody name="StaticRoutingSubnetTbody">
				</tbody>
			</table>
		</div>
	</%def>
	${static_routing_subnet()}
</div>
<div id="LanSheet">
	${ethernet()}
	<br>
	${basic_subnet()}
	<br>
	${static_routing_subnet()}
</div>
<div id="PrototypeSetting" class="settingtb">
	<table>
		<tr class="PrototypeTr">
			<td class="Action"><img class="btnStyle btnAdd" src="/image/plus.gif">
			<img class="btnStyle btnDelete" src="/image/minus.gif">
			</td>
			<td><input type="text"></td>
			<td><input type="text"></td>
		</tr>
	</table>
</div>
</body>
