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

var current_selection = null;


function on_launch() {
}

function draw_inspector() {
    var canvas2 = document.getElementById('canvas2');
    canvas2.width = canvas2.width;
    var c = canvas2.getContext('2d');

    if(current_selection == "rotate_p")
	draw_rotation(c, 100, 100, true, "red", null, null, null);
}

function code_clicked(obj) {
    if(current_selection != null)
	$("." + current_selection).css("color", "grey");

    classes = $(obj).attr("class").split(" ");
    current_selection = classes[1];
    $("." + current_selection).css("color", "red");

    draw_inspector();
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
	    html+= "<b class='inspectable " + $(nodes[i]).attr("class") + "' onclick='code_clicked(this);'>" + $(nodes[i]).text() + "</b>";
	    break;
	}
    }

    $("#code").append(html);
}
