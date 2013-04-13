##index.html
<%inherit file="base.mako"/>

<%!
	import json
	import const
%>

<%block name="header">
	<link rel="stylesheet" href="/css/system/diagnostic_tools.css" type="text/css">
	<%include file="service_header.mako"/>
	<script type="text/javascript">
	var all_wans = ${const.ALL_WANS};
	var confirm_msg = "${_('It may take several minutes in a complex network environment. Are you sure?')}";
	var target_warning_msg = "${_('Target should be a valid IP address or host name')}";
	var stop_cmd = Array(
		"${_('Stop ping command successfully')}",
		"${_('Stop traceroute command successfully')}"
	);
	vInterfaceList.length = ${len(const.ALL_WANS)} + 2;
	</script>
	<script src="/script/system/diagnostic_tools.js"></script>
</%block>

<body>
<form id="fmResult" action="diagnostic_toolsHandler" method="post">
	<input type="hidden" name="no_submit" value="yes">
</form>
<div class="table_div">
	<table class="table_main">
		<caption class="Nobr caption_out">${_('Diagnostic Tools')}</caption>
		<tr>
			<th>${_('ARP Enforcement')}</th>
			<td><button id="arp_enforce" class="button_200">${_('Enforce')}</button></td>
		</tr>
		<tr>
			<th>${_('IP Conflict Test')}</th>
			<td><button id="ip_conflict_test" class="button_200">${_('Test')}</button></td>
		</tr>
	</table>
</div>
<br>
<div class="table_div">
	<table class="table_main">
		<caption class="Nobr caption_out">${_('Ping & Trace Route')}</caption>
		<tr>
			<th>${_('Target IP')}</th>
			<td><input type="text" id="target_ip"></td>
			<th>${_('Interface')}</th>
			<td><select id="sel_Interface">
			</select></td>
		</tr>
		<tr>
			<td colspan="4">
				<textarea id="textarea" readonly="true" wrap="off"></textarea>
			</td>
		</tr>
		<tr>
			<td colspan="4">
				<button id="ping" class="button_200">${_('Ping')}</button>
				<button id="traceroute" class="button_200">${_('Trace')}</button>
				<button id="stop" class="button_200">${_('Stop')}</button>
			</td>
		</tr>
	</table>
</div>
</body>
