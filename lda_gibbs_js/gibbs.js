var spans = [];
var running = false;
var zoomed = false;

var colors = ['green', 'orange'];

var compressed_data = JSON.parse(compressed_data_string);
var data_string = LZW.decompress(compressed_data);
var data = JSON.parse(data_string);

/*
Display docs and set up spans and state.
*/
var timer_id = 0;
var iteration = 0;
var timer_id;
$(function() {
	corpus.forEach(function(doc, i){
		var p = $('<p class="doc"><strong>' + i + ': </strong></p>');
		var doc_spans = [];
		doc.forEach(function(word, j){
			var span = $('<span class="word"></span>').text(word + " ");
			span.appendTo(p);
			doc_spans.push(span);
		});
		p.appendTo('#docs');
		spans.push(doc_spans);
	});
	update_colors(data[0]);
	$("#start").click(start);
	$("#reset").click(reset);
	$("#zoom").click(zoom);
});

function start() {
	if (!running) {
		timer_id = setInterval(function (argument) {
			update_colors(data[iteration]);
			$("#iteration").text(iteration);
			iteration++;
			if (iteration == data.length) {
				clearInterval(timer_id);
			}
		}, 200);
		running = true;
	}
}

function reset() {
	iteration = 0;
	clearInterval(timer_id);
	running = false;
	update_colors(data[0]);
	$("#iteration").text(iteration);
}

/*
Update color of each word to reflect state.
*/
function update_colors(state) {
	spans.forEach(function(doc_spans, i){
		doc_spans.forEach(function(word_span, j){
			if (zoomed) {
				word_span.css({'background-color': colors[state[i][j]]});
			} else {
				word_span.css({'color': colors[state[i][j]]});
			}
		});
	});
}

function zoom() {
	zoomed = !zoomed;
	var docs = $(".doc");
	var words = $(".word");
	if (zoomed) {
		words.css('color', 'black');
		docs.css('font-size', '4pt');
	} else {
		words.css('background-color', 'white');
		docs.css('font-size', '12pt');
	}
	update_colors(data[iteration]);
}