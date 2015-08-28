<?php
/*
Plugin Name: Julite Product Generator
Plugin URI: http://www.julispace.com
Description: Product Generator
Version: 0.0.8
Author: Manuel and Jonas Kugelmann
Author URI: http://www.bitcraft.org
GitHub Plugin URI: TheDraguun/julite
*/

add_shortcode("productgenerator", "productgenerator_handler");


/*
[productgenerator id="lalala" angle="33" lux="185" lux_d="100" min_d="300" max_d="500" kelvin="3500"]
*/


function productgenerator_handler($atts) {

  extract(shortcode_atts(array(
      'id' => "pg_".uniqid(),
      'angle' => 33,
      'lux' => 185,
      'lux_d' => 100,
      'min_d' => 10,
      'max_d' => 300,
	  'init_d' => 240,
	  'kelvin' => 3500
  ), $atts));


  $output = productgenerator_function($id, $angle, $lux, $lux_d, $min_d, $max_d, $init_d, $kelvin);

  return $output;
}

function productgenerator_function($id, $angle, $lux, $luxD, $minD, $maxD, $initD, $kelvin) {
  $maxD10 =$maxD *0.01;
  $minD10 =$minD *0.01;
	$output = "";
	$output .= <<<HTML

	<div id="{$id}_pg" class="pg">

        <div id="{$id}_slider" class="pg_slider"></div>

		<div id="{$id}_drawing" class="pg_drawing"></div>

		<div class="pg_input_block">
      <span class="pg_text_color" > Roomheight</span> <input id="{$id}_input" class="pg_input" type="number" max="{$maxD10}" min="{$minD10}" step="0.01"/><span class="pg_text_color" > m</span>
		</div>

		<div style="clear: both;"></div>

        <script>jQuery(function(){pg_init("{$id}", parseInt({$angle}), parseInt({$lux}), parseInt({$luxD}), parseInt({$minD}), parseInt({$maxD}), parseInt({$initD}), parseInt({$kelvin}));});</script>

	</div>

HTML;

	return $output;
}




function adding_important_scripts() {

	wp_register_script('modernizr', plugins_url('/js/vendor/modernizr-2.6.2.min.js', __FILE__));
	wp_enqueue_script('modernizr');

}

add_action( 'wp_enqueue_scripts', 'adding_important_scripts', 5 );


function adding_important_styles() {
	wp_register_style('normalize', plugins_url('/css/normalize.css', __FILE__), array(), '20150301');
	wp_enqueue_style('normalize');
}

add_action( 'wp_enqueue_scripts', 'adding_important_styles', 5);


function adding_scripts() {

	$plugin_data = get_plugin_data(__FILE__);
	$plugin_version = $plugin_data['Version'];

	wp_enqueue_script('jquery');
	wp_enqueue_script('jquery-ui-core');
	wp_enqueue_script('jquery-ui-widget');
	wp_enqueue_script('jquery-ui-button');
    wp_enqueue_script('jquery-ui-slider');

	//wp_register_style('jquery-ui', "http://ajax.googleapis.com/ajax/libs/jqueryui/jquery-ui.js",array(), '1.10.4');
	//wp_enqueue_script('jquery-ui');

	wp_register_script('mustache', plugins_url('/js/vendor/mustache-0.4.2.min.js', __FILE__), array(),'0.4.2');
	wp_enqueue_script('mustache');

	wp_register_script('svg', plugins_url('/js/vendor/svg-1.0.1.min.js', __FILE__), array(),'1.0.1');
	wp_enqueue_script('svg');

	wp_register_script('main', plugins_url('/js/main.js', __FILE__), array('jquery', 'mustache', 'svg'), $plugin_version, true);
	wp_enqueue_script('main');

	wp_register_script('plugins', plugins_url('/js/plugins.js', __FILE__), array('main'), $plugin_version, true);
	wp_enqueue_script('plugins');
}

add_action( 'wp_enqueue_scripts', 'adding_scripts', 8 );


function adding_styles() {

	//wp_enqueue_style('jquery');
	//wp_enqueue_style('jquery-ui-core');
	//{$wp_scripts->registered['jquery-‌​‌​ui-core']->version}

	wp_register_style('jquery-ui', "http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/themes/ui-lightness/jquery-ui.min.css",array(), '1.10.4');
	wp_enqueue_style('jquery-ui');

	wp_register_style('main', plugins_url('/css/main.css', __FILE__), array(), '20150301');
	wp_enqueue_style('main');
}

add_action( 'wp_enqueue_scripts', 'adding_styles',10);


?>
