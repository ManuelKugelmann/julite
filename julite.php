<?php
/*
Plugin Name: Julite Product Generator
Plugin URI: http://www.julispace.com
Description: Product Generator
Version: 0.1 BETA
Author: Manuel Kugelmann
Author URI: http://www.bitcraft.org
*/

add_shortcode("productgenerator", "productgenerator_handler");


/*

[productgenerator id = "lalala" title = "Lala la" A_deg = "33" A_label = "33°" A_lux= ]
[productgenerator id = "lalala" title = "Lala la" options = "name={Foo} | name = {Bar}" ]
*/


function productgenerator_handler($atts) {

  extract(shortcode_atts(array(
      'blubb' => 1,
   ), $atts));
   
   
  $output = productgenerator_function($blubb);
  
  return $output;
}

function productgenerator_function($blubb) {

	/*
	ob_start(); ?>
	<fieldset id="pets" data-role="controlgroup">
		<legend>Static Radio Buttons</legend>
		<input type="radio" name="pets" id="pets-cat" value="cat" checked="checked" />	<label for="pets-cat">Cat</label>
		<input type="radio" name="pets" id="pets-dog" value="dog" /> <label for="pets-dog">Dog</label>
		<script> jQuery( function(){jQuery("#pets").buttonset();}); </script>
	</fieldset>
	<?php
	return ob_get_clean();*/

	class Option
	{
		public $value;
		public $label;
	}


	$groupname = "angle";
	$grouplabel = $blubb;

	$options = array(
		"33°" =>  array ( "label" => "33°") ,
		"66°" => array ( "label" => "66°")
	);

	$checked = array_keys($options)[0];



	$output = "";

	$output .= <<<HTML
    <fieldset id="{$groupname}" data-role="controlgroup">
    	<legend>{$grouplabel}</legend>
HTML;


    foreach( $options as $keyvalue => $data )
    {
	    $label = $data["label"];
	    $id = $groupname . "-" . $keyvalue;
	    $output .= <<<HTML
		<input type="radio" name="{$groupname}" id="{$id}" value="{$keyvalue}" />	<label for="{$id}">{$label}</label>
HTML;
    }

	$output .= <<<HTML
		<script>
		jQuery( function(){
			finalizeRadioButtons("{$groupname}","{$checked}");
		});
		</script>
	</fieldset>
HTML;

	return $output;
}




function adding_important_scripts() {

	wp_register_script('modernizr', plugins_url('/js/vendor/modernizr-2.6.2.min.js', __FILE__));
	wp_enqueue_script('modernizr');

}

add_action( 'wp_enqueue_scripts', 'adding_important_scripts', 5 );


function adding_important_styles() {
	wp_register_style('normalize', plugins_url('/css/normalize.css', __FILE__), array(), '20141128');
	wp_enqueue_style('normalize');
}

add_action( 'wp_enqueue_scripts', 'adding_important_styles', 5);


function adding_scripts() {

	wp_enqueue_script('jquery');
	wp_enqueue_script('jquery-ui-core');
	wp_enqueue_script('jquery-ui-widget');
	wp_enqueue_script('jquery-ui-button');

	//wp_register_style('jquery-ui', "http://ajax.googleapis.com/ajax/libs/jqueryui/jquery-ui.js",array(), '1.10.4');
	//wp_enqueue_script('jquery-ui');

	wp_register_script('mustache', plugins_url('/js/vendor/mustache-0.4.2.min.js', __FILE__), array(),'0.4.2');
	wp_enqueue_script('mustache');

	wp_register_script('main', plugins_url('/js/main.js', __FILE__), array('jquery', 'mustache'), '20141128', true);
	wp_enqueue_script('main');

	wp_register_script('plugins', plugins_url('/js/plugins.js', __FILE__), array('main'), '20141128', true);
	wp_enqueue_script('plugins');
}

add_action( 'wp_enqueue_scripts', 'adding_scripts', 8 );


function adding_styles() {

	//wp_enqueue_style('jquery');
	//wp_enqueue_style('jquery-ui-core');
	//{$wp_scripts->registered['jquery-‌​‌​ui-core']->version}

	wp_register_style('jquery-ui', "http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/themes/ui-lightness/jquery-ui.min.css",array(), '1.10.4');
	wp_enqueue_style('jquery-ui');

	wp_register_style('main', plugins_url('/css/main.css', __FILE__), array(), '20141128');
	wp_enqueue_style('main');
}

add_action( 'wp_enqueue_scripts', 'adding_styles',10);


?>