var GEOM = window.GEOM || {};

/**
 * Widget.
 * This is the widget object
 * @param _container_selector: container of the widget
 * @param _data: data fro the widget
 */

GEOM.Widget = function( _container_selector, _data ){
	this.data = _data,
	this.$container = $( _container_selector ),
	this.template = 'templates/widget.html',
	this.canvasSize = 200,
	this.canvasCentre = this.canvasSize/2;
};

GEOM.Widget.prototype.init = function()
{
	this.publishWidget().then(function(){
		var tick = Snap("#tick");
		tick.transform( 'r-66,' + this.canvasCentre + ',' + ( this.canvasCentre + 35 ) );

		var percent = this.calculatePercent();

		this.animateNumbers();

		//animate tick
		this.animateTick( percent );

		//animate arc
		this.animateArc( percent );
	}.bind(this));
}

/**
 * publishWidget.
 * Publish the widget rendering a tmeplate with _ and load the svg
 */

GEOM.Widget.prototype.publishWidget = function()
{
	var deferred = Q.defer();

	//html bit
	var template = window['GEOM']["Templates"][this.template]( {data: this.data} );

	this.$container.empty();
	this.$container.append( template );

	//svg bit
	var s = Snap("#svg");
	Snap.load("assets/images/geck-o-meter.svg", function (f) {
	    var g = f.select("#meter");
	    s.append( g );
	    deferred.resolve();
	}.bind(this));

	return deferred.promise;
};

/**
 * animate.
 * Do all the animations
 */

GEOM.Widget.prototype.calculatePercent = function()
{
	// this.data.max - this.data.min < 0 -> wrong?
	if( this.data.max - this.data.min < 0)
	{
		this.$container.find('.max_value').css('color', '#EA5057');
		return 0;
	}

	// this.data.value - this.data.min < 0 not reached the minumum
	//do something different
	if( this.data.value - this.data.min < 0 )
	{
		this.$container.find('.center').css('background-color', '#EA5057');
		return 0;
	}

	if( this.data.value > this.data.max )
	{
		var percent = 1;
	}
	else
	{
		//calculate percent for animations
		var percent = (this.data.value - this.data.min)/(this.data.max - this.data.min);
	}

	return percent;
};

GEOM.Widget.prototype.animateNumbers = function()
{
	this.$container.find('#center_value').each(function () {
	    $(this).prop('Counter',0).animate({
	        Counter: $(this).text()
	    }, {
	        duration: 2000,
	        easing: 'swing',
	        step: function (now) {
	            $(this).text(Math.ceil(now));
	        }
	    });
	});
}

/**
 * animateTick.
 * Use Snap to rotate the tick around his center point
 */

GEOM.Widget.prototype.animateTick = function( _percent )
{
	var tick_centre_x = this.canvasCentre,
    	tick_centre_y = this.canvasCentre + 35; //normalize to pick the dark point, this center is not perfect

    //endpoint from -66 to 66, just cause the tick is not aligner with the arc
    var endpoint = _percent * ( 66 * 2 ) - 66;

	var tick = Snap("#tick");

	tick.animate({ transform: 'r' + endpoint + ',' + tick_centre_x + ',' + tick_centre_y }, 2000, function(){});

	return endpoint;
};

/**
 * animateArc.
 * Use Snap to animate the arc
 */

GEOM.Widget.prototype.animateArc = function( _percent )
{

	var path = "",
		s = Snap("#svg"),
		arc = s.path( path ),
		radius = this.canvasSize * 0.67 / 2,
    	startY = this.canvasCentre;

	//animate bar
    var endpoint = _percent * 180 - 90;

    Snap.animate(-90, endpoint,   function (val) {
        arc.remove();

        var d = val,
            dr = d-90;
            radians = Math.PI*(dr)/180,
            endx = this.canvasCentre + radius*Math.cos(radians),
            endy = this.canvasCentre + radius * Math.sin(radians),
            largeArc = d>180 ? 1 : 0;  
            path = "M"+( this.canvasCentre - radius )+","+startY+" A"+radius+","+radius+" 0 "+largeArc+",1 "+endx+","+endy;
  
        arc = s.path(path);
        arc.attr({
          stroke: '#EA5057',
          fill: 'none',
          strokeWidth: 37
        });

        arc.transform( 't0,16');

    }.bind(this), 2000, mina.easeinout);

    return endpoint;
};