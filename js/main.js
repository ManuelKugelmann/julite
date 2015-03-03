jQuery(document).on("pageinit", function(event){

	// custom code goes here

});



function luxAtD(lux, luxD, D) {
    var f = luxD/D;
    return Math.round(f*f*lux);
}

function pg_init(id, angle, lux, luxD, minD, maxD) {

	var sliderObj = jQuery( "#"+id+"_slider" );
	var valueObj = jQuery( "#"+id+"_value" );
	var luxObj = jQuery( "#"+id+"_lux" );

	sliderObj.slider({
	 // orientation: "vertical",
	  min: minD,
	  max: maxD,
	  value: minD,
	  slide: function( event, ui ) {
		  var value = ui.value;
		  pg_update(valueObj, luxObj, value, id, angle, lux, luxD, minD, maxD);
	  }
	});

	var value = sliderObj.slider( "value" );
	pg_update(valueObj, luxObj, value, id, angle, lux, luxD, minD, maxD);

	pg_draw(id, angle, lux, luxD, minD, maxD);

}

function pg_update(valueObj, luxObj, value, id, angle, lux, luxD, minD, maxD) {

	valueObj.text( (value*0.01).toFixed(2) );
	luxObj.text( luxAtD(lux,luxD, value) );

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
