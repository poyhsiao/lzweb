var CurrentTabid = 0;

function set_tab_color(tab)
{       
	if (tab.hasClass('tabon'))
	{
		tab.css({
			color: '#FFFFFF',
			backgroundColor: 'black',
			borderBottom: '3px #CC0000 solid'
		});
	}
	else
	{
		tab.css({
			color: '#999999',
			backgroundColor: 'black',
			borderBottom: 'thin black solid'
		});
	}
}

function switchcontent(index)
{
	var oDoc = parent.document.getElementById("ContentFrame").contentWindow.document;
	switch (index)
	{
		case 0: //WAN
			oDoc.getElementById("WanSheet").style.display = "";	
			oDoc.getElementById("LanSheet").style.display = "none";			
			oDoc.getElementById("DmzSheet").style.display = "none";	
			break;
		case 1: //DMZ
			oDoc.getElementById("WanSheet").style.display = "none";	
			oDoc.getElementById("DmzSheet").style.display = "";			
			oDoc.getElementById("LanSheet").style.display = "none";			
			break;
		case 2: //LAN
			oDoc.getElementById("WanSheet").style.display = "none";	
			oDoc.getElementById("DmzSheet").style.display = "none";			
			oDoc.getElementById("LanSheet").style.display = "";			
			break;	
	}
}

function switchtab()
{
	var tabs, i;

	if ($(this).hasClass('tabon')) return;
	tabs = $('table#tablist td');
	for (i = 0; i < tabs.size(); i++) {
		if (this == tabs.get(i)) {
			$(this).removeClass("taboff").addClass("tabon");
			set_tab_color($(this));
			CurrentTabid = i;
		}
		else {
			tabs.eq(i).removeClass("tabon").addClass("taboff");
			set_tab_color(tabs.eq(i));
		}
	}
	switchcontent(CurrentTabid);
}

function set_tabs(tabid)
{
	var tabs, i;
	tabs = $('table#tablist td');
	if (tabid<0 || tabid>tabs.length)
		tabid = CurrentTabid;
	else
		CurrentTabid = tabid;

	for (i = 0; i < tabs.size(); i++) {
		if (i==tabid)
			tabs.eq(i).removeClass("taboff").addClass("tabon");
		else
			tabs.eq(i).removeClass("tabon").addClass("taboff");

		set_tab_color(tabs.eq(i));
	}
}

$(function(){
	$('table#tablist td').each(function(){
		this.onclick = switchtab;
		this.onmouseover = function(){
			if ($(this).hasClass('taboff')) {
				$(this).css({
					color: '#666666',
					backgroundColor: '#CCCCCC',
					borderBottom: '3px #666666 solid'
				});
			}
		};
		this.onmouseout = function(){
			set_tab_color($(this));
		};
	});
	set_tabs(-1);
});
