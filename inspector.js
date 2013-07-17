
var code_parts = ["rotate_brick", "check_if_stopped", "remove_full_lines"];
var arrows = {"rotate_brick": {"brick_array": true, "rotation": true, "squares": false, "field_xy": false, "field_squares": false},
	      "check_if_stopped": {"brick_array": false, "rotation": true, "squares": true, "field_xy": true, "field_squares": true},
	      "remove_full_lines": {"brick_array": false, "rotation": false, "squares": false, "field_xy": false, "field_squares": false}}

var selected_code = "rotate_brick";

var original_x = 650;
var original_y = 100;
var rotated_x = 750;
var rotated_y = 100;
var text_x = 650;
var text_y = 180;
var bricks_x = 50;
var bricks_y = 50;
var squares_x = 50;
var squares_y = 170;
var field_x = 0;
var field_y = 0;

var selected = 0;
var selected_i = 0;
var selected_j = 0;


function on_launch() {
    var selected = Math.floor(Math.random() * squares.length);
    while(squares[selected][0] == 0 && squares[selected][1] == 0)
	selected = Math.floor(Math.random() * squares.length);
    make_selection(selected);
}

function make_selection(x) {
    var b = calculate_squares(0, type);
    selected = x;
    selected_i = b[selected][0] + center[type][0];
    selected_j = b[selected][1] + center[type][1];    
}

function draw_inspector() {
    var canvas2 = document.getElementById('canvas2');
    canvas2.width = canvas2.width;
    var c = canvas2.getContext('2d');
    c.globalAlpha = 1.0;

    draw_bricks_array(c, bricks_x, bricks_y, type, selected_i, selected_j);
    draw_squares_array(c, squares_x, squares_y);

    draw_rotation(c);
    if(rotates[type]) {
	print_coordinate_mapping(c);
    }

    var canvas3 = document.getElementById('canvas3');
    canvas3.width = canvas3.width;
    c = canvas3.getContext('2d');
    c.globalAlpha = 1.0;

    draw_field_array(c, field_x, field_y);
    if(selected_code == "remove_full_lines")
	print_row_counts(c, field_x, field_y);
}

function draw_rotation(c) {
    var b = calculate_squares(0, type);
    c.fillStyle = "rgb(200, 200, 250)";
    c.fillRect(original_x + b[selected][0] * width, original_y + b[selected][1] * height, width, height);
    if(rotates[type])
	c.fillRect(rotated_x + squares[selected][0] * width, rotated_y + squares[selected][1] * height, width, height);

    for(var i = 0; i < b.length; i++) {
	c.beginPath();
	c.strokeStyle = "grey";
	c.rect(original_x + b[i][0] * width, original_y + b[i][1] * height, width, height);
	c.stroke();
    }

    if(rotates[type]) {
	for(var i = 0; i < squares.length; i++) {
	    c.beginPath();
	    c.strokeStyle = "grey";
	    c.rect(rotated_x + squares[i][0] * width, rotated_y + squares[i][1] * height, width, height);
	    c.stroke();
	}

	if(arrows[selected_code]["rotation"]) {
	    var x1 = original_x + width/2;
	    var y1 = original_y + height/2;

	    if(b[selected][0] != 0)
		draw_arrow(c, x1, y1, x1 + b[selected][0] * width, y1, "#00C2CC");
	    if(b[selected][1] != 0)
		draw_arrow(c, x1 + b[selected][0] * width, y1, x1 + b[selected][0] * width, y1 + b[selected][1] * height, "#76BF00");

	    x1 = rotated_x + width/2;
	    y1 = rotated_y + height/2;
	    if(squares[selected][0] != 0)
		draw_arrow(c, x1, y1, x1 + squares[selected][0] * width, y1, "#871BE0");
	    if(squares[selected][1] != 0)
		draw_arrow(c, x1 + squares[selected][0] * width, y1, x1 + squares[selected][0] * width, y1 + squares[selected][1] * height, "#9BA300");
	}

	var start_rot = 0;
	var end_rot = 0;

	if(b[selected][0] != 0)
	    start_rot = get_rotation(b[selected][0], 0);
	else if(b[selected][1] != 0)
	    start_rot = get_rotation(0, b[selected][1]);

	var center_x = (original_x + rotated_x)/2;
	var center_y = original_y - 50;

	draw_arc_arrow(c, center_x, center_y, start_rot, (start_rot + rot) % 4);

	c.beginPath();
	c.fillStyle = "black";
	c.font = "12pt Arial";
	c.textAlign = "center";
	c.textBaseline = "middle";
	c.fillText(rot.toString(), center_x, center_y);
    }    
}

