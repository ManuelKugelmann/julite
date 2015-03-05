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
  var beamGroup = canvas.group();
  var beam = beamGroup.polygon(beamInfo.plot).fill(getColorFromTemperature(5700));



}

function getPointsForBeam(angle,height){
  //convert to radians by multiplying with (Math.PI/180)
  var beta = angle/2 * (Math.PI/180);
  var a = height;
  var b = Math.tan(beta) *a;
  return {plot:[[0,0],[b,a],[-b,a]],width:b*2,height:a};

}

function getColorFromTemperature (tempKelvin){
  tempKelvin = tempKelvin <1000 ? 1000 : tempKelvin;
  tempKelvin = tempKelvin >40000 ? 40000 : tempKelvin;
  tempKelvin /=100
  var red=0;
  var green =0;
  var blue=0;
  var temperatureCalc =0;
  if(tempKelvin <= 66){
    red =255;
  }else{
    temperatureCalc = tempKelvin -60;
    temperatureCalc =329.69872446 * (temperatureCalc ^ -0.1332047592 );
    red = temperatureCalc;
    red = red <0 ? 0 : red;
    red = red > 255 ? 255 : red;
  }

  if(tempKelvin <= 66){
    temperatureCalc =tempKelvin;
    temperatureCalc = 99.4708025861 * Math.log(temperatureCalc) - 161.1195681661;
    green =temperatureCalc;

  }else{
    temperatureCalc = tempKelvin - 60;
    temperatureCalc = 288.1221695283 * (temperatureCalc ^ -0.0755148492);
    green = temperatureCalc;
  }
  green = green <0 ? 0 : green;
  green = green > 255 ? 255 : green;

  if(tempKelvin >=66){
    blue =255;
  }else if(tempKelvin <=19){
    blue =0;
  }else{
    temperatureCalc = tempKelvin - 10
    temperatureCalc = 138.5177312231 * Math.log(temperatureCalc) - 305.0447927307

    blue = temperatureCalc
    blue = blue <0 ? 0 : blue;
    blue = blue > 255 ? 255 : blue;
  }

  return {r:Math.floor(red),g:Math.floor(green),b:Math.floor(blue)};
}
