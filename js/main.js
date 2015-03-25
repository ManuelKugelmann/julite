jQuery(document).on("pageinit", function(event){

	// custom code goes here

});



function luxAtD(lux, luxD, D) {
    var f = luxD/D;
    return Math.round(f*f*lux);
}

var pg_value = 240;
var pg_roomHeight =240;
// luxD = distance for lux value
// minD = minimum room height
// maxD = maximum room height
// kelvin = color temperature in kelvin
// every height value is in cm: 500 == 5 meters
function pg_init(id, angle, lux, luxD, minD, maxD, kelvin) {

	var pgObj = jQuery( "#"+id+"_pg" );
	var sliderObj = jQuery( "#"+id+"_slider" );
	var sliderObjs = jQuery( ".pg_slider" );
  var roomHeightInputObj = jQuery('#'+id+'_input');

	var initial_roomHeight = 240; //default roomHeight = 2,4m
  var initial_slider_value = initial_roomHeight; // infoText should start at floor


  var canvas = pg_draw(id, angle, lux, luxD, minD, maxD, kelvin,initial_roomHeight,initial_slider_value);
  pg_update_draw(canvas, initial_slider_value, id, angle, lux, luxD, minD, maxD, kelvin, initial_roomHeight);

  //TODO fix slider not moving
  //TODO fix slider wrong start pos
	sliderObj.slider({
	  orientation: "vertical",
	  min: 0, //minimum measurable distance = 10 cm
	  max: initial_roomHeight-10,
	  value: initial_slider_value,
    step:5,

	  // executed on every slider after any value change
	  change: function( event, ui ) {
		  var slider_value = ui.value;
      pg_value = calculate_value(slider_value, pg_roomHeight);
		  pg_update_draw(canvas, pg_value, id, angle, lux, luxD, minD, maxD, kelvin, pg_roomHeight);
	  },

	  // only executed on the actively moved slider
	  slide: function( event, ui ) {
		  var slider_value = ui.value;
		  pg_value = calculate_value(slider_value, pg_roomHeight);
		  pg_update_draw(canvas, pg_value, id, angle, lux, luxD, minD, maxD, kelvin, pg_roomHeight);
		  //pg_update_others(sliderObjs, slider_value);
	  }

	});

  // what does it do?
	pgObj.on('update', function () {
		pg_update_draw(canvas, pg_value, id, angle, lux, luxD, minD, maxD, kelvin, pg_roomHeight);
	});

  //sets initial room height
  roomHeightInputObj.val(initial_roomHeight);
  //TODO fix getting input form arrows on input field
  roomHeightInputObj.on('input',function(){
    var value= parseInt(roomHeightInputObj.val());
    value =isNaN(value) ? initial_roomHeight :value;
    value =value > maxD ? maxD :value;
    value =value < minD ? minD :value;
    pg_roomHeight=value;
    sliderObj.slider( "option", "max", pg_roomHeight ); // update slider on room height change
    if(pg_value > pg_roomHeight){
      pg_update_others(sliderObj, pg_roomHeight );
    }
    pgObj.trigger('update');
  });

  roomHeightInputObj.change(function(){
    roomHeightInputObj.val(pg_roomHeight);
    pgObj.trigger('update');
  })



}


// invert inverted value  back
function calculate_slider_value(value, roomHeight) {
	return roomHeight -value;
}
// inverting slider value
function calculate_value(slider_value, roomHeight) {
	return roomHeight -slider_value;
}


function pg_update_others(sliderObjs, slider_value) {
	sliderObjs.slider('value', slider_value);
}


function pg_update_draw(canvas, infoHeight, id, angle, lux, luxD, minD, maxD, kelvin, roomHeight) {
  pg_draw(id, angle, lux, luxD, minD, maxD, kelvin, roomHeight, infoHeight, canvas);
}


