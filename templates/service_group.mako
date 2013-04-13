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
	vServiceGroupList = Array(
		"${'proto@'}",
		"${'tcp@'}",
		"${'udp@'}"
	);
	var servicegroup_jcfg = ${cgi.escape(json.dumps(servicegroup_args))};
	</script>
	<script type="text/javascript" src="/script/system/service_group.js"></script>
</%block>

<body>
<form name="fmResult" action="servicegroupHandler" method="post" onsubmit="Apply();">
	<input type="hidden" name="no_submit" value="no">
	<input type="hidden" name="ServicegroupSetting">
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
	<table class="ServicegroupTb table_main">
		<caption class="Nobr caption_out">${_('Service Group Rule')}</caption>
		<thead>
			<tr>
				<th>${_('Label')}</th>
				<td><input type="text"></td>
			</tr>
			<tr>
				<th class="addServiceGroup Action">
				<img class="btnStyle" src="/image/plus.gif">
				</th>
				<th>${_('Service')}</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
</div>

<div id="ServiceRule" class="settingtb">
	<table>
		<tr>
			<th>${_('Service')}</th>
			<td><select id="sel_service">
			</select>
			</td>
			<td id="ServiceTd"><input type="text" class="tb_input" disabled></td>
		</tr>
		<tr class="error_msg">
			<td colspan="3"></td>
		</tr>
	</table>
</div>

<div id="ServiceSetting" class="settingtb">
	<table>
		<tr class="ServiceSettingTr">
			<td><img class="btnEdit btnStyle" src="/image/edit.gif">
			<img class="btnDelete btnStyle" src="/image/minus.gif">
			</td>
			<td></td>
		</tr>
	</table>
</div>
</body>
