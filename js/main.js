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

}
		  
function pg_update(valueObj, luxObj, value, id, angle, lux, luxD, minD, maxD) {

	valueObj.text( (value*0.01).toFixed(2) );
	luxObj.text( luxAtD(lux,luxD, value) );

	pg_draw(id, angle, lux, luxD, minD, maxD);
}


function pg_draw(id, angle, lux, luxD, minD, maxD) {

	var draw = SVG(id + '_drawing');

	var rect = draw.rect(50,50).move(100,100).fill('#f09');

	/* make rectangle jump and change color on mouse over */
	rect.mouseover(function() {
		this.animate(1000, SVG.easing.elastic)
			.move(400 * Math.random(), 400 * Math.random())
			.rotate(-45 + 90 * Math.random())
			.fill({
				r: ~~(Math.random() * 255)
			  , g: ~~(Math.random() * 255)
			  , b: ~~(Math.random() * 255)
			})
	})
	
	draw.text('svg.js')
		.back()
		.fill('#ccc')
		.move('50%', '40%')
		.font({
			family: 'Source Sans Pro'
		  , size: 18
		  , anchor: 'middle'
		});
}
	