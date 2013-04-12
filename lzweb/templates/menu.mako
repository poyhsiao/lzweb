<%
	import cherrypy
	group = cherrypy.session.get('LoginGroup')
%>

<script type="text/javascript">
var ApplyConfirmation = "${_('Are you sure to apply these settings?')}";
var LogoutConfirmation = "${_('Are you sure to logout?')}";

var MainMenu = [ ["${_('System')}", "${_('Summary')}", "${_('DNS')}", "${_('Network Setting')}",
		"${_('WAN Detection')}", "${_('FQDN')}", "${_('IP Group')}", "${_('Service Group')}",
		"${_('Diagnostic Tools')}", "${_('ARP Table')}", "${_('Date/Time')}", "${_('DDNS')}", "${_('Administration')}"],
		["${_('Service')}", "${_('DHCP (LAN)')}", "${_('DHCP (DMZ)')}", "${_('Virtual Server')}",
		"${_('Firewall')}", "${_('Connection Limit')}", "${_('Auto Routing')}", "${_('NAT')}", "${_('SNMP')}"],
		["${_('Statistics')}", "${_('Bandwidth Utilization')}","${_('WAN Detection')}",
		"${_('DHCP (LAN)')}", "${_('DHCP (DMZ)')}", "${_('FQDN')}"],
		["${_('Log')}", "${_('View')}", "${_('Syslog')}"],
		["${_('Language')}", "${_('English')}", "${_('Traditional Chinese')}", "${_('Simplified Chinese')}"] ];

var PageMenu = [ ["system", "summary", "dns", "network",
		"wan_detection", "fqdn", "ip_group", "service_group",
		"diagnostic_tools", "arp_table", "date_time", "ddns", "administration"],
		["service", "dhcp_lan", "dhcp_dmz", "virtual_server", "firewall",
		"connection_limit", "auto_routing", "nat", "snmp"],
		["statistics", "stat_bandwidth_utilization", "stat_wan_detection", "stat_dhcp_lan", "stat_dhcp_dmz", "stat_fqdn"],
		["log", "view", "syslog"] ];

var login_group = "${group}";
if (login_group == "monitor")
{
	var tmpArr;

	// Remove administration page
	MainMenu[0].pop();
	PageMenu[0].pop();
	// Remove diagnostic_tools page
	tmpArr = MainMenu[0].splice(8,1);
	MainMenu[0].concat(tmpArr);
	tmpArr = PageMenu[0].splice(8,1);
	PageMenu[0].concat(tmpArr);
}
</script>
