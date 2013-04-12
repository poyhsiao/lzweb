function check_input(tbAccount)
{
	var name = tbAccount.find('input#input_name');
	if (!name.val().match(/^[\w]{4,255}$/)
		|| name.val() == "root" || name.val() == "dkru4swlb10")
	{
		show_error(name);
		return [false, invalid_msg[1]];
	}
	var password = tbAccount.find('input#input_pw');
	if (!password.val().match(/^[\w]{4,255}$/))
	{
		show_error(password);
		return [false, invalid_msg[2]];
	}
	var confirm = tbAccount.find('input#confirm_pw');
	if (password.val() != confirm.val())
	{
		show_error(confirm);
		return [false, invalid_msg[3]];
	}
	return [true, ""];
}

function load_account(tbRule, trRule)
{
	//Edit mode, load tr settings
	if (trRule)
	{
		var name = trRule.find('td:first').text();
		var group = trRule.find('td:eq(1)').text();

		// Name
		tbRule.find('input#input_name').attr('disabled', true).val( name );
		// Group
		tbRule.find('select#sel_group').val( group );
		if ( name == "admin" || name == "monitor" )
		{
			tbRule.find('select#sel_group').attr('disabled', true);
			tbRule.find('input#input_pw').focus();
		}
		else
		{
			tbRule.find('select#sel_group').removeAttr('disabled').focus();
		}
		
	}
	//Add mode, initial all settings
	else
	{
		// Name
		tbRule.find('input#input_name').removeAttr('disabled').val('').focus();
		// Group
		tbRule.find('select#sel_group').removeAttr('disabled');
		tbRule.find('select#sel_group option').get(0).selected = true;
	}

	// Password
	tbRule.find('input#input_pw').val('');
	// Confirm Password
	tbRule.find('input#confirm_pw').val('');
}

function update_admin_jcfg(name, group, pw)
{
	administration_jcfg[name] = new Array();
	administration_jcfg[name]['g'] = group;
	administration_jcfg[name]['p'] = pw;
}

function gen_account_tr(name, group, admin)
{
	var tr, accTr;
	if (admin)
		tr = $('<tr><td></td><td></td><td></td><td><button></button></td></tr>');
	else
		tr = $('<tr><td></td><td></td><td></td><td><button></button> <button></button></td></tr>');

	tr.find('td:first').css("text-align", "center").text( name );
	tr.find('td:eq(1)').css("text-align", "center").text( group );
	tr.find('td:eq(2)').css("text-align", "center").html('<img src="/image/state-dead.gif">');

	if (username == name)
	{
		tr.find('td:eq(2)').css("text-align", "center").html('<img src="/image/state-alive.gif">');
	}
	for (var i = 0; i < acc_online_array.length; i++)
	{	
		if (acc_online_array[i] == name || username == name)
		{
			tr.find('td:eq(2)').css("text-align", "center").html('<img src="/image/state-alive.gif">');
			break;
		}
	}
	tr.find('button:first').addClass("button_80 btnEdit")
	.click(function(){
		accTr = $(this).closest('tr');
		var tbAccount = $('#AccountSetting').clone(true);
		if (tbAccount.dialog('isOpen'))
			tbAccount.dialog('close');

		tbAccount.dialog({
			open: function(){
				load_account($(this), accTr);
				$(this).find('tr:last').hide();
			},
			title: vAccountSettingTbTitle[1],
			buttons: [{
				text: vSettingTbButton[0],
				click : function(){
					var ret = check_input($(this));
					$(this).find('tr:last').hide();
					if (ret[0])
					{
						var account_name = $(this).find('input#input_name').val();
						var account_group = $(this).find('select#sel_group').val();
						var account_password = $(this).find('input#input_pw').val();
	
						//Save account to middleware
						$.post('edit_account',
							{name: account_name, password: account_password, group: account_group},
							function(response){
								if (response[0]) //Save successfully
								{
									accTr.find('td:eq(1)').text( account_group );
									// update administration_jcfg
									update_admin_jcfg(account_name, account_group, account_password);
									tbAccount.dialog("close");
								}
								else
								{
									alert(response[1]);
								}
							}
						);
					}
					else
					{
						$(this).find('tr:last').show()
							.find('td').text(ret[1]);
					}
				}
			},
			{
				text: vSettingTbButton[1],
				click: function() {
					$(this).dialog('close');
				}
			}]
		})
		.dialog('open');
	}).text( vSettingTbButton[2] );

	if (!admin)
	{
		tr.find('button:eq(1)').addClass("button_80 btnDelete")
		.click(function(){
			if (window.confirm(del_account_msg))
			{
				accTr = $(this).closest('tr');
				var account_name = accTr.find('td:first').text();
				//Delete account to middleware
				$.post('del_account',
					{name: account_name},
					function(response){
						if (response[0]) //Save successfully
						{
							accTr.detach();
							//update administration_jcfg
							delete administration_jcfg[account_name];
						}
						else
						{
							alert(response[1]);
						}
					}
				);
			}
		})
		.text( vSettingTbButton[3] );

		if (username == name)
		{
			tr.find('button:eq(1)').attr('disabled', true);
		}
	}

	tr.appendTo($('#AccountTbody'));
}

