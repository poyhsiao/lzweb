##index.html
<%inherit file="base.mako"/>

<%!
	import json
	import cgi
%>

<%block name="header">
	<link rel="stylesheet" href="/css/system/fqdn.css" type="text/css">
	<script type="text/javascript">
	var fqdn_jcfg = ${cgi.escape(json.dumps(fqdnargs))};
	</script>
	<script src="/script/system/fqdn.js"></script>
</%block>

<body>
<form name="fmResult" action="fqdnHandler" method="post" onsubmit="Apply();">
	<input type="hidden" name="no_submit" value="no">
	<input type="hidden" name="FqdnSetting">
</form>

<div class="table_div">
	<table class="table_main">
		<caption class="Nobr caption_out">${_('FQDN Setting')}</caption>
		<thead>
			<tr>
				<th>${_('No.')}</th>
				<th>${_('Domain Name')}</th>
			</tr>
		</thead>
		<tbody id="fqdnTbody">
		</tbody>
		<tfoot>
			<tr>
				<th><img id="addFqdn" class="btnStyle" src="/image/plus.gif">
				<img id="deleteFqdn" class="btnStyle" src="/image/minus.gif">
				</th>
				<th>${_('Note: Empty domain name can be acceptable')}</th>
			</tr>
		</tfoot>
	</table>
</div>
</body>
