
var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;

var RAL_LAT = 35.7789;
var RAL_LON = -78.6347;

var map;
var lastLatLng;
var shiftPressed=false;
baseUrl = 'https://torid-fire-403.firebaseio.com/';
var mapData = new Firebase(baseUrl);
var session;
var child_name;
var markers = [];

var drive_polylines = [];

$(document).ready(function(){	
	var directionsService = new google.maps.DirectionsService();
	var mapOptions = {
		keyboardShortcuts: false,
		disableDefaultUI: false,
		zoom: 18,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: new google.maps.LatLng(RAL_LAT, RAL_LON)
	}
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	var x = $(window).innerHeight() - 50,
        y = $(window).scrollTop() + 50;

    var sydney_route = [
		new google.maps.LatLng( -33.858883 , 151.213608 ),
		new google.maps.LatLng( -33.858986 , 151.213593 ),
		new google.maps.LatLng( -33.859016 , 151.213470 ),
		new google.maps.LatLng( -33.859016 , 151.213470 ),
		new google.maps.LatLng( -33.859562 , 151.213318 ),
		new google.maps.LatLng( -33.861977 , 151.213058 ),
		new google.maps.LatLng( -33.866554 , 151.212433 ),
		new google.maps.LatLng( -33.866554 , 151.212433 ),
		new google.maps.LatLng( -33.866344 , 151.210800 ),
		new google.maps.LatLng( -33.866344 , 151.210800 ),
		new google.maps.LatLng( -33.866573 , 151.210709 ),
		new google.maps.LatLng( -33.869614 , 151.210388 ),
		new google.maps.LatLng( -33.869614 , 151.210388 ),
		new google.maps.LatLng( -33.870029 , 151.210327 ),
		new google.maps.LatLng( -33.870350 , 151.210358 ),
		new google.maps.LatLng( -33.870754 , 151.210312 ),
		new google.maps.LatLng( -33.870754 , 151.210312 ),
		new google.maps.LatLng( -33.870777 , 151.206940 ),
		new google.maps.LatLng( -33.870777 , 151.206940 ),
		new google.maps.LatLng( -33.872982 , 151.207001 ),
		new google.maps.LatLng( -33.873684 , 151.206924 ),
		new google.maps.LatLng( -33.874729 , 151.206726 ),
		new google.maps.LatLng( -33.876381 , 151.206161 ),
		new google.maps.LatLng( -33.876381 , 151.206161 ),
		new google.maps.LatLng( -33.875988 , 151.203552 ),
		new google.maps.LatLng( -33.875988 , 151.203552 ),
		new google.maps.LatLng( -33.877052 , 151.203354 ),
		new google.maps.LatLng( -33.877327 , 151.203247 ),
		new google.maps.LatLng( -33.877327 , 151.203247 ),
		new google.maps.LatLng( -33.877232 , 151.202774 ),
		new google.maps.LatLng( -33.877220 , 151.202469 ),
		new google.maps.LatLng( -33.877563 , 151.201447 ),
		new google.maps.LatLng( -33.877632 , 151.200989 ),
		new google.maps.LatLng( -33.877628 , 151.200699 ),
		new google.maps.LatLng( -33.877506 , 151.199890 ),
		new google.maps.LatLng( -33.877506 , 151.199890 ),
		new google.maps.LatLng( -33.877506 , 151.199615 ),
		new google.maps.LatLng( -33.877594 , 151.199295 ),
		new google.maps.LatLng( -33.879047 , 151.195709 ),
		new google.maps.LatLng( -33.879047 , 151.195709 ),
		new google.maps.LatLng( -33.874371 , 151.193008 ),
		new google.maps.LatLng( -33.874264 , 151.192902 ),
		new google.maps.LatLng( -33.874035 , 151.192490 ),
		new google.maps.LatLng( -33.873943 , 151.192413 ),
		new google.maps.LatLng( -33.873943 , 151.192413 ),
		new google.maps.LatLng( -33.875626 , 151.189972 ),
		new google.maps.LatLng( -33.876591 , 151.188339 ),
		new google.maps.LatLng( -33.876942 , 151.187851 ),
		new google.maps.LatLng( -33.877087 , 151.187759 ),
		new google.maps.LatLng( -33.877216 , 151.187775 ),
		new google.maps.LatLng( -33.878292 , 151.188644 ),
		new google.maps.LatLng( -33.878452 , 151.188721 ),
		new google.maps.LatLng( -33.878708 , 151.188705 ),
		new google.maps.LatLng( -33.878914 , 151.188599 ),
		new google.maps.LatLng( -33.879799 , 151.186981 ),
		new google.maps.LatLng( -33.879799 , 151.186981 ),
		new google.maps.LatLng( -33.880810 , 151.187805 ),
		new google.maps.LatLng( -33.880810 , 151.187805 ),
		new google.maps.LatLng( -33.881302 , 151.186859 ),
		new google.maps.LatLng( -33.881302 , 151.186859 ),
		new google.maps.LatLng( -33.883987 , 151.190689 ),
	];

	var poly = new google.maps.Polyline({
		map: map, 
		path: sydney_route,
		strokeColor: "blue",
		strokeOpacity: 0.4,
    	strokeWeight: 10
	});

	var defaultBounds = new google.maps.LatLngBounds(
	      new google.maps.LatLng(-33.8902, 151.1759),
	      new google.maps.LatLng(-33.8474, 151.2631));
	map.fitBounds(defaultBounds);

	var input = document.getElementById('pac-input');
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);


	var searchBox = new google.maps.places.SearchBox((input));
	  google.maps.event.addListener(searchBox, 'places_changed', function() {
	      var places = searchBox.getPlaces();

	      for (var i = 0, marker; marker = markers[i]; i++) {
	        marker.setMap(null);
	      }

	    // For each place, get the icon, place name, and location.
	      markers = [];
	      var bounds = new google.maps.LatLngBounds();
	     for (var i = 0, place; place = places[i]; i++) {
	       var image = {
	         url: place.icon,
	         size: new google.maps.Size(71, 71),
	         origin: new google.maps.Point(0, 0),
	         anchor: new google.maps.Point(17, 34),
	         scaledSize: new google.maps.Size(25, 25)
	       };

	//       // Create a marker for each place.
	       var marker = new google.maps.Marker({
	         map: map,
	         icon: image,
	         title: place.name,
	         position: place.geometry.location
	       });

	       markers.push(marker);

	       bounds.extend(place.geometry.location);
	     }

	     map.fitBounds(bounds);
	   });

	   // Bias the SearchBox results towards places that are within the bounds of the
	   // current map's viewport.
	   google.maps.event.addListener(map, 'bounds_changed', function() {
	     var bounds = map.getBounds();
	     searchBox.setBounds(bounds);
	   });
 });



