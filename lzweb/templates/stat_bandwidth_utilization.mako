##index.html
<%inherit file="base.mako"/>

<%!
	import const
%>

<%block name="header">
	<link rel="stylesheet" href="/css/statistics/stat_bandwidth_utilization.css" type="text/css">
	<script src="/script/statistics/stat_bandwidth_utilization.js"></script>
</%block>

<body>
<form name="fmResult" action="statBandwidthUtilizationHandler" method="post" onsubmit="Apply();">
	<input type="hidden" name="no_submit" value="yes">
</form>
<div class="table_div">
	<table class="table_main">
		<tr>
			<th class="Nobr">${_('WAN Link')}</th>
			<td><select id="sel_wan">
			% for index in range(len(const.ALL_WANS)):
				<option value=${index+1}>${index+1}</option>
			% endfor
			</select></td>
			<th class="Nobr">${_('Traffic Type')}</th>
			<td><select id="sel_traffic">
				<option value="out" selected>${_('Outbound')}</option>
				<option value="in">${_('Inbound')}</option>
			</select></td>
			<td><button id="refresh" class="button_128">${_('Refresh')}</td>
		</tr>
	</table>
</div>
<br>
<div id="chart-min" class="chart-box">
	<canvas id="canvas-min" width="705" height="195"></canvas>
</div>
<div id="chart-hour" class="chart-box">
	<canvas id="canvas-hour" width="705" height="195"></canvas>
</div>
<div id="chart-day" class="chart-box">
	<canvas id="canvas-day" width="705" height="195"></canvas>
</div>
</body>
