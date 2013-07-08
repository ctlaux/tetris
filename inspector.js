
var original_x = 100;
var original_y = 100;
var rotated_x = 200;
var rotated_y = 100;

var selected = 0;
var canvas;


function on_launch() {
    selected = Math.floor(Math.random() * squares.length);
    while(squares[selected][0] == 0 && squares[selected][1] == 0)
	selected = Math.floor(Math.random() * squares.length);
}

function draw_rotation() {
    var canvas = document.getElementById('canvas2');
    canvas.width = canvas.width;
    var c = canvas.getContext('2d');

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
	    draw_arrow(c, x1, y1, x1 + blue[0] * width, y1 + blue[1] * height, "blue");
	if((red[0]-blue[0]) != 0 || (red[1]-blue[1]) != 0)
	    draw_arrow(c, x1 + blue[0] * width, y1 + blue[1] * height, x1 + red[0] * width, y1 + red[1] * height, "red");

	var start_rot = 0;
	var end_rot = 0;

	if(b[selected][0] != 0)
	    start_rot = get_rotation(b[selected][0], 0);
	else if(b[selected][1] != 0)
	    start_rot = get_rotation(0, b[selected][1]);

	draw_arc_arrow(c, 150, 50, start_rot, (start_rot + rot) % 4);

	c.beginPath();
	c.fillStyle = "black";
	c.font = "12pt Arial";
	c.textAlign = "center";
	c.textBaseline = "middle";
	c.fillText(rot.toString(), 150, 50);
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
	    selected = i;
	    change = true;
	    break;
	}
    }

    for(var i = 0; i < squares.length; i++) {
	if(click_inside_square(x, y, rotated_x, rotated_y, squares[i])) {
	    selected = i;
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
