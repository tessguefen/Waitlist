function Waitlist_Sent_Load_Query( filter, sort, offset, count, callback, delegator ) {
	return AJAX_Call_Module(	callback,
								'admin',
								'TGWaitlist',
								'Waitlist_Sent_All_Load_Query',
								'&Filter=' + EncodeArray( filter ) +
								'&Sort=' + encodeURIComponent( sort ) +
								'&Offset=' + encodeURIComponent( offset ) +
								'&Count=' + encodeURIComponent( count ),
								delegator );
}

function Waitlist_Sent_Batchlist_Delete( id, callback, delegator ) {
	return AJAX_Call_Module(	callback,
								'admin',
								'TGWaitlist',
								'Waitlist_Sent_Delete',
								'Waitlist_ID=' + encodeURIComponent( id ),
								delegator );
}