function draw_arrow(c, from_x, from_y, to_x, to_y, color) {
    var head_length = 8;
    var angle = Math.atan2(to_y - from_y, to_x - from_x);

    c.beginPath();
    c.strokeStyle = color;
    c.moveTo(from_x, from_y);
    c.lineTo(to_x, to_y);
    c.lineTo(to_x - head_length*Math.cos(angle-Math.PI/6), to_y - head_length*Math.sin(angle-Math.PI/6));
    c.moveTo(to_x, to_y);
    c.lineTo(to_x - head_length*Math.cos(angle+Math.PI/6), to_y - head_length*Math.sin(angle+Math.PI/6));
    c.stroke();
}

function draw_arc_arrow(c, x, y, start_rot, end_rot) {
    var radius = 20;

    if(start_rot == end_rot)
	return;

    c.strokeStyle = "black";
    c.beginPath();
    c.arc(x, y, radius, -(start_rot+1) * Math.PI/2, -(end_rot+1) * Math.PI/2, true);
    c.stroke();

    var head_length = 8;
    var angle = -((end_rot+2) % 4) * Math.PI/2;
    var head_x = x + radius * Math.cos(-(end_rot+1) * Math.PI/2);
    var head_y = y + radius * Math.sin(-(end_rot+1) * Math.PI/2);

    c.beginPath();
    c.moveTo(head_x, head_y);
    c.lineTo(head_x - head_length*Math.cos(angle-Math.PI/6), head_y - head_length*Math.sin(angle-Math.PI/6));
    c.moveTo(head_x, head_y);
    c.lineTo(head_x - head_length*Math.cos(angle+Math.PI/6), head_y - head_length*Math.sin(angle+Math.PI/6));
    c.stroke();
}

function get_rotation(x, y) {
    if(x > 0 && y == 0)
	return 3;
    if(x < 0 && y == 0)
	return 1;
    if(x == 0 && y > 0)
	return 2;
    if(x == 0 && y < 0)
	return 0;
}

function print_coordinate_mapping(c) {
    if($.browser.mozilla)
	return;

    c.beginPath();
    c.font = "12pt Arial";
    c.textAlign = "start";
    c.textBaseline = "alphabetic";

    var b = calculate_squares(0, type);

    for(var i = 0; i < b.length; i++) {
	if(i == selected)
	    c.fillStyle = "rgb(150, 150, 255)";
	else
	    c.fillStyle = "black";
	c.fillText("(" + b[i][0] + "," + b[i][1] + ")", text_x, text_y + 20*i);
	c.fillText("→", text_x + 50, text_y + 20*i);
	c.fillText("(" + squares[i][0] + "," + squares[i][1] + ")", text_x + 80, text_y + 20*i);
    }
}

function draw_bricks_array(c, start_x, start_y, selected_k, selected_i, selected_j) {
    var x = start_x;
    var y = start_y;

    if(arrows[selected_code]["brick_array"]) {
	c.font = "12pt Arial";
	c.textAlign = "start";
	c.textBaseline = "alphabetic";

	c.fillStyle = "green";
	c.fillText("k", start_x - width + selected_k * 4 * width + 7, start_y - height - 5);
	c.fillStyle = "blue";
	c.fillText("i", start_x - width + selected_k * 4 * width + (selected_i + 1) * width + 7, start_y - 5);
	c.fillStyle = "red";
	c.fillText("j", start_x - width + selected_k * 4 * width + 7, start_y + (selected_j + 1) * height - 5);

	draw_arrow(c, start_x - 3/2*width, start_y - 3/2*height, start_x - width + selected_k * 4 * width, start_y - 3/2*height, "green");
	draw_arrow(c, start_x + selected_k * 4 * width - 0.5*width, start_y - height/2,
	              start_x - width + selected_k * 4 * width + (selected_i + 1) * width, start_y - height/2, "blue");
	draw_arrow(c, start_x + selected_k * 4 * width - 0.5*width, start_y - height/2,
	              start_x + selected_k * 4 * width - 0.5*width, start_y - height/2 + (selected_j + 0.5) * height, "red");
    }

    c.beginPath();
    c.strokeStyle = "grey";

    for(var k = 0; k < bricks.length; k++) {
	x = start_x + k*4*width;
	for(var i = 0; i < bricks[k].length; i++) {
	    y = start_y;
	    for(var j = 0; j < bricks[k][i].length; j++) {
		if(bricks[k][i][j] == 1) {
		    if(k == type && i == selected_i && j == selected_j)
			c.fillStyle = "rgb(200, 200, 255)";
		    else
			c.fillStyle = "rgb(220, 220, 220)";
		    c.fillRect(x, y, width, height);
		    c.rect(x, y, width, height);
		}
		y+= height;
	    }
	    x+= width;
	}

	c.rect(start_x + k*4*width - width, start_y - height, 3*width, 5*height);
	c.moveTo(start_x + k*4*width, start_y - height);
	c.lineTo(start_x + k*4*width, start_y + 4*height);

	c.moveTo(start_x + k*4*width - width, start_y);
	c.lineTo(start_x + k*4*width + 2*width, start_y);
    }

    c.stroke();
}

