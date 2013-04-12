##index.html
<%inherit file="base.mako"/>

<%block name="header">
	<link rel="stylesheet" href="/css/system/dns.css" type="text/css">
	<script src="/script/system/dns.js"></script>
</%block>

<body>
<form name="fmResult" action="dnsHandler" method="post" onsubmit="Apply();">
	<input type="hidden" name="no_submit" value="no">
	<input type="hidden" name="DnsSetting">
</form>

<div id="dnssheet" class="table_div">
	<table class="table_main">
		<caption class="Nobr caption_out">${_('DNS Setting')}</caption>
		<tr>
			<th>${_('Host Name')}</th>
			<td><input type="text" id="host_name" value="${dnsargs['hostname']}"></td>
		</tr>
		<tr>
			<th>${_('Domain Name')}</th>
			<td><input type="text" id="domain_name" value="${dnsargs['domain-name']}"></td>
		</tr>
		<tr>
			<th>${_('DNS Server 1')}</th>
			<td><input type="text" id="dns_server_1" value="${dnsargs['dns-server-1']}"></td>
		</tr>
		<tr>
			<th>${_('DNS Server 2')}</th>
			<td><input type="text" id="dns_server_2" value="${dnsargs['dns-server-2']}"></td>
		</tr>
	</table>
</div>
</body>
