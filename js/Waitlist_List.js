function Waitlist_Load_Query( filter, sort, offset, count, callback, delegator ) {
	return AJAX_Call_Module_JSON( callback, 'admin', 'TGWaitlist', 'Waitlist_Load_Query',
	{
		Filter:			filter,
		Sort:			sort,
		Offset:			offset,
		Count: 			count
	}, delegator );
}

function Waitlist_Batchlist_Delete( id, callback, delegator ) {
	return AJAX_Call_Module_JSON( callback, 'admin', 'TGWaitlist', 'Waitlist_Delete',
	{
		ID: id
	}, delegator );
}

function TriggerEmails_Execute( waitlist_items, callback, delegator ) {
	return AJAX_Call_Module_JSON( callback, 'admin', 'TGWaitlist', 'Waitlist_Trigger_Emails',
	{
		Waitlists:	waitlist_items
	}, delegator );
}

function Waitlist_Batchlist() {
	MMBatchList.call( this, 'jsWaitlist_Batchlist' );

	this.Feature_SearchBar_SetPlaceholderText( 'Search Waitlists...' );
	this.SetDefaultSort( 'id', '-' );

	if ( CanI( 'SYSM', 0, 0, 0, 1 ) )
	{
		this.Feature_Delete_Enable('Delete Waitlist(s)');
	}

	if ( CanI( 'SYSM', 0, 0, 1, 0 ) )
	{
		this.button_trigger_emails	= this.Feature_Buttons_AddButton_Dynamic( 'Trigger Emails', 'Trigger Emails', 'Refresh', this.TriggerEmails );

		this.Feature_BatchProcessList_RegisterProcess( 'TriggerEmails', function( ids, callback, delegator ) { TriggerEmails_Execute( ids, callback, delegator ); } );
		this.Feature_BatchProcessList_SetOnBatchProcessList_Add( 'TriggerEmails', this.onBatchProcessList_Add_TriggerEmails );
		this.Feature_BatchProcessList_SetOnBatchProcessProcessingDialogTitle( 'TriggerEmails', this.onBatchProcessProcessingDialogTitle_TriggerEmails );
		this.Feature_BatchProcessList_SetOnBatchProcessShouldConfirm( 'TriggerEmails', function() { return false; } );
	}
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
		.SetDisplayInList(false),
		new MMBatchList_Column_Name( 'Current Stock', 'inv_count', 'inv_count')
		.SetAdvancedSearchEnabled(false)
		.SetSortByField( '' )
	];
	return columnlist;
}

Waitlist_Batchlist.prototype.onDelete = function( item, callback, delegator ) {
	Waitlist_Batchlist_Delete( item.record.id, callback, delegator );
}

Waitlist_Batchlist.prototype.TriggerEmails = function()
{
	this.Feature_BatchProcessList_ProcessList( 'TriggerEmails' );
}

Waitlist_Batchlist.prototype.onBatchProcessList_Add_TriggerEmails = function( item, list )
{
	list.push( item.record.id );
}

Waitlist_Batchlist.prototype.onBatchProcessList_TriggerEmails = function( ids, callback, delegator )
{
	TriggerEmails_Execute( ids, callback, delegator );
}

Waitlist_Batchlist.prototype.onBatchProcessProcessingDialogTitle_TriggerEmails = function()
{
	return 'Preparing to trigger Emails';
}

Waitlist_Batchlist.prototype.Custom_EnableDisableButtons_Hook = function()
{
	var triggeremails = false;

	for ( i = 0; i < this.ActiveItemList_Count(); i++ )
	{
		if ( this.ActiveItemList_ItemAtIndex( i ).record.pending == 1 )
		{
			triggeremails = true;
			break;
		}
	}

	if ( this.button_process_points && triggeremails )	this.button_process_points.Show();
	else if ( this.button_process_points )				this.button_process_points.Hide();
}
