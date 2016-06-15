/*


OUT					      |	OUT							      |	OUT
.R.R < lat > .R.j	|	.R.R < lat > .R.j			|	.R.R < lat > .R.j
.j.j > lng < .j.R	|	.j.j < lng < .j.R			|	.j.j < lng > .j.R
					        |								        |								.R.j
------------------+-----------lat---------+--------------------------
OUT					      |	IN							      |	OUT
.R.R < lat < .R.j	|	.R.R < lat < .R.j			|	.R.R < lat < .R.j
.j.j > lng < .j.R	|	.j.j < lng < .j.R			|	.j.j < lng > .j.R
				         lng						 	       lng							  \/
					        |								        |
					        |	MAP IN BOUNDS				  |
			         		|								        |								.R.R
------------------+-----------lat---------+--------------------------
OUT					      |	OUT							      |	OUT
.R.R > lat < .R.j	|	.R.R > lat < .R.j			|	.R.R > lat < .R.j
.j.j > lng < .j.R	|	.j.j < lng < .j.R			|	.j.j < lng > .j.R
					        |        								|
				        .j.j				<			      .j.R


[
  [ 1, 0, 0 ,
    0, 0, 0 ,    <--- top left corner
    0, 0, 0 ]
]

+---+---+---+ <--- marker is outside of map show special arrow on map at corner
| x |   |   | <--- top left corner
+---+---+---+
|   |map|   |
+---+---+---+
|   |   |   |
+---+---+---+

*/

//  Map bound controller based on geo position will show where
//  marker is

function MapBoundsController () {

this.activateBC = false;
this.check = function ( bd ) {
  // bd --> bounds data
  // if (!this.activate) return;
  var lat = this.latBC,
      lng = this.lngBC;
  if ((bd.R.R < lat && lat < bd.R.j) && (bd.j.j < lng && lng < bd.j.R)) {
    // in map bounds
    return [
      [0,0,0,
       0,1,0,
       0,0,0]
    ];
  } else if ((bd.R.R < lat && lat > bd.R.j) && (bd.j.j > lng && lng < bd.j.R)) {
    // top left corner
    return [
      [1,0,0,
       0,0,0,
       0,0,0]
    ];
  } else if ((bd.R.R < lat && lat > bd.R.j) && (bd.j.j < lng && lng < bd.j.R)) {
    // middle top
    return [
      [0,1,0,
       0,0,0,
       0,0,0]
    ];
  } else if ((bd.R.R < lat && lat > bd.R.j) && (bd.j.j < lng && lng > bd.j.R)) {
    // top right corner
    return [
      [0,0,1,
       0,0,0,
       0,0,0]
    ];
  } else if ((bd.R.R < lat && lat < bd.R.j) && (bd.j.j < lng && lng > bd.j.R)) {
    // middle right side
    return [
      [0,0,0,
       0,0,1,
       0,0,0]
    ];
  } else if ((bd.R.R > lat && lat < bd.R.j) && (bd.j.j < lng && lng > bd.j.R)) {
    // bottom right corner
    return [
      [0,0,0,
       0,0,0,
       0,0,1]
    ];
  } else if ((bd.R.R > lat && lat < bd.R.j) && (bd.j.j < lng && lng < bd.j.R)) {
    // middle bottom
    return [
      [0,0,0,
       0,0,0,
       0,1,0]
    ];
  } else if ((bd.R.R > lat && lat < bd.R.j) && (bd.j.j > lng && lng < bd.j.R)) {
    // bottom left corner
    return [
      [0,0,0,
       0,0,0,
       1,0,0]
    ];
  } else if ((bd.R.R < lat && lat < bd.R.j) && (bd.j.j > lng && lng < bd.j.R)) {
    // middle left side
    return [
      [0,0,0,
       1,0,0,
       0,0,0]
    ];
  }
};
}
