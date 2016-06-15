var sp = [ 'top', 'right', 'bottom', 'left' ],
	  sd = ['opacity', 'color'],
	  ss = ['width', 'height'],
	  sb = ['background-color'],
	  s = [];

function mUpdate_5 ( t, point ) {
	var p, d, px = point.x-20, py = point.y-35;
	if (t.currentIcon!==5) {
		t.currentIcon = 5;
		t.markersReferenceList[0][3].icon = t.icons[5];
	}
	for (p = 0; p < sp.length; p++) {
		t.markersReferenceList[0][0].style[sp[p]] = (p===1 || p===2) ? null : ((p===0) ? (py+'px') : (px+'px'));
	}
	for (d = 0; d < sd.length; d++) {
		t.markersReferenceList[0][3].style[sd[d]] = d ? 'white' : '1';
		t.markersReferenceList[0][3].style[ss[d]] = d ? '40px' : '40px';
	}
	t.markersReferenceList[0][3].style[sb[0]] = '#f44336';
}

function mUpdate_outside ( t, point, i ) {
	var p, d, px = point.x-20, py = point.y-35;
	s[0] = (i===1||i===2||i===3) ? 0 : (i===4||i===6) ? (py+'px') : null;
	s[1] = (i===1||i===2||i===4||i===7||i===8) ? null : '20px';
	s[2] = (i===1||i===2||i===3||i===4||i===6) ? null : '20px';
	s[3] = (i===1||i===4||i===7) ? 0 : (i===2||i===8) ? (px+'px') : null;
	if (t.currentIcon!==i) {
		t.currentIcon = i;	// set current icon
		t.markersReferenceList[0][3].icon = t.icons[i]; // update icon if nesesery - POLYMER
	}
	for (d = 0; d < sd.length; d++) {
		t.markersReferenceList[0][3].style[sd[d]] = d ? 'black' : '0.9';
		t.markersReferenceList[0][3].style[ss[d]] = d ? '20px' : '20px';
	}
	for (p = 0; p < sp.length; p++) {
		t.markersReferenceList[0][0].style[sp[p]] = s[p];
	}
	t.markersReferenceList[0][3].style[sb[0]] = '#FFEB3B';

}

/*
			[ top: 0, 					[ top: 0, 					[ top: 0,
			  right: null, 			  right: null,		 	  right: 0,
			  bottom: null,			  bottom: null, 	 	  bottom: null,
			  left: 0 		] 		  left: px	 	]  	 	  left: null 	]

			[ top: py, 					[ top: null, 				[ top: py,
			  right: null, 			  right: null,		 	  right: 0,
			  bottom: null,			  bottom: null, 	 	  bottom: null,
			  left: 0	 	] 			  left: null 	]  	 	  left: null 	]

			[ top: null, 				[ top: null, 				[ top: null,
			  right: null, 			  right: null,		 	  right: 0,
			  bottom: 0,				  bottom: 0, 			 	  bottom: 0,
			  left: 0 		] 		  left: px	 	]  	 	  left: null 	]

*/
