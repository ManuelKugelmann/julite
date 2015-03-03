jQuery(document).on("pageinit", function(event){

	// custom code goes here

});



function luxAtD(lux, luxD, D) {
    var f = luxD/D;
    return Math.round(f*f*lux);
}

function pg_init(id, angle, lux, luxD, minD, maxD) {

	var sliderObj = jQuery( "#"+id+"_slider" );

	var sliderObjs = jQuery( ".pg_slider" );
	var valueObjs = jQuery( ".pg_value" );
	var luxObjs = jQuery( ".pg_lux" );

	sliderObj.slider({
	 // orientation: "vertical",
	  min: minD,
	  max: maxD,
	  value: minD,

	  change: function( event, ui ) {
		  var value = ui.value;
		  pg_update_text(valueObjs, luxObjs, value, id, angle, lux, luxD, minD, maxD);
	  },

	  slide: function( event, ui ) {
		  var value = ui.value;
		  pg_update_others(sliderObjs, value);
	  }

	});

	var value = sliderObj.slider( "value" );
	pg_update_text(valueObjs, luxObjs, value, id, angle, lux, luxD, minD, maxD);

	pg_draw(id, angle, lux, luxD, minD, maxD);

}

function pg_update_text(valueObjs, luxObjs, value, id, angle, lux, luxD, minD, maxD) {
	valueObjs.text( (value*0.01).toFixed(2) );
	luxObjs.text( luxAtD(lux,luxD, value) );
}

function pg_update_others(sliderObjs, value) {
	sliderObjs.slider('value', value);

}


function pg_draw(id, angle, lux, luxD, minD, maxD) {

	var canvas = SVG(id + '_drawing');
  var beamHeight =50;
  var beamInfo= getPointsForBeam(angle,beamHeight);
  var beam = canvas.polygon(beamInfo.plot).move(100-beamInfo.width/2,0).fill('#666');


}

function getPointsForBeam(angle,height){
  //convert to radians by multiplying with (Math.PI/180)
  var beta = angle/2 * (Math.PI/180);
  var a = height;
  var b = Math.tan(beta) *a;
  return {plot:[[0,0],[b,a],[-b,a]],width:b*2,height:a};

}
