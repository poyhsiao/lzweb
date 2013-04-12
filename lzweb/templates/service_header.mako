<script type="text/javascript">
var service_proto = "proto@";
var service_tcp = "tcp@";
var service_udp = "udp@";
var group_at = "group@";

vInterfaceList = Array(
	"${_('LAN')}",
	"${_('DMZ')}",
	"${_('WAN1')}",
	"${_('WAN2')}",
	"${_('WAN3')}",
	"${_('WAN4')}"
);

vSpeedDuplexList = Array(
	"${_('auto')}",
	"${_('10/half')}",
	"${_('10/full')}",
	"${_('100/half')}",
	"${_('100/full')}"
);

vWanTypeList = Array(
	"${_('Static')}",
	"${_('PPPoE')}",
	"${_('DHCP')}"
);

vVsWanList = Array(
	"${_('none')}",
	"${_('auto')}",
	"${_('IPv4 Address')}"
);

var vFwSourceList = Array(
	"${_('IPv4 Address')}",
	"${_('IPv4 Range')}",
	"${_('Subnet/mask')}",
	"${_('LAN')}",
	"${_('DMZ')}",
	"${_('WAN')}",
	"${_('Any')}",
	"${_('group@')}",
	"${_('fqdn@')}"
);

var vFwDestinationList = Array(
	"${_('IPv4 Address')}",
	"${_('IPv4 Range')}",
	"${_('Subnet/mask')}",
	"${_('LAN')}",
	"${_('DMZ')}",
	"${_('WAN')}",
	"${_('Localhost')}",
	"${_('Any')}",
	"${_('group@')}",
	"${_('fqdn@')}"
);

var vServiceList = Array(
	"${_('Any Service')}",
	"${'proto@'}",
	"${'tcp@'}",
	"${'udp@'}",
	"${_('group@')}"
);

var vKnownServices = {
	'tcp@21': 'FTP'
	,'tcp@22': 'SSH'
	,'tcp@23': 'TELNET'
	,'tcp@25': 'SMTP'
	,'tcp@53': 'DNS'
	,'udp@53': 'DNS'
	,'tcp@70': 'GOPHER'
	,'tcp@79': 'FINGER'
	,'tcp@80': 'HTTP'
	,'tcp@110': 'POP3'
	,'tcp@119': 'NNTP'
	,'udp@123': 'NTP'
	,'tcp@143': 'IMAP'
	,'udp@161': 'SNMP'
	,'tcp@179': 'BGP'
	,'tcp@210': 'WAIS'
	,'tcp@389': 'LDAP'
	,'tcp@443': 'HTTPS'
	,'udp@500': 'IKE'
	,'tcp@513': 'RLOGIN'
	,'tcp@514': 'SYSLOG'
	,'udp@514': 'SYSLOG'
	,'udp@520': 'RIP'
	,'tcp@540': 'UUCP'
	,'tcp@1720': 'H323'
	,'udp@1720': 'H323'
	,'udp@1812': 'RADIUS'
	,'udp@1813': 'RADIUS-ACCT'
	,'tcp@3389': 'RDP'
	,'tcp@5631': 'pcAnywhere-D'
	,'tcp@5632': 'pcAnywhere-S'
	,'tcp@6000-6063': 'X-11'
	,'proto@1': 'ICMP'
	,'proto@47': 'GRE'
	,'proto@50': 'ESP'
	,'proto@51': 'AH'
};

var vActionList = Array(
	"${_('Accept')}",
	"${_('Deny')}"
);

var vArSourceList = Array(
	"${_('IPv4 Address')}",
	"${_('IPv4 Range')}",
	"${_('Subnet/mask')}",
	"${_('LAN')}",
	"${_('DMZ')}",
	"${_('Localhost')}",
	"${_('Any')}",
	"${_('group@')}",
	"${_('fqdn@')}"
);

var vArDestinationList = Array(
	"${_('IPv4 Address')}",
	"${_('IPv4 Range')}",
	"${_('Subnet/mask')}",
	"${_('WAN')}",
	"${_('group@')}",
	"${_('fqdn@')}"
);

var vNatSourceList = Array(
	"${_('IPv4 Address')}",
	"${_('IPv4 Range')}",
	"${_('group@')}",
	"${_('fqdn@')}"
);

var vNatTranslateList = Array(
	"${_('IPv4 Address')}",
	"${_('IPv4 Range')}",
	"${_('No NAT')}"
);

var vCheckAddrList = Array(
	"${_('IPv4 Address')}",
	"${_('IPv4 Range')}",
	"${_('Subnet/mask')}",
	"${_('group@')}",
	"${_('fqdn@')}"
);

var vCheckServiceList = Array(
	"${'proto@'}",
	"${'tcp@'}",
	"${'udp@'}",
	"${_('group@')}"
);

var vSettingTbTitle = Array(
	"${_('Add Rule Details')}",
	"${_('Edit Rule Details')}"
);

var vArpSettingTbTitle = Array(
	"${_('Add Fixed Entries Details')}",
	"${_('Edit Fixed Entries Details')}"
);

var vAccountSettingTbTitle = Array(
	"${_('Add Account Setting')}",
	"${_('Edit Account Setting')}"
);

var vSettingTbButton = Array(
	"${_('OK')}",
	"${_('Cancel')}",
	"${_('Edit')}",
	"${_('Delete')}"
);