//On press of enter in a message box push the message to firebase


var lastSession = mapData.endAt().limit(1);
lastSession.on('child_added', function(sessionSnapshot) {

	session = sessionSnapshot.ref();
	//var session =  mapData.child('1396119733966 - Chris-kristy2 - Sat Mar 29 2014 15:03:05 GMT-0400 (Eastern Daylight Time)');

	$('#session_name').text(sessionSnapshot.name());
	
	for (var i = 0; i < drive_polylines.length; i++) {
		drive_polylines[i].setMap(null);
	}
	lastLatLng = null;

	$('#messages').text('');

	session.on('child_added', function(snap) {
		var message = snap.val();

		if (typeof message.message != "undefined") { 
			$("#messages").append("\n"+ message.time_stamp + "   " + message.message);
			//$('#messageInput').val("");
			$("#messages").scrollTop(
	       $("#messages")[0].scrollHeight - $("#messages").height());
		}

		//Tutor Side
		if (typeof message.lat != "undefined") { 
			var latLng = {lat:message.lat,lng:message.lng};
			if (lastLatLng) {
				var poly = new google.maps.Polyline({
					map: map, 
					path: [lastLatLng, latLng],
					strokeColor: "red",
					strokeOpacity: 0.6
			    });
		    	drive_polylines.push(poly);
			}

		    lastLatLng = latLng;
		}
	});
});

$(document).ready(function() {
	$("#messageInput").keydown(function(e){ 
		if(e.which == 13){
			var text = $('#messageInput').val();
			var current_time = new Date();
			if (text != "") {
				var current_time = new Date();
				session.push({ 
					message: "Tutor: " + text, 
					user: "tutor", 
					time_stamp: jQuery.now(), 
					time: current_time.toString()
				});
				$('#messageInput').val("");		
			}
			
		}
	});
});