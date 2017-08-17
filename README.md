# Waitlist

## Functionality
- [x] Waitlist Batchlist
	- [x] Trigger Emails via Batchlist
	- [x] Delete Waitlist entries via Batchlist
- [x] Front-end form submission
- [x] Page, `WatilistEmailTemplate` created on install with default code for email triggering
	- [x] Template code includes `l.settings:waitlist` variable. Includes: Product, Variant, Options for selected variant
	- [x] Customization over Subject & "Email From"
		- [x] `g.Email_Subject` & `g.Email_From` in template code will be used.
- [x] On deletion of a product, all references of that product are removed from the Waitlist table
- [x] Create Function to check all waitlists for email triggers
	- [x] Tie this functionality to a scheduled task
- [ ] Create if statement for form (hide/ shown on PROD page)
- [ ] Create a JSON version of form submission
	- [ ] JSON would return success [1|0], messages
- [ ] Run check for Waitlist add Product, with no variant, but should be with a variant (only adding the master product should not be allowed)
- [ ] Admin > Product View, show batchlist for JUST that product? (Can technically be done with an advanced search on Batchlist)
- [ ] Return `g.Waitlist_Message_ID`, for use elsewhere (for customizations on Messages)
- [ ] Look for other functionality that would be useful in this module

## Form Submission

**Required Inputs:**
- `g.Action` = `WaitlistAdd`
- `g.Waitlist_Product_Code`
- `g.Waitlist_Email`

Optional Inputs:
- `g.Waitlist_Variant_ID`
	- By Default this will be set to 0 if not set.

**Form Example**
```xml
<mvt:if expr="g.Waitlist_Error">Error: &mvte:global:Waitlist_Error;<br /></mvt:if>
<mvt:if expr="g.Waitlist_Message">&mvte:global:Waitlist_Message;<br /></mvt:if>
<form name="waitlist_add" method="post" action="&mvte:product:link;">
	<input type="hidden" name="Action" value="WaitlistAdd" />
	<input type="hidden" name="Waitlist_Product_Code" value="&mvt:product:code;" />
	<input type="hidden" name="Waitlist_Variant_ID" id="jsWaitlist_Variant_ID" value="&mvt:attributemachine:variant_id;" />
	Email: <input type="email" name="Waitlist_Email" value="&mvte:global:Waitlist_Email;" /><br />
	<input type="submit" value="Sign up to the waitlist!" class="button">
</form>
<script>
// ---- Update Display When Attribute Machine Fires ---- //
MivaEvents.SubscribeToEvent('variant_changed', function (product_data) {
	var WaitlistVariantID = document.getElementById( 'jsWaitlist_Variant_ID' );
	if ( WaitlistVariantID ) {
		WaitlistVariantID.value = 0;
		if ( product_data.variant_id > 0 ) {
			WaitlistVariantID.value = product_data.variant_id;
		}
	}
});
</script>
  ```
  
## Email Template Example
![Email Example](http://puu.sh/xbg14/bbb1594b13.png)
