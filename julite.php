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
[productgenerator id="lalala" angle="33" luxD1="185" minD="3" maxD="5"]
*/


function productgenerator_handler($atts) {

  extract(shortcode_atts(array(
      'id' => "lalala",
      'angle' => 33,
      'lux' => 185,
      'luxD' => 100,
      'minD' => 300,
      'maxD' => 500
  ), $atts));
   
   
  $output = productgenerator_function($id, $angle, $lux, $luxD, $minD, $maxD);
  
  return $output;
}

function productgenerator_function($id, $angle, $lux, $luxD, $minD, $maxD) {

	$output = "";
	$output .= <<<HTML



        <div id="{$id}_slider" class="vertical-slider" style="height:200px;"></div>
        
        </br>

        For a beam angle of {$angle}°, the brightness at <span id="{$id}_value" class="slider_value">?</span> m is <span id="{$id}_lux" class="slider_lux">?</span> lux.



         <script>
          jQuery(function(){

            var sliderObj = jQuery( "#{$id}_slider" );
            var valueObj = jQuery( "#{$id}_value" );
            var luxObj = jQuery( "#{$id}_lux" );

            sliderObj.slider({
              orientation: "vertical",
              min: {$minD},
              max: {$maxD},
              value: {$minD},
              slide: function( event, ui ) {
                valueObj.text( (ui.value*0.01).toFixed(2) );
                luxObj.text( luxAtD({$lux},{$luxD}, ui.value) );
              }
            });

            var value = sliderObj.slider( "value" );

            valueObj.text( (value*0.01).toFixed(2) );
            luxObj.text( luxAtD({$lux},{$luxD}, value) );

          });

          </script>

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
    wp_enqueue_script('jquery-ui-slider');

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