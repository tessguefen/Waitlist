function Waitlist_Sent_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'TGWaitlist', 'Waitlist_Sent_Load_Query',
	{
		Filter:			filter,
		Sort:			sort,
		Offset:			offset,
		Count: 			count
	}, delegator );
}

function Waitlist_Sent_Batchlist_Delete( id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'TGWaitlist', 'Waitlist_Sent_Delete',
	{
		ID: id
	}, delegator );
}

function Waitlist_Sent_Batchlist()
{
	MMBatchList.call( this, 'Waitlist_Sent_Batchlist' );

	this.Feature_SearchBar_SetPlaceholderText( 'Search Sent Waitlists...' );
	this.SetDefaultSort( 'id', '-' );

	if ( CanI( 'SYSM', 0, 0, 0, 1 ) )
	{
		this.Feature_Delete_Enable('Delete Waitlist(s)');
	}
}

DeriveFrom( MMBatchList, Waitlist_Sent_Batchlist );

Waitlist_Sent_Batchlist.prototype.onLoad = Waitlist_Sent_Load_Query;

Waitlist_Sent_Batchlist.prototype.onCreateRootColumnList = function()
{
	var columnlist =
	[
		new MMBatchList_Column_Name(		'Waitlist ID',			'id',			'id')
			.SetAdvancedSearchEnabled(false)
			.SetDisplayInMenu(false)
			.SetDisplayInList(false)
			.SetAdvancedSearchEnabled(false)
			.SetSortByField( '' ),
		new MMBatchList_Column_DateTime(	'Date Added',			'time_added',	'time_added'),
		new MMBatchList_Column_DateTime(	'Date Sent',			'time_sent',	'time_sent'),
		new MMBatchList_Column_Name(		'Email',				'email',		'email'),
		new MMBatchList_Column_Name(		'Product Code',			'product_code',	'product_code'),
		new MMBatchList_Column_Name(		'Product Name',			'product_name',	'product_name'),
		new MMBatchList_Column_Name(		'Variant Code',			'variant_code',	'variant_code'),
		new MMBatchList_Column_Name(		'Variant Product Name',	'variant_name',	'variant_name'),
		new MMBatchList_Column_Name(		'Product ID',			'product_id',	'product_id')
			.SetDisplayInMenu(false)
			.SetDisplayInList(false)
			.SetAdvancedSearchEnabled(false)
			.SetSortByField( '' ),
		new MMBatchList_Column_Name(		'Variant ID',			'variant_id ',	'variant_id')
			.SetAdvancedSearchEnabled(false)
			.SetDisplayInMenu(false)
			.SetDisplayInList(false)
			.SetSortByField( '' ),
		new MMBatchList_Column_Numeric(		'Quantity',				'quantity',		'quantity', 0)
	];

	return columnlist;
}

Waitlist_Sent_Batchlist.prototype.onDelete = function( item, callback, delegator )
{
	Waitlist_Sent_Batchlist_Delete( item.record.id, callback, delegator );
}
