##index.html
<%inherit file="base.mako"/>

<%block name="header">
	<link rel="stylesheet" href="/css/log/view.css" type="text/css">
	<script type="text/javascript">
	var vLogTypeList = Array("${_('System')}", "${_('Traffic')}");
	var traffic_jcfg = ${viewargs['traffic']}.reverse();
	var system_jcfg = ${viewargs['system']}.reverse();
	</script>
	<script type="text/javascript" src="/script/log/view.js"></script>
</%block>

<body>
<form name="fmResult" id="mainformlog" action="viewHandler" method="post">
	<input type="hidden" name="no_submit" value="yes">
</form>

<div class="table_div">
	<table class="table_main">
		<tr>
			<th>${_('Log Type')}</th>
			<td><select id="sel_type"><select></td>
		</tr>
	</table>
</div>

<br>

<div class="table_div">
	<button id="refresh" class="collapse_button button_200">${_('Refresh')}</button>
	<table class="table_main">
		<caption class="caption_out">${_('Recent Event')}</caption>
	</table>
</div>
<textarea id="_RecentEvent" readonly wrap="off"></textarea>
</body>
