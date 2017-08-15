function Waitlist_Load_Query( filter, sort, offset, count, callback, delegator ) {
	return AJAX_Call_Module(	callback,
								'admin',
								'TGWaitlist',
								'Waitlist_All_Load_Query',
								'&Filter=' + EncodeArray( filter ) +
								'&Sort=' + encodeURIComponent( sort ) +
								'&Offset=' + encodeURIComponent( offset ) +
								'&Count=' + encodeURIComponent( count ),
								delegator );
}

function Waitlist_Batchlist_Delete( time_added, email, callback, delegator ) {
	return AJAX_Call_Module(	callback,
								'admin',
								'TGWaitlist',
								'Waitlist_Delete',
								'time_added=' + encodeURIComponent( time_added ) + '&email=' + encodeURIComponent( email ),
								delegator );
}

function Waitlist_Trigger_Emails( waitlist_items, callback ) {
	return AJAX_Call_Module(	 callback,
								'admin',
								'TGWaitlist',
								'Waitlist_Trigger_Emails',
								'Waitlists=' + EncodeArray( waitlist_items ) );
}