function draw_squares_array(c, start_x, start_y) {
    c.font = "12pt Arial";
    c.textAlign = "center";
    c.textBaseline = "middle";

    if(arrows[selected_code]["squares"]) {
	c.fillStyle = "blue";
	c.fillText("i", start_x + 5/2*width, start_y - height/2);
	c.fillStyle = "red";
	c.fillText("1", start_x - width/2, start_y + 3/2*height);

	draw_arrow(c, start_x - width/2, start_y - height/2, start_x + 2*width, start_y - height/2, "blue");
	draw_arrow(c, start_x - width/2, start_y - height/2, start_x - width/2, start_y + height, "red");
    }

    c.beginPath();
    c.strokeStyle = "grey";

    for(var i = 0; i < squares.length; i++) {
	c.rect(start_x + i*width, start_y, width, height);
	c.rect(start_x + i*width, start_y + height, width, height);

	if(i == selected)
	    c.fillStyle = "rgb(150, 150, 255)";
	else
	    c.fillStyle = "black";
	c.fillText(squares[i][0].toString(), start_x + i*width + width/2, start_y + height/2);
	c.fillText(squares[i][1].toString(), start_x + i*width + width/2, start_y + 3/2*height);
    }

    c.stroke();
}

function draw_field_array(c, start_x, start_y) {
    c.font = "12pt Arial";
    c.textAlign = "start";
    c.textBaseline = "alphabetic";

    if(arrows[selected_code]["field_xy"]) {
	c.fillStyle = "#00CCE3";
	c.fillText("x", start_x + (x + 1)*width + 7, start_y + height - 5);
	draw_arrow(c, start_x + width/2, start_y + height/2, start_x + (x + 1)*width, start_y + height/2, "#00CCE3");
	if(y >= 0) {
	    c.fillStyle = "#005FE3";
	    c.fillText("y", start_x + 7, start_y + (y + 2)*height - 5);
	    draw_arrow(c, start_x + width/2, start_y + height/2, start_x + width/2, start_y + (y + 1)*height, "#005FE3");
	}
    }

    if(selected_code == "remove_full_lines") {
	c.fillStyle = "blue";
	c.fillText("i", start_x + 5*width + 7, start_y + height - 5);
	draw_arrow(c, start_x + width/2, start_y + height/2, start_x + 5*width, start_y + height/2, "blue");
	c.fillStyle = "red";
	c.fillText("j", start_x + 7, start_y + 11*height - 5);
	draw_arrow(c, start_x + width/2, start_y + height/2, start_x + width/2, start_y + 10*height, "red");
    }

    c.beginPath();
    c.strokeStyle = "grey";

    if(selected_code != "remove_full_lines") {
	for(var i = 0; i < squares.length; i++) {
	    if(i == selected)
		c.fillStyle = "rgb(200, 200, 255)";
	    else
		c.fillStyle = "rgb(220, 220, 220)";
	    if(y + squares[i][1] >= 0)
		c.fillRect(start_x + (x + squares[i][0] + 1)*width, start_y + (y + squares[i][1] + 1)*height, width, height);
	}
    }

    for(var i = 0; i < field_width; i++)
	for(var j = 0; j < field_height; j++) {
	    c.rect(start_x + width + i*width, start_y + height + j*height, width, height);

	    if(field[i][j] != -1) {
		c.fillStyle = "rgb(220, 220, 220)";
		c.fillRect(start_x + width + i*width, start_y + height + j*height, width, height);
	    }

	    if(selected_code == "remove_full_lines" && ! $.browser.mozilla) {
		c.font = "12pt Arial";
		c.textAlign = "center";
		c.textBaseline = "middle";

		var str = "0";
		c.fillStyle = "grey";
		if(field[i][j] != -1) {
		    str = "1";
		    c.fillStyle = "black";
		}
		c.fillText(str, start_x + (i + 3/2)*width, start_y + (j + 3/2)*height);
	    }
	}

    c.stroke();

    if(arrows[selected_code]["field_squares"]) {
	var x1 = start_x + (x+1)*width + width/2;
	var y1 = start_y + (y+1)*height + height/2;
	if(squares[selected][0] != 0 && y > -1)
	    draw_arrow(c, x1, y1, x1 + squares[selected][0] * width, y1, "#871BE0");
	if(squares[selected][1] != 0 && y + squares[selected][1] > -1 && y > -1)
	    draw_arrow(c, x1 + squares[selected][0] * width, y1, x1 + squares[selected][0] * width, y1 + squares[selected][1] * height, "#9BA300");
    }
}

