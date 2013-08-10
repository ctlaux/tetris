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

var var_exclusion = ["Math", "length"];

var rotation_x = 100;
var rotation_y = 100;
var start_x = 100;
var start_y = 100;


function draw_inspector() {
    var canvas2 = document.getElementById('canvas2');
    canvas2.width = canvas2.width;
    var c = canvas2.getContext('2d');

    if(selection_begins_with("rotate_")) {
	var orig_x_arrow = null;
	var orig_y_arrow = null;
	var rot_x_arrow = null;
	var rot_y_arrow = null;

	var i = current_selection.indexOf("rotate_x");
	if(i != -1)
	    orig_x_arrow = selection_color[i];
	i = current_selection.indexOf("rotate_y");
	if(i != -1)
	    orig_y_arrow = selection_color[i];
	i = current_selection.indexOf("rotate_p");
	if(i != -1)
	    rot_x_arrow = selection_color[i];
	i = current_selection.indexOf("rotate_q");
	if(i != -1)
	    rot_y_arrow = selection_color[i];

	draw_rotation(c, rotation_x, rotation_y, true, orig_x_arrow, orig_y_arrow, rot_x_arrow, rot_y_arrow);
    }
    else if(selection_begins_with("calcsq_")) {
	var draw_k = null;
	var draw_i = null;
	var draw_j = null;

	var i = current_selection.indexOf("calcsq_k");
	if(i != -1)
	    draw_k = selection_color[i];
	i = current_selection.indexOf("calcsq_i");
	if(i != -1)
	    draw_i = selection_color[i];
	i = current_selection.indexOf("calcsq_j");
	if(i != -1)
	    draw_j = selection_color[i];

	draw_bricks_array(c, start_x, start_y, true, draw_k, draw_i, draw_j, type, selected_i, selected_j);
    }
    else if(selection_begins_with("variable_")) {
	c.font = "12pt Arial";
	c.textAlign = "start";
	c.textBaseline = "alphabetic";
	var y = 10;

	for(var i = 0; i < current_selection.length; i++)
	    if(current_selection[i] != null && current_selection[i].substring(0, 9) == "variable_") {
		var var_name = current_selection[i].substring(9, current_selection[i].length);
		var v = window[var_name];
		var d = array_dimension(v);

		if(v instanceof Array && d == 1) {
		    c.fillStyle = selection_color[i];
		    c.fillText(var_name + " = ", 10, y+20);
		    draw_array1d(c, v, 100, y+2, 18);
		    y+= 20;
		}
		else if(v instanceof Array && d == 2) {
		    c.fillStyle = selection_color[i];
		    c.fillText(var_name + " = ", 10, y+20);
		    draw_array2d(c, v, 100, y+2, 18);
		    y+= v[0].length*20;
		}
		else {
		    c.fillStyle = selection_color[i];
		    c.fillText(var_name + " = " + v, 10, y+20);
		    y+= 20;
		}
	    }
    }
}

function array_dimension(arr) {
    var x = arr;
    var d = 0;

    while(x instanceof Array) {
	d++;
	x = x[0];
    }

    return d;
}

function draw_array1d(c, arr, start_x, start_y, height) {
    c.beginPath();
    c.strokeStyle = "grey";
    c.fillStyle = "black";
    c.font = "12pt Arial";
    c.textAlign = "start";
    c.textBaseline = "alphabetic";

    var x = start_x;

    for(var i = 0; i < arr.length; i++) {
	var width = c.measureText(arr[i].toString()).width + 8;
	c.rect(x, start_y, width, height);
	c.fillText(arr[i].toString(), x + 3, start_y + height - 2);
	x+= width;
    }

    c.stroke();
}

function draw_array2d(c, arr, start_x, start_y, height) {
    var max_width = 0;

    for(var i = 0; i < arr.length; i++)
	for(var j = 0; j < arr[0].length; j++) {
	    var width = c.measureText(arr[i][j].toString()).width + 8;
	    max_width = Math.max(max_width, width);
	}

    c.beginPath();
    c.strokeStyle = "grey";
    c.fillStyle = "black";
    c.font = "12pt Arial";
    c.textAlign = "start";
    c.textBaseline = "alphabetic";

    for(var i = 0; i < arr.length; i++)
	for(var j = 0; j < arr[0].length; j++) {
	    c.rect(start_x + i*max_width, start_y + j*height, max_width, height);
	    c.fillText(arr[i][j].toString(), start_x + max_width*i + 3, start_y + height*j + height - 2);
	}

    c.stroke();
}

function selection_begins_with(str) {
    return (current_selection[0] != null && current_selection[0].substring(0, str.length) == str) ||
	   (current_selection[1] != null && current_selection[1].substring(0, str.length) == str) ||
	   (current_selection[2] != null && current_selection[2].substring(0, str.length) == str);
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
	    html+= markup_variables($(nodes[i]).text());
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

function markup_variables(text) {
    acc = "";
    current = ""

    for(var i = 0; i < text.length; i++) {
	if(text[i].match(/\w/))
	    current+= text[i];
	else {
	    if(current.length >= 1 && var_exclusion.indexOf(current) == -1 && window[current] != null && typeof(window[current]) != "function")
		current = "<b class='inspectable variable_" + current + "'>" + current + "</b>";

	    acc+= current;
	    acc+= text[i];
	    current = "";
	}
    }

    acc+= current;

    return acc;
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
