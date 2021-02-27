AttributeMachine.prototype.AttributeList_Load_Possible_Callback_Original = AttributeMachine.prototype.AttributeList_Load_Possible_Callback;

AttributeMachine.prototype.AttributeList_Load_Possible_Callback = function (response)
{
	var waitlist_form = document.getElementsByName('waitlist_add')[0];

	if (response && response.data && response.data.variant && waitlist_form)
	{
		if (response.data.variant.inv_active && response.data.variant.inv_level === 'out')
		{
			waitlist_form.style.display = 'block';
		}
		else
		{
			waitlist_form.style.display = 'none';
		}
	}

	this.AttributeList_Load_Possible_Callback_Original(response);
};