function InterfaceBTF( interface )
{
	if (interface == "lan")
		return vInterfaceList[0];
	else if (interface == "dmz")
		return vInterfaceList[1];
	else if (interface == "wan1")
		return vInterfaceList[2];
	else if (interface == "wan2")
		return vInterfaceList[3];
	else if (interface == "wan3")
		return vInterfaceList[4];
	else if (interface == "wan4")
		return vInterfaceList[5];
}

function SpeedDuplexBTF( mode )
{
	if (mode=="10/half")
		return vSpeedDuplexList[1];
	else if (mode=="10/full")
		return vSpeedDuplexList[2];
	else if (mode=="100/half")
		return vSpeedDuplexList[3];
	else if (mode=="100/full")
		return vSpeedDuplexList[4];
	else
		return vSpeedDuplexList[0];
}

function WanTypeBTF( type )
{
	if (type=="pppoe")
		return vWanTypeList[1];
	else if (type=="dhcp")
		return vWanTypeList[2];
	else
		return vWanTypeList[0];
}

function GroupBTF( group, label )
{
	if (!label) label = "";
	
	group = group + "(" + label + ")";
	
	return group;
}

function AddressBTF( address )
{
	if (address=="lan")
		return vFwDestinationList[3];
	else if (address=="dmz")
		return vFwDestinationList[4];
	else if (address=="wan")
		return vFwDestinationList[5];
	else if (address=="localhost")
		return vFwDestinationList[6];
	else if (address=="any")
		return vFwDestinationList[7];
	else
		return address;
}

function HandleAddressBTF( val, ipgroup_list, fqdn_list )
{
	var idx;
	if ( val.match(/^group@[\d]/) )
	{
		idx = val.split('@')[1];
		val = GroupBTF(vFwDestinationList[8]+idx, ipgroup_list[idx-1]['label']);
	}
	else if ( val.match(/^fqdn@[\d]/) )
	{
		idx = val.split('@')[1];
		val = GroupBTF(vFwDestinationList[9]+idx, fqdn_list[idx-1]);
	}
	else
	{
		val = AddressBTF(val);
	}
	return val;
}

function ServiceBTF( service )
{
	if ( service=="any" )
		return vServiceList[0];
	else if ( service in vKnownServices )
		return vKnownServices[service] + ' (' + service + ')';
	else
		return service;	
}

function HandleServiceBTF( val, servicegroup_list )
{
	var idx;
	if ( val.match(/^group@[\d]/) )
	{
		idx = val.split("@")[1];
		val = GroupBTF(vServiceList[4]+idx, servicegroup_list[idx-1]['label']);
	}
	else
	{
		val = ServiceBTF(val);
	}
	
	return val;
}

function ActionBTF( action )
{
	if (action=="accept")
		return vActionList[0];
	else if (action=="deny")
		return vActionList[1];
	else
		return action;
}

function VsWanBTF( wan )
{
	if (wan=="none")
		return vVsWanList[0];
	else if (wan=="auto")
		return vVsWanList[1];
	else
		return wan;
}

function InterfaceFTB( interface )
{
	if (interface == vInterfaceList[0])
		return "lan";
	else if (interface == vInterfaceList[1])
		return "dmz";
	else if (interface == vInterfaceList[2])
		return "wan1";
	else if (interface == vInterfaceList[3])
		return "wan2";
	else if (interface == vInterfaceList[4])
		return "wan3";
	else if (interface == vInterfaceList[5])
		return "wan4";
}

function SpeedDuplexFTB( mode )
{
	if (mode==vSpeedDuplexList[1])
		return "10/half";
	else if (mode==vSpeedDuplexList[2])
		return "10/full";
	else if (mode==vSpeedDuplexList[3])
		return "100/half";
	else if (mode==vSpeedDuplexList[4])
		return "100/full";
	else
		return "auto";
}

function WanTypeFTB( type )
{
	if (type==vWanTypeList[1])
		return "pppoe";
	if (type==vWanTypeList[2])
		return "dhcp";
	else
		return "static";
}

function AddressFTB( address )
{
	if (address==vFwDestinationList[3])
		return "lan";
	else if (address==vFwDestinationList[4])
		return "dmz";
	else if (address==vFwDestinationList[5])
		return "wan";
	else if (address==vFwDestinationList[6])
		return "localhost";
	else if (address==vFwDestinationList[7])
		return "any";
	else if (address.split("@")[0] == vFwDestinationList[8].split("@")[0])
		return group_at + address.split("@")[1].split("(")[0];
	else if (address.split("@")[0] == vFwDestinationList[9].split("@")[0])
		return "fqdn@" + address.split("@")[1].split("(")[0];
	else
		return address;
}

function ServiceFTB( service )
{
	if (service==vServiceList[0])
		return "any";
	else if (service.split("@")[0] == vServiceList[4].split("@")[0])
		return group_at + service.split("@")[1].split("(")[0];
	else
	{
		var regex = /(proto|tcp|udp)@[\d-]+/;
		if (regex.test(service))
		{
			return regex.exec(service)[0];
		}
		else
			return service;
	}
}

function ActionFTB( action )
{
	if (action==vActionList[0])
		return "accept";
	else if (action==vActionList[1])
		return "deny";
	else
		return action;
}

function VsWanFTB( wan )
{
	if (wan==vVsWanList[0])
		return "none";
	else if (wan==vVsWanList[1])
		return "auto";
	else
		return wan;
}

function isTcpOrUdpPrefix(service)
{
	return /(tcp|udp)@/.test(service);
}
</script>
