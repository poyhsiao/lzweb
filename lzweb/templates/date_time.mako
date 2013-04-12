##index.html
<%inherit file="base.mako"/>

<%!
	import json
	import tz
	timezone = sorted(tz.TZ.keys())
%>

<%block name="header">
	<link rel="stylesheet" href="/css/system/date_time.css" type="text/css">
	<%include file="menu.mako"/>
	<script type="text/javascript">
	var time_jcfg = ${json.dumps(timeargs)};
	</script>
	<script src="/script/system/date_time.js"></script>
</%block>

<body>
<form name="fmResult" action="timeHandler" method="post" onsubmit="Apply();">
	<input type="hidden" name="no_submit" value="no">
	<input type="hidden" name="TimeSetting">
</form>
<div class="table_div">
	<table class="table_main">
		<caption class="Nobr caption_out">${_('Date/Time Setting')}</caption>
		<tr>
			<th>${_('Time Zone')}</th>
			<td><select id="time_zone">
			% for key in timezone:
				<option>${key}</option>
			% endfor
			</select></td>
		</tr>
		<tr>
			<th>${_('Time Server')}</th>
			<td>
				<input type="text" id="time_server">
			</td>
		</tr>
		<tr>
			<th>${_('Date')}</th>
			<td><input type="text" id="date"></td>
		</tr>
		<tr>
			<th>${_('Time')}</th>
			<td>
				<input type="text" id="time">
				<button id="btnSetTime" class="button_128">${_('Set Date/Time')}</button>
			</td>
		</tr>
	</table>
</div>
</body>