function sort_by_name()
{
	var name_array = new Array();
	var i = 0;

	for (name in administration_jcfg)
	{
		name_array[i] = name;
		i++;
	}

	name_array.sort();

	for (i = 0; i < name_array.length; i++)
	{
		if (name_array[i] == "admin" || name_array[i] == "monitor")
			gen_account_tr(name_array[i], administration_jcfg[name_array[i]]['g'], true);
		else
			gen_account_tr(name_array[i], administration_jcfg[name_array[i]]['g'], false);
	}
}

function sort_by_group()
{
	var admin_array = new Array();
	var monitor_array = new Array();
	var i = 0;
	var j = 0;

	for (name in administration_jcfg)
	{
		if (administration_jcfg[name]['g'] == "admin")
		{
			admin_array[i] = name;
			i++;
		}
		else
		{
			monitor_array[j] = name;
			j++;
		}
	}

	//sort by name
	admin_array.sort();
	monitor_array.sort();

	for (i = 0; i < admin_array.length; i++)
	{
		if (admin_array[i] == "admin")
			gen_account_tr(admin_array[i], administration_jcfg[admin_array[i]]['g'], true);
		else
			gen_account_tr(admin_array[i], administration_jcfg[admin_array[i]]['g'], false);
	}
	for (j = 0; j < monitor_array.length; j++)
	{
		if (monitor_array[j] == "monitor")
			gen_account_tr(monitor_array[j], administration_jcfg[monitor_array[j]]['g'], true);
		else
			gen_account_tr(monitor_array[j], administration_jcfg[monitor_array[j]]['g'], false);
	}
}

$(function(){
	$('#AccountSetting').dialog({
		autoOpen: false,
		width: 350,
	});

	$('#add_account').click(function(){
		var tbAccount = $('#AccountSetting').clone(true);
		if (tbAccount.dialog('isOpen'))
			tbAccount.dialog('close');

		tbAccount.dialog({
			open: function(){
				load_account($(this));
				$(this).find('tr:last').hide();
			},
			title: vAccountSettingTbTitle[0],
			buttons: [{
				text: vSettingTbButton[0],
				click : function(){
					var ret = check_input($(this));
					$(this).find('tr:last').hide();
					if (ret[0])
					{
						var account_name = $(this).find('input#input_name').val();
						var account_group = $(this).find('select#sel_group').val();
						var account_password = $(this).find('input#input_pw').val();
	
						//Save account to middleware
						$.post('add_account',
							{name: account_name, param: JSON.stringify({"g": account_group, "p": account_password})},
							function(response){
								if (response[0]) //Save successfully
								{
									gen_account_tr(account_name, account_group, false);
									// update administration_jcfg
									update_admin_jcfg(account_name, account_group, account_password);
									tbAccount.dialog("close");
								}
								else
								{
									alert(response[1]);
								}
							}
						);
					}
					else
					{
						$(this).find('tr:last').show()
							.find('td').text(ret[1]);
					}
				}
			},
			{
				text: vSettingTbButton[1],
				click: function() {
					$(this).dialog('close');
				}
			}]
		})
		.dialog('open');
	})

	$('#sort_name').click(function(){
		$('#AccountTbody').empty();
		sort_by_name();
	});

	$('#sort_group').click(function(){
		$('#AccountTbody').empty();
		sort_by_group();
	});

	$('#factory_default').click(function(){
		if (window.confirm(factory_default_msg))
		{
			$.post('factory_default',
				'',
				function(response){
					alert(response);
				}
			);
		}
	});

	$('#reboot').click(function(){
		if (window.confirm(reboot_msg))
		{
			$.post('reboot',
				'',
				function(response){
					alert(response);
				}
			);
		}
	});

	$('#save_cfg').click(function(){
		$('#SaveCfg').submit();
	});

	$('#restore_cfg').click(function(){
		if ($('[name="cfgFile"]').val() == "")
		{
			alert(invalid_msg[4]);
			return false;
		}
		$('#RestoreCfg').submit();
	});

	$('#fw_update').click(function(){
		if ($('[name="fwupfile"]').val() == "")
		{
			alert(invalid_msg[4]);
			return false;
		}
		//update key
		$.post('firmware_updatekey',
			{updatekey: $('#update_key').val()},
			'');
		$('#FwUpdate').submit();
	});

	$('#fw_downgrade').click(function(){
		if ($('[name="fwdownfile"]').val() == "")
		{
			alert(invalid_msg[4]);
			return false;
		}
		$('#FwDowngrade').submit();
	});

	// Initial account table and sort by name
	sort_by_name();

	NotifyUser();
});