function pg_draw(id, angle, lux, luxD, minD, maxD, kelvin, roomHeight, infoHeight, canvas) {

  if(typeof canvas ==='undefined'|| canvas === null ){
    canvas = SVG(id + '_drawing').fixSubPixelOffset();
  } else {
    canvas.clear();
  }
  var svgElement = jQuery(canvas.node);
  var color = getColorFromTemperature(kelvin);
  var lineColor = "#fff";
  if(new SVG.Color(color).brightness()>0.82){
      lineColor ='#666';
  }
  // define beam
  var beamHeight = svgElement.height();
  var beamGroundHeight = svgElement.height() * 0.2;
  beamHeight -= beamGroundHeight;

  var beamInfo = getPointsForBeam(angle, beamHeight);
  var beamGroup = canvas.group();


  var beam = beamGroup.polygon(beamInfo.plot).fill(canvas.gradient('linear',function(stop){stop.at(0.3,color);stop.at(1,color,0);}).from(0, 0).to(0, 1));
  var beamGround = beamGroup.ellipse(beamInfo.width,beamGroundHeight)
                            .move(-beamInfo.width/2 ,beamInfo.height -beamGroundHeight/2)
                            .fill(canvas.gradient('radial',function(stop){
                              stop.at(0.2,new SVG.Color(color).morph("#fff").at(0.4));
                              stop.at(1,new SVG.Color(color).morph("#fff").at(0.4),0.2);
                            }));

  // define center line
  var heightLine = beamGroup.line(0,0,0,beamInfo.height).stroke(lineColor) ;
  heightLine.marker('start',5,5,function(add){add.circle(5).fill(lineColor); });
  heightLine.marker('end',5,5,function(add){add.circle(5).fill(lineColor);});

  // calculate scaleFactor from roomHeight defines conversionratio between pixel and meters
  var scaleFactor = beamHeight / roomHeight;

  // define heightRef e.g. chair
  // append from external SVG file
  var realHeightRefHeight =90;
  var heightRef = beamGroup.path("m 268.4,20.176271 c 14.8,-1 29.8,-3 44.5,-0.5 21.4,3.3 40.8,14.8 56,30 14.5,13.9 23.8,32.4 29.5,51.499999 13.4,41.6 26,83.5 38.8,125.3 1.9,8.2 6.1,15.5 10,22.9 1.2,2.5 -1.3,5 -0.6,7.6 0.9,3.9 2.2,7.7 3.6,11.4 15.3,4.1 31,6.7 46.4,10.7 4,0.9 8.1,3 9.9,7 1.1,2.8 0.9,5.9 1,8.9 0.1,4.8 0.5,9.7 0.1,14.5 0,2.9 -3.2,4.2 -5.4,5.2 -11.3,4.3 -23.6,4.2 -35.2,7 0.4,2.1 0.8,4.3 1.5,6.3 21.4,69 41.9,138.2 62.7,207.3 1.7,6 5.6,11.3 6.7,17.5 1.1,2.5 -1.4,4.3 -3.1,5.6 -3.5,2.5 -8.9,3.7 -12.4,0.8 -3,-5.5 -2.7,-11.9 -4.3,-17.8 -7.5,-25.1 -15,-50.2 -22.6,-75.4 -3,-9.5 -5.4,-19.2 -8.7,-28.6 -4.8,-0.7 -9.6,0.7 -14.4,1.5 -26.5,5.1 -53,9.8 -79.5,14.5 -6.5,1.3 -13.1,2 -19.6,3.6 -1.3,4.9 -2.1,9.9 -3,14.8 -1,5.8 0.3,12.2 -2.6,17.5 -4.3,3.1 -12,2.1 -14.4,-3 -0.3,-5.2 2.1,-10 3.5,-14.8 1.3,-3.8 1.7,-7.9 2.2,-11.8 -15,1.9 -29.7,5 -44.6,7.3 -20.8,3.6 -41.6,7 -62.3,10.9 -0.1,1.4 -0.1,2.9 0.3,4.3 10.2,35.2 20.2,70.5 30.2,105.8 2,5.3 5.2,10.1 6,15.8 0.6,2.5 -1.7,4.5 -3.7,5.7 -3.7,2 -8.6,2.9 -12.4,0.7 -3.5,-5.4 -3,-12 -4.1,-18 -12.3,-43.1 -24.6,-86.1 -36.7,-129.3 -4.3,-14.9 -8,-30.1 -12.7,-44.9 -18.9,2.6 -37.7,5.6 -56.6,8.2 -5.9,1 -12,1.2 -17.8,2.8 -4.6,28.3 -8,56.8 -12.1,85.2 -0.5,5.9 1.1,12.1 -1.1,17.8 -4.1,4.5 -13.1,3.1 -15.6,-2.5 -0.7,-6.5 2.9,-12.3 3.7,-18.6 8,-61.2 16.2,-122.3 25.7,-183.2 4,-26.4 8.1,-52.7 12,-79.1 0.2,-3.3 -3,-5.7 -2.5,-9 0,-2.6 2.9,-3.4 4.5,-5 0.7,-2.6 -0.1,-5.4 0.8,-8.1 1.5,-5.1 3.4,-10.5 2.1,-15.9 -7,-26.3 -14.1,-52.6 -21.3,-78.8 -3.1,-12.5 -6,-25.2 -5.1,-38.199999 0.5,-25.9 16.8,-51.1 40.7,-61.5 12.7,-5.7 26.8,-6.8 40.4,-7.8 17.2,-1.5 34.4,-2.8 51.6,-4.1 M 296,143.07627 c -28.2,0.3 -56.2,4.5 -83.6,11 -12.1,3.1 -24.2,6.4 -36.4,9.5 -3.5,0.9 -7.1,1.4 -10.3,3 7.9,32.8 17.9,65.1 26.6,97.7 1.2,3.5 3.5,6.5 5.1,9.9 0.9,1.9 3.4,0.9 5,0.9 44.8,-5.3 89.6,-11.5 134.4,-16.8 14.4,-1.7 28.8,-3.7 43.3,-2.6 5.2,0.2 10.4,1.3 15.7,1.7 2.3,-12.5 4.3,-25.1 6.5,-37.6 1,-3.6 -3,-6.4 -2.2,-10 0,-3.1 4.9,-2.3 4.8,-5.2 -0.1,-3.9 0.4,-7.6 1.9,-11.1 1,-4.1 3.6,-8.3 2,-12.5 -4,-12.6 -7.8,-25.2 -11.5,-37.7 -1.8,-0.3 -3.5,-0.5 -5.2,-0.4 -12.7,0.2 -25.4,-0.4 -38.1,-0.3 -19.3,0.2 -38.7,-0.8 -58,0.5 m 121.1,74.3 c -0.8,3 -2.1,6.4 0,9.1 2.9,4.1 5.5,8.4 8.8,12.1 -1,-5.6 -2.8,-11 -4.6,-16.3 -0.7,-2.2 -2.2,-3.9 -4.2,-4.9 m -2.9,16.2 c -1.9,8.7 -3.3,17.4 -4.6,26.1 2.4,1.6 5.3,1.8 8.1,2.4 5.5,0.8 10.7,2.4 16.2,2.7 -0.7,-3 -0.6,-6.8 -3.4,-8.6 -4.2,-2.9 -7.1,-7.1 -10,-11.1 -2.5,-3.6 -3.7,-7.9 -6.3,-11.5 m -237.3,33.1 c -1.1,-6.1 -2.9,-12.1 -4.4,-18.1 -3.7,6.1 -0.5,13.7 4.4,18.1 m -7.8,1.9 c -1.1,3.7 -1.5,7.5 -1.4,11.3 2.3,-0.1 4.5,-0.5 6.5,-1.3 -1.3,-3.5 -2.7,-7.1 -5.1,-10 m -6.9,42.2 c -1.9,13 -4.1,25.9 -6.1,38.9 -0.6,3.6 -1.3,7.2 -1.2,10.9 15.4,-1.6 30.7,-4.3 46,-6.3 0.2,-5 -2.2,-9.7 -3.2,-14.5 -2,-6.4 -3.2,-13 -5.7,-19.2 -9.5,-4.1 -20.7,-4.2 -29.8,-9.8 m 238.7,20.7 c -1.6,0.3 -4.4,0.1 -4.4,2.5 -4.6,24.7 -9.3,49.3 -14,74 -2.3,13.1 -5.4,26.2 -7.3,39.3 34.8,-5.9 69.6,-12.3 104.4,-18.3 1.3,-0.2 2.6,-0.9 3.9,-1.3 -0.3,-1.6 -0.4,-3.2 -0.9,-4.7 -9.7,-31.9 -19.4,-63.9 -29.1,-95.8 -0.4,-1.1 -0.9,-2.1 -1.4,-3.1 -17.2,1.7 -34.1,5.1 -51.2,7.4 m -191.7,-6.2 c 1.7,7.7 4.2,15.3 6.1,22.9 0.5,1.4 0.6,4.1 2.7,3.6 18.7,-2.5 37.4,-5.4 56.2,-8 1.7,-0.3 3.7,-0.3 4.8,-1.7 -17.2,-3.3 -34,-8.4 -51,-12.5 -6.3,-1.3 -12.4,-3.7 -18.8,-4.3 m 152.6,14 c -31.5,4.7 -62.9,9.4 -94.4,13.9 -16.1,2.6 -32.3,4.5 -48.3,7.4 1,5.4 2.7,10.5 4.1,15.8 3,10.2 5.1,20.6 8.8,30.6 18.8,-2.5 37.5,-6.1 56.3,-9.1 27.1,-4.6 54.4,-8.8 81.5,-13.5 3.7,-0.1 4.7,-3.9 5.1,-6.9 2.3,-13.6 5.2,-27.2 7.1,-40.9 -6.8,0.2 -13.5,2 -20.2,2.7 m -196.9,28.9 c -3.8,0.5 -7.8,0.6 -11.5,1.7 -1.1,4.2 -1.5,8.5 -2.2,12.8 -1.6,12.3 -4.2,24.5 -5.2,36.9 5.4,-0.3 10.7,-1.2 16.1,-2 18.2,-2.8 36.4,-5.1 54.6,-8.2 -0.9,-5.3 -2.8,-10.3 -4.1,-15.4 -3,-10.4 -5.5,-21 -8.8,-31.3 -13,1.5 -25.9,3.7 -38.9,5.5 m 196.5,25.8 c -36.8,6.2 -73.6,12.6 -110.4,18.6 -5.6,1.2 -11.3,1.5 -16.8,3.1 3.1,12.6 6.9,25 10.2,37.5 1.6,5.2 2.5,10.5 4.7,15.5 4.7,-0.4 9.3,-1.4 13.9,-2.1 20.5,-3.4 41.1,-6.8 61.6,-10.4 12.1,-2.3 24.4,-3.8 36.5,-6.5 1.5,-6.1 2.3,-12.3 3.6,-18.4 2.3,-12.9 5.2,-25.7 7.1,-38.6 -3.5,0.2 -6.9,0.7 -10.4,1.3 z")
  .fill("#cbcbcb");

  var heightRefHeight = heightRef.height();

  //scale heightRef to roomHeight
  if(typeof roomHeight !='undefined' && roomHeight !== null && roomHeight != 0 && heightRefHeight != 0 ) {
    heightRef.size(heightRef.width() * realHeightRefHeight/heightRefHeight, heightRefHeight * realHeightRefHeight/heightRefHeight);
    heightRef.size(heightRef.width() * scaleFactor, heightRef.height() * scaleFactor);
    heightRef.move(10, beamHeight-heightRef.height());
  }
  //define lux infoText
  var infoGroup =beamGroup.group();
  var infoTextOffsetX =beamInfo.width/2 ;
  var infoText =infoGroup.text( luxAtD(lux,luxD, infoHeight) + " lux at " + (infoHeight*0.01).toFixed(2)  + " m" ).fill({ color: '#fff' }) ;
  infoText.move(infoTextOffsetX,-jQuery(infoText.node).height()/2);
  infoGroup.line(0,0,infoTextOffsetX-5,0).stroke("#fff");

  infoGroup.move(0, infoHeight*scaleFactor);

  beamGroup.move(svgElement.width()/2, beamGroundHeight*0.3);

  return canvas;

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
    temperatureCalc =329.69872446 * Math.pow(temperatureCalc , -0.1332047592);
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
    temperatureCalc = 288.1221695283 * Math.pow(temperatureCalc , -0.0755148492);
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
