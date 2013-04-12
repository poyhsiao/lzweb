##index.html
<%inherit file="base.mako"/>

<%block name="header">
	<link rel="stylesheet" href="/css/system/network.css" type="text/css">
	<script src="/script/system/network_header.js"></script>
</%block>

<body>
	<table id="tablist">
		<tr align="center">
			<td class="taboff tabinside"><span>${_('WAN Setting')}</span></td>
			<td class="taboff tabinside"><span>${_('DMZ Setting')}</span></td>
			<td class="taboff"><span>${_('LAN Setting')}</span></td>
		</tr>
	</table>
</body>
