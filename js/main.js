jQuery(document).on("pageinit", function(event){

	// custom code goes here

});



function luxAtD(lux, luxD, D) {
    var f = luxD/D;
    return Math.round(f*f*lux);
}

function pg_init(id, angle, lux, luxD, minD, maxD, kelvin) {

	var sliderObj = jQuery( "#"+id+"_slider" );

	var sliderObjs = jQuery( ".pg_slider" );
	var valueObjs = jQuery( ".pg_value" );
	var luxObjs = jQuery( ".pg_lux" );

	var canvas = pg_draw(id, angle, lux, luxD, minD, maxD, kelvin);

	sliderObj.slider({
	  orientation: "vertical",
	  min: minD,
	  max: maxD,
	  value: minD,

	  change: function( event, ui ) {
		  var value = ui.value;
		  pg_update_text(valueObjs, luxObjs, value, id, angle, lux, luxD, minD, maxD);
		  pg_update_draw(canvas, value, id, angle, lux, luxD, minD, maxD, kelvin);
	  },

	  slide: function( event, ui ) {
		  var value = ui.value;
		  pg_update_others(sliderObjs, value);
      pg_update_text(valueObjs, luxObjs, value, id, angle, lux, luxD, minD, maxD);
		  pg_update_draw(canvas, value, id, angle, lux, luxD, minD, maxD, kelvin);
	  }

	});

	var value = sliderObj.slider( "value" );
	pg_update_text(valueObjs, luxObjs, value, id, angle, lux, luxD, minD, maxD);
	pg_update_draw(canvas, value, id, angle, lux, luxD, minD, maxD, kelvin);
}

function pg_update_text(valueObjs, luxObjs, value, id, angle, lux, luxD, minD, maxD) {
	valueObjs.text( (value*0.01).toFixed(2) );
	luxObjs.text( luxAtD(lux,luxD, value) );
}

function pg_update_others(sliderObjs, value) {
	sliderObjs.slider('value', value);
}

function pg_update_draw(canvas, value, id, angle, lux, luxD, minD, maxD, kelvin) {

	// hier änderungen am svg machen - statt nur dem canvas kannst du natürlich auch was anderes, z.b. ein array von elementen aus dem pg_draw zurückgeben
  pg_draw(id,angle,lux,luxD,minD,maxD,kelvin,value,canvas);
}


function pg_draw(id, angle, lux, luxD, minD, maxD, kelvin,sliderHeight,canvas) {

  if(typeof canvas ==='undefined'|| canvas === null ){
    canvas = SVG(id + '_drawing');
  } else {
    canvas.clear();
  }
  var svgElement =jQuery(canvas.node);
  //move to style class
  svgElement.css('background-color','#666');

  var beamHeight = svgElement.height();
  var beamGroundHeight =svgElement.height() * 0.2;
  beamHeight -=beamGroundHeight;

  var beamInfo= getPointsForBeam(angle,beamHeight);
  var beamGroup = canvas.group();
  var color = getColorFromTemperature(kelvin);
  var lineColor = "#fff";
  if(new SVG.Color(color).brightness()>0.82){
      lineColor ='#666';
  }
  var beam = beamGroup.polygon(beamInfo.plot).fill(color).stroke(new SVG.Color(color).morph("#000").at(0.1));

  var beamGround = beamGroup.ellipse(beamInfo.width,beamGroundHeight)
                            .move(-beamInfo.width/2 ,beamInfo.height -beamGroundHeight/2)
                            .fill(new SVG.Color(color).morph("#fff").at(0.4));
  var heightLine = beamGroup.line(0,0,0,beamInfo.height).stroke(lineColor) ;
  heightLine.marker('start',5,5,function(add){add.circle(5).fill(lineColor);});
  heightLine.marker('end',5,5,function(add){add.circle(5).fill(lineColor);});


  var beamFigure = beamGroup.path("m 49.958914,864.43476 c -15.486083,0 -28.020724,12.61681 -28.020724,28.10289 0,15.48609 12.534641,28.02065 28.020724,28.02065 15.486082,0 28.102896,-12.53456 28.102896,-28.02065 0,-15.48608 -12.616814,-28.10289 -28.102896,-28.10289 z m -17.09182,60.88953 c -0.197477,0 -0.381358,0.0684 -0.575206,0.0815 -0.109387,0 -0.220616,0 -0.328689,0 -3.208949,-0.18932 -6.400965,1.43282 -8.052876,4.4373 L 1.0664487,971.3402 c -2.2785237,4.14411 -0.79137755,9.25535 3.3690605,11.50411 4.1604382,2.24876 9.3899308,0.77518 11.6684538,-3.36919 l 9.367632,-17.09182 0,18.81757 c 0,3.84539 1.167581,7.4423 3.122544,10.43573 l 0,48.7283 c 0,6.6258 4.95171,11.9971 11.093248,11.9971 6.141538,0 11.093249,-5.3713 11.093249,-11.9971 l 0,-40.1001 0.657377,0 0,40.1821 c 0,6.5775 4.951711,11.9151 11.093249,11.9151 6.141538,0 11.093248,-5.3376 11.093248,-11.9151 l 0,-48.72799 c 1.977129,-3.01158 3.122544,-6.63399 3.122544,-10.51804 l 0,-14.87331 7.231155,13.14756 c 2.278524,4.14437 7.425843,5.61795 11.586282,3.36919 4.160438,-2.24876 5.647579,-7.36 3.36906,-11.50411 L 76.171849,929.84336 c -1.680415,-3.05628 -4.952342,-4.69288 -8.217221,-4.43729 -0.05417,0 -0.109914,0 -0.164345,0 -0.220879,-0.0263 -0.432081,-0.0815 -0.657377,-0.0815 l -9.367632,0 -13.229726,0 -11.668454,0 z")
  .x(0).y(0).fill("#7c7c7c");
  if(typeof sliderHeight !='undefined' && sliderHeight !== null   ){
    var scaleFactor = beamHeight /sliderHeight;
    var beamFigureHeight =beamFigure.height();
    beamFigure.size(beamFigure.width() *180/beamFigureHeight,beamFigureHeight *180 /beamFigureHeight);

    beamFigure.size(beamFigure.width()*scaleFactor,beamFigure.height()*scaleFactor);
    beamFigure.move(2,beamHeight -beamFigure.height());
  }

  beamGroup.move(100,beamGroundHeight*0.3);

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
