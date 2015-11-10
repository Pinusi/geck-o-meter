'use strict';

/**
 * myCeciLigthbox.
 * Closure in which initialize the main instance of the lightbox
 */

(function( _scope ){

	var GEOM = _scope.GEOM || {};

	$( document ).ready(function() {

		getData().then(function( _data ){
			var widget = new GEOM.Widget( "#widget", _data );
			widget.init();
		});

	});

	/**
	* getData.
	* Get data from somewhere
	*/

	var getData = function()
	{
		var deferred = Q.defer();

		$.ajax({
			dataType: "json",
			url: "https://widgister.herokuapp.com/challenge/frontend",
			success: function( _data )
			{
				deferred.resolve( _data );
			}
		});

		return deferred.promise;
	}

}( window ));