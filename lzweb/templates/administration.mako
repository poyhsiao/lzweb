##index.html
<%inherit file="base.mako"/>

<%
	import xte_summary
	summary_jcfg = xte_summary.get()
	if summary_jcfg[0]:
		version = summary_jcfg[1]['version']
	else:
		version = ""
%>

<%!
	import json
%>

<%block name="header">
	<link rel="stylesheet" href="/css/system/administration.css" type="text/css">
	<%include file="service_header.mako"/>
	<script type="text/javascript">
	var administration_jcfg = ${json.dumps(administration_args)};
	var acc_online_array = ${json.dumps(acc_list)};
	var username = ${json.dumps(user_name)};
	var del_account_msg = "${_('Are you sure to delete this account?')}";
	var factory_default_msg = "${_('Are you sure to load factory default settings, and reboot?')}";
	var reboot_msg = "${_('Are you sure to reboot system right now?')}";
	</script>
	<script src="/script/system/administration.js"></script>
</%block>

<body>
<div class="table_div">
	<div id="status_info">
		<span id="on_line">${_('on-line')}</span>
		<span id="off_line">${_('off-line')}</span>
	</div>
	<table class="table_main">
		<caption class="Nobr caption_out">${_('Account Setting')}</caption>
		<thead>
		<tr>
			<th id="acc_name">${_('Name')}</th>
			<th id="acc_group">${_('Group')}</th>
			<th id="acc_status">${_('Status')}</th>
			<td><button id="add_account" class="button_128">${_('Add')}</button>
				<button id="sort_name" class="button_128">${_('Sort by Name')}</button>
				<button id="sort_group" class="button_128">${_('Sort by Group')}</button>
			</td>
		</tr>
		</thead>
		<tbody id="AccountTbody">
		</tbody>
	</table>
</div>
<br>
<div class="table_div">
	<table class="table_main">
		<caption class="Nobr caption_out">${_('Maintenance')}</caption>
		<tr>
			<th>${_('Factory default')}</th>
			<td><button id="factory_default" class="button_200">${_('Factory default')}</button></td>
		</tr>
		<tr>
			<th>${_('Reboot')}</th>
			<td><button id="reboot" class="button_200">${_('Reboot')}</button></td>
		</tr>
	</table>
</div>
<br>
<div class="table_div">
	<table class="table_main">
		<caption class="Nobr caption_out">${_('Configuration File')}</caption>
		<tr>
			<th>${_('Save Configuration')}</th>
			<td>
			<form id="SaveCfg" action="save_cfg">
				<button id="save_cfg" class="button_200">${_('Save')}</button>
			</form>
			</td>
		</tr>
		<tr>
			<th>${_('Restore Configuration')}</th>
			<td>
			<form id="RestoreCfg" action="restore_cfg" enctype="Multipart/form-data" method="post">
				<input type="file" name="cfgFile">
				<button id="restore_cfg" class="button_200">${_('Restore')}</button>
			</form>
			</td>
		</tr>
	</table>
</div>
<br>
<div class="table_div">
	<table class="table_main">
		<caption class="Nobr caption_out">${_('Firmware Update')}</caption>
		<tr>
			<th>${_('Current Version')}</th>
			<td id="version">${version}</td>
		</tr>
		<tr>
			<th>${_('Firmware Update')}</th>
			<td>
			<table id="FwUpdateTb">
				<tr>
					<th>${_('Input update key')}</th>
					<td><input type="text" id="update_key"></td>
				</tr>
				<tr>
					<td colspan="2">
					<form id="FwUpdate" action="firmware_update" enctype="Multipart/form-data" method="post">
					<input type="file" name="fwupfile">
					<button id="fw_update" class="button_200">${_('Update')}</button>
					</form>
					</td>
				</tr>
			</table>
			</td>
		</tr>
		<tr>
			<th>${_('Firmware Downgrade')}</th>
			<td>
			<form id="FwDowngrade" action="firmware_downgrade" enctype="Multipart/form-data" method="post">
				<input type="file" name="fwdownfile">
				<button id="fw_downgrade" class="button_200">${_('Downgrade')}</button>
			</form>
			</td>
		</tr>
		
	</table>
</div>	

<div id="AccountSetting" class="settingtb">
	<table>
		<tr>
			<th>${_('Name')}</th>
			<td><input type="text" id="input_name"></td>
		</tr>
		<tr>
			<th>${_('Group')}</th>
			<td><select id="sel_group">
				<option>admin</option>
				<option>monitor</option>
			</select></td>
		</tr>
		<tr>
			<th>${_('Password')}</th>
			<td><input type="password" id="input_pw"></td>
		</tr>
		<tr>
			<th>${_('Confirm')}</th>
			<td><input type="password" id="confirm_pw"></td>
		</tr>
		<tr class="error_msg">
			<td colspan="2"></td>
		</tr>
	</table>
</div>
</body>
