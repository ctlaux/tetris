// Inspectable Tetris clone 
// Copyright (c) 2013 Christopher Laux <ctlaux@gmail.com>

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.


var source = "tetris.xml"
var xml;


function on_launch() {
}

function draw_inspector() {
}

function render_markup(code) {
    var nodes = code.childNodes;
    var html = "";

    for(var i = 0; i < nodes.length; i++) {
	switch(nodes[i].nodeName) {
	case "#text":
	    html+= $(nodes[i]).text();
	    break;

	case "inspect":
	    html+= "<b>" + $(nodes[i]).text() + "</b>";
	    break;
	}
    }

    $("#code").append(html);
}

$(function() {
    $.ajax({type: "GET",
	    url: source,
	    dataType: "xml",
	    success: function(data) {
		xml = data;
		console.log("xml received");
		render_markup(xml.firstChild);
	    }
	   });
});
