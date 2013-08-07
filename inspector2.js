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

var rotation_x = 100;
var rotation_y = 100;


function on_launch() {
}

function draw_inspector() {
    var canvas2 = document.getElementById('canvas2');
    canvas2.width = canvas2.width;
    var c = canvas2.getContext('2d');

    if(current_selection == "rotate_p")
	draw_rotation(c, rotation_x, rotation_y, true, null, null, "red", null);
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

function click_select_square_canvas2(e) {
    var canvas2 = document.getElementById('canvas2');
    var cursor = get_cursor_position(canvas2, e);
    var mouse_x = cursor[0];
    var mouse_y = cursor[1];
    var change = false;

    if(current_selection != null && current_selection.substring(0, 7) == "rotate_") {
	var b = calculate_squares(0, type);

	for(var i = 0; i < b.length; i++)
	    if(click_inside_square(mouse_x, mouse_y, rotation_x, rotation_y, b[i])) {
		make_selection(i);
		change = true;
		break;
	    }

	for(var i = 0; i < squares.length; i++)
	    if(click_inside_square(mouse_x, mouse_y, rotation_x + 100, rotation_y, squares[i])) {
		make_selection(i);
		change = true;
		break;
	    }
    }

    if(change)
	draw_inspector();
}
