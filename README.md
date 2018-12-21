# Waitlist
Current Module Version: 1.006

1.007 coming soon.

## What's new in 1.007
- Log of which emails got sent ( Waitlist - Sent )
- [JSON API Hooks](#json_api)

## What's new in 1.006
- Current Stock Column for Batchlist
- Minor Validation

## UPDATING FROM 1.004 AND BELOW
Please Change the following page codes:
- `WatilistEmailTemplate` TO `WaitlistEmailTemplate`
- `WatilistEmailLogic` TO `WaitlistEmailLogic` (if you were using this)

## Functionality
- [x] Waitlist Batchlist
	- [x] Trigger Emails via Batchlist
	- [x] Delete Waitlist entries via Batchlist
	- [x] Product Name & Variant Name displayed
- [x] Front-end form submission
- [x] Page, `WaitlistEmailTemplate` created on install with default code for email triggering
	- [x] Template code includes `l.settings:waitlist` variable. Includes: Product, Variant, Options for selected variant
	- [x] Customization over Subject & "Email From"
		- [x] `g.Email_Subject` & `g.Email_From` in template code will be used.
- [x] On deletion of a product, all references of that product are removed from the Waitlist table
- [x] Create Function to check all waitlists for email triggers
	- [x] Tie this functionality to a scheduled task
- [x] Create if statement for form (hide/ shown on PROD page)
- [x] Create an API version of form submission
- [x] Run check for Waitlist add Product, with no variant, but should be with a variant (only adding the master product should not be allowed)
- [x] Custom Page to determine if an email should be triggered. [View Details here](#customized-email-trigger-logic-v-1001)

## Item Functionality
- [x] Create an item
	- [x] `Waitlist_API_URL( return var )`
		- This will return a url for the Waitlist API (json url)
	- [x] `CurrentWaitlistCount( product_id, variant_id, return var )`
		- This will return the number of people on the waitlist
	- [x] `WaitlistXCustomer_Load( cust_id, return var )`
		- This will load in all waitlists a customer is currently waiting on (via cust_id)
	- [x] `WaitlistXEmail_Load( email, return var )`
		- This will load in all waitlists a customer is currently waiting on (via email)

**WaitlistXCustomer_Load & WaitlistXEmail_Load will return an array of waitlists. Example members available:**
```xml
:cust_id
:email
:id
:options:attmpat_id
:options:attr_id
:options:attribute:attemp_id
:options:attribute:code
:options:attribute:cost
:options:attribute:default_id
:options:attribute:disp_order
:options:attribute:id
:options:attribute:inventory
:options:attribute:price
:options:attribute:product_id
:options:attribute:prompt
:options:attribute:required
:options:attribute:type
:options:attribute:weight
:options:dimensions
:options:option:attr_id
:options:option:code
:options:option:cost
:options:option:disp_order
:options:option:id
:options:option:price
:options:option:product_id
:options:option:prompt
:options:option:weight
:options:option_id
:options:part_count
:options:product_id
:options:variant_id
:product:active
:product:agrpcount
:product:cancat_id
:product:catcount
:product:code
:product:cost
:product:disp_order
:product:dt_created
:product:dt_updated
:product:id
:product:name
:product:page_id
:product:pgrpcount
:product:price
:product:taxable
:product:weight
:product_id
:time_added
:variant_id
:variantspart_id
:variants:product:active
:variants:product:agrpcount
:variants:product:cancat_id
:variants:product:catcount
:variants:product:code
:variants:product:cost
:variants:product:disp_order
:variants:product:dt_created
:variants:product:dt_updated
:variants:product:id
:variants:product:name
:variants:product:page_id
:variants:product:pgrpcount
:variants:product:price
:variants:product:taxable
:variants:product:weight
:variants:product_id
:variants:quantity
:variants:variant_id
```

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
<mvt:if expr="g.Waitlist_Error"><div style="background: #e74c3c; color: #fff; font-size: 11px; padding: 5px 10px;">Error: &mvte:global:Waitlist_Error;</div></mvt:if>
<mvt:if expr="g.Waitlist_Message"><div style="background: #16a085; color: #fff; font-size: 11px; padding: 5px 10px;">&mvte:global:Waitlist_Message;</div></mvt:if>

<form name="waitlist_add" method="post" action="&mvte:product:link;" style="display:none;">
	<div style="font-size: 11px; background: #ecf0f1; text-align: center; padding: 10px 5px; margin-bottom: 0.75rem;">Sign up with your email to be notified when this product is back in stock!</div>
	<div id="jsWaitlist_Message"></div>
	<input type="hidden" name="Action" value="WaitlistAdd" />
	<input type="hidden" name="Waitlist_Product_Code" value="&mvt:product:code;" />
	<input type="hidden" name="Waitlist_Variant_ID" id="jsWaitlist_Variant_ID" value="&mvt:attributemachine:variant_id;" />
	<div style="display: flex;flex-direction: row;">
		<input type="email" name="Waitlist_Email" value="&mvte:global:Waitlist_Email;" placeholder="Email" style="flex: 1 1 auto; padding: 5px; border: 1px solid #bdc3c7; border-right: 0;" />
		<input type="submit" value="Sign up" class="button" style="flex: 1 1 auto; padding: 5px; border: 0; background-color: #3498db;" />
	</div>
</form>
```
**Item to call Waitlist API (for AJAX call)**
```xml
<mvt:item name="waitlist" param="Waitlist_API_URL( l.all_settings:waitlist_url )" />
```

**Javascript for basic show/ hide & Ajax call**
```javascript
var waitlist_api = '&mvtj:waitlist_url;';
// ---- Update Display When Attribute Machine Fires ---- //
var waitlist_form = document.getElementsByName( 'waitlist_add' )[0];
var waitlist_ajax_msg = document.getElementById( 'jsWaitlist_Message');
MivaEvents.SubscribeToEvent('variant_changed', function (product_data) {
	var WaitlistVariantID = document.getElementById( 'jsWaitlist_Variant_ID' );
	if ( WaitlistVariantID ) {
		WaitlistVariantID.value = 0;
		if ( product_data.variant_id > 0 ) WaitlistVariantID.value = product_data.variant_id;
	}
	if ( am&mvte:product:id;.buttons && waitlist_form ) {
		var show_waitlist = 0;
		am&mvte:product:id;.buttons.forEach( function( button ) {
			if ( button.disabled ) show_waitlist = 1;
		});
		show_waitlist === 0 ? waitlist_form.style.display = 'none' : waitlist_form.style.display = 'block';
	}
});

var stock_level = '&mvtj:attributemachine:product:inv_level;';
( stock_level == 'out' && waitlist_form ) ? waitlist_form.style.display = 'block' : waitlist_form.style.display = 'none';

// ---- Show / Hide Form for Attributes ---- //
if ( typeof am&mvte:product:id; != 'undefined' ) {
	var inv_msg_element = document.getElementById( am&mvte:product:id;.settings.inventory_element_id );
	if ( inv_msg_element && ( inv_msg_element.innerHTML ).includes( am&mvte:product:id;.settings.invalid_msg ) && waitlist_form ) waitlist_form.style.display = 'none';
}

// Ajax Call
if ( waitlist_form && waitlist_api ) {
	waitlist_form.onsubmit = function onSubmit( form ) {
		form.preventDefault();
		var Waitlist_Product_Code = document.getElementsByName( 'Waitlist_Product_Code' )[0].value;
		var Waitlist_Variant_ID = document.getElementsByName( 'Waitlist_Variant_ID' )[0].value;
		var Waitlist_Email = document.getElementsByName( 'Waitlist_Email' )[0].value;

		var waitlist_data = 'WaitlistFunction=Waitlist_Add&Product_Code=' + Waitlist_Product_Code + '&Variant_ID=' + Waitlist_Variant_ID + '&Email=' + Waitlist_Email;

		var wishlist_call = new XMLHttpRequest();
		wishlist_call.open('POST', waitlist_api, true);
		wishlist_call.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		wishlist_call.onload = function() {
			if (this.status === 200) {
				var wishlist_return = JSON.parse( this.responseText );
				if ( wishlist_return.success === 0 ) {
					waitlist_ajax_msg.innerHTML = wishlist_return.error_message;
				} else {
					waitlist_ajax_msg.innerHTML = 'Thank you for signing up!';
				}
				console.log(wishlist_return);
			} else {
				waitlist_ajax_msg.innerHTML = 'An error has occurred.';
			}
		};
		wishlist_call.send( waitlist_data );

	}
}
```
  
## Email Template Example
![Email Example](http://puu.sh/xbg14/bbb1594b13.png)

---

## Customized Email Trigger Logic (v 1.001)
You can create an Page called `WaitlistEmailLogic`, and return a `1` or `0` in the variable `g.Waitlist_Email_Continue`.

If `g.Waitlist_Email_Continue` is set to 1, it will send the email.

If `g.Waitlist_Email_Continue` is set to 0, it will not send the email.

If `g.Waitlist_Email_Continue` is not set, it will use the original determination from the module.

**When an email is triggered, and it uses the page WaitlistEmailLogic, you will have access to l.settings:waitlist**

`l.settings:waitlist:original_determination` is the original determination from the module before hitting the page. It can return 1, 0 & negative values. Anything below or equal to 0 will not trigger the email.

#### When l.settings:waitlist:variant_id is greater than 0:
```xml
:waitlist:cust_id
:waitlist:email
:waitlist:id
:waitlist:options[X]:attmpat_id
:waitlist:options[X]:attr_id
:waitlist:options[X]:attribute:attemp_id
:waitlist:options[X]:attribute:code
:waitlist:options[X]:attribute:cost
:waitlist:options[X]:attribute:default_id
:waitlist:options[X]:attribute:disp_order
:waitlist:options[X]:attribute:id
:waitlist:options[X]:attribute:inventory
:waitlist:options[X]:attribute:price
:waitlist:options[X]:attribute:product_id
:waitlist:options[X]:attribute:prompt
:waitlist:options[X]:attribute:required
:waitlist:options[X]:attribute:type
:waitlist:options[X]:attribute:weight
:waitlist:options[X]:dimensions
:waitlist:options[X]:option:attr_id
:waitlist:options[X]:option:code
:waitlist:options[X]:option:cost
:waitlist:options[X]:option:disp_order
:waitlist:options[X]:option:id
:waitlist:options[X]:option:price
:waitlist:options[X]:option:product_id
:waitlist:options[X]:option:prompt
:waitlist:options[X]:option:weight
:waitlist:options[X]:option_id
:waitlist:options[X]:part_count
:waitlist:options[X]:product_id
:waitlist:options[X]:variant_id
:waitlist:original_determination (Original Determination from the Module)
:waitlist:product:active
:waitlist:product:agrpcount
:waitlist:product:cancat_id
:waitlist:product:catcount
:waitlist:product:code
:waitlist:product:cost
:waitlist:product:disp_order
:waitlist:product:id
:waitlist:product:inv_active
:waitlist:product:name
:waitlist:product:page_id
:waitlist:product:pgrpcount
:waitlist:product:price
:waitlist:product:taxable
:waitlist:product:weight
:waitlist:product_id
:waitlist:time_added
:waitlist:variant_id
:waitlist:variants[X]:part_id
:waitlist:variants[X]:product_id
:waitlist:variants[X]:quantity
:waitlist:variants[X]:variant_id
```
`[x]` Determines it is part of an array.

#### When There is no variant:
```xml
:waitlist:cust_id
:waitlist:email
:waitlist:id=
:waitlist:original_determination (Original Determination from the Module)
:waitlist:product:active
:waitlist:product:agrpcount
:waitlist:product:cancat_id
:waitlist:product:catcount
:waitlist:product:code
:waitlist:product:cost
:waitlist:product:descrip
:waitlist:product:disp_order
:waitlist:product:id
:waitlist:product:inv_active
:waitlist:product:inv_available
:waitlist:product:inv_instock
:waitlist:product:inv_level
:waitlist:product:inv_long
:waitlist:product:inv_low_level
:waitlist:product:inv_low_track
:waitlist:product:inv_out_level
:waitlist:product:inv_out_track
:waitlist:product:inv_short
:waitlist:product:name
:waitlist:product:page_id
:waitlist:product:pgrpcount
:waitlist:product:price
:waitlist:product:taxable
:waitlist:product:weight
:waitlist:product_id
:waitlist:time_added
:waitlist:variant_id
```


## Miva JSON API
<a name="json_api"></a>

The following functions may be used:
- [Waitlist_Load_Query](#Waitlist_Load_Query)
	- Use this to load in all the waitlist users.
- [Waitlist_Trigger_All](#Waitlist_Trigger_All)
	- This will run a function to trigger any waitlist emails, that need to be sent.
- [Waitlist_Load_Email](#Waitlist_Load_Email)
	- Load the Waitlists for a specific Email
- [Waitlist_Load_Customer](#Waitlist_Load_Customer)
	- Load the Waitlists for a specific Customer (using Customer's ID)
- [Waitlist_Add](#Waitlist_Add)
	- Add a user to a waitlist.

### Waitlist_Load_Query
<a name="Waitlist_Load_Query"></a>

The following may be sorted/ filtered:

| Code         | Description                                                        | 
|--------------|--------------------------------------------------------------------| 
| id           | Waitlist ID; Unique                                                | 
| time_added   | Timestamp of when the User signed up for the waitlist              | 
| product_id   | Product ID                                                         | 
| variant_id   | Variant ID (if applicable)                                         | 
| email        | Email of User who signed up for the waitlist                       | 
| cust_id      | Customer ID of user who signed up for the waitlist (if applicable) | 
| product_code | Product Code                                                       | 
| variant_code | Variant Part(s) Product Code                                       | 
| product_name | Product Name                                                       | 
| variant_name | Variant Part(s) Product Name                                       | 

Example:

```json
{
	"Store_Code": "YOUR_STORE_CODE",
	"Function": "Module",
	"Module_Code": "TGWaitlist",
	"Module_Function": "Waitlist_Load_Query",
	"sort": "email",
	"Filter":[  
		{  
			"name":"search",
			"value":[  
				{  
					"field": "product_code",
					"operator": "EQ",
					"value": "My_Product_Code"
				}
			]
		}
	]
}
```

### Waitlist_Trigger_All
<a name="Waitlist_Trigger_All"></a>

Example:

```json
{
	"Store_Code": "YOUR_STORE_CODE",
	"Function": "Module",
	"Module_Code": "TGWaitlist",
	"Module_Function": "Waitlist_Trigger_All"
}
```

### Waitlist_Load_Email
<a name="Waitlist_Load_Email"></a>

Example:

```json
{
	"Store_Code": "YOUR_STORE_CODE",
	"Function": "Module",
	"Module_Code": "TGWaitlist",
	"Module_Function": "Waitlist_Load_Email",
	"Email": "email@email.com"
}
```

### Waitlist_Load_Customer
<a name="Waitlist_Load_Customer"></a>

Example:

```json
{
	"Store_Code": "YOUR_STORE_CODE",
	"Function": "Module",
	"Module_Code": "TGWaitlist",
	"Module_Function": "Waitlist_Load_Customer",
	"Customer_ID": 5
}
```

### Waitlist_Add
<a name="Waitlist_Add"></a>
*`Variant_ID` & `Customer_ID` is optional.*

Example:

```json
{
	"Store_Code": "YOUR_STORE_CODE",
	"Function": "Module",
	"Module_Code": "TGWaitlist",
	"Module_Function": "Waitlist_Add",
	"Product_Code": "My_Product_Code",
	"Email": "hello@email.com",
	"Customer_ID": 2,
	"Variant_ID": 2
}
```