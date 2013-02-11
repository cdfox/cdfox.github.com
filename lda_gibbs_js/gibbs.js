var spans = [];
var num_topics = 2;
var alpha = 0.2;
var beta = 0.2;
var paused = false;
var zoomed = false;

var colors = ['green', 'orange'];

var compressed_data = JSON.parse(compressed_data_string);
var data_string = LZW.decompress(compressed_data);
var data = JSON.parse(data_string);

/*
Display docs and set up spans and state.
*/
timer_id = 0;
i = 0;
$(function(){
	corpus.forEach(function(doc, i){
		var p = $('<p class="doc"><strong>' + i + ': </strong></p>');
		var doc_spans = [];
		doc.forEach(function(word, j){
			var span = $('<span class="word"></span>').text(word + " ").appendTo(p);
			doc_spans.push(span);
		});
		p.appendTo('#docs');
		spans.push(doc_spans);
	});
	//gibbs(100, 1, 20, reviews, num_topics, alpha, beta);
	$("body").keypress(start);
	$("#start").click(start);
	$("#zoom").click(zoom);
});

function start(){
	if (!paused) {
		i = 0;
	} else {
		paused = false;
	}
	clearInterval(timer_id);
	var timer_id = setInterval(function (argument) {
		update_colors(data[i]);
		$("#iteration").text(i);
		i++;
	}, 200);
	$("#pause").click(function(){
		clearInterval(timer_id);
		paused = true;
	});
}

/*
Update color of each word to reflect state.
*/
function update_colors(state){
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

}