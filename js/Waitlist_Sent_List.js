function Waitlist_Sent_Load_Query( filter, sort, offset, count, callback, delegator ) {
	return AJAX_Call_Module(	callback,
								'admin',
								'TGWaitlist',
								'JSON_Waitlist_Sent_Load_Query',
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

function Waitlist_Sent_Batchlist() {
	var self = this;
	MMBatchList.call( this, 'jsWaitlist_Sent_Batchlist' );
	this.Feature_SearchBar_SetPlaceholderText( 'Search Sent Waitlists...' );
	this.SetDefaultSort( 'id', '-' );
	this.Feature_Delete_Enable('Delete Waitlist(s)');
	this.processingdialog = new ProcessingDialog();
}

DeriveFrom( MMBatchList, Waitlist_Sent_Batchlist );

Waitlist_Sent_Batchlist.prototype.onLoad = Waitlist_Sent_Load_Query;

Waitlist_Sent_Batchlist.prototype.onCreateRootColumnList = function() {
	var columnlist =
	[
		new MMBatchList_Column_Name( 'Waitlist ID', 'id', 'id')
		.SetAdvancedSearchEnabled(false)
		.SetDisplayInMenu(false)
		.SetDisplayInList(false)
		.SetAdvancedSearchEnabled(false),
		new MMBatchList_Column_DateTime( 'Date Added', 'time_added', 'time_added'),
		new MMBatchList_Column_DateTime( 'Date Sent', 'time_sent', 'time_sent'),
		new MMBatchList_Column_Name( 'Email', 'email', 'email'),
		new MMBatchList_Column_Name( 'Product Code', 'product_code', 'product_code'),
		new MMBatchList_Column_Name( 'Product Name', 'product_name', 'product_name'),
		new MMBatchList_Column_Name( 'Variant Code', 'variant_code', 'variant_code'),
		new MMBatchList_Column_Name( 'Variant Product Name', 'variant_name', 'variant_name'),
		new MMBatchList_Column_Name( 'Product ID', 'product_id', 'product_id')
		.SetDisplayInMenu(false)
		.SetDisplayInList(false)
		.SetAdvancedSearchEnabled(false),
		new MMBatchList_Column_Name( 'Variant ID', 'variant_id ', 'variant_id')
		.SetAdvancedSearchEnabled(false)
		.SetDisplayInMenu(false)
		.SetDisplayInList(false)
	];
	return columnlist;
}

Waitlist_Sent_Batchlist.prototype.onDelete = function( item, callback, delegator ) {
	Waitlist_Sent_Batchlist_Delete( item.record.id, callback, delegator );
}
