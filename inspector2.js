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

var current_selection = [null, null, null];

var selection_color = ["red", "green", "blue"];

var rotation_x = 100;
var rotation_y = 100;


function on_launch() {
}

function draw_inspector() {
    var canvas2 = document.getElementById('canvas2');
    canvas2.width = canvas2.width;
    var c = canvas2.getContext('2d');

    if((current_selection[0] != null && current_selection[0].substring(0, 7) == "rotate_") ||
       (current_selection[1] != null && current_selection[1].substring(0, 7) == "rotate_") ||
       (current_selection[2] != null && current_selection[2].substring(0, 7) == "rotate_")) {
	var orig_x_arrow = null;
	var orig_y_arrow = null;
	var rot_x_arrow = null;
	var rot_y_arrow = null;

	var i = current_selection.indexOf("rotate_p");
	if(i != -1)
	    orig_x_arrow = selection_color[i];
	var i = current_selection.indexOf("rotate_q");
	if(i != -1)
	    orig_y_arrow = selection_color[i];
	var i = current_selection.indexOf("rotate_x");
	if(i != -1)
	    rot_x_arrow = selection_color[i];
	var i = current_selection.indexOf("rotate_y");
	if(i != -1)
	    rot_y_arrow = selection_color[i];

	draw_rotation(c, rotation_x, rotation_y, true, orig_x_arrow, orig_y_arrow, rot_x_arrow, rot_y_arrow);
    }
}

function code_clicked(obj, e) {
    var button = e.which - 1;

    if(current_selection[button] != null)
	$("." + current_selection[button]).css("color", "grey");

    classes = $(obj).attr("class").split(" ");

    if(current_selection[button] == classes[1]) {                   // click a second time deselects
	current_selection[button] = null;
    }
    else {
	current_selection[button] = classes[1];
	$("." + current_selection[button]).css("color", selection_color[button]);
    }

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
	    html+= "<b class='inspectable " + $(nodes[i]).attr("class") + "'>" + $(nodes[i]).text() + "</b>";
	    break;
	}
    }

    $("#code").append(html);

    $(".inspectable").mousedown(function(event) {
	code_clicked(this, event);
    });
}

function click_select_square_canvas2(e) {
    var canvas2 = document.getElementById('canvas2');
    var cursor = get_cursor_position(canvas2, e);
    var mouse_x = cursor[0];
    var mouse_y = cursor[1];
    var change = false;

    if((current_selection[0] != null && current_selection[0].substring(0, 7) == "rotate_") ||
       (current_selection[1] != null && current_selection[1].substring(0, 7) == "rotate_") ||
       (current_selection[2] != null && current_selection[2].substring(0, 7) == "rotate_")) {
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
