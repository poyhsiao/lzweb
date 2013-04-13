import xte_ip_group
import xte_service_group
import xte_fqdn

def getGroupJcfg():
	ipgroup_cfg = xte_ip_group.get()
	if ipgroup_cfg[0]:
		ipgroup_jcfg = ipgroup_cfg[1]['group']
	else:
		ipgroup_jcfg = []

	servicegroup_cfg = xte_service_group.get()
	if servicegroup_cfg[0]:
		servicegroup_jcfg = servicegroup_cfg[1]['group']
	else:
		servicegroup_jcfg = []

	fqdn_cfg = xte_fqdn.get()
	if fqdn_cfg[0]:
		fqdn_jcfg = fqdn_cfg[1]['fqdn']
	else:
		fqdn_jcfg = []

	return (ipgroup_jcfg, servicegroup_jcfg, fqdn_jcfg)
