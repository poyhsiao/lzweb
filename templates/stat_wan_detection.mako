##index.html
<%inherit file="base.mako"/>

<%!
	import json
	import const
%>

<%block name="header">
	<link rel="stylesheet" href="/css/statistics/stat_wan_detection.css" type="text/css">
	<script type="text/javascript">
	var stat_wan_det_jcfg = ${json.dumps(stat_wan_det_args)};
	var current_wan = "${wan_index}";
	var refresh_time = "${time}";
	</script>
	<script src="/script/statistics/stat_wan_detection.js"></script>
</%block>

<body>
<form name="fmResult" action="statWanDetectionHandler" method="post" onsubmit="Apply();">
	<input type="hidden" name="no_submit" value="yes">
	<input type="hidden" name="wan_index">
	<input type="hidden" name="time">
</form>
<div class="table_div">
	<table id="WanSettingTb" class="table_main">
		<tr>
			<th class="Nobr">${_('WAN Link')}</th>
			<td><select id="sel_wan">
			% for index in range(len(const.ALL_WANS)):
				<option value=${index+1}>${index+1}</option>
			% endfor
			</select></td>
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
		<caption class="Nobr caption_out">${_('WAN Detection')}</caption>
		<thead id="StatThead">
		<tr>
			<th>${_('Destination IP')}</th>
			<th>${_('Number of Requests')}</th>
			<th>${_('Number of Replies')}</th>
			<th>${_('Success Ratio (%)')}</th>
		</tr>
		</thead>
		<tbody id="StatTbody">
		</tbody>	
	</table>
</div>
<div id="wan_detection_detail" class="settingtb">
	<table>
		<tr class="StatWanDetection">
		% for index in range(4):
			<td></td>
		% endfor
		</tr>
	</table>
</div>
</body>
