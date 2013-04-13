##index.html
<%inherit file="base.mako"/>

<%!
	import json
	import cgi
%>

<%block name="header">
	<link rel="stylesheet" href="/css/system/group.css" type="text/css">
	<%include file="service_header.mako"/>
	<script type="text/javascript">
	var vIpGroupAddrList = Array(
		"${_('IPv4 Address')}",
		"${_('IPv4 Range')}",
		"${_('Subnet/mask')}",
		"${_('fqdn@')}"
	);
	var ipgroup_jcfg = ${cgi.escape(json.dumps(ipgroup_args))};
	var fqdn_list = ${json.dumps(fqdn_args)};
	</script>
	<script type="text/javascript" src="/script/system/ip_group.js"></script>
</%block>

<body>
<form name="fmResult" action="ipgroupHandler" method="post" onsubmit="Apply();">
	<input type="hidden" name="no_submit" value="no">
	<input type="hidden" name="IpgroupSetting">
</form>
<div class="table_div">
	<table id="SelGroupTb" class="table_main">
		<tr>
			<th>${_('Group')}</th>
			<td><select id="sel_group">
			% for i in range(32):
				<option value=${i+1}>${i+1}</option>
			% endfor
			</select></td>
		</tr>
	</table>
</div>
<br>
<div id="oSheetTemp" class="table_div">
	<div class="ToggleSort">
		<span class="itemDisabled checkDragDrop">&nbsp;</span>${_('Drag and Drop')}
	</div>
	<table class="IpgroupTb table_main">
		<caption class="Nobr caption_out">${_('IP Group Rule')}</caption>
		<thead>
			<tr>
				<th>${_('Label')}</th>
				<td><input type="text"></td>
			</tr>
			<tr>
				<th class="addIpGroup Action">
				<img class="btnStyle" src="/image/plus.gif">
				</th>
				<th>${_('IPv4 Address')}</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
</div>

<div id="IpAddrRule" class="settingtb">
	<table>
		<tr>
			<th>${_('IPv4 Address')}</th>
			<td><select id="sel_addr">
			</select>
			</td>
			<td id="AddrTd"></td>
		</tr>
		<tr class="error_msg">
			<td colspan="3"></td>
		</tr>
	</table>
</div>

<div id="IpAddrSetting" class="settingtb">
	<table>
		<tr class="IpAddrSettingTr">
			<td><img class="btnEdit btnStyle" src="/image/edit.gif">
			<img class="btnDelete btnStyle" src="/image/minus.gif">
			</td>
			<td></td>
		</tr>
	</table>
</div>
</body>
