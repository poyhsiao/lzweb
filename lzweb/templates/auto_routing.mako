##index.html
<%inherit file="base.mako"/>

<%!
	import json
	import cgi
	import const
%>

<%block name="header">
	<link rel="stylesheet" href="/css/service/auto_routing.css" type="text/css">
	<%include file="service_header.mako"/>
	<script type="text/javascript">
	var ar_jcfg = ${cgi.escape(json.dumps(arargs))};
	var ipgroup_list = ${json.dumps(ipgroup_args)};
	var servicegroup_list = ${json.dumps(servicegroup_args)};
	var fqdn_list = ${json.dumps(fqdn_args)};
	var all_wans = ${const.ALL_WANS};
	var ArBtnTitle = Array(
		"${_('Add auto routing rules')}",
		"${_('Edit auto routing rules')}",
		"${_('Delete auto routing rules')}"
	);
	</script>
	<script src="/script/service/auto_routing.js"></script>
</%block>

<body>
<form name="fmResult" action="autoroutingHandler" method="post" onsubmit="Apply();">
	<input type="hidden" name="no_submit" value="no">
	<input type="hidden" name="AutoroutingSetting">
</form>

<div class="table_div">
	<table class="table_main">
		<caption class="Nobr caption_out">${_('Auto Routing Setting')}</caption>
		<tr>
			<th>${_('Method')}</th>
			<td><select id="sel_method">
			<option value="0">${_('weight')}</option>
			<option value="1">${_('traffic')}</option>
			</select></td>
		</tr>
		<tr id="ParamTr">
			<th>${_('Parameters')}</th>
			<td><input type="text" id="input_param" value="${arargs['parameter']}"></td>
		</tr>
		<tr>
			<th>${_('Persistence Time')}</th>
			<td><input type="text" id="input_aging" value="${arargs['aging']}"><span>${_('sec')}</span></td>
		</tr>
	</table>
</div>
<br>
<div id="ArRule" class="table_div">
	<div class="ToggleSort">
		<span class="itemDisabled checkDragDrop">&nbsp;</span>${_('Drag and Drop')}
	</div>
	<table id="ArRuleTable" class="table_main">
		<caption class="Nobr caption_out">
			${_('IPv4 Rules')}
		</caption>
		<thead>
		<tr>
			<th rowspan="2" id="addRule" class="Action">
			<img class="btnStyle" src="/image/plus.gif">
			</th>
			<th rowspan="2">${_('Source')}</th>
			<th rowspan="2">${_('Destination')}</th>
			<th rowspan="2">${_('Service')}</th>
			<th colspan=${len(const.ALL_WANS)}>${_('WAN')}</th>
			<th rowspan="2" class="checkboxTh">${_('Failover')}</th>
			<th rowspan="2" class="checkboxTh">${_('Persistent')}</th>
			<th rowspan="2" id="logTh">${_('Log')}</th>
		</tr>
		<tr>
			% for index in range(len(const.ALL_WANS)):
				<th>${index+1}</th>
			% endfor
		</tr>
		</thead>
		<tbody id="RuleTbody">
		</tbody>
	</table>
</div>

<div id="ArRuleDetail" class="settingtb">
	<table>
		<%def name="GenArRuleRow1(name, id)">
			<tr>
				<th class="ArRuleDetailTh">${name}</th>
				<td colspan=${len(const.ALL_WANS)} class="SelTd"><select id=${id}></select></td>
				<td></td>
			</tr>
		</%def>
		${GenArRuleRow1(_('Source'), "sel_Source")}
		${GenArRuleRow1(_('Destination'), "sel_Destination")}
		${GenArRuleRow1(_('Service'), "sel_Service")}
		<tr>
			<th rowspan="2" class="ArRuleDetailTh">${_('WAN')}</th>
			% for index in range(len(const.ALL_WANS)):
				<th>${index+1}</th>
			% endfor
		</tr>
		<tr>
			% for index in const.ALL_WANS:
				<td><input type="checkbox" name=${index}></td>
			% endfor
		</tr>
		<%def name="GenArRuleRow2(name)">
			<tr>
				<th class="ArRuleDetailTh">${name}</th>
				<td colspan=${len(const.ALL_WANS)}><input type="checkbox" class="checkboxInput"></td>
			</tr>
		</%def>
		${GenArRuleRow2(_('Failover'))}
		${GenArRuleRow2(_('Persistent'))}
		${GenArRuleRow2(_('Log'))}

		<tr class="error_msg">
			<td colspan=${len(const.ALL_WANS)+2}></td>
		</tr>
	</table>
</div>

<div id="ArRuleSetting" class="settingtb">
	<table>
		<tr class="ArSetting">
			<td><img class="btnEdit btnStyle" src="/image/edit.gif">
			<img class="btnDelete btnStyle" src="/image/minus.gif">
			</td>
			% for index in range(len(const.ALL_WANS)+ 6):
				<td></td>
			% endfor
		</tr>
	</table>
</div>
</body>
