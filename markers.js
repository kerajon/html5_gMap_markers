(function (window, d3) {
  'use strict';

  //  very old code need to be refactored
  //  works fine on chrome but FF well ... :/
  //  JS engines can not stand continous computing from geo position to
  //  pixel position on screen when grabbing and moving maps
  //  params needs to be taken from event

  function update_markers ( show, markerIndex, that) {
  	arguments[arguments.length-1].tafcdo = [];
  	if (arguments.length === 3) {
  		if (show) {
  			that.okioki = true;
  			if (typeof arguments[1] == Array) {
  				for (var i = arguments[1].length-1; i >= 0; i--) {
  					that.temporaryArrayForcompareDistanceObj[arguments[1][i]].show = true;
  				}
  			} else {
  				for (var i = that.temporaryArrayForcompareDistanceObj.length-1; i >= 0; i--) {
  					that.temporaryArrayForcompareDistanceObj[i].show = false;
  				}
  				that.temporaryArrayForcompareDistanceObj[markerIndex].show = true;
  				that.tafcdo = that.temporaryArrayForcompareDistanceObj;
  			}
  		} else {
  			that.okioki = false;
  		}
  	} else if (arguments.length === 2) {
  		arguments[1].okioki = arguments[0];
  		for (var i = arguments[1].temporaryArrayForcompareDistanceObj.length-1; i >= 0; i--) {
  			arguments[1].temporaryArrayForcompareDistanceObj[i].show = false;
  		}
  	}

  }




  function Marker ( mapApp ) {
  	// inherit from MAP class to get latlng to pixel  google function
  	MapLayer.call(this, mapApp.$.gMap.map);
  	// inherit from BoundsController to check wheter is in map or outside
  	MapBoundsController.call(this);

  	this.appRef = mapApp;
  	this.geoPosition;
  	this.markerCounter = 0;
  	this.position = {
  		x: null,
  		y: null
  	};
  	this.position_site;
  	this.textMode = false;

  	// marker can be in one of three states    [ rounded_marker, card_marker, arrow_marker ]
  	this.state = [ 1, 1, 1 ];

  	// 5 is a main icon
  	this.currentIcon = 5;

  	// object with base properties --> do not clear up after creating new object
  	this.markersBaseProperties = {};
  	// array of references of existing markers on map to update
  	this.markersReferenceList = [];
  	// array of object with properties of existing markers
  	this.markersOnMapProperties = [];
  	// object with busstop information --> keeps and updates info about it self
  	this.busstop = {};
  	this.busstop.city = '';
  	this.busstop.street = '';
  	this.busstop.nr = '';
  	this.busstop.site = 2;
  	this.busstop.line_nr = [];
  	this.busstop.hours = '';
  	this.busstop.index = null;
  	this.busstop.lat = null;
  	this.busstop.lng = null;

  	this.icons = [ null, 'hardware:keyboard-arrow-up-left', 'hardware:keyboard-arrow-up', 'hardware:keyboard-arrow-up-right', 'hardware:keyboard-arrow-left', 'maps:directions-bus', 'hardware:keyboard-arrow-right', 'hardware:keyboard-arrow-down-left', 'hardware:keyboard-arrow-down', 'hardware:keyboard-arrow-down-right' ];
  	this.activateBC = true;
  	this.markersBaseProperties.mapNode = d3.select('#map').node();
  	this.markersBaseProperties.mapWidth = d3.select('#map').node().getBoundingClientRect().width;
  	this.markersBaseProperties.mapHeight = d3.select('#map').node().getBoundingClientRect().height;

  	// IF EDITOR MODE true THEN ..
  	this.editorMode = false;

  // END OF (Marker CLASS) properties
  }

  Marker.prototype.updateBaseProperties = function () {
  	var mapNode = this.markersBaseProperties.mapNode;
  	this.markersBaseProperties.mapWidth = d3.select(mapNode).node().getBoundingClientRect().width;
  	this.markersBaseProperties.mapHeight = d3.select(mapNode).node().getBoundingClientRect().height;
  };

  Marker.prototype.whereAmI = function () {
  	// where marker is
  	var t = this;
  	if (!this.busstop.lat) return;
  	if (!this.latBC) this.latBC = this.busstop.lat;
  	if (!this.lngBC) this.lngBC = this.busstop.lng;

  	this.position_site = arrayToNumber( t.check( mapApp.mapBounds ) );

  };

  // this.update works with this.computePos inside callback
  Marker.prototype.update = function ( point ) {
  	this.whereAmI();
  	if (arguments.length === 1) {
  		this.createMarker( point );
  	} else {
  		if (this.markersReferenceList.length === 0) return;
  		/*		**
  		 *      **   		DESTROYING AND CREATING MARKER TAKES MORE MEMORY
  		 *		**			THAN SAVING AND KEEPING REFERENCE TO MARKERS AND UPDATING THEIR
  		 *	    **			POSITION
  		 *
  		 *	    **
  		 */
  		var t = this;
  		this.computePos(function ( p ) {
  			t.updateMarkersPos( p );
  		});
  	}
  };

  Marker.prototype.updateMarkersPos =  function ( point ) {
  	var index = this.position_site, t = this;

  		this.markersReferenceList[0][2] = point;

  		if (index === undefined || index === 5) {
  			mUpdate_5(this, point);
  		} else {
  			var outside = [null, 'tl', 'tm', 'tr', 'ml', null, 'mr', 'bl', 'bm', 'br'];
  			this.outside[outside[index]]( t, point, index );


  		}
  	};
  Marker.prototype.outside = {};
  Marker.prototype.outside.tl = function( t, point, index ) {
  	mUpdate_outside( t, point, index);
  };
  Marker.prototype.outside.tm = function( t, point, index ) {
  	mUpdate_outside( t, point, index);
  };
  Marker.prototype.outside.tr = function( t, point, index ) {
  	mUpdate_outside( t, point, index);
  };
  Marker.prototype.outside.ml = function( t, point, index ) {
  	mUpdate_outside( t, point, index);
  };
  Marker.prototype.outside.mr = function( t, point, index ) {
  	mUpdate_outside( t, point, index);
  };
  Marker.prototype.outside.bl = function( t, point, index ) {
  	mUpdate_outside( t, point, index);
  };
  Marker.prototype.outside.bm = function( t, point, index ) {
  	mUpdate_outside( t, point, index);
  };
  Marker.prototype.outside.br = function( t, point, index ) {
  	mUpdate_outside( t, point, index);
  };

  Marker.prototype.destroyMarker = function ( cb ) {
  	for (var for_i = 0; for_i < this.markersReferenceList.length; for_i++) {
  		d3.select(this.markersReferenceList[for_i][0]).remove();
  	}

  	this.markersReferenceList = [];
  	this.markersOnMapProperties = [];

  	if (arguments.length) cb();
  };

  // this.computePos needs this.update to create and show Markers
  Marker.prototype.computePos = function ( cb ) {
  	if (this.geoPosition !== null) {this.geoForComputePosition = this.geoPosition;}
  	var geoPos = this.geoForComputePosition,
  		m = this;
  	this.overlay.update( geoPos, function ( point ) {
  		m.position.x = point.x;
  		m.position.y = point.y;
  		cb( point );
  	});
  };
  /***
    * 	MARKER CONSIST OF PAPER-FAB ON THE TOP AND INFOWINDOW AS CARD UNDER PAPER-FAB
   *
    */
  Marker.prototype.createMarker = function ( point ) {
  	var t = this,
  		indexMarker = this.markerCounter,
  		idMarker = 'marker' + indexMarker.toString(),
  		idCard = 'marker' + indexMarker.toString();
  		if (typeof this.geoPosition !== 'undefined') {
  			// destroy old markers if exist and create new ones
  			this.destroyMarker( function () {
  				// create marker
  				createMarkerNode( t, indexMarker, point );
  			});
  		} else {
  			// create marker
  			createMarkerNode( t, indexMarker, point );

  		}
  };

  Marker.prototype.createInfoWindow = function () {

  };

  Marker.prototype.animate = {};
  /////////////////////////////// normal mode
  Marker.prototype.onTap = function ( iM, t ) {
  	var point = t.markersReferenceList[iM][2],
  		  fabRef = t.markersReferenceList[iM][3];
  	if (!this.appRef.$.markerInfo.textMode) {
  		this.textMode = true;
  		this._textMode();
  	} else if (this.appRef.$.markerInfo.textMode) {
  		this._switch();
  	}


  };

  Marker.prototype._textMode = function() {
  	var w, h;
  	w = window.innerWidth;
  	h = window.innerHeight;
  	// create info card

  	this.appRef.$.markerInfo.hidden = false;
  	this.appRef.$.markerInfo.textMode = true;
  	d3.select('#map').style('height', (h / 2) + 'px');
  	d3.select('#markerInfoPC').style('width', w + 'px').style('height', h/2 + 'px');

  	d3.select('#exitTM').style('left', '5px').style('bottom', ((window.innerHeight/2) - (document.querySelector('#exitTM').offsetWidth / 2)) + 'px');
  	this.appRef.tmr();
  	this._switch();

  };

  Marker.prototype._switch = function() {
  	var mi = this.appRef.$.markerInfo,
  		app = this.appRef;

  	//center map on thismarker
  	app.gmap.lat = this.busstop.lat;
  	nP( app, 'gmap.lat');
  	app.gmap.lng = this.busstop.lng;
  	nP( app, 'gmap.lng');
  	mi.busstop.nr = this.busstop.nr;
  	nP( mi, 'busstop.nr');

  };

  // help functions
  function nP ( t, o) {
  	var a = [], oO;
  	a = o.split('.');
  	oO = t;
  	for (var i = 0; i < a.length; i++) {
  		oO = oO[a[i].toString()];
  	}
  	t.notifyPath(o, oO);
  }

  ///////////////////////////////////////////////////
  /////////////////////////EDITOR MODE START//////////////
  /////////////////////////////////////////////////////
  Marker.prototype.animate.onTap_edit = function ( iM, t ) {
  	var point = t.markersReferenceList[iM][2],
  		  fabRef = t.markersReferenceList[iM][3];
  	if (!t.markersReferenceList[iM].opened) {
  		this.e_showInfoWindow( t, point, fabRef, cardRef );
  	} else {
  		this.e_hideInfoWindow( t, point, fabRef, cardRef );
  	}
  	t.markersReferenceList[iM].opened = !t.markersReferenceList[iM].opened;
  };

  Marker.prototype.animate.e_hideInfoWindow = function ( t, point, fabRef, cardRef ) {
  	onTapeditorMenu( t, point, cardRef, false );
  	onTapAnimMarker( fabRef, 135, 117, '50%' );
  };

  Marker.prototype.animate.e_showInfoWindow = function ( t, point, fabRef, cardRef ) {
  	onTapAnimMarker( fabRef, 17, 117, '5px' );
  	onTapeditorMenu( t, point, cardRef, true );
  };
  ///////////////////////////////////////////////////
  /////////////////////////EDITOR MODE END//////////////
  /////////////////////////////////////////////////////


  // END OF (Marker CLASS)

  /*
   *		SHORTHAND FUNCTIONS for (Marker CLASS)
  *
  */

  function arrayToNumber ( array ) {
  	var counter = 0, i = 0;

  	for (i = 0; i < array[0].length; i++) {
  		counter++;
  		if (array[0][i] === 1) {
  			return counter;
  		}
  	}
  	return 0;
  }

  function computeMarkerIndex ( t, geoPosition ) {
  	if (typeof geoPosition === 'object') {
  		t.geoPosition = null;

  		return 0;
  	}

  }

  function onTapAnimMarker( fab, de, du, radius ) {
  	d3.select( fab )
  	  .transition()
  	  .delay( de )
  	  .duration( du )
  	  .style('border-radius', radius);
  }

  function onTapAnimCard( toRight, point, fade, card, de, du, width ) {
  	var height, pointX, pointY;
  	if (fade === 'in' && toRight === false) {
  		height = 40;
  		pointX = point.x - 120;
  		pointY = point.y - 35;
  		onTapAnimCard_in_toLeft ( card, width, height, point, pointX, pointY, de, du );
  	} else if (fade === 'out' && toRight === false) {
  	 	height = 1;
  	 	pointX = point.x;
  	 	pointY = point.y - 35;
  	 	onTapAnimCard_out_toLeft( card, width, height, point, pointX, pointY );
  	} else if (fade === 'in' && toRight === true) {
  	 	height = 40;
  	 	pointX = point.x;
  	 	pointY = point.y - 35;
  	 	onTapAnimCard_in_toRight( card, width, height, point, pointX, pointY, de, du );
  	} else if (fade === 'out' && toRight === true) {
  	 	height = 1;
  	 	pointX = point.x;
  	 	pointY = point.y - 35;
  	 	onTapAnimCard_out_toRight( card, width, height, point, pointX, pointY );
  	}
  }

  /* FOR onTapAnimCard FUNCTION */
  function onTapAnimCard_in_toLeft ( card, width, height, point, pointX, pointY, de, du ) {
  	d3.select( card )
  	  .transition()
  	  .delay(de)
  	  .duration(7)
  	  .style('left',(point.x-10)+'px')
  	  .style('top', (point.y-35)+'px')
  	  .style('width','1px')
  	  .style('height', height + 'px')
  	  .style('border-top-left-radius', '5px')
  	  .style('border-bottom-left-radius', '5px')
  	  .transition()
  	  .delay(2 * de + 7)
  	  .duration(du)
  	  .style('width', width)
  	  .style('left', pointX + 'px')
  	  .style('top', pointY + 'px');
  }
  function onTapAnimCard_in_toRight ( card, width, height, point, pointX, pointY, de, du ) {
  	d3.select( card )
  	  .transition()
  	  .delay(de) //de
  	  .duration(7)
  	  .style('left',(point.x-10)+'px')
  	  .style('top', (point.y-35)+'px')
  	  .style('width','1px')
  	  .style('height', height + 'px')
  	  .style('border-top-right-radius', '5px')
  	  .style('border-bottom-right-radius', '5px')
  	  .transition()
  	  .delay(2 * de + 7)
  	  .duration(du)
  	  .style('width', width)
  	  .style('left', pointX + 'px');
  }

  function onTapAnimCard_out_toLeft ( card, width, height, point, pointX, pointY ) {
  	d3.select( card )
  	  .transition()
  	  .delay(17)
  	  .duration(300)
  	  .style('width', width)
  	  .style('left', pointX + 'px')
  	  .style('top', pointY + 'px')
  	  .transition()
  	  .delay(317)
  	  .duration(7)
  	  .style('left',(point.x-10)+'px')
  	  .style('top', (point.y-35)+'px')
  	  .style('width','1px')
  	  .style('height', height + 'px')
  	  .style('border-top-left-radius', '5px')
  	  .style('border-bottom-left-radius', '5px');
  }
  function onTapAnimCard_out_toRight (card, width, height, point, pointX, pointY) {
  	d3.select( card )
  	  .transition()
  	  .delay(17)
  	  .duration(300)
  	  .style('width', width)
  	  .style('left', pointX + 'px')
  	  .transition()
  	  .delay(317)
  	  .duration(7)
  	  .style('left',(point.x-10)+'px')
  	  .style('top', (point.y-35)+'px')
  	  .style('width','1px')
  	  .style('height', height + 'px')
  	  .style('border-top-right-radius', '5px')
  	  .style('border-bottom-right-radius', '5px');
  }
  /* FOR onTapAnimCard FUNCTION */

  function createMarkerNode ( t, indexMarker, point ) {
  	// prepare for creating nodes
  	var idMarker = 'marker' + indexMarker.toString(),
  		tt = t;
  	// create nodes
  	d3.select('#map')
  	  .append('map-paper-marker')
  	  .attr('id',idMarker);
  	d3.select('#'+idMarker)
  	  .style('position','absolute')
  	  .style('z-index','1')
  	  .style('left',(point.x-20)+'px')
  	  .style('top', (point.y-35)+'px');

  	// save references to created nodes
  	var mark = document.querySelector('#' + idMarker),
  		fab = document.querySelector('#' + idMarker + ' paper-fab'),
  		icon = document.querySelector('#' + idMarker + ' paper-fab #icon svg');
  	// remember created nodes
  	t.markersReferenceList.push( {0: mark, 1: icon, 2: point, 3: fab, opened: false} );
  	t.markersOnMapProperties.push({ tapped: false });

  	// add tap listeners for newly created marker but...
  	if (!t.editorMode) mark.addEventListener('tap', function () {
  		tt.onTap( 0, tt );
  		tt.appRef.textMode = 1;
  	});
  	// if editor mode enabled then ..
  	if (t.editorMode) mark.addEventListener('tap', function () {
  		tt.onTap_edit( 0, tt );
  	});
  }


  ///////////HELPER FUNCTIONS/////////////////////////////
  /////////////////////////EDITOR MODE START//////////////
  /////////////////////////////////////////////////////

  function onTapeditorMenu ( t, point, cardRef, showBool ) {
  	if (showBool) {
  		t.appRef.markerInputEditionMode = true;

  		setTimeout( function () {
  			d3.select(document.querySelector('#dhmdmi'))
  			  .style('position', 'fixed')
  			  .style('z-index','100')
  		  	  .style('left',(point.x-40)+'px')
  		  	  .style('top', (point.y-60)+'px');

  		  	setTimeout( function () {
  		  		t.appRef.markerInputEditionMode_opened = true;
  		  		t.appRef.markerInputEditionMode_i = t.busstop.nr;
  		  	},100 );
  		}, 100);
  	}
  	if (!showBool) {
  		t.appRef.markerInputEditionMode = false;
  		t.appRef.markerInputEditionMode_opened = false;

  	}

  }


  ////////////////////////////////////////////////////////////////////
  ///////////// HELPER OUTSIDE FUNCTIONS ////////////////////////////
  ///////////////////////////////////////////////////////////////////






  ///////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  ////////////////   CREATE 	JSON 	BUSSTOP /////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////

  function CreateJson ( kind ) {

  	this.geometry = {};
  	this.properties = {};
  	this.o = {};

  	// linia
  	if (kind === 'l') this.geometry.coordinates = [];
  	if (kind === 'l') this.geometry.coordinates.ib = [];
  	// this.coordinatesItem { lat: '', lng: '', isBusstop: '' }
  	if (kind === 'l') this.properties.line_nr = '';
  	if (kind === 'l') this.properties.nr = [];
  	if (kind === 'l') this.properties.site = 0;
  	if (kind === 'l') this.isBusstop = function ( item ) {
  		this.geometry.coordinates.ib[this.geometry.coordinates.length] = item;
  	};
  	if (kind === 'l') this.coordinatesItem = function ( item ) {
  		this.geometry.coordinates[this.geometry.coordinates.length] = item;
  	};

  	// przystanki
  	if (kind === 'b') this.geometry.coordinates = { lat: '', lng: '' };
  	if (kind === 'b') this.properties.city = '';
  	if (kind === 'b') this.properties.line_nr = [];
  	// this.line_nrItem = ''
  	if (kind === 'b') this.properties.nr = '';
  	if (kind === 'b') this.properties.site = 0;
  	if (kind === 'b') this.properties.street = '';
  	if (kind === 'b') this.line_nrItem = function ( item ) {
  		this.properties.line_nr[this.properties.line_nr.length] = item;
  	};

  	// godziny

  	// create JSON object
  	this.returnJson = function () {
  		// lina
  		if (kind === 'l') for (var for_i = 0; for_i < this.geometry.coordinates.length; for_i++) {
  			this.geometry.coordinates[for_i].isBusstop = this.geometry.coordinates.ib[for_i];
  			if (this.geometry.coordinates.ib[for_i]) this.properties.nr[for_i] = this.geometry.coordinates.ib[for_i];
  		}
  		if (kind === 'l') this.o = {
  			geometry: {
  				coordinates: this.geometry.coordinates
  			},
  			properties: {
  				nr: this.properties.nr,
  				line_nr: this.properties.line_nr,
  				site: this.properties.site
  			}
  		};
  		// przystanki
  		if (kind === 'b') this.o = {
  			geometry: {
  				coordinates: this.geometry.coordinates
  			},
  			properties: {
  				line_nr: this.properties.line_nr,
  				city: this.properties.city,
  				nr: this.properties.nr,
  				street: this.properties.street,
  				site: this.properties.site
  			}
  		};

  		return JSON.parse(JSON.stringify( this.o ));
  	};
  }
  ///////// END //////// END  ////////// END /////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  ////////////////   CREATE 	JSON 	BUSSTOP /////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////




  // --------------------------------------------------------------------
  // --------------------------------------------------------------------


  //////////////////////////////////////////////////////////////////////////////////////
  ////////   MARKER controller //////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////



  function MarkerController ( mapApp ) {
  	// keeps references to markers that should be displayd on map
  	this.bagOfMarkers = [];
  	this.marker = {};
  	this.m = {};
  	this.textMode = false;
  }
  // update markers
  MarkerController.prototype.update = function () {
  	if (!mapApp.$.gMap.map) return;
  	// update position of each marker
  	for (var i = 0; i < this.bagOfMarkers.length; i++) {
  		this.bagOfMarkers[i].update();
  	}
  };

  // destroy marker --> remove from bagofmarkers
  MarkerController.prototype.destroy = function () {
  	if (!arguments.length) {
  		// remove all from DOM and instace
  		if (this.bagOfMarkers.length) for (var i = this.bagOfMarkers.length - 1; i >= 0 ; i--) {

  			this.bagOfMarkers[i].destroyMarker();			// DOM freed
  		}
  		this.bagOfMarkers = [];
  	}
  };

  // add marker to bagofmarkers
  MarkerController.prototype.add = function () {
  	var latLng = new google.maps.LatLng( this.marker.lat, this.marker.lng );
  	this.m[this.bagOfMarkers.length] = new Marker( mapApp );
  	this.m[this.bagOfMarkers.length].markerCounter = this.bagOfMarkers.length;
    this.m[this.bagOfMarkers.length].busstop.nr = this.marker.nr;
    this.m[this.bagOfMarkers.length].busstop.lat = this.marker.lat;
    this.m[this.bagOfMarkers.length].busstop.lng = this.marker.lng;
    this.m[this.bagOfMarkers.length].busstop.city = this.marker.city;
    this.m[this.bagOfMarkers.length].busstop.street = this.marker.street;
    this.m[this.bagOfMarkers.length].busstop.line_nr = this.marker.line_nr;
    this.m[this.bagOfMarkers.length].busstop.site = this.marker.site;
    this.m[this.bagOfMarkers.length].busstop.index = this.marker.index;
    this.m[this.bagOfMarkers.length].busstop.hours = this.marker.hours;
    this.m[this.bagOfMarkers.length].editorMode = this.marker.editorMode ? this.marker.editorMode : false;
    this.m[this.bagOfMarkers.length].geoPosition = this.marker.geoPosition ? this.marker.geoPosition : latLng;
    var b = this.m[this.bagOfMarkers.length];
    this.m[this.bagOfMarkers.length].computePos(function ( p ) {
        b.update( p );
    });

    this.bagOfMarkers[this.bagOfMarkers.length] = this.m[this.bagOfMarkers.length];
  };

  MarkerController.prototype.ask4marker = function( nr, s ) {
  	// nr --> busstop nr
  	// s --> 0 prev || 1 next
  	for (var i = 0; i < this.bagOfMarkers.length; i++) {
  		if (this.bagOfMarkers[i].busstop.nr == nr) {
  			if (s === 0 && i > 0) {
  				i--;
  				this.bagOfMarkers[i]._switch();
  				break;
  			} else if (s === 0 && i === 0) {
  				this.bagOfMarkers[this.bagOfMarkers.length - 1]._switch();
  				break;
  			} else if (s === 1 && i < this.bagOfMarkers.length - 1) {
  				i++;
  				this.bagOfMarkers[i]._switch();
  				break;
  			} else if (s === 1 && i === this.bagOfMarkers.length - 1) {
  				this.bagOfMarkers[0]._switch();
  				break;
  			}
  		}
  	}
  };

})(window, d3);
