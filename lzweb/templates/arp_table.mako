##index.html
<%inherit file="base.mako"/>

<%!
	import json
	import const
%>

<%block name="header">
	<link rel="stylesheet" href="/css/system/arp_table.css" type="text/css">
	<%include file="service_header.mako"/>
	<script type="text/javascript">
	var arp_table_jcfg = ${json.dumps(arptable_args)};
	var all_wans = ${const.ALL_WANS};
	vInterfaceList.length = ${len(const.ALL_WANS)} + 2;
	</script>
	<script src="/script/system/arp_table.js"></script>
</%block>

<body>
<form name="fmResult" action="arptableHandler" method="post" onsubmit="Apply();">
	<input type="hidden" name="no_submit" value="no">
	<input type="hidden" name="ArptableSetting">
</form>

<div class="table_div">
	<div class="ToggleSort">
		<span class="itemDisabled checkDragDrop">&nbsp;</span>${_('Drag and Drop')}
	</div>
	<table id="FixedTb" class="table_main">
		<caption class="Nobr caption_out">${_('Fixed Entries Setting')}</caption>
			<thead>
			<tr>
				<th class="addFixed Action">
				<img class="btnStyle" src="/image/plus.gif">
				</th>
				<th>${_('Interface')}</th>
				<th>${_('IP Address')}</th>
				<th>${_('MAC Address')}</th>
			</tr>
			</thead>
			<tbody id="FixedTbody">
			</tbody>
	</table>
</div>
<br>
<div class="table_div">
	<table class="table_main">
		<caption class="Nobr caption_out">${_('Dynamic Entries Setting')}</caption>
			<thead>
			<tr>
				<th>${_('Interface')}</th>
				<th>${_('IP Address')}</th>
				<th>${_('MAC Address')}</th>
				<th>${_('Fix')}</th>
			</tr>
			</thead>
			<tbody id="DynamicTbody">
			</tbody>
	</table>
</div>

<div id="FixedRule" class="settingtb">
	<table>
		<tr>
			<th>${_('Interface')}</th>
			<td><select id="sel_Interface"></select></td>
		</tr>
		<tr>
			<th>${_('IP Address')}</th>
			<td><input type="text"></td>
		</tr>
		<tr>
			<th>${_('MAC Address')}</th>
			<td><input type="text"></td>
		</tr>
		<tr class="error_msg">
			<td colspan="2"></td> 
		</tr>
	</table>
</div>
<div id="FixedSetting" class="settingtb">
	<table>
		<tr class="FixedSettingTr">
			<td><img class="btnEdit btnStyle" src="/image/edit.gif">
			<img class="btnDelete btnStyle" src="/image/minus.gif">
			</td>
			<td></td>
			<td></td>
			<td></td>
		</tr>
	</table>
</div>
</body>
