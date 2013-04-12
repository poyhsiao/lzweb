$(function(){
	InitSelection($('#sel_type'), vLogTypeList);

	$('#sel_type').change(function(){
		if ($(this).val() == vLogTypeList[0]) //system
		{
			$.get(
				'refreshLog',
				{logtype: 'system'},
				function(response) {
					$('#_RecentEvent').val( response );
				}
			)
		}
		else //traffic
		{
			$.get(
				'refreshLog',
				{logtype: 'traffic'},
				function(response) {
					$('#_RecentEvent').val( response );
				}
			)
		}
	});

	$('#refresh').click(function(){
		if ($('#sel_type').val() == vLogTypeList[0]) //system
		{
			$.get(
				'refreshLog',
				{logtype: 'system'},
				function(response) {
					$('#_RecentEvent').val( response );
				}
			)
		}
		else //traffic
		{
			$.get(
				'refreshLog',
				{logtype: 'traffic'},
				function(response) {
					$('#_RecentEvent').val( response );
				}
			)
		}
	});

	// Initial log is system
	$('#_RecentEvent').height( 7 * document.documentElement.clientHeight / 9 )
		.val( system_jcfg.join('') );

	NotifyUser();
});
