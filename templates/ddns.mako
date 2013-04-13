##index.html
<%inherit file="base.mako"/>

<%!
	import json
	import const
%>

<%block name="header">
	<link rel="stylesheet" href="/css/system/ddns.css" type="text/css">
	<script type="text/javascript">
	var ddns_jcfg = ${json.dumps(ddns_args)};
	</script>
	<script src="/script/system/ddns.js"></script>
</%block>

<body>
<form name="fmResult" action="ddnsHandler" method="post" onsubmit="Apply();">
	<input type="hidden" name="no_submit" value="no">
	<input type="hidden" name="DDnsSetting">
</form>

<div id="WanSheet">
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
		<div class="table_div ddns_setting">
			<table class="table_main">
				<caption class="Nobr caption_out">${_('DDNS Setting')}</caption>
					<tr>
						<th>${_('Enable')}</th>
						<td class="toggle_enable"></td>
					</tr>
					<tr>
						<th>${_('Provider')}</th>
						<td><select class="speed_duplex">
							<option value="www.no-ip.com">www.no-ip.com</option>
						</select></td>
					</tr>
					<tr>
						<th>${_('Domain Name')}</th>
						<td><input type="text"></td>
					</tr>
					<tr>
						<th>${_('User Name')}</th>
						<td><input type="text"></td>
					</tr>
					<tr>
						<th>${_('Password')}</th>
						<td><input type="password"></td>
					</tr>
			</table>
		</div>
	</dev>
</div>
</body>
