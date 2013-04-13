<%!
	import cgi
%>

<script type="text/javascript">
var invalid_msg = Array(
	"${_('Invalid input!')}",
	"${_('Invalid input name!')}",
	"${_('Invalid input password!')}",
	"${_('Password and confirm are inconsistent!')}",
	"${_('Please select file!')}"
);

function htmlspecialchars_decode(string, quote_style) {
	if (string == null)
		string = "";
	string = string.toString();
	string = string.replace(/&amp;/g, '&');
	string = string.replace(/&lt;/g, '<');
	string = string.replace(/&gt;/g, '>');
	if (quote_style == 'ENT_QUOTES') {
		string = string.replace(/&quot;/g, '"');
		string = string.replace(/&#039;/g, '\'');
	}
	else if (quote_style != 'ENT_NOQUOTES') {
		string = string.replace(/&quot;/g, '"');
	}
	return string;
}

function NotifyUser()
{
	%if msg_list:
		%for i in msg_list:
			window.alert(htmlspecialchars_decode("${cgi.escape( i )}"));
		%endfor
	%endif
}
</script>
