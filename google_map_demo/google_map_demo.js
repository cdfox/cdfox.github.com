
var directionsService;
var map;
var r;
var stepSet;
var callbacks_finished;
var colors = ['red', 'blue', 'green', 'yellow'];

window.onload = initialize;

function initialize() {
  directionsService = new google.maps.DirectionsService();
  var cary = new google.maps.LatLng(35.7789, -78.8003);
  var mapOptions = {
    zoom:12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: cary
  }
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  var colorKey = new google.maps.InfoWindow({
    content:  '<strong>Number of overlapping routes:</strong> <br />' + 
              '<span style="background-color:red;color:red">...</span> 1 <br />' +
              '<span style="background-color:blue;color:blue">...</span> 2 <br />' +
              '<span style="background-color:green;color:green">...</span> 3 <br />' +
              '<span style="background-color:yellow;color:yellow">...</span> 4 <br /><br />',
    position: new google.maps.LatLng(35.7789, -78.9003)
    
  });
  colorKey.open(map);
  document.getElementById("go").onclick = calcRoute;
  calcRoute();
}

function calcRoute() {
  callbacks_finished = 0;
  stepSet = {};
  for (var i = 1; i <= 4; i++) {
    var start = document.getElementById("start" + i).value;
    var end = document.getElementById("end" + i).value;
    var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        // add each step in the route to the set
        var steps = response.routes[0].legs[0].steps;
        for (var i = 0; i < steps.length; i++) {
          var encodedPath = steps[i].polyline.points;
          if (encodedPath in stepSet) {
            stepSet[encodedPath].count++;
          } else {
            stepSet[encodedPath] = {
              count: 1,
              end: steps[i].end_location,
              instructions: steps[i].instructions
            }
          }
        }

        callbacks_finished++;
        if (callbacks_finished == 4) drawRoute();
      } else {
        console.log(status);
      }
      console.log(response);
      r = response;
    });
  }
}

function drawRoute() {
  for (var encodedPath in stepSet) {

    var count = stepSet[encodedPath].count;
    var instructions = stepSet[encodedPath].instructions;
    var end = stepSet[encodedPath].end;
    var path = google.maps.geometry.encoding.decodePath(encodedPath);

    console.log(instructions);
    console.log(count + "\n");

    var poly = new google.maps.Polyline({
      map: map, 
      path: path,
      strokeColor: colors[count - 1],
      strokeOpacity: 0.2 + Math.min(0.7, 0.2 * count)
    });
    var marker = new google.maps.Marker({
      position: end,
      title: instructions,
      map: map
    });
  };
}