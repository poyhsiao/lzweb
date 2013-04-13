##index.html
<%inherit file="base.mako"/>

<%!
	import json
%>

<%block name="header">
	<link rel="stylesheet" href="/css/service/dhcp.css" type="text/css">
	<script type="text/javascript">
	var dhcp_range_list = ${json.dumps(dhcpargs['dynamic-range'])};
	var static_mapping_list = ${json.dumps(dhcpargs['static-mapping'])};
	</script>
	<script type="text/javascript" src="/script/service/dhcp.js"></script>
</%block>

<body>
<form name="fmResult" action="dhcpHandler" method="post" onsubmit="Apply();">
	<input type="hidden" name="no_submit" value="no">
	<input type="hidden" name="DhcpSetting">
</form>

<div class="table_div">
	<table class="table_main">
		<caption class="Nobr caption_out">${_(dhcp_caption)}</caption>
		<tr>
			<th class="dhcpTh">${_('DNS Server 1')}</th>
			<td><input type="text" id="dns_server_1" value="${dhcpargs['dns-server-1']}"></td>
		</tr>
		<tr>
			<th class="dhcpTh">${_('DNS Server 2')}</th>
			<td><input type="text" id="dns_server_2" value="${dhcpargs['dns-server-2']}"></td>
		</tr>
		<tr>
			<th class="dhcpTh">${_('Gateway')}</th>
			<td><input type="text" id="gateway" value="${dhcpargs['gateway']}"></td>
		</tr>
		<tr>
			<th class="dhcpTh">${_('Netmask')}</th>
			<td><input type="text" id="mask" value="${dhcpargs['mask']}"></td>
		</tr>
		<tr>
			<th class="dhcpTh">${_('DHCP Range')}</th>
			<td>
			<table id="DhcpRangeTable">
				<thead>
				<tr>
					<th id="addDhcpRange" class="Action">
					<img class="btnStyle" src="/image/plus.gif">
					</th>
					<th>${_('Starting Address')}</th>
					<th>${_('Ending Address')}</th>
				</tr>
				</thead>
				<tbody id="DhcpRangeTbody">
				</tbody>
			</table>
			</td>
		</tr>
		<tr>
			<th class="dhcpTh">${_('Static Mapping')}</th>
			<td>
			<table id="StaticMappingTable">
				<thead>
				<tr>
					<th id="addStaticMapping" class="Action">
					<img class="btnStyle" src="/image/plus.gif">
					</th>
					<th>${_('MAC Address')}</th>
					<th>${_('IP Address')}</th>
				</tr>
				</thead>
				<tbody id="StaticMappingTbody">
				</tbody>
			</table>
			</td>
		</tr>
	</table>
</div>

<div id="PrototypeSetting" class="settingtb">
	<table>
		<tr>
			<td class="Action"><img class="btnAdd btnStyle" src="/image/plus.gif">
			<img class="btnDelete btnStyle" src="/image/minus.gif">
			</td>
			<td><input type="text"></td>
			<td><input type="text"></td>
		</tr>
	</table>
</div>
</body>
