MivaEvents.SubscribeToEvent('variant_changed', function (data) {
	var WaitlistVariantID = document.getElementById('jsWaitlist_Variant_ID');
	if (WaitlistVariantID) {
		WaitlistVariantID.value = data.variant_id > 0 ? data.variant_id : 0;
	}
});
