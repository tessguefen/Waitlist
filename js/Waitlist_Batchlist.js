function Waitlist_Batchlist() {
	var self = this;
	MMBatchList.call( this, 'jsWaitlist_Batchlist' );
	this.Feature_SearchBar_SetPlaceholderText( 'Search Waitlists...' );
	this.SetDefaultSort( 'time_added', '-' );
	this.Feature_Delete_Enable('Delete Waitlist(s)');
	this.Feature_RowDoubleClick_Enable();
	this.processingdialog = new ProcessingDialog();
	this.Feature_Buttons_AddButton_Dynamic( 'Trigger Email(s)', '', 'notification', self.triggerEmails );
}

DeriveFrom( MMBatchList, Waitlist_Batchlist );

Waitlist_Batchlist.prototype.onLoad = Waitlist_Load_Query;

Waitlist_Batchlist.prototype.onCreateRootColumnList = function() {
	var columnlist =
	[
		new MMBatchList_Column_Name( 'Waitlist ID', 'id', 'id')
		.SetAdvancedSearchEnabled(false)
		.SetDisplayInMenu(false)
		.SetDisplayInList(false)
		.SetAdvancedSearchEnabled(false),
		new MMBatchList_Column_DateTime( 'Date Added', 'time_added', 'time_added'),
		new MMBatchList_Column_Name( 'Email', 'email', 'email'),
		new MMBatchList_Column_Name( 'Product Code', 'product_code', 'product_code'),
		new MMBatchList_Column_Name( 'Variant Code', 'variant_code', 'variant_code'),
		new MMBatchList_Column_Name( 'Product ID', 'product_id', 'product_id')
		.SetDisplayInMenu(false)
		.SetDisplayInList(false)
		.SetAdvancedSearchEnabled(false),
		new MMBatchList_Column_Name( 'Variant ID', 'variant_id ', 'variant_id ')
		.SetAdvancedSearchEnabled(false)
		.SetDisplayInMenu(false)
		.SetDisplayInList(false)
	];
	return columnlist;
}

Waitlist_Batchlist.prototype.onDelete = function( item, callback, delegator ) {
	Waitlist_Batchlist_Delete( item.record.id, callback, delegator );
}

Waitlist_Batchlist.prototype.triggerEmails = function() {
	var self = this;
	var i, i_len, item, list;

	list = new Array();
	
	for ( i = 0, i_len = this.ActiveItemList_Count(); i < i_len; i++ ) {
		if ( ( item = this.ActiveItemList_ItemAtIndex( i ) ) === null ) {
			continue;
		}

		list.push( item.record.time_added );
	}

	this.processingdialog.Show( 'Triggering Emails...' );
	
	Waitlist_Trigger_Emails( list, function( response ) { self.Waitlist_Trigger_Emails_Callback( response ); } );
}

Waitlist_Batchlist.prototype.Waitlist_Trigger_Emails_Callback = function( response ) {
	this.processingdialog.Hide();

	if ( !response.success ) {
		return this.onerror( response.error_code, response.error_message );
	}

	this.Refresh();
}