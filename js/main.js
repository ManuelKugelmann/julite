jQuery(document).on("pageinit", function(event){

	// custom code goes here



});

/*
 options = [
 { "value": "moe", "label": "Moe"},
 { "value": "larry", "label": "Larry" },
 { "value": "curly", "label": "Curly" }
 ]

 createRadioButtons("stooges", options);
 */


function finalizeRadioButtons(groupname, checked) {


    jQuery( "input[name="+groupname+"]:radio" ).click(function() {
        if(jQuery(this).is(':checked')) { alert("checked " + jQuery(this).attr('id') ); }
    });

    jQuery("#"+groupname+"-"+checked).prop("checked", true)


    jQuery("#"+groupname).buttonset();

}


function createRadioButtons(insertionpoint, groupname, options, checked){


    if (!checked) {
        checked = options[0].value;
    }

	var template = '{{#options}}\
			<label for="{{name}}-{{value}}">{{label}}</label>\
			<input type="radio" name="{{name}}" id="{{name}}-{{value}}" value="{{value}}"/>\
		    {{/options}}';

	var $radios = jQuery("<fieldset id='"+groupname+"' data-role='controlgroup'></fieldset>")
		.prepend(
        jQuery(Mustache.to_html(template, {'name': groupname, 'options':options}))
	);

    jQuery("#"+insertionpoint).append($radios).trigger('create');



    jQuery( "input[name="+groupname+"]:radio" ).click(function() {
        if(jQuery(this).is(':checked')) { alert("checked " + jQuery(this).attr('id') ); }
    });

    jQuery("#"+groupname+"-"+checked).prop("checked", true)



    jQuery("#"+groupname).buttonset();

}
