##index.html
<%inherit file="base.mako"/>

<%block name="header">
	<link rel="stylesheet" href="/css/service/snmp.css" type="text/css">
	<script type="text/javascript">
	var EnableSNMP = ${snmpargs['enable']};
	</script>
	<script type="text/javascript" src="/script/service/snmp.js"></script>	
</%block>

<body>
<form name="fmResult" action="snmpHandler" method="post" onsubmit="Apply();"> 
	<input type="hidden" name="no_submit" value="no">                                
	<input type="hidden" name="SnmpSetting">
</form>

<div id="snmpsheet" class="table_div">                                                   
        <table class="table_main">
		<caption class="Nobr caption_out">${_('SNMP Setting')}</caption>
        	<tr>
			<th>${_('Enable')}</th>
			<td id="idEnableSNMP">&nbsp;</td>
		</tr>
        	<tr>
        		<th>${_('Community')}</th>
        		<td><input type="text" id="CommunityID" value="${snmpargs['community']}"></td>
        	</tr>
        	<tr>
        		<th>${_('System Name')}</th>
        		<td><input type="text" id="SysNameID" value="${snmpargs['system-name']}"></td>
        	</tr>
        	<tr>
        		<th>${_('System Contact')}</th>
        		<td><input type="text" id="SysContactID" value="${snmpargs['system-contact']}"></td>
        	</tr>
        	<tr>
        		<th>${_('System Location')}</th>
        		<td><input type="text" id="SysLocationID" value="${snmpargs['system-location']}"></td>
        	</tr>
        </table>
</div>
</body>
