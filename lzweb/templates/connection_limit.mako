##index.html
<%inherit file="base.mako"/>

<%!
	import json
%>

<%block name="header">
	<link rel="stylesheet" href="/css/service/connection_limit.css" type="text/css">
	<%include file="service_header.mako"/>
	<script type="text/javascript">
	var connlimit_jcfg = ${json.dumps(connlimit_args)};
	var ipgroup_list = ${json.dumps(ipgroup_args)};
	var servicegroup_list = ${json.dumps(servicegroup_args)};
	var fqdn_list = ${json.dumps(fqdn_args)};
	var ClBtnTitle = Array(
		"${_('Add connection limit rules')}",
		"${_('Edit connection limit rules')}",
		"${_('Delete connection limit rules')}"
	);
	</script>
	<script src="/script/service/connection_limit.js"></script>
</%block>

<body>
<form name="fmResult" action="connlimitHandler" method="post" onsubmit="Apply();">
	<input type="hidden" name="no_submit" value="no">
	<input type="hidden" name="ConnlimitSetting">
</form>
<div id="ConnlimitRule" class="table_div">
	<div class="ToggleSort">
		<span class="itemDisabled checkDragDrop">&nbsp;</span>${_('Drag and Drop')}
	</div>
	<table id="ConnlimitRuleTable" class="table_main">
		<caption class="Nobr caption_out">
			${_('IPv4 Rules')}
		</caption>
		<thead>
		<tr>
			<th id="addRule" class="Action">
			<img class="btnStyle" src="/image/plus.gif">
			</th>
			<th>${_('Source')}</th>
			<th>${_('Destination')}</th>
			<th>${_('Service')}</th>
			<th>${_('Conn/Sec')}</th>
			<th id="logTh">${_('Log')}</th>
		</tr>
		</thead>
		<tbody id="RuleTbody">
		</tbody>
	</table>
</div>

<div id="ConnlimitRuleDetail" class="settingtb">
	<table>
		<tr>
			<th>${_('Source')}</th>
			<td class="SelTd"><select id="sel_Source"></select></td>
			<td></td>
		</tr>
		<tr>
			<th>${_('Destination')}</th>
			<td class="SelTd"><select id="sel_Destination"></select></td>
			<td></td>
		</tr>
		<tr>
			<th>${_('Service')}</th>
			<td class="SelTd"><select id="sel_Service"></select></td>
			<td></td>
		</tr>
		<tr>
			<th>${_('Conn/Sec')}</th>
			<td class="SelTd"><input type="text" id="sel_Conn"></td>
		</tr>
		<tr>
			<th>${_('Log')}</th>
			<td><input type="checkbox" id="logInput"></td>
		</tr>
		<tr class="error_msg">
			<td colspan="3"></td>
		</tr>
	</table>
</div>

<div id="ConnlimitRuleSetting" class="settingtb">
	<table>
		<tr class="ConnlimitSetting">
			<td><img class="btnEdit btnStyle" src="/image/edit.gif">
			<img class="btnDelete btnStyle" src="/image/minus.gif">
			</td>
			% for index in range(5):
				<td></td>
			% endfor
		</tr>
	</table>
</div>
</body>
