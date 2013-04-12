##index.html
<%inherit file="base.mako"/>

<%block name="header">
<title>XteraLink</title>
<link rel="shortcut icon" href="/image/favicon.ico" type="image/vnd.microsoft.icon">
<link rel="stylesheet" href="/css/login.css" type="text/css">
<%
	import cherrypy

	CurrentLanguage = cherrypy.session['iUserLanguage']
	login = _('Login')
%>

<script type="text/javascript">
	$(function(){
		## for wide screen
		if ( screen.width/screen.height > 4/3 )
			$('#oImage').attr("src", "/image/cover2.jpg");
		else
			$('#oImage').attr("src", "/image/cover1.jpg");

		$('#login').val("${login}").mouseover(function(){
			$(this).addClass("login_mouseover");
		}).mouseleave(function(){
			$(this).removeClass("login_mouseover");
		});

		$('#pw_input').val("");
		$('#account_input').focus();

		if (${CurrentLanguage}) // not English
		{
			$('#lang, #account, #pw').width(32).css("left", 314);
		}

		$('#lang_sel').bind('change', function(event){
			$('#act').val("ChangeLanguage");
			$('#oMain').submit();
		}).val(${CurrentLanguage});

		NotifyUser();
	});
</script>
</%block>

<body>
<div>
	<img id="oImage" src="/image/cover1.jpg" alt="XteraLink background">
</div>
<div id="login_div">
<img id="oLogo" src="/image/loginpage.png" alt="XteraLink logo">
<form id="oMain" action="doLogin" method="post">
<div>
	<span id="lang">${_('Language')}</span>
	<span id="lang_span">:</span>
	<select id="lang_sel" name="Language">
	<%
		lang_list = [_('English'), _('Traditional Chinese'), _('Simplified Chinese')]
	%>
	% for index in range(len(lang_list)):
		<option value=${index}>${lang_list[index]}</option>
	% endfor

	</select>
	<span id="account">${_('Account')}</span>
	<span id="account_span">:</span>
	<input id="account_input" name="AccountAlias" type="text">
	<span id="pw">${_('Password')}</span>
	<span id="pw_span">:</span>
	<input id="pw_input" name="Password" type="password">
	<input name="AdminCheck" type="hidden" value="yes">
	<input id="login" type="submit" name="SubmitBar">
	<input id="act" name="Action" type="hidden" value="">
</div>
</form>
</div>
</body> 
