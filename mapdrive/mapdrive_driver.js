
var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;

var RAL_LAT = 35.7789;
var RAL_LON = -78.6347;

var map;
var lastLatLng;
var shiftPressed=false;
var firebase = new Firebase('https://torid-fire-403.firebaseio.com/');

var drive_polylines = [];
var mapData;

var lastSession = firebase.endAt().limit(1);
lastSession.on('child_added', function(sessionSnapshot) {
	$('#session_name').text(sessionSnapshot.name());

	mapData = sessionSnapshot.ref();


	for (var i = 0; i < drive_polylines.length; i++) {
		drive_polylines[i].setMap(null);
	}
	lastLatLng = null;



	$('#messages').text('');

	//On receiving a message show it in the cht box or On receiving any mouse movements on the Map draw a line along the route
	mapData.on('child_added',function(snapshot){
		var message = snapshot.val();
		if(typeof message.message != "undefined"){ 
			$("#messages").append("\n"+ message.time_stamp + "   " + message.message);
			//$('#messageInput').val("");
			$("#messages").scrollTop(
	       $("#messages")[0].scrollHeight - $("#messages").height());
		} else if (typeof message.lat != "undefined") {
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

function initialize() {
	var markers = [];
	//Initialize Google Maps
	
	var directionsService = new google.maps.DirectionsService();
	var mapOptions = {
		keyboardShortcuts: false,
		disableDefaultUI: false,
		zoom: 16,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: new google.maps.LatLng(RAL_LAT, RAL_LON)
	}
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	var x = $(window).innerHeight() - 50,
        y = $(window).scrollTop() + 50;



	google.maps.event.addListener(map, 'mousemove', function(event) {

		if(shiftPressed){
		console.log(jQuery.now());

			var latLng = event.latLng;
			var current_time = new Date();
			mapData.push({lat:latLng.lat(), lng:latLng.lng(), time_stamp: jQuery.now(), time: current_time.toString()})

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


	var defaultBounds = new google.maps.LatLngBounds(
	      new google.maps.LatLng(-33.8902, 151.1759),
	      new google.maps.LatLng(-33.8474, 151.2631));
	map.fitBounds(defaultBounds);

	var input = document.getElementById('pac-input');
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);


	var searchBox = new google.maps.places.SearchBox((input));
	google.maps.event.addListener(searchBox, 'places_changed', function() {
		console.log(searchBox.getPlaces());
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

	        // Create a marker for each place.
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
 }

 google.maps.event.addDomListener(window, 'load', initialize);




//Bind for shift press on the Map 
$(document).bind('keydown',function (e) {
	if(e.which == 16){		
		shiftPressed = true;
	}
});

//Bind for release of Shift Key on the Map
$(document).bind('keyup',function (e) {
	if(e.which == 16){
		
		shiftPressed = false;
	}
});


//On press of enter in a message box push the message to firebase
$(document).ready(function(){
	$("#messageInput").keydown(function(e){
		if(e.which == 13){
			var text = $('#messageInput').val();
			var current_time = new Date();
			if (text != "") {
				var current_time = new Date();
				mapData.push({ 
					message: "Driver: "+text, 
					user: "driver", 
					time_stamp: jQuery.now(), 
					time: current_time.toString()
				});
				$('#messageInput').val("");
			}
		}
	});



	$('#new_session').click(function() {

		var unix_time = Date.now();
		var session_name = window.prompt('Enter a session name.');
		var session_start_time = (new Date()).toString();

		mapData = firebase.child(unix_time + ' - ' + session_name + ' - ' + session_start_time);
		mapData.push({'start': 'start'});
	});
});