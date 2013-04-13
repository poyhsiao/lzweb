##index.html
<%inherit file="base.mako"/>

<%block name="header">
	<link rel="stylesheet" href="/css/log/syslog.css" type="text/css">
	<script type="text/javascript">
	var facility = "${syslogargs['facility']}"
	</script>
	<script type="text/javascript" src="/script/log/syslog.js"></script>
</%block>

<body>
<form name="fmResult" action="syslogHandler" method="post" onsubmit="Apply();">
	<input type="hidden" name="no_submit" value="no">
	<input type="hidden" name="SyslogSetting">
</form>

<div id="syslogSheet" class="table_div">
	<table class="table_main">
		<caption class="Nobr caption_out">${_('Syslog Setting')}</caption>
		<tr>
			<th>${_('Server IP')}</th>
			<td><input type="text" id="server_ip" value=${syslogargs['server']}></td>
		</tr>
		<tr>
			<th>${_('Facility')}</th>
			<td><select id="sel_fac"></select></td>
		</tr>
	</table>
</div>
</body>
