##index.html
<%inherit file="base.mako"/>
<%
	import cherrypy
	login_name = cherrypy.session.get('LoginName')
	login_ip = cherrypy.request.remote.ip
%>

<%block name="header">
	<title>XteraLink</title>
	<link rel="shortcut icon" href="/image/favicon.ico" type="image/vnd.microsoft.icon">
	<link rel="stylesheet" href="/css/main.css" type="text/css">
	<link rel="stylesheet" href="/css/style.css" type="text/css">
	<script type="text/javascript" src="/script/color.js"></script>
	<%include file="menu.mako"/>
	<script type="text/javascript">
		var CurrentCategory = ${iCurrentCategory};
		var CurrentPage = ${iCurrentPage};
		var lang_str = Array(
			"en", "ct", "cs"
		);
		var CurrentLanguageStr = lang_str[${iUserLanguage}];
		var del_acc_msg = "${_('Your account has been deleted!')}";
		var is_expired = false;
	</script>
	<script type="text/javascript" src="/script/interface.js"></script>
</%block>

<body onload="Initialize();" onunload="finalize();">
	<form name="fmResult" id="ofmResult" action="ChangeLang" method="post">
	<div>
		<input type="hidden" name="CurrentCategory">
		<input type="hidden" name="CurrentPage">
		<input type="hidden" name="CurrentLanguage">
	</div>
	</form>
	<div class="LogoBar">
		<span id="LogoBarBG1">
			<img src="/image/S3_header_BG1.png" alt="XteraLink logo bar 1">
		</span>
		<span id="LogoBarBG2">
			<img src="/image/S3_header_BG2.png" alt="XteraLink logo bar 2">
		</span>
		<span id="AscenLinkLogo">
			<img src="/image/banner.png" alt="XteraLink banner">
		</span>
		<span id="XteraLogo">
			<a href="http://www.xtera-ip.com/" id="CompanyAnchor">
			<img src="/image/S3_Xtera_logo.png" alt="XteraLink logo"></a>
		</span>
	</div>	
	<div id="MenuBar" class="MenuBar">
		<div id="ItemTemplate" class="MenuItem">
			<span class="ItemClose"></span>
			<div class="MenuPage_div"></div>
		</div>
		<div id="EntryTemplate" class="MenuEntry">
			<span class="EntryName"></span>
		</div>
	</div>
	<div id="PageBar">
		<span id="IdentityInformation">${login_name}@${login_ip}</span>
		<span id="oLogout">${_('Logout')}</span>
		<div id="PageName">
			<span></span>
			<img id="PageNameImg" src="/image/S3_arrow_right.png" alt="arrow right">
			<span></span>
		</div>
		<span id="oApply">${_('Apply')}</span>
		<span id="oReload">${_('Reload')}</span>
		<span id="oHelp">${_('Help')}</span>
	</div>
	<div id="PageTailer">
	</div>
	<div id="ContentHeader">
		<table id="ContentTable" border="0" cellspacing="0" cellpadding="0">
		<tbody><tr>
			<td id="ContentTdNo1"><img src="/image/Content/index_01.png" alt="content image"></td>
			<td id="ContentTdNo2"></td>
			<td id="ContentTdNo3"><img src="/image/Content/index_04.png" alt="content image"></td>
		</tr>
		<tr>
			<td id="ContentTdNo4"></td>
			<td id="ContentTdNo5"></td>
			<td id="ContentTdNo6"></td>
		</tr>
		<tr>
			<td id="ContentTdNo7"><img src="/image/Content/index_12.png" alt="content image"></td>
			<td id="ContentTdNo8"></td>
			<td id="ContentTdNo9"><img src="/image/Content/index_14.png" alt="content image"></td>
		</tr>
		</tbody>
		</table>
	</div>
	<div id="ContentDialog">
		<img src="/image/Content/index_10.png" alt="content dialog">
	</div>
	<iframe id="HeaderFrame" scrolling="no" frameborder="0"></iframe>
	<iframe id="ContentFrame" name="Content" scrolling="auto" frameborder="0"></iframe>
</body>
