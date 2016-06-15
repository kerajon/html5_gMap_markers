//  override google overlay methods

function MapLayer ( map ) {

	this.overlay = new google.maps.OverlayView();

	this.overlay.draw = function () {};

	this.overlay.update = function ( latLng, cb ) {
		var projection = this.getProjection();
    // catch error ??
		var point = projection.fromLatLngToContainerPixel(arguments[0]);

    if (arguments.length === 1) return point;
    if (arguments.length === 2) cb( point );
	};

	this.overlay.setMap( map );
}
