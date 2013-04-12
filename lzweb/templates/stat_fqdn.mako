##index.html
<%inherit file="base.mako"/>

<%!
	import json
%>

<%block name="header">
	<link rel="stylesheet" href="/css/statistics/stat_fqdn.css" type="text/css">
	<script type="text/javascript">
	var stat_fqdn_jcfg = ${json.dumps(stat_fqdn_args)};
	var refresh_time = "${time}";
	</script>
	<script src="/script/statistics/stat_fqdn.js"></script>
</%block>

<body>
<form name="fmResult" action="statFqdnHandler" method="post" onsubmit="Apply();">
	<input type="hidden" name="no_submit" value="yes">
	<input type="hidden" name="time">
</form>
<div class="table_div">
	<table id="FqdnSettingTb" class="table_main">
		<tr>
			<th class="Nobr">${_('Automatic Refresh')}</th>
			<td><select id="sel_period">
				<option value="0" selected>${_('Disabled')}</option>
				<option value="3">${_('Every 3 Seconds')}</option>
				<option value="6">${_('Every 6 Seconds')}</option>
				<option value="9">${_('Every 9 Seconds')}</option>
				<option value="15">${_('Every 15 Seconds')}</option>
				<option value="21">${_('Every 21 Seconds')}</option>
				<option value="30">${_('Every 30 Seconds')}</option>
				<option value="39">${_('Every 39 Seconds')}</option>
				<option value="51">${_('Every 51 Seconds')}</option>
				<option value="63">${_('Every 63 Seconds')}</option>
			</select></td>
		</tr>
	</table>
</div>
<br>
<div class="table_div">
	<table class="table_main">
		<caption class="Nobr caption_out">${_('FQDN')}</caption>
		<thead id="StatThead">
		<tr>
			<th>${_('No.')}</th>
			<th>${_('FQDN')}</th>
			<th>${_('IP 1')}</th>
			<th>${_('IP 2')}</th>
			<th>${_('IP 3')}</th>
			<th>${_('IP 4')}</th>
		</tr>
		</thead>
		<tbody id="StatTbody">
		</tbody>	
	</table>
</div>
<div id="stat_fqdn_detail" class="settingtb">
	<table>
		<tr class="StatFqdn">
		% for index in range(6):
			<td></td>
		% endfor
		</tr>
	</table>
</div>
</body>
