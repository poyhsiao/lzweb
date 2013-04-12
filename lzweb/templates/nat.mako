##index.html
<%inherit file="base.mako"/>

<%!
	import json
	import const
%>

<%block name="header">
	<link rel="stylesheet" href="/css/service/nat.css" type="text/css">
	<%include file="service_header.mako"/>
	<script type="text/javascript">
	var nat_jcfg = ${json.dumps(nat_args)};
	var ipgroup_list = ${json.dumps(ipgroup_args)};
	var servicegroup_list = ${json.dumps(servicegroup_args)};
	var fqdn_list = ${json.dumps(fqdn_args)};
	var summary_jcfg = ${json.dumps(summary_args)};
	var NatBtnTitle = Array(
		"${_('Add nat rules')}",
		"${_('Edit nat rules')}",
		"${_('Delete nat rules')}"
	);
	</script>
	<script src="/script/service/nat.js"></script>	
</%block>

<body>
<form name="fmResult" action="natHandler" method="post" onsubmit="Apply();">
	<input type="hidden" name="no_submit" value="no">
	<input type="hidden" name="NatSetting">
</form>

<div id="WanIndex" class="table_div">
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

<div id="oSheetTemplate">
<div id="WanEnable" class="table_div">
	<table class="table_main">
		<tr>
			<th>${_('Enable')}</th>
			<td class="EnableWan">&nbsp;</td>
		</tr>
	</table>
</div>

<br>

<div id="NatRule" class="table_div">
	<div class="ToggleSort">
		<span class="itemDisabled checkDragDrop">&nbsp;</span>${_('Drag and Drop')}
	</div>
	<table class="NatRuleTb table_main">
		<caption class="Nobr caption_out">${_('IPv4 Rules')}</caption>
		<thead>
		<tr>
			<th class="addNatRule Action">
			<img class="btnStyle" src="/image/plus.gif">
			</th>
			<th>${_('Source')}</th>
			<th>${_('Destination')}</th>
			<th>${_('Service')}</th>
			<th>${_('Translate')}</th>
			<th id="logTh">${_('Log')}</th>
		</tr>
		</thead>
		<tbody name="NatTbody">
		</tbody>
	</table>
</div>
</div>

<div id="NatRuleDetail" class="settingtb">
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
			<th>${_('Translate')}</th>
			<td class="SelTd"><select id="sel_Translate"></select></td>
			<td><input type="text" class="tb_input" disabled></td>
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

<div id="NatRuleSetting" class="settingtb">
	<table>
		<tr class="NatRuleSettingTr">
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
