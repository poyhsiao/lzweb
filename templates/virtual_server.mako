##index.html
<%inherit file="base.mako"/>

<%!
	import json
	import const
%>

<%block name="header">
	<link rel="stylesheet" href="/css/service/virtual_server.css" type="text/css">
	<%include file="service_header.mako"/>
	<script type="text/javascript">
	var vs_jcfg = ${json.dumps(vsargs)};
	var servicegroup_list = ${json.dumps(servicegroup_args)};
	var all_wans = ${const.ALL_WANS};
	var VsBtnTitle = Array(
		"${_('Add virtual server rules')}",
		"${_('Edit virtual server rules')}",
		"${_('Delete virtual server rules')}"
	);
	</script>
	<script src="/script/service/virtual_server.js"></script>
</%block>

<body>
<form name="fmResult" action="virtualserverHandler" method="post" onsubmit="Apply();">
	<input type="hidden" name="no_submit" value="no">
	<input type="hidden" name="VirtualserverSetting">
</form>
<div id="VsRule" class="table_div">
	<div class="ToggleSort">
		<span class="itemDisabled checkDragDrop">&nbsp;</span>${_('Drag and Drop')}
	</div>
	<table id="VsRuleTable" class="table_main">
		<caption class="Nobr caption_out">
			${_('Virtual Server')}
		</caption>
		<thead>
		<tr>
			<th rowspan="2" id="addRule" class="Action">
			<img class="btnStyle" src="/image/plus.gif">
			</th>
			<th colspan="${len(const.ALL_WANS)+1}">${_('Virtual Server')}</th>
			<th colspan="2">${_('Real Server')}</th>
			<th rowspan="2">${_('Log')}</th>
		</tr>
		<tr>
			% for index in const.ALL_WANS:
				<th rowspan="2">${_(index)}</th>
			% endfor
			<th>${_('Service')}</th>
			<th>${_('IPv4')}</th>
			<th>${_('Port Mapping')}</th>
		</tr>
		</thead>
		<tbody id="RuleTbody">
		</tbody>
	</table>
</div>

<div id="VsRuleDetail" class="settingtb">
	<table>
		<tr class="VsRuleTr">
			<th colspan="3">${_('Virtual Server')}</th> 
		</tr>
	 	% for index in const.ALL_WANS:
			<tr>
				<th class="VsRuleTh">${_(index)}</th>
				<td><select class="sel_Wan"></select></td>
				<td><input type="text"></td>
			</tr>
		% endfor
		<tr>
			<th class="VsRuleTh">${_('Service')}</th>
			<td><select id="sel_Service"></select></td>
			<td></td>
		</tr>
		<tr class="RsRuleTr">
			<th colspan="3">${_('Real Server')}</th>
		</tr>
		<tr>
			<th class="RsRuleTh">${_('IPv4')}</th>
			<td colspan="2"><input type="text" id="real_ip"></td>
		</tr>
		<tr id="port_mapping">
			<th class="RsRuleTh">${_('Port Mapping')}</th>
			<td colspan="2"><input type="text"></td>
		</tr>
		<tr id="log">
			<th>${_('Log')}</th>
			<td><input type="checkbox"></td>
		</tr>
		<tr class="error_msg">
			<td colspan="3"></td>
		</tr>
	</table>
</div>

<div id="VsRuleSetting" class="settingtb">
	<table>
		<tr class="VsSetting">
			<td><img class="btnEdit btnStyle" src="/image/edit.gif">
			<img class="btnDelete btnStyle" src="/image/minus.gif">
			</td>
			% for index in range(len(const.ALL_WANS)+ 4):
				<td></td>
			% endfor
		</tr>
	</table>
</div>
</body>
