##index.html
<%inherit file="base.mako"/>

<%!
	import json
	import const
%>

<%block name="header">
	<link rel="stylesheet" href="/css/system/wan_detection.css" type="text/css">
	<%include file="service_header.mako"/>
	<script type="text/javascript">
	var wandet_jcfg = ${json.dumps(wandet_args)};	
	</script>
	<script src="/script/system/wan_detection.js"></script>
</%block>

<body>
<form name="fmResult" action="wan_detHandler" method="post" onsubmit="Apply();">
	<input type="hidden" name="no_submit" value="no">
	<input type="hidden" name="WanDetSetting">
</form>

<div class="table_div">
	<table class="table_main">
		<tr>
			<th>${_('Always Success When There Is Inbound Traffic')}</th>
			<td id="oAlways">&nbsp;</td>
		</tr>
	</table>
</div>
<br>
<div class="table_div">
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
<div class="table_div">
	<table class="table_main">
		<tr>
			<th>${_('Protocol')}</th>
			<td><select class="sel_protocol">
				<option value="0">ICMP</option>
				<option value="1">TCP</option>
			</select></td>
		</tr>
		<tr>
			<th>${_('Detection Period')}</th>
			<td>
				<input type="text">
				<span>${_('sec')}</span>
			</td>
		</tr>
		<tr>
			<th>${_('Number of Targets per Detection')}</th>
			<td>
				<input type="text">
			</td>
		</tr>
		<tr>
			<th>${_('Number of Retries')}</th>
			<td>
				<input type="text">
			</td>
		</tr>
	</table>
</div>
<br>
<div id="icmp_div" class="table_div">
	<div class="ToggleSort">
		<span class="itemDisabled checkDragDrop">&nbsp;</span>${_('Drag and Drop')}
	</div>
	<table class="table_main icmpTb">
		<caption class="Nobr caption_out">${_('Target List')}</caption>
		<thead>
		<tr>
			<th class="addIcmpList Action">
			<img class="btnStyle" src="/image/plus.gif">
			</th>
			<th>${_('Destination IP')}</th>
			<th>${_('Hops')}</th>
		</tr>
		</thead>
		<tbody name="IcmpTbody">
		</tbody>
	</table>
</div>
<div id="tcp_div" class="table_div">
	<div class="ToggleSort">
		<span class="itemDisabled checkDragDrop">&nbsp;</span>${_('Drag and Drop')}
	</div>
	<table class="table_main tcpTb">
		<caption class="Nobr caption_out">${_('Target List')}</caption>
		<thead>
		<tr>
			<th class="addTcpList Action">
			<img class="btnStyle" src="/image/plus.gif">
			</th>
			<th>${_('Destination IP')}</th>
			<th>${_('TCP Port')}</th>
		</tr>
		</thead>
		<tbody name="TcpTbody">
		</tbody>
	</table>
</div>
</div>

<div id="PrototypeSetting" class="settingtb">
	<table>
		<tr class="PrototypeTr">
			<td class="Action"><img class="btnAdd btnStyle" src="/image/plus.gif">
			<img class="btnDelete btnStyle" src="/image/minus.gif">
			</td>
			<td><input type="text"></td>
			<td><input type="text"></td>
		</tr>
	</table>
</div>
</body>
