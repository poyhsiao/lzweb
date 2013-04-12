##index.html
<%inherit file="base.mako"/>

<%!
	import json
	import const
%>

<%block name="header">
	<link rel="stylesheet" href="/css/system/summary.css" type="text/css">
	<%include file="menu.mako"/>
	<script type="text/javascript">
	var summary_jcfg = ${json.dumps(summary_args)};
	var all_wans = ${const.ALL_WANS};
	</script>
	<script src="/script/system/summary.js"></script>
</%block>

<body>
<form id="fmResult" action="summaryHandler" method="post">
	<input type="hidden" name="no_submit" value="yes">
	<input type="hidden" name="position">
</form>
<div id="sys_info_div" class="table_div">
	<table id="sys_info_table" class="table_main">
		<caption class="Nobr caption_out">${_('System Information')}</caption>
		<%def name="GenSysInfoRow(name, value)">
		<tr>
			<th>${name}</th>
			<td class="dotted">&nbsp;</td>
			<td class="info">${value}</td>
		</tr>
		</%def>
		${GenSysInfoRow(_('Version'), summary_args['version'])}
		${GenSysInfoRow(_('Serial Number'), summary_args['sn'])}
		${GenSysInfoRow(_('Uptime'), summary_args['uptime'])}
		${GenSysInfoRow(_('Connections'), summary_args['connections'])}
		${GenSysInfoRow(_('CPU Usage %'), summary_args['cpu'])}
	</table>
</div>
<br>
<div id="port_info_div" class="table_div">
	<div id="detect_info">
		<span id="detect_ok">${_('DetectOK')}</span>
		<span id="detect_fail">${_('Failed')}</span>
	</div>
	<table id="port_info_table" class="table_main">
		<caption class="Nobr caption_out">${_('Port Information')}</caption>
		<tr>
			<th>${_('Interface')}</th>
			% for index in const.ALL_NICS:
				<th>${_(index)}</th>
			% endfor
			% for (dev, pos, rtab, dum) in const.IFMAP:
			%	if dev.startswith("usb"):
					<th>${_(pos)}(${_(dev)})</th>
			%	endif	
			% endfor
			<th>${_('LAN')}</th>
			<th>${_('DMZ')}</th>
		</tr>
		<%def name="GenPortInfoRow(name, id)">
		<tr id=${id}>
			<th>${name}</th>
			% for index in range(len(const.ALL_WANS)+ 2):
				<td></td>
			% endfor
		</tr>
		</%def>
		${GenPortInfoRow(_('DDNS Host'), "ddns")}
		${GenPortInfoRow(_('IPv4 Address'), "ipv4")}
		${GenPortInfoRow(_('Status'), "status")}
		${GenPortInfoRow(_('Rx (Kbps)'), "rx")}
		${GenPortInfoRow(_('TX (Kbps)'), "tx")}
		${GenPortInfoRow(_('Detection'), "detection")}
		<tr>
			<th>${_('Reconnect')}</th>
			<%def name="GenReconnectButton(name)">
				<td><button name=${name} class="button_80">${_('Reconnect')}</button></td>
			</%def>
			% for index in const.ALL_WANS:
				${GenReconnectButton(index)}
			% endfor
			<td>${_('N/A')}</td>
			<td>${_('N/A')}</td>
		</tr>
		${GenPortInfoRow(_('Connection Time'), "connection_time")}
		${GenPortInfoRow(_('Label'), "label")}
	</table>
</div>
</body>
