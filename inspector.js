
var original_x = 100;
var original_y = 300;
var rotated_x = 200;
var rotated_y = 300;
var text_x = 100;
var text_y = 380;

var selected = 0;
var selected_i = 0;
var selected_j = 0;
var canvas;


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
    var canvas = document.getElementById('canvas2');
    canvas.width = canvas.width;
    var c = canvas.getContext('2d');
    c.globalAlpha = 1.0;

    draw_bricks_array(c, 100, 50, type, selected_i, selected_j);
    draw_field_array(c, 400, 230);

    draw_rotation(c);
    if(rotates[type]) {
	print_coordinate_mapping(c);
    }

    print_row_counts();
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

	var x1 = original_x + width/2;
	var y1 = original_y + height/2;
	if(b[selected][0] != 0)
	    draw_arrow(c, x1, y1, x1 + b[selected][0] * width, y1, "blue");
	if(b[selected][1] != 0)
	    draw_arrow(c, x1 + b[selected][0] * width, y1, x1 + b[selected][0] * width, y1 + b[selected][1] * height, "red");

	blue = rotate(rot, b[selected][0], 0);
	red = rotate(rot, b[selected][0], b[selected][1]);

	x1 = rotated_x + width/2;
	y1 = rotated_y + height/2;
	if(blue[0] != 0 || blue[1] != 0)
	    draw_arrow(c, x1, y1, x1 + blue[0] * width, y1 + blue[1] * height, "#871BE0");
	if((red[0]-blue[0]) != 0 || (red[1]-blue[1]) != 0)
	    draw_arrow(c, x1 + blue[0] * width, y1 + blue[1] * height, x1 + red[0] * width, y1 + red[1] * height, "#9BA300");

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

    c.beginPath();
    c.strokeStyle = "grey";

    for(var k = 0; k < bricks.length; k++) {
	x = start_x + k*4*width;
	for(var i = 0; i < bricks[k].length; i++) {
	    y = start_y;
	    for(var j = 0; j < bricks[k][i].length; j++) {
		if(bricks[k][i][j] == 1) {
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

function draw_field_array(c, start_x, start_y) {
    c.font = "12pt Arial";
    c.textAlign = "start";
    c.textBaseline = "alphabetic";

    c.fillStyle = "#00CCE3";
    c.fillText("x", start_x + (x + 1)*width + 7, start_y + height - 5);
    draw_arrow(c, start_x + width/2, start_y + height/2, start_x + (x + 1)*width, start_y + height/2, "#00CCE3");
    if(y >= 0) {
	c.fillStyle = "#005FE3";
	c.fillText("y", start_x + 7, start_y + (y + 2)*height - 5);
	draw_arrow(c, start_x + width/2, start_y + height/2, start_x + width/2, start_y + (y + 1)*height, "#005FE3");
    }

    c.beginPath();
    c.strokeStyle = "grey";

    c.fillStyle = "rgb(220, 220, 220)";
    for(var i = 0; i < squares.length; i++) {
	if(y + squares[i][1] >= 0)
	    c.fillRect(start_x + (x + squares[i][0] + 1)*width, start_y + (y + squares[i][1] + 1)*height, width, height);
    }

    for(var i = 0; i < field_width; i++)
	for(var j = 0; j < field_height; j++) {
	    c.rect(start_x + width + i*width, start_y + height + j*height, width, height);
	    if(field[i][j] != -1) {
		c.fillStyle = "rgb(220, 220, 220)";
		c.fillRect(start_x + width + i*width, start_y + height + j*height, width, height);
	    }
	}

    c.stroke();
}

function print_row_counts() {
    var canvas = document.getElementById('canvas1');
    var c = canvas.getContext('2d');

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
	c.fillText(count.toString(), canvas.width - 15, j*height + 15);
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

function click_select_square(x, y) {
    var change = false;
    var b = calculate_squares(0, type);

    for(var i = 0; i < b.length; i++) {
	if(click_inside_square(x, y, original_x, original_y, b[i])) {
	    make_selection(i);
	    change = true;
	    break;
	}
    }

    for(var i = 0; i < squares.length; i++) {
	if(click_inside_square(x, y, rotated_x, rotated_y, squares[i])) {
	    make_selection(i);
	    change = true;
	    break;
	}
    }

    if(change)
	draw();
}

function canvas_on_click(e) {
    var cursor = get_cursor_position(e);
    var x = cursor[0];
    var y = cursor[1];

    click_select_square(x, y);
}

function get_cursor_position(e) {
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

$(function() {
    canvas = document.getElementById('canvas2');
    canvas.addEventListener("click", canvas_on_click, false);
});
