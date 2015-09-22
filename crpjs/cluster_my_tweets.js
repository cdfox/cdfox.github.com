

function strip_punctuation(string) {
	return string.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"");
}

var tweet_items = $(".js-stream-item");
var tweet_texts = $(".js-tweet-text");
var texts = $.map(tweet_texts, function(p){ 
	return p.innerText;
});
var no_punct = $.map(texts, strip_punctuation);
var lower_case = $.map(no_punct, function(str) {
	return str.toLowerCase();
});

var corpus = {};
for (var i = 0; i < lower_case.length; i++) {
	corpus[i] = lower_case[i].split(" ");
}

var state = crpmm.initialize_state(corpus, 10, .05)

// var iter_display = $("<span class='iter_display'></span>");
// $('.search-query').append(iter_display);
var colors = {};
for (var iter = 1; iter <= 100; iter++) { 

	for (var docID in corpus) {	
		crpmm.sample_table(docID, corpus, state);
	}
	// iter_display.text(iter);
}
color_tweets(state, tweet_items);

function color_tweets(state, tweet_items) {
	for (var docID in state.assignments) {
		var tableID = state.assignments[docID];
		if (!colors.hasOwnProperty(tableID)) {
			colors[tableID] = random_color();
		}
		tweet_items[docID].style.backgroundColor = colors[tableID];
		var table_display = $("<span class='table_display'></span>");
		table_display.text(tableID);
		$(tweet_items[docID]).children().append(table_display);
	}
}

function random_color() {
	return 'hsla(' + Math.random() * 360 + ',50%,50%,0.5)';
}


// From: http://snipplr.com/view.php?codeview&id=14590
/**
 * HSV to RGB color conversion
 *
 * H runs from 0 to 360 degrees
 * S and V run from 0 to 100
 * 
 * Ported from the excellent java algorithm by Eugene Vishnevsky at:
 * http://www.cs.rit.edu/~ncs/color/t_convert.html
 */
function hsvToRgb(h, s, v) {
	var r, g, b;
	var i;
	var f, p, q, t;
	
	// Make sure our arguments stay in-range
	h = Math.max(0, Math.min(360, h));
	s = Math.max(0, Math.min(100, s));
	v = Math.max(0, Math.min(100, v));
	
	// We accept saturation and value arguments from 0 to 100 because that's
	// how Photoshop represents those values. Internally, however, the
	// saturation and value are calculated from a range of 0 to 1. We make
	// That conversion here.
	s /= 100;
	v /= 100;
	
	if(s == 0) {
		// Achromatic (grey)
		r = g = b = v;
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}
	
	h /= 60; // sector 0 to 5
	i = Math.floor(h);
	f = h - i; // factorial part of h
	p = v * (1 - s);
	q = v * (1 - s * f);
	t = v * (1 - s * (1 - f));

	switch(i) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
			
		case 1:
			r = q;
			g = v;
			b = p;
			break;
			
		case 2:
			r = p;
			g = v;
			b = t;
			break;
			
		case 3:
			r = p;
			g = q;
			b = v;
			break;
			
		case 4:
			r = t;
			g = p;
			b = v;
			break;
			
		default: // case 5:
			r = v;
			g = p;
			b = q;
	}
	
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