function print_row_counts(c, start_x, start_y) {
    c.beginPath();
    c.font = "12pt Arial";
    c.textAlign = "start";
    c.textBaseline = "alphabetic";
    c.fillStyle = "black";

    for(var j = 0; j < field_height; j++) {
	var count = 0;
	for(var i = 0; i < field_width; i++)
	    if(field[i][j] != -1)
		count++;
	c.fillText(count.toString(), start_x + (field_width + 1)*width + 5, start_y + (j + 1)*height + 15);
    }
}

function click_inside_square(x, y, offset_x, offset_y, square) {
    if((x >= offset_x + square[0] * width) &&
       (y >= offset_y + square[1] * height) &&
       (x < offset_x + (square[0]+1) * width) &&
       (y < offset_y + (square[1]+1) * height))
	return true;
    else
	return false;
}

function click_select_square_canvas2(e) {
    var canvas2 = document.getElementById('canvas2');
    var cursor = get_cursor_position(canvas2, e);
    var mouse_x = cursor[0];
    var mouse_y = cursor[1];
    var change = false;
    var b = calculate_squares(0, type);

    for(var i = 0; i < b.length; i++)
	if(click_inside_square(mouse_x, mouse_y, original_x, original_y, b[i]) ||
	   click_inside_square(mouse_x, mouse_y,
			       bricks_x + 4 * type * width + center[type][0] * width,
			       bricks_y + center[type][1] * height, b[i])) {
	    make_selection(i);
	    change = true;
	    break;
	}

    for(var i = 0; i < squares.length; i++)
	if(click_inside_square(mouse_x, mouse_y, rotated_x, rotated_y, squares[i])) {
	    make_selection(i);
	    change = true;
	    break;
	}

    if(change)
	draw();
}

function click_select_square_canvas3(e) {
    var canvas3 = document.getElementById('canvas3');
    var cursor = get_cursor_position(canvas3, e);
    var mouse_x = cursor[0];
    var mouse_y = cursor[1];
    var change = false;

    for(var i = 0; i < squares.length; i++)
       if(click_inside_square(mouse_x, mouse_y, field_x + (x+1) * width, field_y + (y+1) * height, squares[i])) {
	   make_selection(i);
	   draw();
	   break;
       }
}

function get_cursor_position(canvas, e) {
    var x;
    var y;
    if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    }
    else {
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    return [x, y];
}

function code_select(selected) {
    selected_code = selected;

    for(var i = 0; i < code_parts.length; i++)
	if(code_parts[i] != selected) {
	    $("#" + code_parts[i]).hide();
	    $("#tab_" + code_parts[i]).removeClass("selected");
	}

    $("#" + selected).show();
    $("#tab_" + selected).addClass("selected");

    draw_inspector();
}

$(function() {
    var canvas2 = document.getElementById('canvas2');
    canvas2.addEventListener("click", click_select_square_canvas2, false);

    var canvas3 = document.getElementById('canvas3');
    canvas3.addEventListener("click", click_select_square_canvas3, false);
});
